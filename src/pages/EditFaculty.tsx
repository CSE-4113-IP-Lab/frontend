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
  
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [formData, setFormData] = useState<FacultyUpdateData>({
    bio: '',
    designation: '',
    joining_date: '',
    username: '',
    phone: '',
    gender: ''
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
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
  
  // Debug: Log the faculty ID parameter
  useEffect(() => {
    console.log('Faculty ID from URL params:', id);
    console.log('API URL:', apiUrl);
  }, [id, apiUrl]);

  // Refetch faculty data function
  const refetchFacultyData = async () => {
    try {
      console.log('Refetching faculty data for ID:', id);
      const response = await fetch(`${apiUrl}/faculties/${id}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refetch faculty data');
      }

      const data: FacultyData = await response.json();
      console.log('Refetched faculty data:', data);
      setFacultyData(data);
      
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

        const response = await fetch(`${apiUrl}/faculties/${id}`, {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
          }
        });

       

        if (!response.ok) {
          throw new Error('Failed to fetch faculty data');
        }

        const data: FacultyData = await response.json();
        setFacultyData(data);
        
        // Set form data with existing values
        setFormData({
          bio: data.bio || '',
          designation: data.designation || '',
          joining_date: data.joining_date || '',
          username: data.user.username || '',
          phone: data.user.phone || '',
          gender: data.user.gender || ''
        });
        
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
      
      // const token = localStorage.getItem('authToken');
      // if (!token) {
      //   throw new Error('No authentication token found');
      // }

      const response = await fetch(`${apiUrl}/faculties/user/${facultyData?.user_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`,
          'Content-Type': 'application/json'
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
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch(`${apiUrl}/users/${facultyData.user_id}/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
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
      console.log('Deleting image for user:', facultyData.user_id);
      console.log('Current image:', facultyData.user.image);
      
      const response = await fetch(`${apiUrl}/users/${facultyData.user_id}/image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsImVtYWlsIjoiYWJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJleHAiOjE3NTIzNjUwNDJ9.L7DODxjZqpZEDCHmZzQV7uxZ7dmKRn3ra_Zx0XQcUik`
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
    <div className="min-h-screen" style={{ backgroundColor: '#E8E9EA' }}>
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Faculty List
          </button>
          
          <h1 className="text-5xl font-bold mb-2" style={{ color: '#2C2C2C' }}>
            Edit Faculty
          </h1>
          <p className="text-xl" style={{ color: '#6B7280' }}>
            Update faculty member information
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <Camera className="w-6 h-6" />
              Profile Image
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Current Image Display */}
              <div className="flex-shrink-0">
                {getImageUrl(facultyData?.user.image) ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(facultyData?.user.image)!}
                      alt="Faculty Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-lg"
                      onError={(e) => {
                        console.error('Image failed to load:', getImageUrl(facultyData?.user.image));
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', getImageUrl(facultyData?.user.image));
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      disabled={imageDeleting}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-300">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
               
              </div>
              
              {/* Image Upload Controls */}
              <div className="flex-grow">
                <div className="mb-4">
                  <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                    Upload New Image
                  </label>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageUploading}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF (Max size: 5MB)
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={!imageFile || imageUploading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  
                  {getImageUrl(facultyData?.user.image) && (
                    <Button
                      type="button"
                      onClick={handleImageDelete}
                      disabled={imageDeleting}
                      variant="outline"
                      className="px-6 py-2 border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {imageDeleting ? 'Deleting...' : 'Delete Image'}
                    </Button>
                  )}
                </div>
                
                {imageError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{imageError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <User className="w-6 h-6" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {validationErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                )}
              </div>

      

              {/* Phone */}
              <div>
                <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <Briefcase className="w-6 h-6" />
              Professional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Designation */}
              <div>
                <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                  Designation *
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={`w-full p-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.designation ? 'border-red-500' : 'border-gray-300'
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
                  <p className="text-red-500 text-sm mt-1">{validationErrors.designation}</p>
                )}
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => handleInputChange('joining_date', e.target.value)}
                  className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              
            </div>
          </div>

          {/* Biography Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <FileText className="w-6 h-6" />
              Biography
            </h2>
            
            <div>
              <label className="block text-lg font-medium mb-2" style={{ color: '#2C2C2C' }}>
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={6}
                className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter faculty biography..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="px-8 py-3 text-lg flex items-center gap-2"
              disabled={saving}
            >
              <X className="w-5 h-5" />
              Cancel
            </Button>
            
            <Button
              type="submit"
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              disabled={saving}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Faculty ID Info */}
        {facultyData && (
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Faculty ID:</strong> {facultyData.id} | 
              <strong> User ID:</strong> {facultyData.user_id} | 
              <strong> Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFaculty;