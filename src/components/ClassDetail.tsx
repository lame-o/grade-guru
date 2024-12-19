import { PDFViewer } from "@/components/PDFViewer";
import { ChatInterface } from "@/components/ChatInterface";
import { Class } from "@/types/class";

interface ClassDetailProps {
  classData: Class;
}

export const ClassDetail = ({ classData }: ClassDetailProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {classData.name}
          </h2>
          {classData.pdfUrl && (
            <PDFViewer pdfUrl={classData.pdfUrl} />
          )}
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <ChatInterface />
      </div>
    </div>
  );
};