import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { ClassCard } from "@/components/ClassCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Class } from "@/types/class";

const Index = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  
  // Mock data - replace with actual data storage later
  const [classes] = useState<Class[]>([
    {
      id: "1",
      name: "Introduction to Computer Science",
      syllabusName: "CS101_Syllabus.pdf",
      uploadDate: "2024-02-20T10:00:00Z",
      lastAccessed: "2024-02-21T15:30:00Z",
    },
  ]);

  const handleClassClick = (classId: string) => {
    setSelectedClass(classId);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Class Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!showUpload && !selectedClass && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Classes</h2>
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Class
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classData={classItem}
                    onClick={handleClassClick}
                  />
                ))}
              </div>
            </div>
          )}

          {showUpload && (
            <div className="flex justify-center">
              <FileUpload />
            </div>
          )}

          {selectedClass && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-1/3">
                <Button 
                  variant="outline" 
                  className="mb-4"
                  onClick={() => setSelectedClass(null)}
                >
                  Back to Dashboard
                </Button>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">
                    {classes.find(c => c.id === selectedClass)?.name}
                  </h2>
                  {/* Add more class details here */}
                </div>
              </div>
              <div className="w-full lg:w-2/3">
                <ChatInterface />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;