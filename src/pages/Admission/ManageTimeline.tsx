import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { admissionService } from '../../services/admissionService';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
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

interface FormValues {
  program_id: number;
  application_start_date: string;
  application_end_date: string;
  admission_exam_date: string;
  result_publication_date: string;
  admission_confirmation_start_date: string;
  admission_confirmation_end_date: string;
  attachment?: File;
}

const formSchema = z.object({
  program_id: z.number().min(1, 'Program is required'),
  application_start_date: z.string(),
  application_end_date: z.string(),
  admission_exam_date: z.string(),
  result_publication_date: z.string(),
  admission_confirmation_start_date: z.string(),
  admission_confirmation_end_date: z.string(),
});

const ManageTimeline = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program_id: 0,
      application_start_date: '',
      application_end_date: '',
      admission_exam_date: '',
      result_publication_date: '',
      admission_confirmation_start_date: '',
      admission_confirmation_end_date: '',
    },
  });

  const safeFormat = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await admissionService.getPrograms();
        setPrograms(data);
      } catch (err) {
        console.error('Error loading programs:', err);
        setError('Failed to load programs');
      }
    };

    const loadTimelines = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await admissionService.getAdmissionTimelines();
        setTimelines(data);
      } catch (err) {
        console.error('Error loading timelines:', err);
        setError('Failed to load timelines');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
    loadTimelines();
  }, []);

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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    const values = form.getValues();
                    
                    await admissionService.createAdmissionTimeline({
                      program_id: Number(values.program_id),
                      application_start_date: values.application_start_date,
                      application_end_date: values.application_end_date,
                      admission_exam_date: values.admission_exam_date,
                      result_publication_date: values.result_publication_date,
                      admission_confirmation_start_date: values.admission_confirmation_start_date,
                      admission_confirmation_end_date: values.admission_confirmation_end_date,
                    });
                    
                    // Reset form
                    form.reset();
                    
                    // Reload timelines
                    const data = await admissionService.getAdmissionTimelines();
                    setTimelines(data);
                  } catch (error) {
                    console.error('Error creating timeline:', error);
                    setError('Failed to create timeline');
                  } finally {
                    setLoading(false);
                  }
                })}>
                  <Select
                    onValueChange={(value) => {
                      const numValue = Number(value);
                      form.setValue('program_id', numValue);
                      console.log('Selected program:', numValue);
                    }}
                    value={form.getValues('program_id') ? String(form.getValues('program_id')) : ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={String(program.id)}>
                          {program.id} - {program.name} ({program.duration})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Application Start Date</Label>
                        <Input
                          type="date"
                          {...form.register('application_start_date')}
                        />
                      </div>
                      <div>
                        <Label>Application End Date</Label>
                        <Input
                          type="date"
                          {...form.register('application_end_date')}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Admission Exam Date</Label>
                      <Input
                        type="date"
                        {...form.register('admission_exam_date')}
                      />
                    </div>

                    <div>
                      <Label>Result Publication Date</Label>
                      <Input
                        type="date"
                        {...form.register('result_publication_date')}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Confirmation Start Date</Label>
                        <Input
                          type="date"
                          {...form.register('admission_confirmation_start_date')}
                        />
                      </div>
                      <div>
                        <Label>Confirmation End Date</Label>
                        <Input
                          type="date"
                          {...form.register('admission_confirmation_end_date')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachment">Attachment (Optional)</Label>
                      <Input
                        id="attachment"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...form.register('attachment')}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Timeline'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {timelines.map((timeline) => (
                <Card key={timeline.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {programs.find((program) => program.id === timeline.program_id)?.name || 'Unknown Program'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Program ID: {timeline.program_id}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTimeline(timeline.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTimeline(timeline.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-gray-500">Admission Exam:</span>
                        <span className="ml-2 font-medium">
                          {safeFormat(timeline.admission_exam_date)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <BookOpen className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="text-gray-500">Results:</span>
                        <span className="ml-2 font-medium">
                          {safeFormat(timeline.result_publication_date)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <ArrowRight className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-gray-500">Confirmation Period:</span>
                        <span className="ml-2 font-medium">
                          {safeFormat(timeline.admission_confirmation_start_date)} - {safeFormat(timeline.admission_confirmation_end_date)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTimeline;
