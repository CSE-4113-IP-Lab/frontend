import React, { useState, useEffect } from 'react';
import { Calendar, Users, ChevronDown, TrendingUp, Eye, UserPlus } from 'lucide-react';
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

interface YearlyStats {
  year: number;
  totalNew: number;
  professors: number;
  associateProfessors: number;
  assistantProfessors: number;
  lecturers: number;
  faculty: FacultyMember[];
}

interface NewFacultyYearwiseProps {
  onViewFaculty?: (faculty: FacultyMember) => void;
}

const NewFacultyYearwise: React.FC<NewFacultyYearwiseProps> = ({ onViewFaculty }) => {
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  useEffect(() => {
    if (facultyData.length > 0) {
      calculateYearlyStats();
    }
  }, [facultyData]);

  const fetchFacultyData = async () => {
    try {
      const response = await fetch('/api/faculties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setFacultyData(data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateYearlyStats = () => {
    const years = [2025, 2024, 2023, 2022, 2021];
    const stats: YearlyStats[] = [];

    years.forEach(year => {
      const yearFaculty = facultyData.filter(faculty => 
        new Date(faculty.joining_date).getFullYear() === year
      );

      stats.push({
        year,
        totalNew: yearFaculty.length,
        professors: yearFaculty.filter(f => f.designation.toLowerCase().includes('professor') && !f.designation.toLowerCase().includes('associate') && !f.designation.toLowerCase().includes('assistant')).length,
        associateProfessors: yearFaculty.filter(f => f.designation.toLowerCase().includes('associate professor')).length,
        assistantProfessors: yearFaculty.filter(f => f.designation.toLowerCase().includes('assistant professor')).length,
        lecturers: yearFaculty.filter(f => f.designation.toLowerCase().includes('lecturer')).length,
        faculty: yearFaculty
      });
    });

    setYearlyStats(stats);
  };

  const getImageUrl = (imageId: number | null) => {
    return imageId ? `/api/files/${imageId}` : "/api/placeholder/280/320";
  };

  const currentYearStats = yearlyStats.find(stat => stat.year === selectedYear);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-xl" style={{ color: '#6B7280' }}>Loading faculty data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-8 h-8" style={{ color: '#4F46E5' }} />
            <h1 className="text-5xl font-bold" style={{ color: '#2C2C2C' }}>
              New Faculty by Year
            </h1>
          </div>
          <p className="text-xl" style={{ color: '#6B7280' }}>
            Track new faculty members joining each year
          </p>
        </div>

        {/* Year Selection */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {yearlyStats.map(stat => (
              <Button
                key={stat.year}
                onClick={() => setSelectedYear(stat.year)}
                variant={selectedYear === stat.year ? 'default' : 'outline'}
                className="px-6 py-3"
              >
                {stat.year} ({stat.totalNew})
              </Button>
            ))}
          </div>
        </div>

        {/* Yearly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {yearlyStats.slice(0, 4).map((stat, index) => (
            <div key={stat.year} className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: '#2C2C2C' }}>
                  {stat.year}
                </h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
                  <span className="text-sm font-medium" style={{ color: '#10B981' }}>
                    {index === 0 ? 'Latest' : 'Previous'}
                  </span>
                </div>
              </div>
              
              <div className="text-3xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                {stat.totalNew}
              </div>
              <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
                New faculty members
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Professors</span>
                  <span style={{ color: '#2C2C2C' }}>{stat.professors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Associate</span>
                  <span style={{ color: '#2C2C2C' }}>{stat.associateProfessors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Assistant</span>
                  <span style={{ color: '#2C2C2C' }}>{stat.assistantProfessors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Lecturers</span>
                  <span style={{ color: '#2C2C2C' }}>{stat.lecturers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Year Details */}
        {currentYearStats && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
                New Faculty in {selectedYear}
              </h2>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: '#6B7280' }} />
                <span className="text-lg font-medium" style={{ color: '#6B7280' }}>
                  {currentYearStats.totalNew} members
                </span>
              </div>
            </div>

            {/* Designation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {currentYearStats.professors}
                </div>
                <div className="text-sm text-blue-600">Professors</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {currentYearStats.associateProfessors}
                </div>
                <div className="text-sm text-green-600">Associate Professors</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {currentYearStats.assistantProfessors}
                </div>
                <div className="text-sm text-yellow-600">Assistant Professors</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {currentYearStats.lecturers}
                </div>
                <div className="text-sm text-purple-600">Lecturers</div>
              </div>
            </div>

            {/* Faculty Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentYearStats.faculty.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={getImageUrl(member.user.image_id)}
                      alt={member.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: '#2C2C2C' }}>
                        {member.user.username}
                      </h4>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        {member.designation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="text-xs" style={{ color: '#6B7280' }}>
                      <span className="font-medium">Joined:</span> {new Date(member.joining_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>
                      <span className="font-medium">Email:</span> {member.user.email}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onViewFaculty?.(member)}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              ))}
            </div>

            {/* No Faculty Message */}
            {currentYearStats.faculty.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
                <p className="text-xl mb-2" style={{ color: '#6B7280' }}>
                  No new faculty members in {selectedYear}
                </p>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  No faculty members joined the department in this year
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default NewFacultyYearwise;