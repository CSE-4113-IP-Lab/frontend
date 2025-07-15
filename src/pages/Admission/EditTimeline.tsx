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
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
}

export default function EditTimeline() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);

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

  const programId = form.watch('program_id');

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load both timeline and programs in parallel
        const [timeline, programsData] = await Promise.all([
          admissionService.getAdmissionTimeline(Number(id)),
          admissionService.getPrograms()
        ]);
        
        setPrograms(programsData);
        
        // Reset form with all values
        form.reset({
          program_id: timeline.program_id,
          application_start_date: timeline.application_start_date,
          application_end_date: timeline.application_end_date,
          admission_exam_date: timeline.admission_exam_date,
          result_publication_date: timeline.result_publication_date,
          admission_confirmation_start_date: timeline.admission_confirmation_start_date,
          admission_confirmation_end_date: timeline.admission_confirmation_end_date,
        });
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#14244c] mb-4">
            Edit Admission Timeline
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Update the admission schedule details
          </p>
        </div>

        <Button
          variant="outline"
          className="mb-8 border-[#14244c] text-[#14244c] hover:bg-[#ecb31d] hover:border-[#ecb31d] hover:text-white transition-colors cursor-pointer"
          onClick={() => navigate('/admission/manage')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timeline Management
        </Button>

        <Card className="border-none shadow-md">
          <CardHeader className="bg-[#14244c] text-white">
            <CardTitle>Edit Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Program</Label>
                  <Select
                    onValueChange={(value) => form.setValue('program_id', Number(value))}
                    value={programId ? String(programId) : undefined}
                  >
                    <SelectTrigger className="mt-1">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Application Start Date</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      {...form.register('application_start_date')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Application End Date</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      {...form.register('application_end_date')}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Admission Exam Date</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    {...form.register('admission_exam_date')}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Result Publication Date</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    {...form.register('result_publication_date')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Confirmation Start Date</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      {...form.register('admission_confirmation_start_date')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Confirmation End Date</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      {...form.register('admission_confirmation_end_date')}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
