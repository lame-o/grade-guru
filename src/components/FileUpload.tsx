import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Class } from "@/types/class";
import { useSession } from "@supabase/auth-helpers-react";
import { uploadPDFToStorage, extractPDFText, savePDFToDatabase } from "@/utils/pdfUtils";
import { PDFViewer } from "@/components/PDFViewer";

interface FileUploadProps {
  onClassCreated: (newClass: Class) => void;
  existingClass?: Class;
  isAdditionalContent?: boolean;
  onUpdate?: (updatedClass: Class) => void;
}

export const FileUpload = ({ 
  onClassCreated, 
  existingClass, 
  isAdditionalContent = false,
  onUpdate 
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [className, setClassName] = useState("");
  const [contentName, setContentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const session = useSession();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // Create a temporary URL for preview
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      // Set default content name from file name (without extension)
      if (isAdditionalContent) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setContentName(nameWithoutExt);
      }
      toast.success("PDF file selected successfully!");
    } else {
      setFile(null);
      setPreviewUrl(null);
      toast.error("Please select a valid PDF file");
    }
  };

  const handleUpload = async () => {
    if (!file || (!className.trim() && !isAdditionalContent) || !session?.user?.id) {
      toast.error(isAdditionalContent ? "Please select a file" : "Please select a file and enter a class name");
      return;
    }

    if (isAdditionalContent && !contentName.trim()) {
      toast.error("Please enter a name for this content");
      return;
    }

    setLoading(true);
    
    try {
      // Upload PDF to storage
      const pdfUrl = await uploadPDFToStorage(
        file, 
        session.user.id, 
        isAdditionalContent ? existingClass!.name : className,
        isAdditionalContent
      );
      console.log("PDF uploaded to storage:", pdfUrl);

      // Extract text content
      const pdfContent = await extractPDFText(file);
      console.log("PDF text extracted");

      // Save to database
      await savePDFToDatabase(
        session.user.id,
        isAdditionalContent ? existingClass!.name : className,
        isAdditionalContent ? contentName : file.name,
        pdfUrl,
        pdfContent,
        isAdditionalContent
      );
      console.log("PDF saved to database");

      const newClass: Class = {
        id: crypto.randomUUID(),
        name: isAdditionalContent ? existingClass!.name : className,
        syllabusName: isAdditionalContent ? contentName : file.name,
        uploadDate: new Date().toISOString(),
        pdfUrl: pdfUrl,
        isCommitted: false,
        additionalContent: []
      };
      
      if (isAdditionalContent && existingClass && onUpdate) {
        const updatedClass = {
          ...existingClass,
          additionalContent: [...(existingClass.additionalContent || []), {
            id: newClass.id,
            name: contentName,
            uploadDate: newClass.uploadDate,
            pdfUrl: newClass.pdfUrl,
            isCommitted: false
          }]
        };
        onUpdate(updatedClass);
      } else {
        onClassCreated(newClass);
      }
      
      toast.success(isAdditionalContent ? "Content added successfully!" : "Class created successfully!");
      
      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setFile(null);
      setClassName("");
      setContentName("");
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        toast.error(`Failed to ${isAdditionalContent ? "add content" : "create class"}: ${error.message}`);
      } else {
        toast.error(isAdditionalContent ? "Failed to add content" : "Failed to create class");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {isAdditionalContent ? "Add Additional Content" : "Create New Class"}
      </h2>
      <div className="flex gap-8">
        <div className="w-1/2 space-y-4">
          {!isAdditionalContent ? (
            <div>
              <label htmlFor="class-name" className="block text-sm font-medium text-gray-700 mb-1">
                Class Name
              </label>
              <Input
                id="class-name"
                type="text"
                placeholder="Enter class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="content-name" className="block text-sm font-medium text-gray-700 mb-1">
                Content Name
              </label>
              <Input
                id="content-name"
                type="text"
                placeholder="Enter a name for this content"
                value={contentName}
                onChange={(e) => setContentName(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {file && (
            <p className="text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}
          <Button
            onClick={handleUpload}
            disabled={loading || !file || (!className.trim() && !isAdditionalContent) || (isAdditionalContent && !contentName.trim())}
            className="w-full"
          >
            {loading ? "Uploading..." : isAdditionalContent ? "Add Content" : "Create Class"}
          </Button>
        </div>
        
        <div className="w-1/2">
          {previewUrl && (
            <div className="h-[600px] border rounded-lg overflow-hidden">
              <PDFViewer pdfUrl={previewUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};