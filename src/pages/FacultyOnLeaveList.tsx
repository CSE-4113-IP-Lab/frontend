import React, { useState, useEffect } from 'react';
import { Search, UserX, Calendar, Clock, Eye, Edit, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LeaveRecord {
  id: number;
  faculty_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface FacultyOnLeave {
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
  leave_records: LeaveRecord[];
}

interface FacultyOnLeaveListProps {
  onViewFaculty?: (faculty: FacultyOnLeave) => void;
  onEditFaculty?: (faculty: FacultyOnLeave) => void;
}

const FacultyOnLeaveList: React.FC<FacultyOnLeaveListProps> = ({
  onViewFaculty,
  onEditFaculty
}) => {
  const [facultyData, setFacultyData] = useState<FacultyOnLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('');

  useEffect(() => {
    fetchFacultyOnLeave();
  }, []);

  const fetchFacultyOnLeave = async () => {
    try {
      const response = await fetch('/api/faculties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Mock leave data - in real app, this would come from backend
      const facultyWithLeave = data.map((faculty: any) => ({
        ...faculty,
        leave_records: Math.random() > 0.7 ? [{
          id: 1,
          faculty_id: faculty.id,
          leave_type: ['Medical', 'Personal', 'Academic', 'Maternity'][Math.floor(Math.random() * 4)],
          start_date: '2025-01-01',
          end_date: '2025-02-01',
          reason: 'Sample leave reason',
          status: 'approved' as const
        }] : []
      })).filter((faculty: any) => faculty.leave_records.length > 0);
      
      setFacultyData(facultyWithLeave);
    } catch (error) {
      console.error('Error fetching faculty on leave:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = facultyData.filter(member => {
    const matchesSearch = member.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLeaveType = !selectedLeaveType || 
                           member.leave_records.some(record => record.leave_type === selectedLeaveType);
    return matchesSearch && matchesLeaveType;
  });

  const leaveTypeOptions = [...new Set(facultyData.flatMap(f => f.leave_records.map(r => r.leave_type)))].sort();

  const getImageUrl = (imageId: number | null) => {
    return imageId ? `/api/files/${imageId}` : "/api/placeholder/280/320";
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentLeave = (leaveRecords: LeaveRecord[]) => {
    const now = new Date();
    return leaveRecords.find(record => {
      const startDate = new Date(record.start_date);
      const endDate = new Date(record.end_date);
      return now >= startDate && now <= endDate && record.status === 'approved';
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-xl" style={{ color: '#6B7280' }}>Loading faculty on leave...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UserX className="w-8 h-8" style={{ color: '#F59E0B' }} />
            <h1 className="text-5xl font-bold" style={{ color: '#2C2C2C' }}>
              Faculty on Leave
            </h1>
          </div>
          <p className="text-xl" style={{ color: '#6B7280' }}>
            Faculty members currently on leave ({filteredFaculty.length} members)
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
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

            {/* Leave Type Filter */}
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Leave Types</option>
              {leaveTypeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {(searchTerm || selectedLeaveType) && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLeaveType('');
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Faculty Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFaculty.map((member) => {
            const currentLeave = getCurrentLeave(member.leave_records);
            const latestLeave = member.leave_records[member.leave_records.length - 1];
            
            return (
              <div
                key={member.id}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getImageUrl(member.user.image_id)}
                    alt={member.user.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl" style={{ color: '#2C2C2C' }}>
                        {member.user.username}
                      </h3>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-600">On Leave</span>
                      </div>
                    </div>
                    
                    <p className="text-base mb-3" style={{ color: '#6B7280' }}>
                      {member.designation}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#6B7280' }} />
                        <span className="text-sm" style={{ color: '#6B7280' }}>
                          {member.user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#6B7280' }} />
                        <span className="text-sm" style={{ color: '#6B7280' }}>
                          {member.user.phone}
                        </span>
                      </div>
                    </div>
                    
                    {/* Leave Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#2C2C2C' }}>
                          Current Leave Details
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveStatusColor(latestLeave.status)}`}>
                          {latestLeave.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: '#6B7280' }}>Type:</span>
                          <div style={{ color: '#2C2C2C' }}>{latestLeave.leave_type}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#6B7280' }}>Duration:</span>
                          <div style={{ color: '#2C2C2C' }}>
                            {new Date(latestLeave.start_date).toLocaleDateString()} - {new Date(latestLeave.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {latestLeave.reason && (
                        <div className="mt-2">
                          <span className="font-medium text-sm" style={{ color: '#6B7280' }}>Reason:</span>
                          <div className="text-sm" style={{ color: '#2C2C2C' }}>{latestLeave.reason}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onViewFaculty?.(member)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
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
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <UserX className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-xl mb-2" style={{ color: '#6B7280' }}>
              No faculty members on leave found
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

export default FacultyOnLeaveList;