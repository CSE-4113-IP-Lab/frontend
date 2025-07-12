import React from 'react';
import type { ResearchContribution, ResearchFilters } from '../../types';

interface Props {
  filters: ResearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<ResearchFilters>>;
  contributions: ResearchContribution[];
}

const ResearchFiltersBar: React.FC<Props> = ({ filters, setFilters, contributions }) => {
  const years = Array.from(new Set(contributions.map(c => c.year))).sort((a, b) => b - a);

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <select
        value={filters.year}
        onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Years</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Types</option>
        <option value="grant">Grants</option>
        <option value="fellowship">Fellowships</option>
        <option value="publication">Publications</option>
      </select>

      <input
        type="text"
        placeholder="Search by recipient..."
        value={filters.recipient}
        onChange={(e) => setFilters(prev => ({ ...prev, recipient: e.target.value }))}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default ResearchFiltersBar;
