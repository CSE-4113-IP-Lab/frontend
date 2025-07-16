import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Save, 
  ArrowLeft,
  Loader2,
  BookOpen,
  Camera,
  Upload
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

interface UpdateData {
  year?: number;
  semester?: number;
  registration_number?: string;
  session?: string;
  username?: string;
  phone?: string;
  gender?: string;
}

export function StudentEditProfile() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const apiUrl = import.meta.env.VITE_ENDPOINT;

  const [formData, setFormData] = useState<UpdateData>({
    year: 0,
    semester: 0,
    registration_number: '',
    session: '',
    username: '',
    phone: '',
    gender: ''
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

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


  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/students/user/${userId}`, {
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
      
      // Initialize form data with current values
      setFormData({
        year: data.year,
        semester: data.semester,
        registration_number: data.registration_number,
        session: data.session,
        username: data.user.username,
        phone: data.user.phone,
        gender: data.user.gender
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/users/${userId}/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Refresh student data to get updated image
      await fetchStudentProfile();
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData) return;

    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${import.meta.env.VITE_ENDPOINT}/students/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      // Success - redirect back to profile
      navigate('/student/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/student/profile');
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

  if (error && !studentData) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Student Profile</h1>
          <p className="mt-2 text-gray-600">Update your student information</p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <User className="h-5 w-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Profile Image */}
            <Card>
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center text-[#14244C]">
                  <Camera className="h-5 w-5 mr-2" />
                  Profile Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : getImageUrl(studentData?.user.image) ? (
                        <img 
                          src={getImageUrl(studentData?.user.image)!} 
                          alt={studentData?.user.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#ECB31D] text-[#14244C] text-xl font-bold">
                          {studentData?.user.username?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={uploadImage}
                        disabled={!selectedImage || uploadingImage}
                        className="bg-[#14244C] hover:bg-[#ECB31D] text-white"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Choose a profile image (JPG, PNG, GIF up to 10MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="flex items-center text-[#14244C]">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={userEmail || ''}
                      className="mt-1 bg-gray-50"
                      placeholder="Email address"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="registration_number" className="text-sm font-medium text-gray-700">
                      Registration Number
                    </Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => handleInputChange('registration_number', e.target.value)}
                      className="mt-1"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="session" className="text-sm font-medium text-gray-700">
                      Session
                    </Label>
                    <Input
                      id="session"
                      value={formData.session}
                      onChange={(e) => handleInputChange('session', e.target.value)}
                      className="mt-1"
                      placeholder="Enter session (e.g., 2021-22)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                      Current Year
                    </Label>
                    <Select
                      value={formData.year?.toString()}
                      onValueChange={(value) => handleInputChange('year', parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Year 1</SelectItem>
                        <SelectItem value="2">Year 2</SelectItem>
                        <SelectItem value="3">Year 3</SelectItem>
                        <SelectItem value="4">Year 4</SelectItem>
                        <SelectItem value="5">Year 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semester" className="text-sm font-medium text-gray-700">
                      Current Semester
                    </Label>
                    <Select
                      value={formData.semester?.toString()}
                      onValueChange={(value) => handleInputChange('semester', parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#14244C] hover:bg-[#ECB31D] text-white px-6 py-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
