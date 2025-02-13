import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { FileUpload } from "@/components/FileUpload";
import { Class } from "@/types/class";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { commitSyllabusToKnowledge } from "@/utils/pdfUtils";
import { PDFViewer } from "@/components/PDFViewer";

interface ClassDetailProps {
  classData: Class;
  onUpdate: (updatedClass: Class) => void;
}

export const ClassDetail = ({ classData, onUpdate }: ClassDetailProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const { toast } = useToast();

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
    setShowUpload(false);
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
      console.error("Error committing content:", error);
      toast({
        title: "Error",
        description: "Failed to commit content. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {classData.name}
        </h2>
        <Button 
          onClick={() => setShowUpload(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </Button>
      </div>

      <div className="flex gap-8">
        <div className="w-3/4">
          {showUpload ? (
            <FileUpload 
              existingClass={classData}
              onClassCreated={handleContentAdded}
              onUpdate={onUpdate}
              isAdditionalContent={true}
            />
          ) : (
            <ChatInterface classData={classData} />
          )}
        </div>

        <div className="w-1/4 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Class Materials</h3>
            
            {/* Syllabus */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Syllabus</h4>
              <Button
                variant={selectedPdf === classData.pdfUrl ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setSelectedPdf(classData.pdfUrl || null)}
              >
                <FileText className="w-4 h-4" />
                {classData.syllabusName}
              </Button>
            </div>

            {/* Additional Content */}
            {classData.additionalContent && classData.additionalContent.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Additional Content</h4>
                {classData.additionalContent.map((content) => (
                  <div key={content.id} className="space-y-1">
                    <Button
                      variant={selectedPdf === content.pdfUrl ? "default" : "outline"}
                      className="w-full justify-start gap-2"
                      onClick={() => setSelectedPdf(content.pdfUrl)}
                    >
                      <FileText className="w-4 h-4" />
                      {content.name}
                    </Button>
                    {!content.isCommitted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs gap-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleCommitContent(content.id)}
                      >
                        <Check className="w-3 h-3" />
                        Commit to Knowledge Base
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF Preview */}
          {selectedPdf && (
            <div className="h-[calc(100vh-24rem)] bg-white p-4 rounded-lg shadow">
              <PDFViewer pdfUrl={selectedPdf} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};