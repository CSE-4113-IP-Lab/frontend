import React from "react";
import type { FilterState } from "../../../types";

interface Props {
  filters: FilterState;
  uniqueBatches: string[];
  uniqueSemesters: string[];
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  resultsCount: number;
}

const FilterBar: React.FC<Props> = ({ filters, uniqueBatches, uniqueSemesters, onChange, onClear, resultsCount }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={filters.batch}
          onChange={(e) => onChange('batch', e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Batches</option>
          {uniqueBatches.map(batch => (
            <option key={batch} value={batch}>Batch {batch}</option>
          ))}
        </select>

        <select
          value={filters.semester}
          onChange={(e) => onChange('semester', e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Semesters</option>
          {uniqueSemesters.map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
          ))}
        </select>

        {(filters.batch || filters.semester) && (
          <button onClick={onClear} className="px-4 py-2 bg-gray-500 text-white rounded-md">Clear Filters</button>
        )}
      </div>

      {(filters.batch || filters.semester) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          Showing {resultsCount} classes
          {filters.batch && ` for Batch ${filters.batch}`}
          {filters.semester && ` in Semester ${filters.semester}`}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
