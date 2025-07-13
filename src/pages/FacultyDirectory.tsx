import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Eye, Edit, Trash2, Users, Filter } from 'lucide-react';
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

interface FacultyDirectoryProps {
  onViewFaculty?: (faculty: FacultyMember) => void;
  onEditFaculty?: (faculty: FacultyMember) => void;
  onDeleteFaculty?: (faculty: FacultyMember) => void;
}

const FacultyDirectory: React.FC<FacultyDirectoryProps> = ({
  onViewFaculty,
  onEditFaculty,
  onDeleteFaculty
}) => {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // API base URL
  const apiUrl = import.meta.env.VITE_ENDPOINT;

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      setError(null);
      console.log('Fetching faculty data...');
      
      const response = await fetch(`${apiUrl}/faculties`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Faculty data received:', data);
      
      // Debug the image data for each faculty member
      data.forEach((member: FacultyMember, index: number) => {
        console.log(`Faculty ${index + 1}:`, {
          name: member.user.username,
          image: member.user.image,
          image_id: member.user.image_id
        });
      });
      
      setFacultyData(data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setError('Failed to load faculty data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const designationOptions = useMemo(() => {
    const allDesignations = facultyData.map(member => member.designation).filter(Boolean);
    return [...new Set(allDesignations)].sort();
  }, [facultyData]);

  const roleOptions = useMemo(() => {
    const allRoles = facultyData.map(member => member.user.role).filter(Boolean);
    return [...new Set(allRoles)].sort();
  }, [facultyData]);

  // Filter faculty based on search and filters
  const filteredFaculty = useMemo(() => {
    return facultyData.filter(member => {
      // Enhanced search - includes name, email, and designation
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (member.user.username && member.user.username.toLowerCase().includes(searchLower)) ||
        (member.user.email && member.user.email.toLowerCase().includes(searchLower)) ||
        (member.designation && member.designation.toLowerCase().includes(searchLower));
      
      const matchesDesignation = !selectedDesignation || member.designation === selectedDesignation;
      const matchesRole = !selectedRole || member.user.role === selectedRole;
      
      return matchesSearch && matchesDesignation && matchesRole;
    });
  }, [facultyData, searchTerm, selectedDesignation, selectedRole]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDesignation('');
    setSelectedRole('');
  };

  // Updated image URL construction based on backend structure
  const getImageUrl = (image: string | { id: number; url: string } | null, imageId: number | null) => {
    console.log('Image debug:', { image, imageId });
    
    // Priority 1: If there's an image object with URL (from File relationship)
    if (image && typeof image === 'object' && image.url) {
      // The URL from the File model is the full path like "media/users/uuid_filename.jpg"
      // Backend serves static files at /api/v1/media, so we need to remove the 'media/' prefix
      const cleanPath = image.url.startsWith('media/') ? image.url.substring(6) : image.url;
      const fullUrl = `${apiUrl}/media/${cleanPath}`;
      console.log('Using image object URL:', fullUrl);
      return fullUrl;
    }
    
    // Priority 2: If there's an image string path
    if (image && typeof image === 'string') {
      if (image.startsWith('http')) {
        return image; // Already a full URL
      }
      // Handle relative paths
      const cleanPath = image.startsWith('media/') ? image.substring(6) : image;
      const fullUrl = `${apiUrl}/media/${cleanPath}`;
      console.log('Using image string path:', fullUrl);
      return fullUrl;
    }
    
    // Priority 3: If there's only an image ID (less likely to work without file path)
    if (imageId) {
      console.log('Only image ID available, using placeholder. ID:', imageId);
      // In a real scenario, you might want to make an API call to get file info
      // For now, we'll use the placeholder
    }
    
    // Default placeholder
    console.log('Using placeholder image');
    return "https://via.placeholder.com/280x350/E8E9EA/6B7280?text=No+Image";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-xl" style={{ color: '#6B7280' }}>Loading faculty directory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <Button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchFacultyData();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-10 h-10" style={{ color: '#2C2C2C' }} />
            <h1 className="text-5xl font-bold" style={{ color: '#2C2C2C' }}>
              FACULTY
            </h1>
            <ChevronDown className="w-8 h-8" style={{ color: '#2C2C2C' }} />
          </div>
          <p className="text-1.99xl mb-4" style={{ color: '#6B7280' }}>
            Explore the diverse team of faculty and staff at the Department of Computer Science and Engineering, University of Dhaka.
          </p>
          <div className="flex items-center gap-2 text-lg" style={{ color: '#9CA3AF' }}>
            <Filter className="w-5 h-5" />
            <span>Use filters and search to find specific faculty members</span>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6" style={{ color: '#9CA3AF' }} />
            </div>
            <input
              type="text"
              placeholder="Search by name, designation, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 text-xl rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              style={{ backgroundColor: '#FFFFFF' }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            
            {/* Role Filter - Using user role */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowDesignationDropdown(false);
                }}
                className="flex items-center gap-3 px-8 py-4 text-lg rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                style={{ backgroundColor: selectedRole ? '#E3F2FD' : '#FFFFFF', color: '#2C2C2C' }}
              >
                {selectedRole || 'Role'}
                <ChevronDown className="w-5 h-5" />
              </button>
              
              {showRoleDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedRole('');
                        setShowRoleDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-lg"
                    >
                      All Roles
                    </button>
                    {roleOptions.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-lg"
                      >
                        {role}
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
                  setShowRoleDropdown(false);
                }}
                className="flex items-center gap-3 px-8 py-4 text-lg rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                style={{ backgroundColor: selectedDesignation ? '#E3F2FD' : '#FFFFFF', color: '#2C2C2C' }}
              >
                {selectedDesignation || 'Designation'}
                <ChevronDown className="w-5 h-5" />
              </button>
              
              {showDesignationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-20">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setSelectedDesignation('');
                        setShowDesignationDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-lg"
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
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-lg"
                      >
                        {designation}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            {(selectedDesignation || selectedRole || searchTerm) && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-xl font-semibold" style={{ color: '#2C2C2C' }}>
              Showing {filteredFaculty.length} of {facultyData.length} faculty members
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200 hover:border-blue-300"
            >
              <div className="aspect-[3/3] overflow-hidden relative">
                <img
                  src={getImageUrl(member.user.image, member.user.image_id)}
                  alt={member.user.username}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/280x350/E8E9EA/6B7280?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 line-clamp-1" style={{ color: '#2C2C2C' }}>
                  {member.user.username}
                </h3>
                <p className="text-lg mb-3 font-medium" style={{ color: '#6B7280' }}>
                  {member.designation}
                </p>
                
                {/* Show expertise from bio */}
                {member.bio && (
                  <div className="text-sm mb-3 text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div className="line-clamp-2">
                      {member.bio.length > 80 ? `${member.bio.substring(0, 80)}...` : member.bio}
                    </div>
                  </div>
                )}
                
                <div className="text-sm mb-2 text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {member.user.email}
                </div>
                <div className="text-sm mb-4 text-gray-500">
                  Joined: {new Date(member.joining_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      navigate(`/faculty/profile/${member.id}`);
                      onViewFaculty?.(member);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-base font-medium transition-all duration-200"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    onClick={() => {
                      navigate(`/faculty/edit/${member.id}`);
                      onEditFaculty?.(member);
                    }}
                    variant="outline"
                    className="p-3 rounded-lg border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="mb-6">
              <Users className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p className="text-2xl font-semibold mb-2" style={{ color: '#2C2C2C' }}>
                No faculty members found
              </p>
              <p className="text-lg text-gray-600">
                Try adjusting your search criteria or clearing the filters
              </p>
            </div>
            <Button
              onClick={clearFilters}
              className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
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