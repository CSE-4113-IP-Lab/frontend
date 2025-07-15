import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertIcon } from '@/components/ui/alert';
import { admissionService } from '../../services/admissionService';

// Define ProgramResponse interface since we're not using programService
type ProgramResponse = {
  id: number;
  name: string;
  description?: string;
  duration?: string;
};

// Define form schema using Zod
const formSchema = z.object({
  programId: z.string().min(1, 'Program is required'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  previousInstitution: z.string().min(2, 'Previous institution is required'),
  previousQualification: z.string().min(2, 'Qualification is required'),
  statementOfPurpose: z.string().min(50, 'Statement of purpose should be at least 50 characters'),
  // Add more fields as needed
});

type FormValues = z.infer<typeof formSchema>;

export function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programId: programId || '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      previousInstitution: '',
      previousQualification: '',
      statementOfPurpose: '',
    },
  });

  // Fetch programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // TODO: Replace with actual API call to fetch programs
        // const data = await programService.getPublicPrograms();
        const mockPrograms: ProgramResponse[] = [
          { id: 1, name: 'Computer Science', description: 'Bachelor of Science in Computer Science', duration: '4 years' },
          { id: 2, name: 'Electrical Engineering', description: 'Bachelor of Science in Electrical Engineering', duration: '4 years' },
          { id: 3, name: 'Business Administration', description: 'Bachelor of Business Administration', duration: '4 years' },
        ];
        setPrograms(mockPrograms);
      } catch (err) {
        setError('Failed to load programs');
        console.error(err);
      }
    };

    fetchPrograms();
  }, []);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Replace with actual API call to submit application
      console.log('Form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to success page
      navigate('/admission/application-success');
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Admission Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your application to join our prestigious programs. All fields are required.
          </p>
        </div>
        
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-xl font-bold">Application Details</h2>
            <p className="text-blue-100 text-sm mt-1">
              Please fill out the form below to apply for admission
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-8 space-y-8">
                {error && (
                  <div className="mb-6">
                    <Alert variant="destructive" className="flex items-start gap-3">
                      <AlertIcon variant="destructive" />
                      <div className="ml-3">
                        <div className="text-sm">
                          {error}
                        </div>
                      </div>
                    </Alert>
                  </div>
                )}
                
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">Program Information</h3>
                  <p className="text-sm text-gray-500">Select the program you wish to apply for</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!programId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={String(program.id)}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="previousQualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highest Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., High School Diploma, Bachelor's Degree" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="previousInstitution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of your previous school/college" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mailing Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="statementOfPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statement of Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself, your academic background, and why you want to join this program..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 50 characters. This is your chance to tell us why you're a great fit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-1 pt-4">
                  <h3 className="text-lg font-medium text-gray-900">Supporting Documents</h3>
                  <p className="text-sm text-gray-500">Upload all required documents for your application</p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-colors hover:border-blue-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Click to upload</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF, JPG, PNG (MAX. 10MB each)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <label htmlFor="terms" className="block text-sm text-gray-700">
                    I certify that all information provided is accurate to the best of my knowledge. I understand that providing false information may result in the rejection of my application.
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default ApplicationForm;
