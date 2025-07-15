import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  BookOpen, 
  Calendar, 
  User, 
  Edit,
  ArrowLeft,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  Award,
  Building
} from "lucide-react";

// Type definitions based on backend models
interface FileBase {
  id: number;
  url: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  gender: string | null;
  image_id: number | null;
  is_verified: number;
  role: string;
  image?: FileBase;
}

interface Course {
  id: number;
  name: string;
  credits: number;
  description: string | null;
  program_id: number;
  teacher_id: number | null;
}

interface Program {
  id: number;
  name: string;
  type: string;
  duration: number;
  description: string | null;
}

interface Research {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
  institution: string;
  journal: string;
  link: string;
  supervisor_id: number | null;
  user_id: number;
  supervisor: any;
  user: UserResponse;
}

interface FacultyResponse {
  id: number;
  user_id: number;
  user: UserResponse;
  bio: string | null;
  designation: string;
  joining_date: string;
  courses?: Course[];
  programs?: Program[];
  publications?: Research[];
}

interface FacultyProfileProps {
  facultyId?: number;
  facultyData?: FacultyResponse;
  onEdit?: (faculty: FacultyResponse) => void;
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ 
  facultyId, 
  facultyData
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<FacultyResponse | null>(facultyData || null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [publications, setPublications] = useState<Research[]>([]);
  const [loading, setLoading] = useState(!facultyData);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  

  const apiUrl = import.meta.env.VITE_ENDPOINT;
  const targetFacultyId = facultyId || id;
  const userRole = localStorage.getItem("role");
  console.log('User role:', userRole);

  

  useEffect(() => {
    if (targetFacultyId && !facultyData) {
      fetchFacultyData();
    }
  }, [targetFacultyId, facultyData]);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching faculty data for ID:', targetFacultyId);
      console.log('API URL:', apiUrl);
      console.log('Full request URL:', `${apiUrl}/faculties/${targetFacultyId}`);

      // Fetch faculty data
      const facultyResponse = await fetch(`${apiUrl}/faculties/${targetFacultyId}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJmQGdtYWlsLmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDUzNzY1fQ.q_FzXT5PBLXHxGVgf4K1qwaeXelreawFpGtgOy41bVM`,
          'Accept': 'application/json'
        }
      });
      
      if (!facultyResponse.ok) {
        if (facultyResponse.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        } else if (facultyResponse.status === 404) {
          throw new Error('Faculty not found');
        } else {
          throw new Error(`Failed to fetch faculty data: ${facultyResponse.status}`);
        }
      }
      
      const facultyData = await facultyResponse.json();
      console.log('Faculty data:', facultyData);
      
      setFaculty(facultyData);

      // Fetch courses taught by this faculty
      if (facultyData.id) {
        try {
          console.log('Fetching courses for faculty ID:', facultyData.id);


        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

          const coursesResponse = await fetch(`${apiUrl}/faculties/${facultyData.id}/courses`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            console.log('Courses data:', coursesData);
            setCourses(coursesData.courses || []);
          } else {
            console.warn('Courses response not OK:', coursesResponse.status);
          }
        } catch (courseError) {
          console.warn('Failed to fetch courses:', courseError);
        }
      }

      // Fetch programs associated with this faculty
      if (facultyData.id) {
        try {
          console.log('Fetching programs for faculty ID:', facultyData.id);
          const programsResponse = await fetch(`${apiUrl}/faculties/${facultyData.id}/programs`, {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJmQGdtYWlsLmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDUzNzY1fQ.q_FzXT5PBLXHxGVgf4K1qwaeXelreawFpGtgOy41bVM`,
              'Accept': 'application/json'
            }
          });
          
          if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log('Programs data:', programsData);
          } else {
            console.warn('Programs response not OK:', programsResponse.status);
          }
        } catch (programError) {
          console.warn('Failed to fetch programs:', programError);
        }
      }

      // Fetch research/publications for this faculty
      if (facultyData.user_id) {
        try {
          console.log('Fetching research for user ID:', facultyData.user_id);
          
          // Get token from localStorage
          const token = localStorage.getItem('token');
          
          if (!token) {
            console.warn('No authentication token found for research fetch');
          }

          const researchResponse = await fetch(`${apiUrl}/researchs/user/${facultyData.user_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (researchResponse.ok) {
            const researchData = await researchResponse.json();
            console.log('Research data:', researchData);
            setPublications(researchData || []);
          } else {
            console.warn('Research response not OK:', researchResponse.status);
            // Keep empty array if research fetch fails
            setPublications([]);
          }
        } catch (researchError) {
          console.warn('Failed to fetch research:', researchError);
          // Keep empty array if research fetch fails
          setPublications([]);
        }
      }

    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load faculty data');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: any) => {
    if (!image) {
      return "/api/placeholder/250/250";
    }
    
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        return image;
      }
      return `${apiUrl}/${image}`;
    }
    
    if (typeof image === 'object' && image?.url) {
      if (image.url.startsWith('http')) {
        return image.url;
      }
      return `${apiUrl}/${image.url}`;
    }
    
    return "/api/placeholder/250/250";
  };

   const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleBackClick = () => {
    navigate('/faculties');
  };

  const handleEditClick = () => {
    if (faculty) {
      navigate(`/faculty/edit/${faculty.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading faculty profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleBackClick}
              variant="outline"
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={fetchFacultyData}
              className="gap-1"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Faculty Not Found</h2>
          <p className="text-gray-600 mb-6">The requested faculty profile could not be found.</p>
          <Button 
            onClick={handleBackClick}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header Section */}
        <Card className="relative overflow-hidden mb-8 shadow-2xl border-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <CardContent className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Profile Avatar */}
              <div className="relative group">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 ring-4 ring-white/20 shadow-2xl">
                  <AvatarImage 
                    src={getImageUrl(faculty.user.image)} 
                    alt={faculty.user.username}
                    className="object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {faculty.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="backdrop-blur-sm bg-white/90 hover:bg-white shadow-lg"
                    onClick={handleEditClick}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {faculty.user.username}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border-0">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {faculty.designation}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100 text-lg">
                    <Building className="w-5 h-5" />
                    <span>Department of Computer Science</span>
                  </div>
                </div>
                
                {/* Quick Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <a 
                      href={`mailto:${faculty.user.email}`} 
                      className="text-white hover:text-blue-200 transition-colors truncate"
                    >
                      {faculty.user.email}
                    </a>
                  </div>
                  
                  {faculty.user.phone && (
                    <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <a 
                        href={`tel:${faculty.user.phone}`} 
                        className="text-white hover:text-green-200 transition-colors"
                      >
                        {faculty.user.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white">
                      Joined {new Date(faculty.joining_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}

             

              {(userRole ==="faculty" || userRole ==="admin") &&(
              <div className="lg:self-start">
                <Button
                  onClick={handleEditClick}
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg border-0"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>)
            }

            </div>
                
          </CardContent>
        </Card>
            

        {/* Biography Section */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Biography</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {faculty.bio || `${faculty.user.username} is a ${faculty.designation.toLowerCase()} in the Department of Computer Science and Engineering at the University of Dhaka, Bangladesh. His research interests encompass knowledge discovery, machine learning, and databases, with a particular emphasis on graph-structured data.`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Courses Section */}
            <Card className="shadow-lg border-0">
              <Collapsible open={expandedSection === 'courses'} onOpenChange={() => toggleSection('courses')}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Courses Taught</h3>
                      </div>
                      {expandedSection === 'courses' ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {courses.length === 0 ? (
                        <>
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">CSE 4102</h4>
                                <p className="text-gray-600 mt-1">Mathematical and Statistical Analysis for Engineers</p>
                              </div>
                              <Badge variant="secondary" className="bg-green-600 text-white text-lg px-3 py-1">
                                3
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">CSE-4113</h4>
                                <p className="text-gray-600 mt-1">Internet Programming Lab</p>
                              </div>
                              <Badge variant="secondary" className="bg-green-600 text-white text-lg px-3 py-1">
                                1
                              </Badge>
                            </div>
                          </div>
                        </>
                      ) : (
                        courses.map((course) => (
                          <div key={course.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{course.name}</h4>
                                {course.description && (
                                  <p className="text-gray-600 mt-1">{course.description}</p>
                                )}
                              </div>
                              <Badge variant="secondary" className="bg-green-600 text-white text-lg px-3 py-1">
                                {course.credits}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Publications Section */}
            <Card className="shadow-lg border-0">
              <Collapsible open={expandedSection === 'publications'} onOpenChange={() => toggleSection('publications')}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Research & Publications</h3>
                      </div>
                      {expandedSection === 'publications' ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {publications.length === 0 ? (
                        <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <FileText className="w-10 h-10 text-purple-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Publications Found</h4>
                          <p className="text-gray-600">Research publications will appear here once available.</p>
                        </div>
                      ) : (
                        publications.map((pub, index) => (
                          <div key={pub.id} className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{pub.title}</h4>
                                    <Badge variant="outline" className="text-purple-700 border-purple-200 mb-2">
                                      {pub.type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {pub.description && (
                                  <p className="text-gray-700 mb-3 leading-relaxed">
                                    {pub.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                  {pub.institution && (
                                    <div className="flex items-center gap-1">
                                      <Building className="w-4 h-4" />
                                      <span>{pub.institution}</span>
                                    </div>
                                  )}
                                  {pub.journal && (
                                    <div className="flex items-center gap-1">
                                      <Award className="w-4 h-4" />
                                      <span>{pub.journal}</span>
                                    </div>
                                  )}
                                  {pub.date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{pub.date}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {pub.link && (
                                  <a 
                                    href={pub.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View Publication
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
          {/* Right Sidebar - Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                        <a 
                          href={`mailto:${faculty.user.email}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                          {faculty.user.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {faculty.user.phone && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                          <a 
                            href={`tel:${faculty.user.phone}`} 
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            {faculty.user.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-600 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Office Location</h4>
                        <p className="text-gray-700">Room 302, Science Building</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-600 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Office Hours</h4>
                        <p className="text-gray-700">Monday & Wednesday</p>
                        <p className="text-gray-700">2:00 PM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Quick Links</h4>
                  </div>
                  <div className="space-y-2">
                    <a 
                      href="https://scholar.google.com/citations?user=QYdCC6cAAAAJ" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-start gap-2 h-8 px-3 text-sm font-medium text-purple-600 border border-purple-200 rounded-md hover:bg-purple-50 transition-colors w-full"
                    >
                      <Award className="w-4 h-4" />
                      Research Profile
                    </a>
                    <a 
                      href="https://tanvirfahim15.github.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-start gap-2 h-8 px-3 text-sm font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors w-full"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Academic Portal
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;