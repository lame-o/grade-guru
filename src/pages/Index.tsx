import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ClassGrid } from "@/components/ClassGrid";
import { ClassDetail } from "@/components/ClassDetail";
import { Class } from "@/types/class";

const Index = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const handleClassClick = (classId: string) => {
    setSelectedClass(classId);
    setShowUpload(false);
  };

  const handleClassCreated = (newClass: Class) => {
    setClasses(prevClasses => [...prevClasses, newClass]);
    setShowUpload(false);
  };

  const handleBack = () => {
    setShowUpload(false);
    setSelectedClass(null);
  };

  const selectedClassData = classes.find(c => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        showUpload={showUpload}
        selectedClass={selectedClass}
        onBackClick={handleBack}
        onHomeClick={handleBack}
        onAddNewClick={() => setShowUpload(true)}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!showUpload && !selectedClass && (
            <ClassGrid 
              classes={classes}
              onClassClick={handleClassClick}
            />
          )}

          {showUpload && (
            <div className="flex justify-center">
              <FileUpload onClassCreated={handleClassCreated} />
            </div>
          )}

          {selectedClass && selectedClassData && (
            <ClassDetail classData={selectedClassData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;