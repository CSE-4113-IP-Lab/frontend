import React from "react";
import { Filter } from "lucide-react";

interface ExamFilterBarProps {
  filters: {
    semester: string;
    year: string;
    batch: string;
    type: string;
    room: string;
    exam_date: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const ExamFilterBar: React.FC<ExamFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className = "",
}) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Filter className="text-blue-900" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filter Exams</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline">
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Semester Filter */}
        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            id="semester"
            value={filters.semester}
            onChange={(e) => onFilterChange("semester", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0">
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem.toString()}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            id="year"
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0">
            <option value="">All Years</option>
            {[1, 2, 3, 4, 5].map((yr) => (
              <option key={yr} value={yr.toString()}>
                Year {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <input
            type="text"
            id="batch"
            value={filters.batch}
            onChange={(e) => onFilterChange("batch", e.target.value)}
            placeholder="e.g., 20"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0"
          />
        </div>

        {/* Exam Type Filter */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0">
            <option value="">All Types</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>

        {/* Room Filter */}
        <div>
          <label
            htmlFor="room"
            className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <input
            type="text"
            id="room"
            value={filters.room}
            onChange={(e) => onFilterChange("room", e.target.value)}
            placeholder="e.g., Room 301"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label
            htmlFor="exam_date"
            className="block text-sm font-medium text-gray-700 mb-1">
            Exam Date
          </label>
          <input
            type="date"
            id="exam_date"
            value={filters.exam_date}
            onChange={(e) => onFilterChange("exam_date", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-w-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ExamFilterBar;
