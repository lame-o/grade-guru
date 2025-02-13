import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Class } from "@/types/class";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClassCardProps {
  classData: Class;
  onClick: (classId: string) => void;
  onDelete: (classData: Class) => void;
}

export const ClassCard = ({ classData, onClick, onDelete }: ClassCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger card click when clicking delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.stopPropagation();
      return;
    }
    onClick(classData.id);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer relative group"
      onClick={handleClick}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="delete-button h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {classData.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this class and all its associated content. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => onDelete(classData)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{classData.name}</CardTitle>
        <CardDescription>{classData.syllabusName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Uploaded on {new Date(classData.uploadDate).toLocaleDateString()}</span>
          </div>
          {classData.lastAccessed && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Last accessed {new Date(classData.lastAccessed).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};