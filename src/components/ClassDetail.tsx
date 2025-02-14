import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { FileUpload } from "@/components/FileUpload";
import { Class } from "@/types/class";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { commitSyllabusToKnowledge } from "@/utils/pdfUtils";
import { PDFViewer } from "@/components/PDFViewer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ClassDetailProps {
  classData: Class;
  onUpdate: (updatedClass: Class) => void;
}

export const ClassDetail = ({ classData, onUpdate }: ClassDetailProps) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContentUpload = async (file: File) => {
    const updatedClass = {
      ...classData,
      additionalContent: [
        ...(classData.additionalContent || []),
        {
          id: Date.now().toString(),
          name: file.name,
          uploadDate: new Date().toISOString(),
          isCommitted: false,
        },
      ],
    };
    onUpdate(updatedClass);
  };

  const handleViewPdf = async (pdfUrl: string | null) => {
    setPdfError(null);
    
    if (!pdfUrl) {
      setPdfError("No PDF URL available");
      toast({
        title: "Error",
        description: "Cannot view PDF: URL not available",
        variant: "destructive",
      });
      return;
    }

    try {
      // If it's a storage path, get the URL from Supabase
      if (!pdfUrl.startsWith('http')) {
        const { data } = supabase.storage
          .from('pdfs')
          .getPublicUrl(pdfUrl);
          
        if (!data?.publicUrl) {
          setPdfError("Could not get public URL");
          return;
        }
        
        pdfUrl = data.publicUrl;
      }

      // Log the exact URL we're trying to use
      console.log('Raw PDF URL:', pdfUrl);
      
      // Try to clean up any encoding issues
      const cleanUrl = decodeURIComponent(pdfUrl);
      console.log('Decoded PDF URL:', cleanUrl);
      
      setSelectedPdf(cleanUrl);
    } catch (error) {
      console.error('Error processing PDF URL:', error);
      setPdfError("Error processing PDF URL");
      toast({
        title: "Error",
        description: "Failed to load PDF",
        variant: "destructive",
      });
    }
  };

  const handleCommitContent = async (contentId: string) => {
    try {
      await commitSyllabusToKnowledge(contentId);
      
      const updatedClass = {
        ...classData,
        additionalContent: classData.additionalContent?.map((content) =>
          content.id === contentId
            ? { ...content, isCommitted: true }
            : content
        ),
      };
      
      onUpdate(updatedClass);
      toast({
        title: "Success",
        description: "Content committed to knowledge base",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to commit content to knowledge base",
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{classData.syllabusName}</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main content area - Chat or PDF */}
        <div className="col-span-9">
          {selectedPdf ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Document Viewer</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedPdf(null);
                    setPdfError(null);
                  }}
                >
                  Back to Chat
                </Button>
              </div>
              {pdfError ? (
                <div className="flex items-center justify-center h-[600px] text-red-500">
                  {pdfError}
                </div>
              ) : (
                <div className="h-[600px] overflow-hidden">
                  <PDFViewer pdfUrl={selectedPdf} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md h-[600px]">
              <ChatInterface classData={classData} />
            </div>
          )}
        </div>

        {/* Right column - Content List */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <Button onClick={() => navigate("add-content")} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Syllabus Card */}
              <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">Syllabus</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPdf(classData.pdfUrl || null)}
                  >
                    View
                  </Button>
                </div>
              </div>

              {/* Additional Content Cards */}
              {classData.additionalContent?.map((content) => (
                <div key={content.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      <div>
                        <span className="font-medium">{content.name}</span>
                        <p className="text-sm text-gray-500">
                          {new Date(content.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!content.isCommitted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommitContent(content.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPdf(content.pdfUrl)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};