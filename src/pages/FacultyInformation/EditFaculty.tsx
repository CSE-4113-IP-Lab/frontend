import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, User, Briefcase, FileText, ArrowLeft, Upload, Trash2, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FacultyData {
  id: number;
  user_id: number;
  bio: string;
  designation: string;
  joining_date: string;
  on_leave: number;
  expertise: string[] | null;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    gender: string;
    role: string;
    is_verified: number;
    image_id: number | null;
    image: string | { id: number; url: string } | null;
  };
}

interface FacultyUpdateData {
  bio: string;
  designation: string;
  joining_date: string;
  username: string;
  phone: string;
  gender: string;
  expertise: string[];
  on_leave: number;
}

const EditFaculty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageDeleting, setImageDeleting] = useState(false);
  
  // Expertise management
  const [newExpertise, setNewExpertise] = useState<string>('');
  
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [formData, setFormData] = useState<FacultyUpdateData>({
    bio: '',
    designation: '',
    joining_date: '',
    username: '',
    phone: '',
    gender: '',
    expertise: [],
    on_leave: 0
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const apiUrl = import.meta.env.VITE_ENDPOINT;
  const userRole = localStorage.getItem("role");
  
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
  
  // Debug: Log the faculty ID parameter
  useEffect(() => {
    console.log('Faculty ID from URL params:', id);
    console.log('API URL:', apiUrl);
  }, [id, apiUrl]);

  // Refetch faculty data function
  const refetchFacultyData = async () => {
    try {
      console.log('Refetching faculty data for ID:', id);
      
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken');
      
      const authHeaders: Record<string, string> = token ? {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      } : {};
      
      // Try individual faculty endpoint first
      try {
        const response = await fetch(`${apiUrl}/faculties/${id}`, {
          headers: authHeaders,
        });

        if (response.ok) {
          const data: FacultyData = await response.json();
          console.log('Refetched faculty data:', data);
          setFacultyData(data);
        } else {
          throw new Error('Individual endpoint failed');
        }
      } catch (individualError) {
        console.log('Individual faculty fetch failed, trying faculty by user ID...');
        
        // Fallback: Try faculty by user ID
        const facultyByUserResponse = await fetch(`${apiUrl}/faculties/user/${id}`, {
          headers: authHeaders
        });
        
        if (!facultyByUserResponse.ok) {
          throw new Error(`Failed to fetch faculty data: ${facultyByUserResponse.status}`);
        }
        
        const facultyData = await facultyByUserResponse.json();
        console.log('Refetched faculty data via user ID:', facultyData);
        setFacultyData(facultyData);
      }
      
    } catch (err) {
      console.error('Error refetching faculty data:', err);
    }
  };
  
  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // const token = localStorage.getItem('authToken');
        // if (!token) {
        //   throw new Error('No authentication token found');
        // }

        console.log('Fetching faculty data for ID:', id);
        console.log('API URL:', `${apiUrl}/faculties/${id}`);

        // Get authentication token from localStorage (check multiple possible keys)
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('accessToken') || 
                     localStorage.getItem('access_token') || 
                     localStorage.getItem('authToken');
        
        const authHeaders: Record<string, string> = token ? {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        } : {};
        
        console.log('Auth token found:', token ? 'Yes' : 'No');

        // First try to get individual faculty
        let data: FacultyData | null = null;
        
        try {
          console.log('Trying individual faculty endpoint...');
          const response = await fetch(`${apiUrl}/faculties/${id}`, {
            headers: authHeaders
          });

          if (response.ok) {
            data = await response.json();
            console.log('Individual faculty fetch successful:', data);
          } else {
            console.log(`Individual faculty endpoint failed with status: ${response.status}`);
            throw new Error('Individual endpoint failed');
          }
        } catch (individualError) {
          console.log('Individual faculty fetch failed, trying faculty by user ID...');
          
          // Fallback 1: Try faculty by user ID endpoint (this exists in the API)
          try {
            console.log('Trying faculty by user ID endpoint...');
            const facultyByUserResponse = await fetch(`${apiUrl}/faculties/user/${id}`, {
              headers: authHeaders
            });
            
            if (facultyByUserResponse.ok) {
              data = await facultyByUserResponse.json();
              console.log('Faculty by user ID successful:', data);
            } else {
              console.log(`Faculty by user ID failed with status: ${facultyByUserResponse.status}`);
              throw new Error('Faculty by user ID failed');
            }
          } catch (facultyByUserError) {
            console.log('Faculty by user ID also failed, trying users endpoint...');
            
            // Fallback 2: Try users endpoint to get user data and transform it
            try {
              console.log('Trying individual user endpoint...');
              const userResponse = await fetch(`${apiUrl}/users/${id}`, {
                headers: authHeaders,
              });

              if (userResponse.ok) {
                const user = await userResponse.json();
                console.log('User endpoint successful:', user);
                
                // Transform user data to faculty format
                data = {
                  id: parseInt(id as string),
                  user_id: user.id,
                  bio: user.bio || '',
                  designation: user.designation || 'Faculty',
                  joining_date: user.created_at || new Date().toISOString(),
                  expertise: [],
                  on_leave: 0,
                  user: user
                };
                
                console.log('Transformed user data to faculty format:', data);
              } else {
                console.log(`User endpoint failed with status: ${userResponse.status}`);
                throw new Error(`User endpoint failed: ${userResponse.status}`);
              }
            } catch (userError) {
              console.log('Individual user endpoint failed, trying users list...');
              
              // Fallback 3: Try users list endpoint and find the user
              try {
                const usersListResponse = await fetch(`${apiUrl}/users?skip=0&limit=100`, {
                  headers: authHeaders
                });

                if (usersListResponse.ok) {
                  const allUsers = await usersListResponse.json();
                  console.log('Users list endpoint successful, users count:', allUsers.length);
                  
                  // Find the user by ID
                  const user = allUsers.find((u: any) => u.id === parseInt(id as string));
                  
                  if (user) {
                    // Transform user data to faculty format
                    data = {
                      id: parseInt(id as string),
                      user_id: user.id,
                      bio: user.bio || '',
                      designation: user.designation || 'Faculty',
                      joining_date: user.created_at || new Date().toISOString(),
                      expertise: [],
                      on_leave: 0,
                      user: user
                    };
                    
                    console.log('Found and transformed user to faculty format:', data);
                  } else {
                    throw new Error('User not found in users list');
                  }
                } else {
                  console.log(`Users list failed with status: ${usersListResponse.status}`);
                  throw new Error(`Users list endpoint failed: ${usersListResponse.status}`);
                }
              } catch (usersListError) {
                console.error('All endpoints failed:', usersListError);
                
                // Fallback 4: Create mock data structure for the form to work
                console.log('Creating mock faculty data structure for editing...');
                data = {
                  id: parseInt(id as string),
                  user_id: parseInt(id as string),
                  bio: '',
                  designation: 'Faculty',
                  joining_date: new Date().toISOString(),
                  expertise: [],
                  on_leave: 0,
                  user: {
                    id: parseInt(id as string),
                    username: 'faculty_member',
                    email: '',
                    phone: '',
                    gender: 'Not specified',
                    role: 'faculty',
                    is_verified: 1,
                    image_id: null,
                    image: null
                  }
                };
                
                console.log('Using mock data structure:', data);
              }
            }
          }
        }
        setFacultyData(data);
        
        // Set form data with existing values
        if (data) {
          setFormData({
            bio: data.bio || '',
            designation: data.designation || '',
            joining_date: data.joining_date || '',
            username: data.user.username || '',
            phone: data.user.phone || '',
            gender: data.user.gender || '',
            expertise: data.expertise || [],
            on_leave: data.on_leave || 0
          });
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id && apiUrl) {
      fetchFacultyData();
    }
  }, [id, apiUrl]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    
    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Get authentication token from localStorage (check multiple possible keys)
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Updating faculty with user_id:', facultyData?.user_id);
      console.log('Update payload:', formData);

      const response = await fetch(`${apiUrl}/faculties/user/${facultyData?.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update faculty');
      }

      const updatedData = await response.json();
      setFacultyData(updatedData);
      setSuccess('Faculty updated successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating faculty');
    } finally {
      setSaving(false);
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof FacultyUpdateData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle expertise management
  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageError(null);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile || !facultyData) return;
    
    setImageUploading(true);
    setImageError(null);
    
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('access_token') || 
                   localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

     


      console.log('Uploading image file:', imageFile.name, 'Size:', imageFile.size);
      const formData = new FormData();
      formData.append('file', imageFile);
      //formData.append('image', imageFile);
      
      const response = await fetch(`${apiUrl}/users/${facultyData.user_id}/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const updatedUser = await response.json();
      console.log('Updated user after image upload:', updatedUser);
      
      // Update faculty data with the new user information
      setFacultyData(prev => prev ? { ...prev, user: updatedUser } : prev);
      setImageFile(null);
      setSuccess('Image uploaded successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // Reset file input
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh the faculty data to get the updated image URL
      setTimeout(() => {
        refetchFacultyData();
      }, 500);
      
    } catch (err) {
      console.error('Image upload error:', err);
      setImageError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    if (!facultyData || !facultyData.user.image) return;
    
    setImageDeleting(true);
    setImageError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token') || 
                 localStorage.getItem('accessToken') || 
                 localStorage.getItem('access_token') || 
                 localStorage.getItem('authToken');
    
        
      if (!token) {
          throw new Error('No authentication token found. Please log in.');
      }

      console.log('Deleting image for user:', facultyData.user_id);
      console.log('Current image:', facultyData.user.image);
      
      const response = await fetch(`${apiUrl}/users/${facultyData.user_id}/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error response:', errorText);
        throw new Error(`Failed to delete image: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Check if response has content
      const responseText = await response.text();
      let updatedUser;
      
      try {
        updatedUser = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.log('No JSON response from delete, assuming success');
        updatedUser = { 
          ...facultyData.user, 
          image: null, 
          image_id: null 
        };
      }
      
      console.log('Updated user after image deletion:', updatedUser);
      
      // Update faculty data with the new user information
      if (updatedUser) {
        setFacultyData(prev => prev ? { ...prev, user: updatedUser } : prev);
      } else {
        // If no response, manually update to remove image
        setFacultyData(prev => prev ? { 
          ...prev, 
          user: { 
            ...prev.user, 
            image: null, 
            image_id: null 
          } 
        } : prev);
      }
      
      setSuccess('Image deleted successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      // Refresh the faculty data to ensure UI is updated
      setTimeout(() => {
        refetchFacultyData();
      }, 500);
      
    } catch (err) {
      console.error('Image deletion error:', err);
      setImageError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setImageDeleting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/faculty-management');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8E9EA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl" style={{ color: '#6B7280' }}>Loading faculty data...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Faculty 
          </button>
          
         { (userRole === "faculty" || userRole === "admin") &&(
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Faculty Member
              </h1>
              <p className="text-base text-gray-500">
                Update faculty member information
              </p>
            </div>
            {facultyData && (
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <span className="font-medium">ID:</span> {facultyData.id} | 
                <span className="font-medium"> User:</span> {facultyData.user_id}
              </div>
            )}
          </div>)
}

        </div>
          

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Profile Image Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-gray-500" />
                Profile Image
              </h2>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-6 items-start">
                {/* Current Image Display */}
                <div className="flex-shrink-0">
                  {getImageUrl(facultyData?.user.image) ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(facultyData?.user.image)!}
                        alt="Faculty Profile"
                        className="w-48 h-48 object-cover rounded-full border-4 border-gray-200 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleImageDelete}
                        disabled={imageDeleting}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 disabled:opacity-50"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200 shadow-lg">
                      <User className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Image Upload Controls */}
                <div className="flex-grow space-y-4">
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-2">
                      Upload New Image
                    </label>
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={imageUploading}
                      className="block w-full text-base text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!imageFile || imageUploading}
                      size="sm"
                      className="gap-2 px-6"
                    >
                      <Upload className="w-4 h-4" />
                      {imageUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    
                    {getImageUrl(facultyData?.user.image) && (
                      <Button
                        type="button"
                        onClick={handleImageDelete}
                        disabled={imageDeleting}
                        variant="outline"
                        size="sm"
                        className="gap-2 px-6 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {imageDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </div>
                  
                  {imageError && (
                    <p className="text-sm text-red-600">{imageError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-gray-500" />
                Personal Information
              </h2>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                {/* Username */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`block w-full rounded-md border py-3 px-4 text-base focus:outline-none focus:ring-2 ${
                      validationErrors.username 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="Enter username"
                  />
                  {validationErrors.username && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.username}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-gray-500" />
                Professional Information
              </h2>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                {/* Designation */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className={`block w-full rounded-md border py-3 px-4 text-base focus:outline-none focus:ring-2 ${
                      validationErrors.designation 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="Adjunct Professor">Adjunct Professor</option>
                  </select>
                  {validationErrors.designation && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.designation}</p>
                  )}
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => handleInputChange('joining_date', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Leave Status */}
                <div className="sm:col-span-2">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Leave Status
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="on_leave"
                        value="0"
                        checked={formData.on_leave === 0}
                        onChange={(e) => handleInputChange('on_leave', parseInt(e.target.value))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-base text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="on_leave"
                        value="1"
                        checked={formData.on_leave === 1}
                        onChange={(e) => handleInputChange('on_leave', parseInt(e.target.value))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-base text-gray-700">On Leave</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-gray-500" />
                Areas of Expertise
              </h2>
              
              <div className="mt-6">
                {/* Add New Expertise */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add new expertise area"
                    className="flex-1 rounded-md border border-gray-300 py-3 px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  />
                  <Button
                    type="button"
                    onClick={addExpertise}
                    disabled={!newExpertise.trim()}
                    size="sm"
                    className="px-6"
                  >
                    Add
                  </Button>
                </div>

                {/* Expertise List */}
                <div className="space-y-3">
                  {formData.expertise.map((expertise, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-base text-gray-700">{expertise}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove expertise"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.expertise.length === 0 && (
                    <p className="text-gray-500 text-base italic">No expertise areas added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Biography Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-500" />
                Biography
              </h2>
              
              <div className="mt-6">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={6}
                  className="block w-full rounded-md border border-gray-300 py-3 px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter faculty biography..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              size="sm"
              className="gap-1"
              disabled={saving}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFaculty;