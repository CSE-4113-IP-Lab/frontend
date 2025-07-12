import React, { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { FileText, File, FileCode, UserCircle } from "lucide-react";

const dummySubmissions = [
  {
    studentId: "S2021001",
    name: "Nirjhar Singha",
    profileImage: null,
    files: [
      { name: "report.pdf", type: "pdf" },
      { name: "code.txt", type: "txt" },
      { name: "presentation.zip", type: "other" },
    ],
  },
  {
    studentId: "S2021002",
    name: "Fahim Shakil",
    profileImage: null,
    files: [
      { name: "analysis.pdf", type: "pdf" },
      { name: "notes.txt", type: "txt" },
    ],
  },
  {
    studentId: "S2021003",
    name: "Tanisha Karim",
    profileImage: null,
    files: [
      { name: "documentation.pdf", type: "pdf" },
      { name: "output.txt", type: "txt" },
    ],
  },
  {
    studentId: "S2021004",
    name: "Mehedi Hasan",
    profileImage: null,
    files: [
      { name: "project_code.zip", type: "other" },
      { name: "readme.txt", type: "txt" },
    ],
  },
];

const AssignmentSubmissions: React.FC = () => {
  const [grades, setGrades] = useState<{ [id: string]: string }>({});

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: grade }));
  };

  const handleGradeSubmit = (studentId: string) => {
    console.log(`Grade submitted for ${studentId}: ${grades[studentId]}`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500 mt-0.5" />;
      case "txt":
        return <FileCode className="w-4 h-4 text-blue-500 mt-0.5" />;
      default:
        return <File className="w-4 h-4 text-gray-500 mt-0.5" />;
    }
  };

  return (
    <div className="px-5 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          STUDENT SUBMISSIONS
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Review and evaluate student submissions for the selected assignment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummySubmissions.map((student) => (
          <Card key={student.studentId} cornerStyle="tl">
            <div className="flex items-center space-x-4 mb-4">
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={`${student.name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <p className="font-bold text-primary-dark text-lg">
                  {student.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {student.studentId}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                Submitted Files
              </h4>
              <ul className="space-y-2">
                {student.files.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-text-secondary">
                      {file.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                Grade Submission
              </h4>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="border border-gray-300 rounded-tl px-3 py-1 text-sm w-24"
                  placeholder="Marks"
                  value={grades[student.studentId] || ""}
                  onChange={(e) =>
                    handleGradeChange(student.studentId, e.target.value)
                  }
                />
                <Button
                  size="sm"
                  onClick={() => handleGradeSubmit(student.studentId)}
                  disabled={!grades[student.studentId]}
                >
                  Submit Grade
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {dummySubmissions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary text-lg">
            No submissions available for this assignment.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
