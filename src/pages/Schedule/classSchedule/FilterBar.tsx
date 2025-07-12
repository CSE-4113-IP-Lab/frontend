import React from "react";
import type { FilterState } from "../../../types";

interface Props {
  filters: FilterState;
  uniqueBatches: string[];
  uniqueSemesters: string[];
  uniqueYears: string[];
  uniqueRooms: string[];
  uniquePrograms: Array<{ id: number; name: string; type: string }>;
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  resultsCount: number;
  isLoading?: boolean;
}

const FilterBar: React.FC<Props> = ({
  filters,
  uniqueBatches,
  uniqueSemesters,
  uniqueYears,
  uniqueRooms,
  uniquePrograms,
  onChange,
  onClear,
  resultsCount,
  isLoading = false,
}) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📋 Schedule Filters
      </h2>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {/* Program Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program
          </label>
          <select
            value={filters.program_id}
            onChange={(e) => onChange("program_id", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Programs</option>
            {uniquePrograms.map((program) => (
              <option key={program.id} value={program.id.toString()}>
                {program.type} in {program.name}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <select
            value={filters.batch}
            onChange={(e) => onChange("batch", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Batches</option>
            {uniqueBatches.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onChange("year", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            value={filters.semester}
            onChange={(e) => onChange("semester", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Semesters</option>
            {uniqueSemesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Day Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Day
          </label>
          <select
            value={filters.day_of_week}
            onChange={(e) => onChange("day_of_week", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Days</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>

        {/* Room Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <select
            value={filters.room}
            onChange={(e) => onChange("room", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}>
            <option value="">All Rooms</option>
            {uniqueRooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
            disabled={isLoading}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              Showing {isLoading ? "..." : resultsCount} classes
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              const displayKey = key
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
              let displayValue = value;

              if (key === "program_id") {
                const program = uniquePrograms.find(
                  (p) => p.id.toString() === value
                );
                displayValue = program
                  ? `${program.type} in ${program.name}`
                  : value;
              } else if (key === "day_of_week") {
                displayValue = value.charAt(0).toUpperCase() + value.slice(1);
              }

              return (
                <span key={key} className="inline-block mr-3">
                  {displayKey}: <strong>{displayValue}</strong>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
