import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { admissionService, type AdmissionTimeline } from '../../services/admissionService';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, BookOpen, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertIcon } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Environment types are now defined in src/env.d.ts

const AdmissionPage = () => {
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const loadTimelines = async () => {
    try {
      console.log('Starting to load timelines...');
      setLoading(true);
      setError(null);
      
      // First try to load the data with authentication
      try {
        const data = await admissionService.getAdmissionTimelines();
        console.log('Received authenticated timelines data:', data);
        
        if (data.length === 0) {
          console.log('No timelines data available');
          setError('No admission timelines available at the moment.');
        } else {
          setTimelines(data);
          console.log('Timelines state updated with authenticated data:', data);
        }
      } catch (authError: any) {
        console.log('Falling back to public timeline data due to:', authError.message);
        
        // If authenticated request fails, try to load public data
        try {
          // Use type assertion to bypass TypeScript error
          const publicData = await (admissionService as any).getPublicAdmissionTimelines();
          
          if (publicData && publicData.length > 0) {
            setTimelines(publicData);
            console.log('Successfully loaded public timelines:', publicData);
          } else {
            setError('No admission information is currently available.');
          }
        } catch (publicErr) {
          console.error('Failed to load public timelines:', publicErr);
          setError('Failed to load admission information. Please try again later.');
        }
      }
    } catch (err: any) {
      console.error('Unexpected error in loadTimelines:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError('Failed to load admission information. Please try again later.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
    }
  };

  useEffect(() => {
    // Load timelines for all users, regardless of authentication
    loadTimelines();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive" className="flex items-start gap-3">
            <AlertIcon variant="destructive" />
            <div>
              <h3 className="font-medium">Something went wrong</h3>
              <AlertDescription className="mt-1">
                {error}
              </AlertDescription>
            </div>
          </Alert>
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Admission Timelines
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading admission schedules and deadlines...
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-3 bg-gradient-to-r from-blue-100 to-indigo-100"></div>
                <div className="p-6">
                  <div className="h-7 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="h-9 w-full bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Admission requirements data
  const admissionRequirements = [
    "Minimum GPA of 3.0 in HSC or equivalent examination",
    "Minimum GPA of 3.0 in SSC or equivalent examination",
    "Minimum GPA of 3.5 in Mathematics and Physics in HSC",
    "Must have taken Mathematics and Physics in HSC or equivalent",
    "Must have taken English in HSC or equivalent"
  ];

  // Required documents
  const requiredDocuments = [
    "SSC/O-Level mark sheet and certificate",
    "HSC/A-Level mark sheet and certificate",
    "Passport size photograph",
    "National ID/Birth Registration Certificate",
    "Testimonial from previous institution"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admission Process
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Important dates and deadlines for the upcoming admission cycle
          </p>
        </div>

        {/* Admission Requirements Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Admission Requirements
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              General requirements for undergraduate admission
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Eligibility</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-2">
                    {admissionRequirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Required Documents</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="list-disc pl-5 space-y-2">
                    {requiredDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Admission Timeline Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admission Timeline</h2>
          
          {error ? (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-5 w-5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium">Error loading admission information</h3>
                <div className="mt-1 text-sm">
                  {error}
                </div>
              </div>
            </Alert>
          ) : timelines.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No admission information available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for updates on admission timelines.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {timelines.map((timeline) => (
                <Card key={timeline.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">Program {timeline.program_id}</h2>
                        <p className="text-blue-100 text-sm">Admission Timeline</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">
                        {new Date(timeline.application_end_date) > new Date() ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Application Period</p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(timeline.application_start_date)} - {formatDate(timeline.application_end_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Admission Exam</p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(timeline.admission_exam_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Result Publication</p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(timeline.result_publication_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Confirmation Period</p>
                          <p className="text-gray-900 font-medium">
                            {formatDate(timeline.admission_confirmation_start_date)} - {formatDate(timeline.admission_confirmation_end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {timeline.attachment && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a 
                          href={timeline.attachment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium group"
                        >
                          View Detailed Schedule
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <div className="px-6 pb-6">
                    {isAuthenticated ? (
                      <Button 
                        onClick={() => navigate('/admission/apply')}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Start Application
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => navigate('/login', { state: { from: '/admission' } })}
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                      >
                        Login to Apply
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Button in Header */}
      {user?.role === 'admin' && (
        <div className="text-center mb-8">
          <Button 
            asChild
            variant="outline"
            className="inline-flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
          >
            <Link to="/admission/manage">
              <Settings className="h-4 w-4" />
              Manage Admission Timelines
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
