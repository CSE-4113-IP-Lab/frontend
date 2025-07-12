import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { researchApi } from './services/api';
import type { ResearchContribution } from '../../types';

const ResearchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contribution, setContribution] = useState<ResearchContribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await researchApi.getContributionsByUser(Number(id));
        setContribution(response.data);
      } catch {
        setError('Failed to load research detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!contribution) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/research" className="text-blue-700 hover:underline mb-4 inline-block">
        ← Back to Gallery
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{contribution.title}</h1>
        <p className="text-sm text-gray-500 mb-6">Year: {contribution.year}</p>

        {contribution.type === 'grant' && (
          <>
            <p><strong>Principal Investigator:</strong> {contribution.principal_investigator}</p>
            <p><strong>Funding Agency:</strong> {contribution.funding_agency}</p>
          </>
        )}

        {contribution.type === 'fellowship' && (
          <>
            <p><strong>Recipient:</strong> {contribution.recipient}</p>
            <p><strong>Institution:</strong> {contribution.institution}</p>
          </>
        )}

        {contribution.type === 'publication' && (
          <>
            <p><strong>Authors:</strong> {contribution.authors}</p>
            <p><strong>Journal/Conference:</strong> {contribution.journal_conference}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResearchDetail;
