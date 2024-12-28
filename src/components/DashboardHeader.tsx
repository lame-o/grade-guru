import { Button } from "@/components/ui/button";
import { Home, Plus, ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  showUpload: boolean;
  selectedClass: string | null;
  onBackClick: () => void;
  onHomeClick: () => void;
  onAddNewClick: () => void;
}

export const DashboardHeader = ({
  showUpload,
  selectedClass,
  onBackClick,
  onHomeClick,
  onAddNewClick,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {(showUpload || selectedClass) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackClick}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onHomeClick}
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedClass ? "Class Chat" : showUpload ? "Add New Class" : "Class Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {!showUpload && !selectedClass && (
              <Button onClick={onAddNewClick}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="ml-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};