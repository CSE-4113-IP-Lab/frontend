import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { admissionService } from '../../services/admissionService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Calendar, Clock, BookOpen, ArrowRight } from 'lucide-react';

export default function EditTimeline() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);

  const formSchema = z.object({
    program_id: z.number().min(1, 'Program is required'),
    application_start_date: z.string(),
    application_end_date: z.string(),
    admission_exam_date: z.string(),
    result_publication_date: z.string(),
    admission_confirmation_start_date: z.string(),
    admission_confirmation_end_date: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
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

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the timeline
        const timeline = await admissionService.getAdmissionTimeline(Number(id));
        
        // Load programs
        const programsData = await admissionService.getPrograms();
        setPrograms(programsData);
        
        // Set form values
        form.setValue('program_id', timeline.program_id);
        form.setValue('application_start_date', timeline.application_start_date);
        form.setValue('application_end_date', timeline.application_end_date);
        form.setValue('admission_exam_date', timeline.admission_exam_date);
        form.setValue('result_publication_date', timeline.result_publication_date);
        form.setValue('admission_confirmation_start_date', timeline.admission_confirmation_start_date);
        form.setValue('admission_confirmation_end_date', timeline.admission_confirmation_end_date);
      } catch (err: any) {
        console.error('Error loading timeline:', err);
        setError('Failed to load timeline data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTimeline();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      
      await admissionService.updateAdmissionTimeline(Number(id), data);
      
      // Navigate back to manage page
      navigate('/admission/manage');
    } catch (err: any) {
      console.error('Error updating timeline:', err);
      setError('Failed to update timeline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading timeline data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Selection */}
                <div>
                  <Label>Program</Label>
                  <Select
                    onValueChange={(value) => {
                      const numValue = Number(value);
                      form.setValue('program_id', numValue);
                      console.log('Selected program:', numValue);
                    }}
                    value={String(form.getValues('program_id'))}
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
                </div>

                {/* Dates */}
                <div>
                  <Label>Application Period</Label>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="application_start_date" className="text-sm text-gray-500">
                        Start Date
                      </Label>
                      <Input
                        id="application_start_date"
                        type="date"
                        {...form.register('application_start_date')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="application_end_date" className="text-sm text-gray-500">
                        End Date
                      </Label>
                      <Input
                        id="application_end_date"
                        type="date"
                        {...form.register('application_end_date')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Admission Exam</Label>
                  <Input
                    type="date"
                    {...form.register('admission_exam_date')}
                  />
                </div>

                <div>
                  <Label>Result Publication</Label>
                  <Input
                    type="date"
                    {...form.register('result_publication_date')}
                  />
                </div>

                <div>
                  <Label>Admission Confirmation Period</Label>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="admission_confirmation_start_date" className="text-sm text-gray-500">
                        Start Date
                      </Label>
                      <Input
                        id="admission_confirmation_start_date"
                        type="date"
                        {...form.register('admission_confirmation_start_date')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="admission_confirmation_end_date" className="text-sm text-gray-500">
                        End Date
                      </Label>
                      <Input
                        id="admission_confirmation_end_date"
                        type="date"
                        {...form.register('admission_confirmation_end_date')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
