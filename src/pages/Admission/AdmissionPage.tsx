import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  admissionService,
  type AdmissionTimeline,
} from "../../services/admissionService";
import { programService } from "../../services/programService";
import { format, parseISO, differenceInDays } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription, AlertIcon } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Environment types are now defined in src/env.d.ts

const AdmissionPage = () => {
  const [timelines, setTimelines] = useState<AdmissionTimeline[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Calculate dynamic statistics
  const statistics = useMemo(() => {
    const now = new Date();
    const activeTimelines = timelines.filter(
      (timeline) => new Date(timeline.application_end_date) > now
    );

    const nearestDeadline =
      activeTimelines.length > 0
        ? Math.min(
            ...activeTimelines.map((timeline) =>
              differenceInDays(new Date(timeline.application_end_date), now)
            )
          )
        : 0;

    return {
      openPrograms: activeTimelines.length,
      daysLeft: nearestDeadline,
      totalPrograms: programs.length,
      totalApplications: timelines.length, // This could be replaced with actual application count from API
    };
  }, [timelines, programs]);

  const loadData = async () => {
    try {
      console.log("Starting to load admission data...");
      setLoading(true);
      setError(null);

      // Load timelines and programs concurrently
      const [timelinesData, programsData] = await Promise.allSettled([
        admissionService
          .getAdmissionTimelines()
          .catch(() => (admissionService as any).getPublicAdmissionTimelines()),
        programService.getPublicPrograms().catch(() => []),
      ]);

      // Handle timelines data
      if (timelinesData.status === "fulfilled" && timelinesData.value) {
        setTimelines(timelinesData.value);
      } else {
        setError("No admission timelines available at the moment.");
      }

      // Handle programs data
      if (programsData.status === "fulfilled" && programsData.value) {
        setPrograms(programsData.value);
      }
    } catch (err: any) {
      console.error("Unexpected error in loadData:", err);
      setError("Failed to load admission information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data for all users, regardless of authentication
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive" className="flex items-start gap-3">
            <AlertIcon variant="destructive" />
            <div>
              <h3 className="font-medium">Something went wrong</h3>
              <AlertDescription className="mt-1">{error}</AlertDescription>
            </div>
          </Alert>
          <div className="mt-6 text-center">
            <Button
              className="inline-flex items-center gap-2 bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer"
              onClick={() => window.location.reload()}
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#14244c] mb-4">
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#14244c] sm:text-5xl sm:tracking-tight lg:text-6xl">
            Admission Process
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Important dates and deadlines for the upcoming admission cycle
          </p>
        </div>

        {/* Dynamic Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 bg-[#14244c]/10 rounded-lg">
                <Calendar className="w-6 h-6 text-[#14244c]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Open Programs
                </p>
                <p className="text-2xl font-semibold text-[#14244c]">
                  {statistics.openPrograms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 bg-[#ecb31d]/10 rounded-lg">
                <Clock className="w-6 h-6 text-[#ecb31d]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Days Left</p>
                <p className="text-2xl font-semibold text-[#14244c]">
                  {statistics.daysLeft > 0 ? statistics.daysLeft : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 bg-[#14244c]/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-[#14244c]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Programs
                </p>
                <p className="text-2xl font-semibold text-[#14244c]">
                  {statistics.totalPrograms}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-3 bg-[#ecb31d]/10 rounded-lg">
                <FileText className="w-6 h-6 text-[#ecb31d]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Timelines
                </p>
                <p className="text-2xl font-semibold text-[#14244c]">
                  {statistics.totalApplications}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admission Timeline Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#14244c] mb-6">
            Admission Timeline
          </h2>

          <div className="space-y-6">
            {timelines
              .sort((a, b) => {
                const aIsOpen = new Date(a.application_end_date) > new Date();
                const bIsOpen = new Date(b.application_end_date) > new Date();
                if (aIsOpen && !bIsOpen) return -1;
                if (!aIsOpen && bIsOpen) return 1;
                return (
                  new Date(b.application_end_date).getTime() -
                  new Date(a.application_end_date).getTime()
                );
              })
              .map((timeline) => (
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
                          <h3 className="text-xl font-bold">
                            {programs.find((p) => p.id === timeline.program_id)
                              ?.name || `Program ${timeline.program_id}`}
                          </h3>
                          <p className="text-gray-200 text-sm mt-1">
                            {programs.find((p) => p.id === timeline.program_id)
                              ?.type &&
                              `${
                                programs.find(
                                  (p) => p.id === timeline.program_id
                                )?.type
                              } - `}
                            Admission Timeline
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            new Date(timeline.application_end_date) > new Date()
                              ? "bg-[#ecb31d] text-[#14244c] border-none"
                              : "bg-gray-200 text-gray-700 border-none"
                          }
                        >
                          {new Date(timeline.application_end_date) > new Date()
                            ? "Open"
                            : "Closed"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-white">
                      <div className="space-y-6">
                        {/* Important Dates Section */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-[#14244c]">
                            Timeline Details
                          </h4>
                          <div className="grid gap-4">
                            {/* Application Period */}
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-5 h-5 mr-3 text-[#14244c]" />
                              <div>
                                <p className="text-sm font-medium">
                                  Application Period
                                </p>
                                <p className="text-sm">
                                  {formatDate(timeline.application_start_date)}{" "}
                                  - {formatDate(timeline.application_end_date)}
                                </p>
                              </div>
                            </div>

                            {/* Admission Exam Date */}
                            <div className="flex items-center text-gray-600">
                              <BookOpen className="w-5 h-5 mr-3 text-[#14244c]" />
                              <div>
                                <p className="text-sm font-medium">
                                  Admission Exam Date
                                </p>
                                <p className="text-sm">
                                  {formatDate(timeline.admission_exam_date)}
                                </p>
                              </div>
                            </div>

                            {/* Result Publication */}
                            <div className="flex items-center text-gray-600">
                              <FileText className="w-5 h-5 mr-3 text-[#ecb31d]" />
                              <div>
                                <p className="text-sm font-medium">
                                  Result Publication Date
                                </p>
                                <p className="text-sm">
                                  {formatDate(timeline.result_publication_date)}
                                </p>
                              </div>
                            </div>

                            {/* Confirmation Period */}
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-5 h-5 mr-3 text-[#14244c]" />
                              <div>
                                <p className="text-sm font-medium">
                                  Admission Confirmation Period
                                </p>
                                <p className="text-sm">
                                  {formatDate(
                                    timeline.admission_confirmation_start_date
                                  )}{" "}
                                  -{" "}
                                  {formatDate(
                                    timeline.admission_confirmation_end_date
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          {role === "admin" ? (
                            <Button
                              className="w-full bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(`/admission/edit/${timeline.id}`)
                              }
                            >
                              Manage Timeline
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                className={`w-full ${
                                  new Date(timeline.application_end_date) >
                                  new Date()
                                    ? "bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer font-semibold"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                  if (
                                    new Date(timeline.application_end_date) >
                                    new Date()
                                  ) {
                                    navigate(
                                      `/admission/apply?program=${timeline.program_id}`
                                    );
                                  }
                                }}
                                disabled={
                                  new Date(timeline.application_end_date) <=
                                  new Date()
                                }
                              >
                                {new Date(timeline.application_end_date) >
                                new Date() ? (
                                  <>
                                    Apply Now{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </>
                                ) : (
                                  "Application Closed"
                                )}
                              </Button>
                              {timeline.attachment && (
                                <Button
                                  variant="outline"
                                  className="w-full border-[#14244c] text-[#14244c] hover:bg-[#ecb31d] hover:border-[#ecb31d] hover:text-white transition-colors cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      timeline.attachment?.url,
                                      "_blank"
                                    )
                                  }
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Detailed Schedule
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {role === "admin" && (
        <div className="fixed bottom-6 right-6">
          <Button
            className="bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] shadow-lg transition-colors cursor-pointer"
            onClick={() => navigate("/admission/manage")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Admissions
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
