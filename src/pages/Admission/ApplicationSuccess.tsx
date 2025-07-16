import { CheckCircle, Mail, Home, Clock, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function ApplicationSuccess() {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (countdown === 0) {
      // Auto-redirect after countdown
      // window.location.href = '/';
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-[#14244c] p-6 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#ecb31d] p-3 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-[#14244c]" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Application Submitted Successfully!</h1>
              <p className="text-gray-200 max-w-lg">
                Thank you for choosing our institution. We've received your application and will review it shortly.
              </p>
            </div>
          </div>
          
          <CardContent className="p-8">
            <motion.div 
              className="grid gap-6 md:grid-cols-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div 
                className="bg-blue-50 p-5 rounded-lg border border-blue-100"
                variants={item}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Check Your Email</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We've sent a confirmation email with your application details.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-purple-50 p-5 rounded-lg border border-purple-100"
                variants={item}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Next Steps</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our team will review your application within 3-5 business days.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-amber-50 p-5 rounded-lg border border-amber-100"
                variants={item}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Interview</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Selected candidates will be contacted for an interview.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-green-50 p-5 rounded-lg border border-green-100"
                variants={item}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Documentation</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Have your academic documents ready for verification.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-6">
                  Need help? Our admission team is here to assist you.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <a href="mailto:admissions@csedu.edu" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Us
                    </a>
                  </Button>
                  
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link to="/" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Return to Home {countdown > 0 && `(${countdown})`}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ApplicationSuccess;
