import React from "react";
import type { ScheduleEntry, TimeSlot } from "../../../types";

interface Props {
  scheduleData: Record<string, Record<string, ScheduleEntry>>;
  timeSlots: TimeSlot[];
  days: string[];
}

const ScheduleTable: React.FC<Props> = ({ scheduleData, timeSlots, days }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Time</th>
            {days.map(day => (
              <th key={day} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, idx) => {
            const timeKey = `${slot.start}-${slot.end}`;
            return (
              <tr key={timeKey} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium border-b">
                  <div>{slot.start}</div>
                  <div className="text-sm text-gray-500">{slot.end}</div>
                </td>
                {days.map(day => {
                  const entry = scheduleData[timeKey]?.[day];
                  return (
                    <td key={day} className="px-4 py-3 border-b text-sm">
                      {entry ? (
                        <div className="space-y-1">
                          <div className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 inline-block">{entry.courseCode}</div>
                          <div className="text-xs text-gray-600">{entry.courseName}</div>
                          <div className="text-xs text-gray-500">Batch {entry.batch} • Sem {entry.semester}</div>
                          <div className="text-xs text-gray-500">{entry.instructor}</div>
                          <div className="text-xs text-green-600 font-medium">{entry.room}</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">No class</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default ScheduleTable;
