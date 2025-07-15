import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface Faculty {
  id: number;
  bio: string;
  designation: string;
  joining_date: string;
  on_leave: number;
  expertise: string[] | null;
  user_id: number;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    is_verified: number;
    image_id: number | null;
    image: {
      id: number;
      url: string;
    } | null;
  };
}

interface YearwiseFaculty {
  year: number;
  faculties: Faculty[];
}

const NewFacultyYearwise: React.FC = () => {
  const navigate = useNavigate();
  const [yearwiseFaculties, setYearwiseFaculties] = useState<YearwiseFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  
  const apiUrl = import.meta.env.VITE_ENDPOINT;

  // Helper function to get image URL
  const getImageUrl = (image: { id: number; url: string } | null): string | null => {
    if (!image) return null;
    if (image.url.startsWith('http')) {
      return image.url;
    }
    return `${apiUrl}/${image.url}`;
  };

  // Helper function to get joining year from date
  const getJoiningYear = (joiningDate: string): number => {
    return new Date(joiningDate).getFullYear();
  };

  // Fetch and group faculties by joining year
  useEffect(() => {
    const fetchYearwiseFaculties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch(`${apiUrl}/faculties?skip=0&limit=100`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch yearwise faculties: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Group faculties by joining year
        const facultyByYear: { [key: number]: Faculty[] } = {};
        
        data.forEach((faculty: Faculty) => {
          const year = getJoiningYear(faculty.joining_date);
          if (!facultyByYear[year]) {
            facultyByYear[year] = [];
          }
          facultyByYear[year].push(faculty);
        });

        // Convert to array and sort by year (newest first)
        const yearwiseData: YearwiseFaculty[] = Object.keys(facultyByYear)
          .map(year => ({
            year: parseInt(year),
            faculties: facultyByYear[parseInt(year)]
          }))
          .sort((a, b) => b.year - a.year);

        setYearwiseFaculties(yearwiseData);
        
        // Initially expand the current year and last year
        const currentYear = new Date().getFullYear();
        setExpandedYears(new Set([currentYear, currentYear - 1]));
      } catch (err) {
        console.error('Error fetching yearwise faculties:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchYearwiseFaculties();
  }, [apiUrl]);

  // Handle faculty card click
  const handleFacultyClick = (facultyId: number) => {
    navigate(`/faculty/profile/${facultyId}`);
  };

  // Toggle year expansion
  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading yearwise faculty data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/faculty')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Faculty Overview
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Faculty by Joining Year</h1>
            <p className="text-xl text-gray-600">
              Faculty members organized by their joining year
            </p>
          </div>
        </div>

        {/* Yearwise Faculty Sections */}
        <div className="space-y-6">
          {yearwiseFaculties.map((yearData) => (
            <div key={yearData.year} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Year Header */}
              <div
                onClick={() => toggleYear(yearData.year)}
                className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {yearData.year} Joining Faculty
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {yearData.faculties.length} member{yearData.faculties.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {expandedYears.has(yearData.year) ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
              </div>

              {/* Faculty Grid (Collapsible) */}
              {expandedYears.has(yearData.year) && (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {yearData.faculties.map((faculty) => (
                      <div
                        key={faculty.id}
                        onClick={() => handleFacultyClick(faculty.id)}
                        className="cursor-pointer transform hover:-translate-y-1 overflow-hidden"
                      >
                        <div className="p-4 text-center">
                          {/* Faculty Image */}
                          <div className="flex justify-center mb-3 relative">
                            {getImageUrl(faculty.user.image) ? (
                              <img
                                src={getImageUrl(faculty.user.image)!}
                                alt={faculty.user.username}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                                <User className="w-12 h-12 text-gray-500" />
                              </div>
                            )}
                            {/* On Leave Badge */}
                            {faculty.on_leave === 1 && (
                              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                On Leave
                              </div>
                            )}
                          </div>

                          {/* Faculty Info */}
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-red-600 mb-1">
                              {faculty.user.username}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {faculty.designation}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Joined: {new Date(faculty.joining_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {yearwiseFaculties.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty data found</h3>
            <p className="text-gray-600">No faculty members with joining dates are available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewFacultyYearwise;
