import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, UserCheck, UserX, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FacultyStats {
  totalFaculty: number;
  activeFaculty: number;
  facultyOnLeave: number;
  newFaculty2024: number;
  newFaculty2025: number;
  professors: number;
  associateProfessors: number;
  assistantProfessors: number;
  lecturers: number;
}

interface FacultyOverviewProps {
  onNavigate?: (page: string) => void;
}

const FacultyOverview: React.FC<FacultyOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<FacultyStats>({
    totalFaculty: 0,
    activeFaculty: 0,
    facultyOnLeave: 0,
    newFaculty2024: 0,
    newFaculty2025: 0,
    professors: 0,
    associateProfessors: 0,
    assistantProfessors: 0,
    lecturers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyStats();
  }, []);

  const fetchFacultyStats = async () => {
    try {
      const response = await fetch('/api/faculties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const faculties = await response.json();
      
      // Calculate stats from faculty data
      const calculatedStats: FacultyStats = {
        totalFaculty: faculties.length,
        activeFaculty: faculties.filter((f: any) => f.status === 'active').length,
        facultyOnLeave: faculties.filter((f: any) => f.status === 'on_leave').length,
        newFaculty2024: faculties.filter((f: any) => f.joining_date?.includes('2024')).length,
        newFaculty2025: faculties.filter((f: any) => f.joining_date?.includes('2025')).length,
        professors: faculties.filter((f: any) => f.designation?.toLowerCase().includes('professor')).length,
        associateProfessors: faculties.filter((f: any) => f.designation?.toLowerCase().includes('associate professor')).length,
        assistantProfessors: faculties.filter((f: any) => f.designation?.toLowerCase().includes('assistant professor')).length,
        lecturers: faculties.filter((f: any) => f.designation?.toLowerCase().includes('lecturer')).length,
      };
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching faculty stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
    <div 
      className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#2C2C2C' }}>{value}</p>
        </div>
        <div className={`p-3 rounded-full`} style={{ backgroundColor: color }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick }: any) => (
    <div 
      className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}>
          <Icon className="w-6 h-6" style={{ color: '#1976D2' }} />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#2C2C2C' }}>{title}</h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-xl" style={{ color: '#6B7280' }}>Loading faculty information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#2C2C2C' }}>
            Faculty Overview
          </h1>
          <p className="text-xl" style={{ color: '#6B7280' }}>
            Comprehensive overview of faculty members and statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Faculty"
            value={stats.totalFaculty}
            icon={Users}
            color="#4F46E5"
            onClick={() => onNavigate?.('faculty-list')}
          />
          <StatCard
            title="Active Faculty"
            value={stats.activeFaculty}
            icon={UserCheck}
            color="#10B981"
            onClick={() => onNavigate?.('active-faculty')}
          />
          <StatCard
            title="Faculty on Leave"
            value={stats.facultyOnLeave}
            icon={UserX}
            color="#F59E0B"
            onClick={() => onNavigate?.('faculty-on-leave')}
          />
          <StatCard
            title="New Faculty (2025)"
            value={stats.newFaculty2025}
            icon={UserPlus}
            color="#EF4444"
            onClick={() => onNavigate?.('new-faculty-2025')}
          />
        </div>

        {/* Designation Breakdown */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
            Faculty by Designation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="text-2xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                {stats.professors}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Professors</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="text-2xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                {stats.associateProfessors}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Associate Professors</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="text-2xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                {stats.assistantProfessors}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Assistant Professors</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="text-2xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
                {stats.lecturers}
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>Lecturers</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Faculty Directory"
              description="Search and browse all faculty members"
              icon={Users}
              onClick={() => onNavigate?.('faculty-directory')}
            />
            <QuickActionCard
              title="Add New Faculty"
              description="Register a new faculty member"
              icon={UserPlus}
              onClick={() => onNavigate?.('add-faculty')}
            />
            <QuickActionCard
              title="Yearly Reports"
              description="View faculty information by year"
              icon={Calendar}
              onClick={() => onNavigate?.('yearly-reports')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium" style={{ color: '#2C2C2C' }}>
                  New faculty member added
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium" style={{ color: '#2C2C2C' }}>
                  Faculty profile updated
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium" style={{ color: '#2C2C2C' }}>
                  Faculty marked as on leave
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyOverview;