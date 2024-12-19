import { Button } from "@/components/ui/button";
import { Home, Plus, ArrowLeft } from "lucide-react";

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
          {!showUpload && !selectedClass && (
            <Button onClick={onAddNewClick}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Class
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};