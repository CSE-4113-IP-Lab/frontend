import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  BookOpen,
} from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";

// Static arrays
const OBJECTIVES = [
  "Understand the fundamental concepts",
  "Apply theoretical knowledge in real-world scenarios",
  "Develop problem-solving skills",
  "Analyze and interpret data effectively",
  "Implement algorithms efficiently",
  "Collaborate in a team environment",
  "Communicate technical ideas clearly",
  "Use version control systems like Git",
  "Optimize code performance",
  "Ensure code readability and documentation",
  "Learn software development lifecycle",
  "Understand system design basics",
  "Test and debug programs rigorously",
  "Follow best coding practices",
  "Explore emerging technologies",
];

const DELIVERABLES = [
  "Source code files",
  "Project report",
  "Presentation slides",
  "Live demo link",
  "Design diagrams",
  "Test cases and results",
  "Installation manual",
  "User guide",
  "Deployment script",
  "Readme file",
  "Database schema",
  "API documentation",
  "Code review summary",
  "Progress log",
  "Final evaluation form",
];

const getRandomItems = (list: string[]) => {
  const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
  return [...list].sort(() => 0.5 - Math.random()).slice(0, count);
};

const generateRandomModules = (total: number) => {
  const moduleCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 modules
  const parts = Array(moduleCount).fill(0);
  let remaining = total;

  for (let i = 0; i < moduleCount - 1; i++) {
    const val = Math.floor(Math.random() * (remaining / 2)) + 1;
    parts[i] = val;
    remaining -= val;
  }
  parts[moduleCount - 1] = remaining;

  return parts.map((value, index) => ({
    label: `Module ${index + 1}`,
    marks: value,
  }));
};

const AssignmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<string[]>([""]);

  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/courseworks/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = response.data;

        if (data.requirements) {
          const parsedReqs = data.requirements.split("_-_-_-_");
          setRequirements(parsedReqs.length ? parsedReqs : [""]);
        } else {
          setRequirements([""]);
        }

        const enhancedAssignment = {
          title: data.title,
          description: data.description,
          assignedDate: data.created_at,
          dueDate: data.due_date,
          maxMarks: data.marks,
          courseName: `CSE ${data.course_id}`,
          instructor: data.creator?.user?.username || "Unknown Instructor",
          instructorEmail: data.creator?.user?.email || "unknown@example.com",
          rubric: generateRandomModules(data.marks),
          objectives: getRandomItems(OBJECTIVES),
          deliverables: getRandomItems(DELIVERABLES),
        };

        setAssignment(enhancedAssignment);
        setError(null);
      } catch (err: any) {
        setError("Failed to load assignment.");
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const emailRef = useRef<HTMLAnchorElement>(null);

  if (loading) {
    return (
      <div className="px-5 py-12 text-center text-gray-600">Loading...</div>
    );
  }

  if (!assignment || error) {
    return (
      <div className="px-5 py-12">
        <Card cornerStyle="tl" className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark mb-4">
            Assignment Not Found
          </h1>
          <p className="text-text-secondary mb-6">
            {error || "The assignment you're looking for doesn't exist."}
          </p>
          <Button onClick={() => navigate("/assignments")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-5 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate("/assignments")}>
          ← Back to Assignments
        </Button>
      </div>

      {/* Assignment Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {assignment.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              <span className="mr-4">
                <BookOpen className="inline w-4 h-4 mr-1" />
                {assignment.courseName}
              </span>
              <span>
                <User className="inline w-4 h-4 mr-1" />
                {assignment.instructor}
              </span>
            </p>
            <p className="text-gray-700 mt-6">{assignment.description}</p>
          </div>

          {/* Objectives */}
          {requirements.length > 0 && requirements[0] !== "" && (
            <div className="bg-white p-x-2 py-5 rounded">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {requirements.map((obj: string, i: number) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Dates */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-md font-semibold text-gray-700">
              Important Dates
            </h3>
            <p className="flex items-center text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-yellow-500 mr-2" />
              Assigned: {formatDate(assignment.assignedDate)}
            </p>
            <p className="flex items-center text-sm text-gray-700">
              <Clock className="w-4 h-4 text-red-500 mr-2" />
              Due Date: {formatDate(assignment.dueDate)}
            </p>
          </div>

          {/* Grading Breakdown */}
          <div className="bg-white p-4 rounded shadow space-y-3">
            <p className="flex justify-between text-sm font-bold text-gray-800">
              <span>Total Marks : {assignment.maxMarks}</span>
            </p>
          </div>

          {/* Contact Instructor */}
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h3 className="text-md font-semibold text-gray-700">Need Help?</h3>
            <p className="text-sm text-gray-700">
              Instructor: <br />
              <span className="font-medium">{assignment.instructor}</span>
            </p>
            <p className="text-sm text-gray-700">
              Email: <br />
              <a
                href={`mailto:${assignment.instructorEmail}`}
                className="text-blue-600 underline"
                ref={emailRef}
              >
                {assignment.instructorEmail}
              </a>
            </p>
            <Button
              className="mt-2 w-full"
              size="sm"
              onClick={() => emailRef.current?.click()}
            >
              Contact Instructor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails;
