import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, UserCheck, Phone, Mail, Calendar, Grid, List } from 'lucide-react';
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
    image_id: number;
  };
}

interface ActiveFacultyListProps {
  onViewFaculty?: (faculty: FacultyMember) => void;
  onEditFaculty?: (faculty: FacultyMember) => void;
}

const ActiveFacultyList: React.FC<ActiveFacultyListProps> = ({
  onViewFaculty,
  onEditFaculty
}) => {
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchActiveFaculty();
  }, []);

  const fetchActiveFaculty = async () => {
    try {
      const response = await fetch('/api/faculties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      // Filter only active faculty (assuming all are active for now)
      setFacultyData(data);
    } catch (error) {
      console.error('Error fetching active faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = facultyData.filter(member => {
    const matchesSearch = member.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDesignation = !selectedDesignation || member.designation === selectedDesignation;
    return matchesSearch && matchesDesignation;
  });

  const designationOptions = [...new Set(facultyData.map(f => f.designation))].sort();

  const getImageUrl = (imageId: number | null) => {
    return imageId ? `/api/files/${imageId}` : "/api/placeholder/280/320";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-xl" style={{ color: '#6B7280' }}>Loading active faculty...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-8 h-8" style={{ color: '#10B981' }} />
            <h1 className="text-5xl font-bold" style={{ color: '#2C2C2C' }}>
              Active Faculty
            </h1>
          </div>
          <p className="text-xl" style={{ color: '#6B7280' }}>
            Currently active faculty members ({filteredFaculty.length} members)
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Designations</option>
              {designationOptions.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>

            {(searchTerm || selectedDesignation) && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDesignation('');
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Faculty Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getImageUrl(member.user.image_id)}
                    alt={member.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#2C2C2C' }}>
                    {member.user.username}
                  </h3>
                  <p className="text-base mb-2" style={{ color: '#6B7280' }}>
                    {member.designation}
                  </p>
                  <div className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
                    {member.user.email}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewFaculty?.(member)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => onEditFaculty?.(member)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F8F9FA' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Faculty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Designation
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Joining Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: '#6B7280' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((member) => (
                    <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(member.user.image_id)}
                            alt={member.user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium" style={{ color: '#2C2C2C' }}>
                              {member.user.username}
                            </div>
                            <div className="text-sm" style={{ color: '#6B7280' }}>
                              {member.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: '#2C2C2C' }}>
                          {member.designation}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: '#2C2C2C' }}>
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" />
                            {member.user.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: '#2C2C2C' }}>
                          {new Date(member.joining_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onViewFaculty?.(member)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => onEditFaculty?.(member)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-xl mb-2" style={{ color: '#6B7280' }}>
              No active faculty members found
            </p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Try adjusting your search criteria
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActiveFacultyList;