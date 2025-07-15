import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft } from 'lucide-react';

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

const FacultyOnLeaveList: React.FC = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const apiUrl = import.meta.env.VITE_ENDPOINT;

  // Helper function to get image URL
  const getImageUrl = (image: { id: number; url: string } | null): string | null => {
    if (!image) return null;
    if (image.url.startsWith('http')) {
      return image.url;
    }
    return `${apiUrl}/${image.url}`;
  };

  // Fetch faculty on leave data
  useEffect(() => {
    const fetchFacultyOnLeave = async () => {
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
          throw new Error(`Failed to fetch faculty on leave: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Filter only faculty members on leave
        const facultyOnLeave = data.filter((faculty: Faculty) => faculty.on_leave === 1);
        setFaculties(facultyOnLeave);
      } catch (err) {
        console.error('Error fetching faculty on leave:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyOnLeave();
  }, [apiUrl]);

  // Handle faculty card click
  const handleFacultyClick = (facultyId: number) => {
    navigate(`/faculty/profile/${facultyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading faculty on leave...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Faculty on Leave</h1>
            <p className="text-xl text-gray-600">
              {faculties.length} faculty member{faculties.length !== 1 ? 's' : ''} currently on leave
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {faculties.map((faculty) => (
            <div
              key={faculty.id}
              onClick={() => handleFacultyClick(faculty.id)}
              className="cursor-pointer transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6 text-center">
                {/* Faculty Image */}
                <div className="flex justify-center mb-4 relative">
                  {getImageUrl(faculty.user.image) ? (
                    <img
                      src={getImageUrl(faculty.user.image)!}
                      alt={faculty.user.username}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg opacity-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg opacity-75">
                      <User className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  {/* On Leave Badge */}
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    On Leave
                  </div>
                </div>

                {/* Faculty Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-red-600 mb-1">
                    {faculty.user.username}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {faculty.designation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {faculties.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members on leave</h3>
            <p className="text-gray-600">All faculty members are currently active.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyOnLeaveList;
