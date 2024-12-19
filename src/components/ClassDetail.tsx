import { useState } from "react";
import { PDFViewer } from "@/components/PDFViewer";
import { ChatInterface } from "@/components/ChatInterface";
import { Class } from "@/types/class";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ClassDetailProps {
  classData: Class;
}

export const ClassDetail = ({ classData }: ClassDetailProps) => {
  const [isCommitted, setIsCommitted] = useState(false);
  const { toast } = useToast();

  const handleCommitToKnowledge = () => {
    setIsCommitted(true);
    toast({
      title: "PDF Committed to Knowledge",
      description: "The PDF content has been added to the chatbot's knowledge base.",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {classData.name}
            </h2>
            {!isCommitted && classData.pdfUrl && (
              <Button 
                onClick={handleCommitToKnowledge}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Commit to Knowledge
              </Button>
            )}
          </div>
          
          {classData.pdfUrl && (
            isCommitted ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-gray-600">
                    PDF content has been added to chatbot's knowledge base
                  </p>
                </div>
              </div>
            ) : (
              <PDFViewer pdfUrl={classData.pdfUrl} />
            )
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <ChatInterface />
      </div>
    </div>
  );
};