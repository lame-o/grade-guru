import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Class } from "@/types/class";
import { Calendar, Clock } from "lucide-react";

interface ClassCardProps {
  classData: Class;
  onClick: (classId: string) => void;
}

export const ClassCard = ({ classData, onClick }: ClassCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(classData.id)}
    >
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