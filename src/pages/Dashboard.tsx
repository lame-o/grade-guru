import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { FileUpload } from "@/components/FileUpload";
import { ClassGrid } from "@/components/ClassGrid";
import { ClassDetail } from "@/components/ClassDetail";
import { Class } from "@/types/class";
import { useNavigate, Routes, Route, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getUserPDFs, deleteClass } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { FileText } from "lucide-react";

// Separate component for the main dashboard view
const DashboardHome = ({ 
  classes, 
  onClassDelete,
  loading 
}: { 
  classes: Class[], 
  onClassDelete: (classData: Class) => Promise<void>,
  loading: boolean 
}) => {
  const navigate = useNavigate();

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Class Dashboard
        </h1>
        <Button onClick={() => navigate("/dashboard/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Class
        </Button>
      </div>
      <ClassGrid 
        classes={classes}
        onClassClick={(classId) => navigate(`/dashboard/class/${classId}`)}
        onClassDelete={onClassDelete}
      />
    </div>
  );
};

// Separate component for class detail view
const ClassDetailView = ({ 
  classes,
  onClassUpdated 
}: { 
  classes: Class[],
  onClassUpdated: (updatedClass: Class) => void 
}) => {
  const { classId } = useParams();
  const selectedClassData = classes.find(c => c.id === classId);

  if (!selectedClassData) {
    return <div>Class not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedClassData.name}
        </h1>
      </div>
      <ClassDetail 
        classData={selectedClassData} 
        onUpdate={onClassUpdated}
      />
    </div>
  );
};

// Separate component for adding additional content
const AddContentView = ({ 
  classes,
  onClassUpdated 
}: { 
  classes: Class[],
  onClassUpdated: (updatedClass: Class) => void 
}) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const selectedClassData = classes.find(c => c.id === classId);

  if (!selectedClassData) {
    return <div>Class not found</div>;
  }

  const handleContentAdded = (newContent: Class) => {
    const updatedClass = {
      ...selectedClassData,
      additionalContent: [...(selectedClassData.additionalContent || []), {
        id: newContent.id,
        name: newContent.syllabusName,
        uploadDate: newContent.uploadDate,
        pdfUrl: newContent.pdfUrl || '',
        isCommitted: false
      }]
    };
    onClassUpdated(updatedClass);
    toast.success("Content added successfully!");
    navigate(`/dashboard/class/${classId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Class Name Header - Clickable */}
        <h1 className="text-2xl font-bold text-gray-900">
          <Button 
            variant="link" 
            className="p-0 h-auto font-bold text-2xl"
            onClick={() => navigate(`/dashboard/class/${classId}`)}
          >
            {selectedClassData.name}
          </Button>
        </h1>
        
        {/* Add Additional Content Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Add Additional Content</h2>
          <FileUpload 
            onClassCreated={handleContentAdded} 
            isAdditionalContent={true}
            existingClass={selectedClassData}
          />
        </div>

        {/* Class Materials Sidebar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold mb-4">Class Materials</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Syllabus</h4>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{selectedClassData.syllabusName}</span>
                </div>
              </div>
            </div>
            
            {selectedClassData.additionalContent && selectedClassData.additionalContent.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Additional Content</h4>
                <div className="space-y-2 mt-2">
                  {selectedClassData.additionalContent.map((content) => (
                    <div key={content.id} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{content.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for adding a new class
const AddNewClass = ({ onClassCreated }: { onClassCreated: (newClass: Class) => void }) => {
  const navigate = useNavigate();

  const handleClassCreated = (newClass: Class) => {
    // Update parent state first
    onClassCreated(newClass);
    toast.success("Class created successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Add New Class
        </h1>
      </div>
      <div className="flex justify-center">
        <FileUpload onClassCreated={handleClassCreated} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleClassDelete = async (classData: Class) => {
    if (!session?.user?.id) return;

    try {
      // Show loading state
      toast.loading("Deleting class...");
      
      // Wait for the deletion to complete
      await deleteClass(session.user.id, classData.name);
      
      // Update local state
      setClasses(prevClasses => prevClasses.filter(c => c.id !== classData.id));
      
      // Show success and navigate
      toast.dismiss();
      toast.success(`${classData.name} has been deleted`);
      
      // Only navigate if we're in the class view
      if (location.pathname.includes(`/dashboard/class/${classData.id}`)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.dismiss();
      toast.error('Failed to delete class');
    }
  };

  const handleClassCreated = (newClass: Class) => {
    setClasses(prevClasses => [...prevClasses, newClass]);
  };

  const handleClassUpdated = (updatedClass: Class) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === updatedClass.id ? updatedClass : cls
      )
    );
  };

  if (!session) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardHome 
                  classes={classes}
                  onClassDelete={handleClassDelete}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="/class/:classId" 
              element={
                <ClassDetailView 
                  classes={classes}
                  onClassUpdated={handleClassUpdated}
                />
              } 
            />
            <Route 
              path="/class/:classId/add-content" 
              element={
                <AddContentView 
                  classes={classes}
                  onClassUpdated={handleClassUpdated}
                />
              } 
            />
            <Route 
              path="/new" 
              element={<AddNewClass onClassCreated={handleClassCreated} />} 
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;