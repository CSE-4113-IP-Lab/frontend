import React, { useState, useEffect } from 'react';
import type { ResearchContribution, ResearchFilters } from '../../types';
import { researchApi } from './services/api';
import ResearchFiltersBar from './ResearchFiltersBar';
import ResearchTableSection from './ResearchTableSection';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

type Tab = 'grants' | 'fellowships' | 'publications';

const ResearchGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('grants');
  const [contributions, setContributions] = useState<ResearchContribution[]>([]);
  const [filters, setFilters] = useState<ResearchFilters>({
    year: '',
    type: '',
    recipient: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await researchApi.getContributions();
      setContributions(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch research contributions');
    } finally {
      setLoading(false);
    }
  };

  const filteredContributions = contributions.filter((contribution) => {
    return (
      (!filters.year || contribution.year.toString() === filters.year) &&
      (!filters.recipient ||
        contribution.principal_investigator?.toLowerCase().includes(filters.recipient.toLowerCase()) ||
        contribution.recipient?.toLowerCase().includes(filters.recipient.toLowerCase()))
    );
  });

  const groupedContributions = {
    grants: filteredContributions.filter(c => c.type === 'grant'),
    fellowships: filteredContributions.filter(c => c.type === 'fellowship'),
    publications: filteredContributions.filter(c => c.type === 'publication'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Research Gallery</h1>
        <p className="text-gray-600 mb-6">
          Explore our department’s research grants, fellowships, and publications.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-300">
          {(['grants', 'fellowships', 'publications'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-800'
                  : 'border-transparent text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <ResearchFiltersBar
          filters={filters}
          setFilters={setFilters}
          contributions={contributions}
        />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <ResearchTableSection
            groupedContributions={{
              grants: activeTab === 'grants' ? groupedContributions.grants : [],
              fellowships: activeTab === 'fellowships' ? groupedContributions.fellowships : [],
              publications: activeTab === 'publications' ? groupedContributions.publications : [],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ResearchGallery;
