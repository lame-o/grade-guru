import { supabase } from "@/integrations/supabase/client";
import { Class, PDFContent } from "@/types/class";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini exactly as in documentation
const genAI = new GoogleGenerativeAI("AIzaSyB3iBoUWc2KTIXTmiORwD3LS3E5jJWC7Gw");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize EXTRACTION_PROMPT
const EXTRACTION_PROMPT = `You are an AI assistant designed to parse and analyze educational PDF documents for academic purposes. Your task is to process PDFs containing syllabi, study guides, lecture notes, homework questions, and handwritten content (scanned or digital) to extract structured information.

Input Requirements:
- Accept PDFs in both text-based and image/scanned formats
- Handle handwritten notes with possible imperfections
- Process mixed-format documents (e.g., typed text with handwritten annotations)

Processing Steps:
- Document Type Identification: Classify the document type (syllabus, lecture notes, homework, etc.)
- Metadata Extraction:
  - Course name/number
  - Professor/instructor name
  - Dates (due dates, exam dates, office hours)
  - Document creation/modification dates
- Content Extraction:
  - For syllabi: Grading policies, course objectives, required materials
  - For study guides: Key concepts, formulas, diagrams
  - For homework: Questions, problems, solution spaces
  - For lectures: Topic headings, bullet points, annotated diagrams

Special Handling:
- Preserve mathematical equations and chemical formulas
- Maintain hierarchical structure (headers > subheaders > body text)
- Flag unclear handwritten sections with confidence scores
- Separate instructor comments from core content

IMPORTANT: Return ONLY raw JSON without any markdown formatting or code blocks. The response should start with a curly brace and end with a curly brace. The structure should be:

{
  "document_type": string,
  "metadata": {
    "course_name": string,
    "professor": string,
    "lecture_days": string[],
    "lecture_times": string[]
  },
  "content": {
    "sections": [{
      "heading": string,
      "body": string,
      "annotations": string[],
      "visual_elements": string[],
      "key_terms": string[]
    }]
  },
  "action_items": {
    "assignments": [{ "name": string, "due_date": string }],
    "exams": [{ "type": string, "date": string }]
  }
}

PDF Content to analyze:`;

export const uploadPDFToStorage = async (
  file: File, 
  userId: string, 
  className: string, 
  isAdditionalContent: boolean = false
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const contentType = isAdditionalContent ? 'additional' : 'syllabus';
  // Structure: userId/className/contentType/timestamp_filename.ext
  const fileName = `${userId}/${encodeURIComponent(className)}/${contentType}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(fileName);

  return publicUrl;
};


export const extractPDFText = async (file: File): Promise<PDFContent> => {
  return new Promise((resolve, reject) => {
    console.log('Starting PDF extraction...');
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        console.log('File read successful');
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          console.error('No PDF content found');
          throw new Error("Failed to read PDF content");
        }

        // Convert ArrayBuffer to Base64
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64String = btoa(
          uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        
        // Create the parts array for Gemini
        const parts = [
          { text: EXTRACTION_PROMPT },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64String
            }
          }
        ];

        console.log('Sending to Gemini...');
        const result = await model.generateContent(parts);
        console.log('Received response from Gemini');
        const responseText = result.response.text();
        console.log('Raw Gemini response:', responseText);
        
        // Clean up the response text to handle markdown formatting
        const cleanJson = responseText
          .replace(/```json\s*/, '') // Remove opening ```json
          .replace(/```\s*$/, '')    // Remove closing ```
          .trim();                   // Remove any extra whitespace
        
        console.log('Cleaned JSON:', cleanJson);
        
        try {
          const structuredContent: PDFContent = JSON.parse(cleanJson);
          console.log('Successfully parsed JSON:', structuredContent);
          resolve(structuredContent);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Parse error details:', {
            error: parseError.toString(),
            rawResponse: responseText,
            cleanedJson: cleanJson
          });
          reject(new Error('Failed to parse Gemini response as JSON: ' + parseError.message));
        }
      } catch (error) {
        console.error('Error in PDF processing:', {
          error: error.toString(),
          errorObject: error,
          stack: error.stack
        });
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };

    try {
      console.log('Starting to read file...');
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error initiating file read:', error);
      reject(error);
    }
  });
};

export const savePDFToDatabase = async (
  userId: string,
  className: string,
  fileName: string,
  pdfUrl: string,
  pdfContent: PDFContent,
  isAdditionalContent: boolean = false
): Promise<void> => {
  const { error } = await supabase
    .from('class_pdfs')
    .insert({
      user_id: userId,
      name: className,
      syllabus_name: fileName,
      pdf_url: pdfUrl,
      pdf_content: JSON.stringify(pdfContent), // Structured content
      document_type: pdfContent.document_type,
      metadata: pdfContent.metadata,
      upload_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_committed: false,
      is_additional_content: isAdditionalContent
    });

  if (error) throw error;
};

