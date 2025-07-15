import { useState, useEffect } from 'react';
import { admissionService } from '../../services/admissionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, BookOpen, ArrowRight, FileText, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
}

interface AdmissionTimeline {
  id: number;
  program_id: number;
  application_start_date: string;
  application_end_date: string;
  admission_exam_date: string;
  result_publication_date: string;
  admission_confirmation_start_date: string;
  admission_confirmation_end_date: string;
  attachment_id?: number;
  attachment?: {
    id: number;
    url: string;
  };
}

const ManageTimeline = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleEditTimeline = (id: number) => {
    navigate(`/admission/edit/${id}`);
  };

  const handleDeleteTimeline = async (id: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this timeline?')) {
        await admissionService.deleteAdmissionTimeline(id);
        setTimelines(timelines.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting timeline:', error);
      setError('Failed to delete timeline');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [programsData, timelinesData] = await Promise.all([
          admissionService.getPrograms(),
          admissionService.getAdmissionTimelines()
        ]);
        setPrograms(programsData);
        setTimelines(timelinesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#14244c] mb-4">
              Manage Admission Timelines
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading timelines...
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#14244c] mb-4">
              Manage Admission Timelines
            </h1>
            <p className="text-lg text-gray-600">
              Manage admission schedules for different programs
            </p>
          </div>
          <Button
            className="bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] shadow-lg transition-colors cursor-pointer"
            onClick={() => navigate('/admission/create-timeline')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Timeline
          </Button>
        </div>

        <div className="space-y-6">
          {timelines.map((timeline) => (
            <motion.div
              key={timeline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <div className="bg-[#14244c] p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">Program {timeline.program_id}</h3>
                      <p className="text-gray-200 text-sm mt-1">
                        {programs.find((program) => program.id === timeline.program_id)?.name || 'Unknown Program'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={new Date(timeline.application_end_date) > new Date() 
                          ? "bg-[#ecb31d] text-[#14244c] border-none" 
                          : "bg-gray-200 text-gray-700 border-none"
                        }
                      >
                        {new Date(timeline.application_end_date) > new Date() ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-[#14244c]">Timeline Details</h4>
                      <div className="grid gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-3 text-[#14244c]" />
                          <div>
                            <p className="text-sm font-medium">Application Period</p>
                            <p className="text-sm">
                              {formatDate(timeline.application_start_date)} - {formatDate(timeline.application_end_date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="w-5 h-5 mr-3 text-[#14244c]" />
                          <div>
                            <p className="text-sm font-medium">Admission Exam Date</p>
                            <p className="text-sm">{formatDate(timeline.admission_exam_date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-5 h-5 mr-3 text-[#ecb31d]" />
                          <div>
                            <p className="text-sm font-medium">Result Publication Date</p>
                            <p className="text-sm">{formatDate(timeline.result_publication_date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-5 h-5 mr-3 text-[#14244c]" />
                          <div>
                            <p className="text-sm font-medium">Admission Confirmation Period</p>
                            <p className="text-sm">
                              {formatDate(timeline.admission_confirmation_start_date)} - {formatDate(timeline.admission_confirmation_end_date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex space-x-3">
                      <Button
                        className="flex-1 bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer"
                        onClick={() => handleEditTimeline(timeline.id)}
                      >
                        Edit Timeline
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteTimeline(timeline.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTimeline;
