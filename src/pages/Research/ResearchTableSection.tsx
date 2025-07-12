import React from 'react';
import { Link } from 'react-router-dom';
import type { ResearchContribution } from '../../types';

interface Props {
  groupedContributions: {
    grants: ResearchContribution[];
    fellowships: ResearchContribution[];
    publications: ResearchContribution[];
  };
}

const ResearchTableSection: React.FC<Props> = ({ groupedContributions }) => {
  const renderTable = (
    title: string,
    items: ResearchContribution[],
    columns: string[],
    rows: (item: ResearchContribution) => React.ReactNode[]
  ) => (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {rows(item).map((cell, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {groupedContributions.grants.length > 0 &&
        renderTable(
          'Grants',
          groupedContributions.grants,
          ['Title', 'Year', 'Principal Investigator', 'Funding Agency'],
          (item) => [
            <Link to={`/research/${item.id}`} className="text-blue-600 hover:underline font-medium">
              {item.title}
            </Link>,
            item.year,
            item.principal_investigator,
            item.funding_agency
          ]
        )}

      {groupedContributions.fellowships.length > 0 &&
        renderTable(
          'Fellowships',
          groupedContributions.fellowships,
          ['Fellowship Name', 'Year', 'Recipient', 'Institution'],
          (item) => [
            <Link to={`/research/${item.id}`} className="text-blue-600 hover:underline font-medium">
              {item.title}
            </Link>,
            item.year,
            item.recipient,
            item.institution
          ]
        )}

      {groupedContributions.publications.length > 0 &&
        renderTable(
          'Publications',
          groupedContributions.publications,
          ['Title', 'Year', 'Authors', 'Journal/Conference'],
          (item) => [
            <Link to={`/research/${item.id}`} className="text-blue-600 hover:underline font-medium">
              {item.title}
            </Link>,
            item.year,
            item.authors,
            item.journal_conference
          ]
        )}

      {Object.values(groupedContributions).every((group) => group.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No research contributions found matching your filters.
        </div>
      )}
    </>
  );
};

export default ResearchTableSection;
