import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
  FileText
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

interface Publication {
  id: number;
  title: string;
  doi: string;
  venue: string;
  year: number;
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
  publications?: Publication[];
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
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(!facultyData);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_ENDPOINT;
  const targetFacultyId = facultyId || id;

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

      // Fetch faculty data
      const facultyResponse = await fetch(`${apiUrl}/faculties/${targetFacultyId}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
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
          const coursesResponse = await fetch(`${apiUrl}/faculties/${facultyData.id}/courses`, {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
            }
          });
          
          if (coursesResponse.ok) {
            const coursesData = await coursesResponse.json();
            setCourses(coursesData.courses || []);
          }
        } catch (courseError) {
          console.warn('Failed to fetch courses:', courseError);
        }
      }

      // Fetch programs associated with this faculty
      if (facultyData.id) {
        try {
          const programsResponse = await fetch(`${apiUrl}/faculties/${facultyData.id}/programs`, {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
            }
          });
          
          if (programsResponse.ok) {
            const programsData = await programsResponse.json();
            console.log('Programs data:', programsData);
          }
        } catch (programError) {
          console.warn('Failed to fetch programs:', programError);
        }
      }

      // Mock publications data since it's not in the backend yet
      setPublications([
        {
          id: 1,
          title: "Advancements in Neural Networks",
          doi: "10.1234/567890",
          venue: "Journal of Artificial Intelligence",
          year: 2022
        },
        {
          id: 2,
          title: "Deep Learning for Image Recognition",
          doi: "10.9876/543210",
          venue: "International Conference on Machine Learning",
          year: 2021
        },
        {
          id: 3,
          title: "Big Data Analytics",
          doi: "10.1122/334455",
          venue: "Data Science Journal",
          year: 2020
        }
      ]);

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

  const handleBackClick = () => {
    navigate('/faculties');
  };

  const handleEditClick = () => {
    if (faculty) {
      // Navigate to EditFaculty page with faculty ID
      navigate(`/faculty/edit/${faculty.id}`);

    }
    
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading faculty profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleBackClick}
              variant="outline"
              className="px-6 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
            <Button 
              onClick={fetchFacultyData}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Faculty Not Found</h2>
          <p className="text-gray-600 mb-6">The requested faculty profile could not be found.</p>
          <Button 
            onClick={handleBackClick}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header Section - Matching Figma Design */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-8">
          <div className="flex items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(faculty.user.image)}
                alt={faculty.user.username}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
                style={{ backgroundColor: '#F5F5F5' }}
                onError={(e) => {
                  console.log('Image failed to load for:', faculty.user.image);
                  e.currentTarget.src = "/api/placeholder/250/250";
                }}
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-gray-900">
                    {faculty.user.username}
                  </h1>
                  <p className="text-lg text-gray-600 mb-1">
                    {faculty.designation}
                  </p>
                  <p className="text-base text-gray-500 mb-4">
                    Department of Computer Science
                  </p>
                </div>
                
                <Button
                  onClick={handleEditClick}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              {/* Contact Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{faculty.user.email}</span>
                </div>
                {faculty.user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{faculty.user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    Joined: {new Date(faculty.joining_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            Biography
          </h2>
          <div className="text-gray-700 leading-relaxed">
            {faculty.bio || `${faculty.user.username} is a ${faculty.designation.toLowerCase()} in the Department of Computer Science and Engineering at the University of Dhaka, Bangladesh. His research interests encompass knowledge discovery, machine learning, and databases, with a particular emphasis on graph-structured data. He has contributed to several research projects and has published in prominent journals and conferences, including ACM Transactions on Knowledge Discovery from Data, PAKDD, and ICDM Workshops, amassing over 180 citations. ${faculty.user.username} is committed to fostering a vibrant academic environment through both teaching and research, and he is dedicated to mentoring students and advancing collaborative, innovative scholarship in computer science.`}
          </div>
        </div>

        {/* Courses Taught Section - Matching Figma Design */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            Courses Taught
          </h2>
          
          {/* Default courses if none from API */}
          {courses.length === 0 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-900 mb-2">
                      CSE 4102
                    </div>
                    <div className="text-gray-600">
                      Mathematical and Statistical Analysis for Engineers
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Credits</div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-900 mb-2">
                      CSE-4113
                    </div>
                    <div className="text-gray-600">
                      Internet Programming Lab
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Credits</div>
                    <div className="text-2xl font-bold text-gray-900">1</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-900 mb-2">
                      CS-4115
                    </div>
                    <div className="text-gray-600">
                      Introduction to Machine Learning
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Credits</div>
                    <div className="text-2xl font-bold text-gray-900">3</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {courses.length > 0 && (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg text-gray-900 mb-2">
                        {course.name}
                      </div>
                      {course.description && (
                        <div className="text-gray-600">
                          {course.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Credits</div>
                      <div className="text-2xl font-bold text-gray-900">{course.credits}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publications Section - Matching Figma Design */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-600" />
            Publications
          </h2>
          
          <div className="space-y-6">
            {publications.map((pub) => (
              <div key={pub.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {pub.title}
                </h3>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">DOI:</span> {pub.doi}
                </div>
                <div className="text-gray-600 mb-2">
                  <span className="font-medium italic">{pub.venue}</span>, {pub.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Section - Matching Figma Design */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <Mail className="w-6 h-6 text-red-600" />
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-gray-600">{faculty.user.email}</div>
              </div>
            </div>
            
            {/* Office */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-semibold text-gray-900">Office</div>
                <div className="text-gray-600">Room 302, Science Building</div>
              </div>
            </div>
            
            {/* Office Hours */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-semibold text-gray-900">Office Hours</div>
                <div className="text-gray-600">Mon/Wed 2-4 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;
