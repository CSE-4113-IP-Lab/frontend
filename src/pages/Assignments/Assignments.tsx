import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Pencil,
  Trash,
} from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import FilterBar from "../../components/FilterBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Assignments: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<"student" | "faculty" | "">("");
  const navigate = useNavigate();
  const [courseOptions, setCourseOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [courseIds, setCourseIds] = useState<number[]>([]); // For internal filtering logic

  const requirements = [
    "Submit the report in PDF format.",
    "Include at least 3 case studies.",
    "Use APA citation style.",
    "Add diagrams wherever necessary.",
    "Mention all external sources clearly.",
    "Ensure the word count is at least 2000.",
    "Proofread for grammar and spelling.",
    "Attach the raw dataset used.",
    "Provide a summary at the end.",
    "Include relevant charts and tables.",
    "Use 12pt Times New Roman font.",
    "Maintain consistent formatting.",
    "Include a title page with student info.",
    "Submit through the university portal.",
    "Avoid plagiarism at all costs.",
  ];

  // const assignmentstatic = [
  //   {
  //     id: 1,
  //     title: "Machine Learning Project - Sentiment Analysis",
  //     courseCode: "CSE 425",
  //     courseName: "Artificial Intelligence",
  //     instructor: "Dr. Mohammad Rahman",
  //     assignedDate: "2025-01-10",
  //     dueDate: "2025-01-25",
  //     maxMarks: 50,
  //     description:
  //       "Implement a sentiment analysis system using machine learning algorithms. Use any dataset of your choice and compare at least 3 different algorithms.",
  //     requirements: [
  //       "Python implementation",
  //       "Dataset of at least 1000 samples",
  //       "Comparison report",
  //       "Source code with documentation",
  //     ],
  //     status: "pending",
  //     submittedDate: null,
  //     grade: null,
  //     feedback: null,
  //   },
  //   {
  //     id: 2,
  //     title: "Database Design and Implementation",
  //     courseCode: "CSE 1",
  //     courseName: "Database Management Systems",
  //     instructor: "Dr. Fatima Khan",
  //     assignedDate: "2025-01-05",
  //     dueDate: "2025-01-20",
  //     maxMarks: 40,
  //     description:
  //       "Design and implement a complete database system for a library management system including ER diagram, normalization, and SQL queries.",
  //     requirements: [
  //       "ER Diagram",
  //       "Normalized tables",
  //       "SQL DDL and DML scripts",
  //       "Sample data insertion",
  //     ],
  //     status: "submitted",
  //     submittedDate: "2025-01-18",
  //     grade: 35,
  //     feedback:
  //       "Good work on normalization. ER diagram could be more detailed.",
  //   },
  //   {
  //     id: 3,
  //     title: "Algorithm Analysis Report",
  //     courseCode: "CSE 201",
  //     courseName: "Data Structures and Algorithms",
  //     instructor: "Dr. Ahmed Hassan",
  //     assignedDate: "2024-12-15",
  //     dueDate: "2025-01-15",
  //     maxMarks: 30,
  //     description:
  //       "Analyze the time and space complexity of various sorting algorithms and provide empirical analysis with performance graphs.",
  //     requirements: [
  //       "Theoretical analysis",
  //       "Implementation in C/C++",
  //       "Performance graphs",
  //       "Written report",
  //     ],
  //     status: "graded",
  //     submittedDate: "2025-01-14",
  //     grade: 28,
  //     feedback:
  //       "Excellent analysis and clear presentation. Minor issues with bubble sort implementation.",
  //   },
  //   {
  //     id: 4,
  //     title: "Web Application Development",
  //     courseCode: "CSE 401",
  //     courseName: "Software Engineering",
  //     instructor: "Dr. Sarah Ahmed",
  //     assignedDate: "2025-01-12",
  //     dueDate: "2025-02-05",
  //     maxMarks: 60,
  //     description:
  //       "Develop a complete web application following software engineering principles including requirements analysis, design, implementation, and testing.",
  //     requirements: [
  //       "Requirements document",
  //       "System design",
  //       "Working application",
  //       "Test cases and results",
  //     ],
  //     status: "pending",
  //     submittedDate: null,
  //     grade: null,
  //     feedback: null,
  //   },
  //   {
  //     id: 5,
  //     title: "Programming Fundamentals - Final Project",
  //     courseCode: "CSE 101",
  //     courseName: "Introduction to Programming",
  //     instructor: "Mr. Karim Abdullah",
  //     assignedDate: "2024-12-20",
  //     dueDate: "2025-01-10",
  //     maxMarks: 25,
  //     description:
  //       "Create a console-based application in C that demonstrates understanding of all programming concepts covered in the course.",
  //     requirements: [
  //       "C source code",
  //       "User manual",
  //       "Test cases",
  //       "Presentation",
  //     ],
  //     status: "overdue",
  //     submittedDate: null,
  //     grade: null,
  //     feedback: null,
  //   },
  // ];

  const getRandomRequirements = (requirements: string[]) => {
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const shuffled = [...requirements].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("id");

    if (userRole === "faculty") {
      setViewMode("faculty");
    } else {
      setViewMode("student");
    }

    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/courses`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        console.log("Fetched courses:", res.data);

        let filteredCourses = res.data;

        if (userRole === "faculty") {
          filteredCourses = res.data.filter(
            (course: any) =>
              course.teacher_id?.toString() === userId?.toString()
          );
        } else {
          const resSt = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/students/courses`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          filteredCourses = resSt.data;
        }

        // Set course ID list for internal use
        setCourseIds(filteredCourses.map((c: any) => c.id));

        // Add 'All Courses' to the top
        const dynamicOptions = filteredCourses.map((course: any) => ({
          label: `${course.name}`,
          value: `${course.id}`,
        }));

        setCourseOptions([
          { label: "All Courses", value: "all" },
          ...dynamicOptions,
        ]);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    const fetchAssignments = async () => {
      if (userRole === "faculty") {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/courseworks`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );

          console.log("Fetched assignments:", res.data);

          const idString = localStorage.getItem("id");
          const currentUserId = idString ? parseInt(idString) : null;

          if (currentUserId !== null) {
            const filteredAssignments = res.data.filter(
              (assignment: any) => assignment.creator.user.id === currentUserId
            );
            console.log("Filtered assignments:", filteredAssignments);

            setAssignments(filteredAssignments);
          } else {
            console.error("User ID not found in localStorage.");
            setAssignments([]); // Or handle appropriately
          }
        } catch (error) {
          console.error("Failed to fetch assignments:", error);
        }
      } else {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/students/courseworks`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );

          console.log("Fetched student assignments:", res.data);

          setAssignments(res.data);
        } catch (error) {
          console.error("Failed to fetch assignments:", error);
        }
      }
    };

    fetchCourses();
    fetchAssignments();
  }, []);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Submitted", value: "submitted" },
    { label: "Graded", value: "graded" },
  ];

  const filteredAssignments = assignments
    .map((assignment) => {
      let status = "pending";

      if (assignment.submission) {
        status =
          assignment.submission.obtained_marks === null ||
          assignment.submission.obtained_marks === 0
            ? "submitted"
            : "graded";
      }

      return {
        ...assignment,
        status,
      };
    })
    .filter((assignment) => {
      const matchesStatus =
        statusFilter === "all" || assignment.status === statusFilter;

      const matchesCourse =
        courseFilter === "all" || assignment.course_id == courseFilter;

      return matchesStatus && matchesCourse;
    });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      graded: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: AlertCircle,
      submitted: CheckCircle,
      graded: CheckCircle,
      overdue: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || AlertCircle;
    return <Icon className="w-4 h-4" />;
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileUpload = async (assignmentId: any) => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/coursework-submissions`,
      { coursework_id: assignmentId, student_id: localStorage.getItem("id") },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (response.status === 201) {
      const submissionId = response.data.id;

      selectedFiles.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file); // backend must accept array under "files"

        try {
          const res = await axios.post(
            `${
              import.meta.env.VITE_SERVER_URL
            }/coursework-submissions/${submissionId}/attachments`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          console.log("Upload success:", res.data);
        } catch (err) {
          console.error("Upload failed:", err);
        }
      });
    }
  };

  return (
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          ASSIGNMENTS
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Manage course assignments, track submission deadlines, and monitor
          progress. Students can submit assignments and view feedback, while
          faculty can create and grade assignments.
        </p>
      </div>

      {/* Faculty Tools */}
      {viewMode === "faculty" && (
        <Card cornerStyle="tl" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-2">
                FACULTY TOOLS
              </h2>
              <p className="text-text-secondary">
                Create new assignments and manage existing ones.
              </p>
            </div>
            <Button
              cornerStyle="br"
              onClick={() => navigate("/assignmentsCreate")}
            >
              <Plus className="inline w-4 h-4 mr-2" />
              CREATE ASSIGNMENT
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {viewMode == "student" && (
          <FilterBar
            title="Filter by Status"
            options={statusOptions}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        )}
        <FilterBar
          title="Filter by Course"
          options={courseOptions}
          activeFilter={courseFilter}
          onFilterChange={setCourseFilter}
        />
      </div>

      {/* Assignment Cards */}
      <div className="space-y-6">
        {filteredAssignments.map((assignment) => {
          const daysRemaining = getDaysRemaining(assignment.due_date);
          const isOverdue = daysRemaining < 0;
          const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0;
          const randomRequirements = getRandomRequirements(requirements);

          return (
            <Card
              key={assignment.id}
              cornerStyle="tl"
              className={`hover:shadow-lg transition-shadow duration-200 ${
                isOverdue
                  ? "border-l-4 border-red-500"
                  : isDueSoon
                  ? "border-l-4 border-yellow-500"
                  : ""
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assignment Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-dark mb-2">
                        {assignment.title}
                      </h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm text-text-secondary">
                          CSE - {assignment.course.course_code} :{""}
                          {assignment.course.name}
                        </span>
                        <span className="text-sm text-text-secondary">
                          Instructor: {assignment.creator.user.username}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        {viewMode == "student" && (
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-tr text-xs font-bold ${getStatusColor(
                              assignment.status
                            )}`}
                          >
                            {getStatusIcon(assignment.status)}
                            <span>{assignment.status}</span>
                          </div>
                        )}
                        <span className="text-xs bg-secondary-gray text-primary-dark px-2 py-1 rounded-tl font-bold">
                          {assignment.marks} MARKS
                        </span>
                        {assignment.status === "graded" &&
                          viewMode == "student" && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-bl font-bold">
                              GRADE: {assignment.grade}/{assignment.maxMarks}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                      REQUIREMENTS
                    </h4>
                    <ul className="space-y-1">
                      {randomRequirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-text-secondary">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {viewMode == "student" && assignment.status === "graded" && (
                    <div className="bg-blue-50 p-4 rounded-tl">
                      <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                        INSTRUCTOR FEEDBACK
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {assignment.submission?.feedback == null ||
                        assignment.submission?.feedback === ""
                          ? "No feedback provided yet."
                          : assignment.submission?.feedback}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dates and Actions */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm uppercase text-primary-dark mb-3">
                      IMPORTANT DATES
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary-yellow" />
                        <div>
                          <p className="text-xs text-text-secondary">
                            Assigned
                          </p>
                          <p className="text-sm font-bold text-primary-dark">
                            {new Date(
                              assignment.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary-yellow" />
                        <div>
                          <p className="text-xs text-text-secondary">
                            Due Date
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              isOverdue ? "text-red-600" : "text-primary-dark"
                            }`}
                          >
                            {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                          {isOverdue ? (
                            <p className="text-xs text-red-600">
                              Overdue by {Math.abs(daysRemaining)} days
                            </p>
                          ) : daysRemaining === 0 ? (
                            <p className="text-xs text-red-600">Due today!</p>
                          ) : (
                            <p
                              className={`text-xs ${
                                isDueSoon
                                  ? "text-yellow-600"
                                  : "text-text-secondary"
                              }`}
                            >
                              {daysRemaining} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                      {assignment.submission?.submission_date &&
                        viewMode == "student" && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-xs text-text-secondary">
                                Submitted
                              </p>
                              <p className="text-sm font-bold text-green-600">
                                {new Date(
                                  assignment.submission?.submission_date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {assignment.status === "pending" &&
                      viewMode == "student" && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-primary-dark mb-2">
                              UPLOAD SUBMISSION
                            </label>
                            <input
                              type="file"
                              multiple
                              onChange={(e) =>
                                setSelectedFiles(
                                  Array.from(e.target.files || [])
                                )
                              }
                              className="w-full text-xs border border-gray-300 rounded-tl p-2"
                              accept=".pdf,.doc,.docx,.zip,.rar"
                            />
                          </div>
                          <Button
                            size="sm"
                            cornerStyle="br"
                            className="w-full"
                            onClick={() => handleFileUpload(assignment.id)}
                            disabled={!selectedFiles}
                          >
                            <Upload className="inline w-3 h-3 mr-1" />
                            SUBMIT ASSIGNMENT
                          </Button>
                        </>
                      )}

                    <Link to={`/assignmentDetails/${assignment.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        cornerStyle="bl"
                        className="w-full mt-2"
                      >
                        <FileText className="inline w-3 h-3 mr-1" />
                        VIEW DETAILS
                      </Button>
                    </Link>
                    {viewMode === "faculty" && (
                      <Link to={`/assignmentSubmissions/${assignment.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          cornerStyle="bl"
                          className="w-full mt-2"
                        >
                          VIEW ALL SUBMISSIONS
                        </Button>
                      </Link>
                    )}
                    {viewMode === "faculty" && (
                      <div className="flex justify-between mt-2">
                        <Link to={`/assignmentsEdit/${assignment.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            cornerStyle="bl"
                            className="w-full px-12"
                          >
                            <Pencil className="inline w-3 h-3 mr-1 mb-[2px]" />
                            EDIT
                          </Button>
                        </Link>
                        <Link to={`/assignments`}>
                          <Button
                            size="sm"
                            variant="outline"
                            cornerStyle="bl"
                            className="w-full px-12"
                            onClick={async () => {
                              try {
                                // Perform the delete request
                                await axios.delete(
                                  `${
                                    import.meta.env.VITE_SERVER_URL
                                  }/courseworks/${assignment.id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "token"
                                      )}`,
                                      "Content-Type": "application/json",
                                      "ngrok-skip-browser-warning": "true",
                                    },
                                  }
                                );

                                // If successful, update state
                                setAssignments((prev) =>
                                  prev.filter((a) => a.id !== assignment.id)
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to delete assignment:",
                                  error
                                );
                                // Optional: Show error notification to user
                              }
                            }}
                          >
                            <Trash className="inline w-3 h-3 mr-1 mb-[2px]" />
                            DELETE
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary text-lg mb-4">
            No assignments match your filter criteria.
          </p>
          <Button
            onClick={() => {
              setStatusFilter("all");
              setCourseFilter("all");
            }}
          >
            CLEAR FILTERS
          </Button>
        </div>
      )}
    </div>
  );
};

export default Assignments;
