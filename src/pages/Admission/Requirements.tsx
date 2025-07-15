import { GraduationCap, BookOpen, FileText, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function AdmissionRequirements() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#14244c] sm:text-5xl mb-4">Admission Requirements</h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about applying to our programs
          </p>
        </div>

        <Card className="border-none shadow-md overflow-hidden mb-12">
          <div className="bg-[#14244c] px-6 py-5 text-white">
            <h2 className="text-2xl font-bold">General Admission Requirements</h2>
            <p className="text-gray-200 mt-2">Essential criteria for all applicants</p>
          </div>
          <CardContent className="px-6 py-8">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Academic Qualifications</h3>
                    <p className="mt-1 text-gray-600">
                      Minimum GPA of 3.0 in previous academic qualifications. Specific requirements may vary by program.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
                    <ul className="mt-2 space-y-2 text-gray-600 list-disc list-inside">
                      <li>Completed application form</li>
                      <li>Official academic transcripts</li>
                      <li>Standardized test scores (if applicable)</li>
                      <li>Letters of recommendation</li>
                      <li>Statement of purpose</li>
                      <li>Resume/CV</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Application Deadlines</h3>
                    <p className="mt-1 text-gray-600">
                      Please check the <Link to="/admission" className="text-blue-600 hover:underline">admission timeline</Link> for specific deadlines.
                      Late applications may be considered on a space-available basis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Application Review Process</h3>
                    <p className="mt-1 text-gray-600">
                      Applications are reviewed holistically. The admissions committee considers academic
                      achievements, test scores, personal statements, letters of recommendation, and other
                      relevant factors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Program-Specific Requirements</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Undergraduate Programs</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>High school diploma or equivalent</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Minimum GPA of 3.0 (on a 4.0 scale)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>SAT/ACT scores (optional for some programs)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>English language proficiency test scores for non-native speakers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Graduate Programs</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Bachelor's degree from an accredited institution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Minimum GPA of 3.0 in undergraduate studies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>GRE/GMAT scores (if required by the program)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Letters of recommendation (typically 2-3)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Statement of purpose</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Resume/CV</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
                <ol className="space-y-6">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium mr-4 flex-shrink-0">1</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Check Eligibility</h3>
                      <p className="mt-1 text-gray-600">
                        Review the admission requirements for your desired program to ensure you meet all criteria.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium mr-4 flex-shrink-0">2</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Prepare Documents</h3>
                      <p className="mt-1 text-gray-600">
                        Gather all required documents, including transcripts, test scores, and letters of recommendation.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium mr-4 flex-shrink-0">3</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Complete Application</h3>
                      <p className="mt-1 text-gray-600">
                        Fill out the online application form and upload all required documents.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium mr-4 flex-shrink-0">4</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Submit Application Fee</h3>
                      <p className="mt-1 text-gray-600">
                        Pay the non-refundable application fee to complete your submission.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-medium mr-4 flex-shrink-0">5</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Track Your Application</h3>
                      <p className="mt-1 text-gray-600">
                        Monitor your application status through our online portal. You'll be notified once a decision has been made.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Link to="/admission/apply">
              <Button className="bg-blue-900 hover:bg-blue-800">
                Start Your Application
              </Button>
            </Link>
          </div>
        </Card>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
          </div>
          <div className="px-6 py-5">
            <p className="text-gray-600 mb-4">
              Our admissions team is here to help you with any questions you may have about the application process.
            </p>
            <div className="mt-4">
              <a 
                href="mailto:admissions@csedu.edu" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FileText className="h-5 w-5 mr-2" />
                Contact Admissions Office
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdmissionRequirements;