export const commitSyllabusToKnowledge = async (classId: string): Promise<void> => {
  const { error: updateError } = await supabase
    .from('class_pdfs')
    .update({ is_committed: true })
    .eq('id', classId);

  if (updateError) {
    console.error('Error updating syllabus status:', updateError);
    throw updateError;
  }
};

export const getUserPDFs = async (userId: string): Promise<Class[]> => {
  // First get all main class entries (syllabi)
  const { data: mainClasses, error: classError } = await supabase
    .from('class_pdfs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_additional_content', false)
    .order('created_at', { ascending: false });

  if (classError) {
    console.error('Error fetching classes:', classError);
    throw classError;
  }

  // Then get all additional content
  const { data: additionalContent, error: contentError } = await supabase
    .from('class_pdfs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_additional_content', true)
    .order('created_at', { ascending: false });

  if (contentError) {
    console.error('Error fetching additional content:', contentError);
    throw contentError;
  }

  // Group additional content by class name
  const contentByClass = additionalContent?.reduce((acc, content) => {
    if (!acc[content.name]) {
      acc[content.name] = [];
    }
    acc[content.name].push({
      id: content.id,
      name: content.syllabus_name,
      uploadDate: content.upload_date,
      pdfUrl: content.pdf_url || '',
      isCommitted: content.is_committed || false
    });
    return acc;
  }, {} as Record<string, Array<{ id: string; name: string; uploadDate: string; pdfUrl: string; isCommitted: boolean; }>>) || {};

  // Map the data to our Class type
  return mainClasses.map(cls => ({
    id: cls.id,
    name: cls.name,
    syllabusName: cls.syllabus_name,
    uploadDate: cls.upload_date,
    lastAccessed: cls.last_accessed,
    pdfUrl: cls.pdf_url,
    isCommitted: cls.is_committed || false,
    additionalContent: contentByClass[cls.name] || []
  }));
};

export const checkDatabaseSchema = async () => {
  const { data, error } = await supabase
    .from('class_pdfs')
    .select()
    .limit(1);

  if (error) {
    console.error('Error checking schema:', error);
    throw error;
  }

  console.log('Database schema:', data);
  return data;
};

export const deleteClass = async (userId: string, className: string): Promise<void> => {
  try {
    // First get all PDFs associated with this class (main syllabus and additional content)
    const { data: classPDFs, error: fetchError } = await supabase
      .from('class_pdfs')
      .select('id, pdf_url, name')
      .eq('user_id', userId)
      .eq('name', className);

    if (fetchError) {
      console.error('Error fetching class PDFs:', fetchError);
      throw fetchError;
    }

    const classFolder = `${userId}/${className}`;
    console.log('Starting storage deletion process for folder:', classFolder);

    // List files in syllabus folder
    const { data: syllabusFiles, error: syllabusError } = await supabase.storage
      .from('pdfs')
      .list(`${classFolder}/syllabus`);

    console.log('Files in syllabus folder:', syllabusFiles);
    
    if (syllabusFiles && syllabusFiles.length > 0) {
      for (const file of syllabusFiles) {
        const filePath = `${classFolder}/syllabus/${file.name}`;
        console.log('Attempting to delete syllabus file:', filePath);
        
        const { error: deleteError } = await supabase.storage
          .from('pdfs')
          .remove([filePath]);
          
        if (deleteError) {
          console.error(`Error deleting file ${filePath}:`, deleteError);
        }
      }
    }

    // List files in additional folder
    const { data: additionalFiles, error: additionalError } = await supabase.storage
      .from('pdfs')
      .list(`${classFolder}/additional`);

    console.log('Files in additional folder:', additionalFiles);
    
    if (additionalFiles && additionalFiles.length > 0) {
      for (const file of additionalFiles) {
        const filePath = `${classFolder}/additional/${file.name}`;
        console.log('Attempting to delete additional file:', filePath);
        
        const { error: deleteError } = await supabase.storage
          .from('pdfs')
          .remove([filePath]);
          
        if (deleteError) {
          console.error(`Error deleting file ${filePath}:`, deleteError);
        }
      }
    }

    // Delete all records from the database
    const { error: dbError } = await supabase
      .from('class_pdfs')
      .delete()
      .eq('user_id', userId)
      .eq('name', className);

    if (dbError) {
      console.error('Error deleting class from database:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error in deleteClass:', error);
    throw error;
  }
};