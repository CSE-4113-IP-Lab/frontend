import React, { useState, useMemo } from "react";
import {
  fullScheduleData,
  timeSlots,
  days,
  exportScheduleToPDF,
} from "./data/scheduleData";
import type { FilterState, ScheduleEntry } from "../../../types";
import FilterBar from "./FilterBar";
import ScheduleTable from "./ScheduleTable";
import Statistics from "./Statistics";

const ClassSchedule: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    batch: "",
    semester: "",
    level: "",
  });

  const filteredScheduleData = useMemo(() => {
    if (!filters.batch && !filters.semester) return fullScheduleData;
    const result: Record<string, Record<string, ScheduleEntry>> = {};
    Object.entries(fullScheduleData).forEach(([timeSlot, dayData]) => {
      const filteredDay: Record<string, ScheduleEntry> = {};
      Object.entries(dayData).forEach(([day, entry]) => {
        const matchBatch = !filters.batch || entry.batch === filters.batch;
        const matchSemester =
          !filters.semester || entry.semester === filters.semester;
        if (matchBatch && matchSemester) filteredDay[day] = entry;
      });
      result[timeSlot] = filteredDay;
    });
    return result;
  }, [filters]);

  const getUniqueValues = (key: "batch" | "semester") => {
    const set = new Set<string>();
    Object.values(fullScheduleData).forEach((ts) =>
      Object.values(ts).forEach((entry) => set.add(entry[key]))
    );
    return Array.from(set).sort();
  };

  const getFilteredResultsCount = () =>
    Object.values(filteredScheduleData).reduce(
      (sum, ts) => sum + Object.keys(ts).length,
      0
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          📚 Class Schedule
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Weekly schedule for the Department of CSE, University of Dhaka
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow border border-gray-200">
        <FilterBar
          filters={filters}
          uniqueBatches={getUniqueValues("batch")}
          uniqueSemesters={getUniqueValues("semester")}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
          onClear={() =>
            setFilters({
              batch: "",
              semester: "",
              level: "",
            })
          }
          resultsCount={getFilteredResultsCount()}
        />
      </div>

      {/* Schedule Table */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-8">
        <ScheduleTable
          scheduleData={filteredScheduleData}
          timeSlots={timeSlots}
          days={days}
        />
      </div>

      {/* Stats */}
      <Statistics
        total={getFilteredResultsCount()}
        timeSlots={timeSlots.length}
        days={days.length}
      />

      {/* Export Buttons */}
      <div className="mt-10 sticky bottom-4 bg-white py-4 px-6 rounded-xl shadow-md flex justify-center gap-4">
        <button
          onClick={() => exportScheduleToPDF(filteredScheduleData)}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition"
        >
          📄 Export to PDF
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          🖨️ Print Schedule
        </button>
      </div>
    </div>
  );
};

export default ClassSchedule;
