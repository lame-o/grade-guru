import { supabase } from "@/integrations/supabase/client";
import { Class } from "@/types/class";

export const uploadPDFToStorage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

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

export const extractPDFText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // For now, we'll just return a placeholder
        // In a real implementation, you'd want to use a PDF parsing library
        resolve("PDF text content placeholder");
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const savePDFToDatabase = async (
  userId: string,
  className: string,
  syllabusName: string,
  pdfUrl: string,
  pdfContent: string
): Promise<void> => {
  const { error } = await supabase
    .from('class_pdfs')
    .insert({
      user_id: userId,
      name: className,
      syllabus_name: syllabusName,
      pdf_url: pdfUrl,
      pdf_content: pdfContent,
    });

  if (error) {
    console.error('Error saving PDF to database:', error);
    throw error;
  }
};

export const getUserPDFs = async (userId: string): Promise<Class[]> => {
  const { data, error } = await supabase
    .from('class_pdfs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching PDFs:', error);
    throw error;
  }

  return data.map(pdf => ({
    id: pdf.id,
    name: pdf.name,
    syllabusName: pdf.syllabus_name,
    uploadDate: pdf.upload_date,
    lastAccessed: pdf.last_accessed,
    pdfUrl: pdf.pdf_url
  }));
};