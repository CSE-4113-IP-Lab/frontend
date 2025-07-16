import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Eye, Award ,ArrowLeft} from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface ExpertiseGroup {
  expertise: string;
  faculties: Faculty[];
}

const FacultyByResearch: React.FC = () => {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [expertiseGroups, setExpertiseGroups] = useState<ExpertiseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = import.meta.env.VITE_ENDPOINT;

  // Helper function to get image URL
  const getImageUrl = (image: { id: number; url: string } | null): string => {
    if (image && image.url) {
      // Handle both absolute and relative URLs
      if (image.url.startsWith('http')) {
        return image.url;
      }
      // Clean up the path and construct full URL
      const cleanPath = image.url.startsWith('media/') ? image.url.substring(6) : image.url;
      return `${apiUrl}/media/${cleanPath}`;
    }
    
    // Default placeholder image
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
  };

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

        console.log('Fetching faculty data with expertise...');
        
        // Try to get all faculty data first
        const response = await fetch(`${apiUrl}/faculties?skip=0&limit=100`, {
          headers: authHeaders
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch faculty data: ${response.status}`);
        }
        
        const data: Faculty[] = await response.json();
        console.log('Faculty data loaded:', data.length, 'members');
        
        // Filter faculty who have expertise
        const facultyWithExpertise = data.filter(faculty => 
          faculty.expertise && faculty.expertise.length > 0
        );
        
        console.log('Faculty with expertise:', facultyWithExpertise.length, 'members');
        setFacultyData(facultyWithExpertise);
        
        // Group faculty by expertise
        groupFacultyByExpertise(facultyWithExpertise);
        
      } catch (err) {
        console.error('Error fetching faculty data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load faculty data');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [apiUrl]);

  // Group faculty by their expertise areas
  const groupFacultyByExpertise = (faculties: Faculty[]) => {
    const expertiseMap = new Map<string, Faculty[]>();
    
    faculties.forEach(faculty => {
      if (faculty.expertise) {
        faculty.expertise.forEach(exp => {
          const expertise = exp.trim();
          if (!expertiseMap.has(expertise)) {
            expertiseMap.set(expertise, []);
          }
          expertiseMap.get(expertise)!.push(faculty);
        });
      }
    });

    // Convert map to array and sort by expertise name
    const groups: ExpertiseGroup[] = Array.from(expertiseMap.entries())
      .map(([expertise, faculties]) => ({ expertise, faculties }))
      .sort((a, b) => a.expertise.localeCompare(b.expertise));
    
    console.log('Expertise groups:', groups);
    setExpertiseGroups(groups);
  };

  // Filter groups based on search term
  const filteredGroups = expertiseGroups.filter(group => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      group.expertise.toLowerCase().includes(searchLower) ||
      group.faculties.some(faculty => 
        faculty.user.username.toLowerCase().includes(searchLower) ||
        faculty.designation.toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading faculty research areas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
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
              <BookOpen className="w-8 h-8 text-gray-800" />
              <h1 className="text-3xl font-bold text-gray-900">
                Faculty by Research Area
              </h1>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">
              Explore our faculty members organized by their research expertise and specializations.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Award className="w-5 h-5" />
              <span>{expertiseGroups.length} research areas • {facultyData.length} faculty members</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8 flex justify-center">
          <div className="relative max-w-2xl w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by research area or faculty name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
            />
          </div>
        </div>

        {/* Research Areas */}
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <div key={group.expertise} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Research Area Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {group.expertise}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {group.faculties.length} {group.faculties.length === 1 ? 'faculty member' : 'faculty members'}
                </p>
              </div>
              
              {/* Faculty List */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.faculties.map((faculty) => (
                    <div
                      key={`${group.expertise}-${faculty.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/faculty/profile/${faculty.id}`)}
                    >
                      {/* Faculty Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(faculty.user.image)}
                          alt={faculty.user.username}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=";
                          }}
                        />
                      </div>
                      
                      {/* Faculty Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1"
                        style={{ color: "rgb(20, 36, 76)" }}
                         >
                          {faculty.user.username}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {faculty.designation}
                        </p>
                      </div>
                      
                      {/* View Profile Icon */}
                      <div className="flex-shrink-0">
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                No research areas found
              </p>
              <p className="text-sm text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria' : 'No faculty members have specified research expertise'}
              </p>
            </div>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyByResearch;
