import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Class } from "@/types/class";

interface WeeklyCalendarProps {
  classes: Class[];
}

export const WeeklyCalendar = ({ classes }: WeeklyCalendarProps) => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // In a real app, we'd parse actual schedule data from the classes
  // For now, we'll just show the class names on random slots for demonstration
  const getRandomTimeSlot = () => Math.floor(Math.random() * 12);
  const getRandomDay = () => Math.floor(Math.random() * 5);

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center mb-4 gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Weekly Schedule</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2">
            <div className="font-medium text-muted-foreground">Time</div>
            {weekDays.map((day) => (
              <div key={day} className="font-medium text-center">{day}</div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[100px_repeat(5,1fr)] gap-2 mb-2"
            >
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {`${hour}:00`}
              </div>
              {weekDays.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className="bg-accent/20 rounded-md h-12 p-2 text-sm"
                >
                  {classes.map((classItem) => {
                    // Randomly assign classes to slots for demonstration
                    if (getRandomTimeSlot() === hour - 8 && getRandomDay() === weekDays.indexOf(day)) {
                      return (
                        <div
                          key={classItem.id}
                          className="bg-primary text-primary-foreground rounded p-1 h-full flex items-center justify-center text-center"
                        >
                          {classItem.name}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};