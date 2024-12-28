import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { FileUpload } from "@/components/FileUpload";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ClassGrid } from "@/components/ClassGrid";
import { ClassDetail } from "@/components/ClassDetail";
import { Class } from "@/types/class";
import { useNavigate } from "react-router-dom";

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
                className: {
                  container: 'flex flex-col gap-4',
                  label: 'text-sm font-medium text-gray-700',
                  input: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500',
                  button: 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                },
              }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_up: {
                    password_label: 'Password (minimum 6 characters)',
                    email_label: 'Email',
                    button_label: 'Sign up',
                  },
                },
              }}
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Minimum 6 characters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

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