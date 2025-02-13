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

interface ClassDetailProps {
  classData: Class;
  onUpdate: (updatedClass: Class) => void;
}

export const ClassDetail = ({ classData, onUpdate }: ClassDetailProps) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContentAdded = (newContent: Class) => {
    const updatedClass = {
      ...classData,
      additionalContent: [...(classData.additionalContent || []), {
        id: newContent.id,
        name: newContent.syllabusName,
        uploadDate: newContent.uploadDate,
        pdfUrl: newContent.pdfUrl || '',
        isCommitted: false
      }]
    };
    onUpdate(updatedClass);
  };

  const handleCommitContent = async (contentId: string) => {
    try {
      await commitSyllabusToKnowledge(contentId);
      const updatedClass = {
        ...classData,
        additionalContent: classData.additionalContent?.map(content => 
          content.id === contentId 
            ? { ...content, isCommitted: true }
            : content
        )
      };
      onUpdate(updatedClass);
      toast({
        title: "Success",
        description: "Content has been committed to the knowledge base!",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error committing content:', error);
      toast({
        title: "Error",
        description: "Failed to commit content to knowledge base",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate(`add-content`)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
          
          {classData.additionalContent && classData.additionalContent.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Additional Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classData.additionalContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-6 h-6 text-gray-500" />
                      <div>
                        <p className="font-medium">{content.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(content.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {content.isCommitted ? (
                        <div className="flex items-center text-green-600">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-sm">Committed</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCommitContent(content.id)}
                        >
                          Commit
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPdf(content.pdfUrl)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <ChatInterface classData={classData} />
          </div>
        </div>
      </div>

      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-[90vw] h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">PDF Viewer</h2>
              <Button variant="ghost" onClick={() => setSelectedPdf(null)}>
                Close
              </Button>
            </div>
            <div className="flex-1">
              <PDFViewer url={selectedPdf} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};