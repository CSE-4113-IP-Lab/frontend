import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  UserCheck, 
  Edit,
  Loader2
} from 'lucide-react';

interface StudentData {
  year: number;
  semester: number;
  registration_number: string;
  session: string;
  id: number;
  user_id: number;
  user: {
    username: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    id: number;
    is_verified: number;
    image_id: number | null;
    image: string | { id: number; url: string } | null;
  };
}

export function StudentProfile() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_ENDPOINT;

  // Helper function to get image URL
  const getImageUrl = (image: string | { id: number; url: string } | null | undefined): string | null => {
    if (typeof image === 'string') {
      // If it's already a full URL, return as is
      if (image.startsWith('http')) {
        return image;
      }
      // If it's a relative path, construct full URL
      return `${apiUrl}/${image}`;
    }
    if (typeof image === 'object' && image?.url) {
      // If it's already a full URL, return as is
      if (image.url.startsWith('http')) {
        return image.url;
      }
      // If it's a relative path, construct full URL
      return `${apiUrl}/${image.url}`;
    }
    return null;
  };

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/students/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student profile');
      }

      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page
    navigate('/student/profile/edit');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderBadgeColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatus = (isVerified: number) => {
    return isVerified === 1 ? (
      <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1 shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Verified</span>
        </div>
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 font-medium px-3 py-1 shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Not Verified</span>
        </div>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <User className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchStudentProfile} className="bg-[#14244C] hover:bg-[#ECB31D] text-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
            <p className="text-gray-600">Unable to load student profile data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="mt-2 text-gray-600">View and manage your student information</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 overflow-hidden shadow-xl">
          <CardHeader 
            style={{ 
              background: 'linear-gradient(135deg, #14244C 0%, #1a2f5a 100%)',
              backgroundSize: '100% 100%'
            }} 
            className="text-white py-8 px-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-4 ring-white/20">
                      {getImageUrl(studentData.user.image) ? (
                        <AvatarImage 
                          src={getImageUrl(studentData.user.image)!} 
                          alt={studentData.user.username}
                          className="object-cover transition-all duration-300 hover:scale-105"
                        />
                      ) : (
                        <AvatarFallback 
                          style={{ backgroundColor: '#ECB31D', color: '#14244C' }} 
                          className="text-4xl font-bold shadow-inner"
                        >
                          {getInitials(studentData.user.username)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl text-white font-bold mb-2 tracking-wide">{studentData.user.username}</CardTitle>
                    <p className="text-blue-200 text-lg mb-3 font-medium">Student ID: {studentData.registration_number}</p>
                    <div className="flex items-center space-x-3 flex-wrap">
                      {getVerificationStatus(studentData.user.is_verified)}
                      <Badge className={`${getGenderBadgeColor(studentData.user.gender)} font-medium px-3 py-1`}>
                        {studentData.user.gender}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 font-medium px-3 py-1">
                        Year {studentData.year} • Semester {studentData.semester}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-[#ECB31D] to-[#f0c654] hover:from-[#d9a218] hover:to-[#ECB31D] text-[#14244C] font-bold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center text-[#14244C]">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{studentData.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{studentData.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900 capitalize">{studentData.user.gender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center text-[#14244C]">
                <BookOpen className="h-5 w-5 mr-2" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="font-medium text-gray-900">{studentData.registration_number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Session</p>
                    <p className="font-medium text-gray-900">{studentData.session}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-[#14244C] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{studentData.year}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Year</p>
                    <p className="font-medium text-gray-900">Year {studentData.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-[#ECB31D] rounded-full flex items-center justify-center">
                    <span className="text-[#14244C] text-xs font-bold">{studentData.semester}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Semester</p>
                    <p className="font-medium text-gray-900">Semester {studentData.semester}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleEditProfile}
            className="bg-[#14244C] hover:bg-[#ECB31D] text-white px-8 py-3 text-lg font-semibold"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

