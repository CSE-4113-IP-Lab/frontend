import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { admissionService } from '../../services/admissionService';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
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

const CreateTimeline = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

    loadPrograms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
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
            <CardTitle>Create New Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
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
                
                navigate('/admission/manage');
              } catch (error) {
                console.error('Error creating timeline:', error);
                setError('Failed to create timeline');
              } finally {
                setLoading(false);
              }
            })}>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Program</Label>
                  <Select
                    onValueChange={(value) => {
                      const numValue = Number(value);
                      form.setValue('program_id', numValue);
                    }}
                    value={form.getValues('program_id') ? String(form.getValues('program_id')) : undefined}
                    defaultValue={undefined}
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

                <div>
                  <Label htmlFor="attachment" className="text-sm font-medium text-gray-700">
                    Attachment (Optional)
                  </Label>
                  <Input
                    id="attachment"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="mt-1"
                    {...form.register('attachment')}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer" 
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Timeline'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTimeline;
