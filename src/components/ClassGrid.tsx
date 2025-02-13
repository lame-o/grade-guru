import { ClassCard } from "@/components/ClassCard";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { Class } from "@/types/class";

interface ClassGridProps {
  classes: Class[];
  onClassClick: (classId: string) => void;
  onClassDelete: (classData: Class) => void;
}

export const ClassGrid = ({ classes, onClassClick, onClassDelete }: ClassGridProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classData={classItem}
            onClick={onClassClick}
            onDelete={onClassDelete}
          />
        ))}
      </div>
      {classes.length === 0 && (
        <div className="text-center text-gray-500">
          No classes yet. Click "Add New Class" to get started.
        </div>
      )}
      
      <WeeklyCalendar classes={classes} />
    </div>
  );
};