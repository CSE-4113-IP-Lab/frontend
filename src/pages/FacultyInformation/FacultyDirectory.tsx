import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Eye, Edit, Users, Filter, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FacultyMember {
  id: number;
  user_id: number;
  bio: string;
  designation: string;
  joining_date: string;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    role: string;
    gender: string;
    image_id: number | null;
    image: string | { id: number; url: string } | null;
  };
}

const FacultyDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);
  const [expertiseOptions, setExpertiseOptions] = useState<string[]>([]);

  const apiUrl = import.meta.env.VITE_ENDPOINT;

  useEffect(() => {
    fetchFacultyData();
    fetchExpertiseOptions();
  }, []);

  // Trigger search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm || selectedDesignation || selectedExpertise) {
        performSearch();
      } else {
        fetchFacultyData(); // Load all data when no filters
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedDesignation, selectedExpertise]);

  const performSearch = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Get authentication token from localStorage (check multiple possible keys)
      // Get token from localStorage
     const token = localStorage.getItem('token');
        
    if (!token) {
          throw new Error('No authentication token found. Please log in.');
    }

      const authHeaders: Record<string, string> = token ? {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      } : {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      console.log('Performing search...');
      console.log('Search term:', searchTerm);
      console.log('Selected designation:', selectedDesignation);
      console.log('Selected expertise:', selectedExpertise);

      // For reliability, let's always use client-side filtering for search
      // since the backend search API is returning 500 errors
      console.log('Using client-side filtering for search...');
      
      try {
        const allDataResponse = await fetch(`${apiUrl}/faculties?skip=0&limit=100`, {
          headers: authHeaders
        });
        
        if (!allDataResponse.ok) {
          throw new Error(`Failed to fetch faculty data: ${allDataResponse.status}`);
        }
        
        const allData = await allDataResponse.json();
        console.log('Loaded all faculty data for client-side filtering:', allData.length, 'members');
        console.log('Sample member data:', allData[0]); // Debug: see the structure
        
        // Apply client-side filtering
        const filtered = allData.filter((member: FacultyMember) => {
          // Search term filtering - be more comprehensive
          if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
              member.user.username?.toLowerCase().includes(searchLower) ||
              member.user.email?.toLowerCase().includes(searchLower) ||
              member.designation?.toLowerCase().includes(searchLower) ||
              member.bio?.toLowerCase().includes(searchLower) ||
              (member.user.username + ' ' + member.designation)?.toLowerCase().includes(searchLower);
            
            if (!matchesSearch) {
              console.log(`Member ${member.user.username} filtered out. Search: "${searchTerm}" didn't match username: "${member.user.username}", email: "${member.user.email}", designation: "${member.designation}"`);
              return false;
            }
          }
          
          // Designation filtering
          if (selectedDesignation && member.designation !== selectedDesignation) {
            console.log(`Member ${member.user.username} filtered out by designation. Expected: "${selectedDesignation}", got: "${member.designation}"`);
            return false;
          }
          
          // Expertise filtering
          if (selectedExpertise) {
            const hasExpertise = (member as any).expertise && 
              (Array.isArray((member as any).expertise) 
                ? (member as any).expertise.includes(selectedExpertise)
                : (member as any).expertise === selectedExpertise);
            
            if (!hasExpertise) {
              console.log(`Member ${member.user.username} filtered out by expertise. Expected: "${selectedExpertise}", got: "${(member as any).expertise}"`);
              return false;
            }
          }
          
          return true;
        });
        
        console.log('Client-side filtering result:', filtered.length, 'members found');
        setFacultyData(filtered);
        
      } catch (fallbackError) {
        console.error('Failed to fetch data for filtering:', fallbackError);
        setError('Unable to search faculty data. Please try again later.');
      }
      
    } catch (error) {
      console.error('Error performing search:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpertiseOptions = async () => {
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken');
      
      const authHeaders: Record<string, string> = token ? {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      } : {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      console.log('Fetching expertise options...');
      
      // Fetch all faculty data to extract unique expertise areas
      const response = await fetch(`${apiUrl}/faculties?skip=0&limit=100`, {
        headers: authHeaders
      });
      
      if (response.ok) {
        const facultyData = await response.json();
        console.log('Faculty data loaded for expertise extraction:', facultyData.length, 'members');
        
        // Extract unique expertise areas from faculty data
        const expertiseSet = new Set<string>();
        
        facultyData.forEach((faculty: any) => {
          if (faculty.expertise && Array.isArray(faculty.expertise)) {
            faculty.expertise.forEach((exp: string) => {
              if (exp && exp.trim()) {
                expertiseSet.add(exp.trim());
              }
            });
          }
          // Also check if expertise is a string (in case API returns it differently)
          if (faculty.expertise && typeof faculty.expertise === 'string') {
            expertiseSet.add(faculty.expertise.trim());
          }
        });
        
        const uniqueExpertise = Array.from(expertiseSet).sort();
        console.log('Unique expertise areas found:', uniqueExpertise);
        setExpertiseOptions(uniqueExpertise);
      } else {
        console.log('Failed to fetch expertise options, using fallback');
        // Fallback to common expertise areas if API fails
        setExpertiseOptions([
          'Artificial Intelligence',
          'Machine Learning',
          'Data Science',
          'Software Engineering',
          'Computer Networks',
          'Database Systems',
          'Cybersecurity',
          'Web Development',
          'Mobile Development',
          'Cloud Computing'
        ]);
      }
    } catch (error) {
      console.error('Error fetching expertise options:', error);
      // Fallback to common expertise areas if fetch fails
      setExpertiseOptions([
        'Artificial Intelligence',
        'Machine Learning',
        'Data Science',
        'Software Engineering',
        'Computer Networks',
        'Database Systems',
        'Cybersecurity',
        'Web Development',
        'Mobile Development',
        'Cloud Computing'
      ]);
    }
  };

  const fetchFacultyData = async () => {
    try {
      setError(null);
      
      // Get authentication token from localStorage (check multiple possible keys)
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken');
      
      const authHeaders: Record<string, string> = token ? {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      } : {
        'accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      console.log('Fetching faculty data...');
      console.log('Auth token found:', token ? 'Yes' : 'No');

      // Try the regular faculties endpoint first as it's more reliable
      try {
        const fallbackResponse = await fetch(`${apiUrl}/faculties?skip=0&limit=100`, {
          headers: authHeaders
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Faculty data loaded from main endpoint:', fallbackData.length, 'members');
          setFacultyData(fallbackData);
          return;
        } else {
          console.log(`Main faculties endpoint failed with status: ${fallbackResponse.status}`);
        }
      } catch (fallbackError) {
        console.log('Main faculties endpoint error:', fallbackError);
      }

      // If main endpoint fails, try search endpoint with minimal parameters
      try {
        const searchParams = new URLSearchParams();
        searchParams.append('skip', '0');
        searchParams.append('limit', '100');
        
        const searchUrl = `${apiUrl}/faculties/search?${searchParams.toString()}`;
        console.log('Trying search endpoint as fallback:', searchUrl);

        const searchResponse = await fetch(searchUrl, {
          headers: authHeaders
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          console.log('Faculty data loaded from search endpoint:', searchData.length, 'members');
          setFacultyData(searchData);
          return;
        } else {
          console.log(`Search endpoint failed with status: ${searchResponse.status}`);
          throw new Error(`Both endpoints failed. Search status: ${searchResponse.status}`);
        }
      } catch (searchError) {
        console.log('Search endpoint also failed:', searchError);
        throw new Error('Unable to load faculty data from any endpoint');
      }
      
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setError('Failed to load faculty data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const designationOptions = useMemo(() => {
    const allDesignations = facultyData.map(member => member.designation).filter(Boolean);
    return [...new Set(allDesignations)].sort();
  }, [facultyData]);

  const filteredFaculty = useMemo(() => {
    // If we have search filters, the data should already be filtered (either server-side or client-side)
    // So we return the data as-is
    return facultyData;
  }, [facultyData]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDesignation('');
    setSelectedExpertise('');
  };

  const getImageUrl = (image: string | { id: number; url: string } | null) => {
    if (image && typeof image === 'object' && image.url) {
      const cleanPath = image.url.startsWith('media/') ? image.url.substring(6) : image.url;
      return `${apiUrl}/media/${cleanPath}`;
    }
    
    if (image && typeof image === 'string') {
      if (image.startsWith('http')) return image;
      const cleanPath = image.startsWith('media/') ? image.substring(6) : image;
      return `${apiUrl}/media/${cleanPath}`;
    }
    
    // Use a simple data URL for placeholder instead of external service
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDI4MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMzUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading faculty directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-600 font-medium">{error}</div>
          <Button 
            onClick={fetchFacultyData}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">

          <button
            onClick={() => navigate('/faculty')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Faculty Overview
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-gray-800" />
              <h1 className="text-3xl font-bold text-gray-900">
                Faculty Directory
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Explore our team of faculty members at the Department of Computer Science and Engineering.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Filter className="w-5 h-5" />
              <span>Use filters and search to find specific faculty members</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8">
          {/* Single Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, designation, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Expertise Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowExpertiseDropdown(!showExpertiseDropdown);
                  setShowDesignationDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors ${
                  selectedExpertise ? 'bg-blue-50 border-blue-200' : 'border-gray-300'
                }`}
              >
                {selectedExpertise || 'All Expertise'}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showExpertiseDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedExpertise('');
                        setShowExpertiseDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        !selectedExpertise ? 'bg-gray-100' : ''
                      }`}
                    >
                      All Expertise
                    </button>
                    {expertiseOptions.map((expertise) => (
                      <button
                        key={expertise}
                        onClick={() => {
                          setSelectedExpertise(expertise);
                          setShowExpertiseDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                          selectedExpertise === expertise ? 'bg-gray-100' : ''
                        }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Designation Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDesignationDropdown(!showDesignationDropdown);
                  setShowExpertiseDropdown(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors ${
                  selectedDesignation ? 'bg-blue-50 border-blue-200' : 'border-gray-300'
                }`}
              >
                {selectedDesignation || 'All Designations'}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showDesignationDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedDesignation('');
                        setShowDesignationDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                        !selectedDesignation ? 'bg-gray-100' : ''
                      }`}
                    >
                      All Designations
                    </button>
                    {designationOptions.map((designation) => (
                      <button
                        key={designation}
                        onClick={() => {
                          setSelectedDesignation(designation);
                          setShowDesignationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                          selectedDesignation === designation ? 'bg-gray-100' : ''
                        }`}
                      >
                        {designation}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedDesignation || selectedExpertise || searchTerm) && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="bg-white rounded-lg p-3 shadow-xs border border-gray-200 inline-block">
            <p className="text-sm font-medium text-gray-700">
              Showing {filteredFaculty.length} of {facultyData.length} faculty members
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="cursor-pointer transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={getImageUrl(member.user.image)}
                  alt={member.user.username}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDI4MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMzUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTg1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                  {member.user.username}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {member.designation}
                </p>
                
                {member.bio && (
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-2 mb-3">
                    <div className="line-clamp-2">
                      {member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {member.user.email}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(member.joining_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      onClick={() => navigate(`/faculty/profile/${member.id}`)}
                      size="sm"
                      className="h-8 px-3 bg-blue-300 hover:bg-blue-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => navigate(`/faculty/edit/${member.id}`)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                No faculty members found
              </p>
              <p className="text-sm text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
            <Button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDirectory;