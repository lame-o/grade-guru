import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { FileUpload } from "@/components/FileUpload";
import { ClassGrid } from "@/components/ClassGrid";
import { ClassDetail } from "@/components/ClassDetail";
import { Class } from "@/types/class";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getUserPDFs } from "@/utils/pdfUtils";
import { toast } from "sonner";

const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      if (session?.user?.id) {
        try {
          const userPDFs = await getUserPDFs(session.user.id);
          setClasses(userPDFs);
        } catch (error) {
          console.error("Error fetching PDFs:", error);
          toast.error("Failed to load your classes");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClasses();
  }, [session?.user?.id]);

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

  if (!session) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!showUpload && !selectedClass && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Class Dashboard
                </h1>
                <Button onClick={() => setShowUpload(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Class
                </Button>
              </div>
              <ClassGrid 
                classes={classes}
                onClassClick={handleClassClick}
              />
            </div>
          )}

          {showUpload && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  Add New Class
                </h1>
                <Button variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
              </div>
              <div className="flex justify-center">
                <FileUpload onClassCreated={handleClassCreated} />
              </div>
            </div>
          )}

          {selectedClass && selectedClassData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  Class Chat
                </h1>
                <Button variant="outline" onClick={handleBack}>
                  Back to Dashboard
                </Button>
              </div>
              <ClassDetail classData={selectedClassData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;