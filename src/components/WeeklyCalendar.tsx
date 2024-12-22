import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Class } from "@/types/class";

interface WeeklyCalendarProps {
  classes: Class[];
}

export const WeeklyCalendar = ({ classes }: WeeklyCalendarProps) => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // In a real app, we'd parse actual schedule data from the classes
  // For now, we'll just show the class names on random days for demonstration
  const getRandomDay = () => Math.floor(Math.random() * 5);

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4 gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Weekly Schedule</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px] grid grid-cols-5 gap-4">
          {weekDays.map((day) => (
            <div key={day} className="space-y-2">
              <div className="font-medium text-center p-2 bg-accent/20 rounded-md">
                {day}
              </div>
              <div className="min-h-[200px] bg-accent/10 rounded-md p-2 space-y-2">
                {classes.map((classItem) => {
                  // Randomly assign classes to days for demonstration
                  if (getRandomDay() === weekDays.indexOf(day)) {
                    return (
                      <div
                        key={classItem.id}
                        className="bg-primary text-primary-foreground rounded p-2 text-sm flex items-center justify-center text-center"
                      >
                        {classItem.name}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};