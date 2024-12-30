import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/components/FileUpload";
import { ClassGrid } from "@/components/ClassGrid";
import { ClassDetail } from "@/components/ClassDetail";
import { Class } from "@/types/class";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Grade Guru</h1>
            <p className="text-gray-600 mb-8">Your personal syllabus assistant</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2563eb',
                      brandAccent: '#1d4ed8',
                    },
                  },
                },
              }}
              theme="light"
              providers={[]}
            />
          </div>
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

export default Index;