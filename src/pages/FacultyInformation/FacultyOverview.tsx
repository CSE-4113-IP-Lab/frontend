import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { User, Users, Calendar, UserCheck, UserX, Search, UserCircle } from 'lucide-react';

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

const FacultyOverview: React.FC = () => {

  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('all');
  
  const apiUrl = import.meta.env.VITE_ENDPOINT;
  const userRole = localStorage.getItem("role");

  // Helper function to get image URL
  const getImageUrl = (image: { id: number; url: string } | null): string | null => {
    if (!image) return null;
    if (image.url.startsWith('http')) {
      return image.url;
    }
    return `${apiUrl}/${image.url}`;
  };

  // Fetch faculties data
  useEffect(() => {
    const fetchFaculties = async () => {
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
          throw new Error('Failed to fetch faculties');
        }

        const data = await response.json();
        setFaculties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [apiUrl]);

  // Handle faculty card click
  const handleFacultyClick = (facultyId: number) => {
    navigate(`/faculty/profile/${facultyId}`);
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (section: string) => {
    setActiveSection(section);
    switch (section) {
      case 'profile':
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          // Find the faculty with matching email
          const currentFaculty = faculties.find(faculty => faculty.user.email === userEmail);
          if (currentFaculty) {
            navigate(`/faculty/profile/${currentFaculty.id}`);
          }
        }
        break;
      case 'research':
        navigate('/faculty/byresearch'); 
        break;
      case 'active':
        navigate('/faculty/active');
        break;
      case 'on-leave':
        navigate('/faculty/on-leave');
        break;
      case 'yearly':
        navigate('/faculty/yearly');
        break;
      case 'directory':
        navigate('/faculty/directory');
        break;
      default:
        setActiveSection('all');
        break;
    }
  };

  // Filter faculties based on active section
  const getFilteredFaculties = () => {
    switch (activeSection) {
      case 'active':
        return faculties.filter(faculty => faculty.on_leave === 0);
      case 'on-leave':
        return faculties.filter(faculty => faculty.on_leave === 1);
      default:
        return faculties;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading faculties...</p>
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

  const filteredFaculties = getFilteredFaculties();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Faculty Navigation</h2>
            <p className="text-sm text-gray-600">Browse faculty by category</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => handleSidebarNavigation('all')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'all' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">All Faculty</span>
              </button>
              
              {userRole === "faculty" && (
                <button
                  onClick={() => handleSidebarNavigation('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === 'profile' 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">My Profile</span>
                </button>
              )}
              
              <button
                onClick={() => handleSidebarNavigation('research')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'research' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Faculty by Research</span>
              </button>
              
              <button
                onClick={() => handleSidebarNavigation('active')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'active' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="font-medium">Active Faculty</span>
              </button>
              
              <button
                onClick={() => handleSidebarNavigation('on-leave')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'on-leave' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserX className="w-5 h-5" />
                <span className="font-medium">Faculty on Leave</span>
              </button>
              
              <button
                onClick={() => handleSidebarNavigation('yearly')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'yearly' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">New Faculty (Yearly)</span>
              </button>
              
              <button
                onClick={() => handleSidebarNavigation('directory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'directory' 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Faculty Directory</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'all' && 'All Faculty Members'}
              {activeSection === 'research' && 'Faculty by Research'}
              {activeSection === 'active' && 'Active Faculty Members'}
              {activeSection === 'on-leave' && 'Faculty Members on Leave'}
              {activeSection === 'yearly' && 'New Faculty Members (Yearly)'}
              {activeSection === 'directory' && 'Faculty Directory'}
            </h1>
            <p className="text-gray-600">
              {filteredFaculties.length} faculty member{filteredFaculties.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Faculty Grid */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
            {filteredFaculties.map((faculty) => (
              <div
                key={faculty.id}
                onClick={() => handleFacultyClick(faculty.id)}
                className="cursor-pointer transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="p-6 text-center">
                  {/* Faculty Image */}
                  <div className="flex justify-center mb-4">
                    {getImageUrl(faculty.user.image) ? (
                      <img
                        src={getImageUrl(faculty.user.image)!}
                        alt={faculty.user.username}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Faculty Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold mb-1"
                        style={{ color: "rgb(20, 36, 76)" }}
                      >
                         {faculty.user.username}
                   </h3>
                  
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {faculty.designation}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {faculty.user.email}
                    </p>
                    {faculty.on_leave === 1 && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          On Leave
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredFaculties.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members found</h3>
              <p className="text-gray-600">No faculty members match the current criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyOverview;
