import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button";
import { FileText, File, FileCode, UserCircle } from "lucide-react";

interface Attachment {
  id: number;
  url: string;
}

interface Submission {
  id: number;
  submission_date: string;
  obtained_marks: number | null;
  feedback: string | null;
  student: {
    id: number;
    user: {
      username: string;
      email: string;
      image: { url: string } | null;
    };
  };
  attachments: Attachment[];
}

const AssignmentSubmissions: React.FC = () => {
  const { id } = useParams(); // coursework ID
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [grades, setGrades] = useState<{ [id: number]: string }>({});
  const [feedbacks, setFeedbacks] = useState<{ [id: number]: string }>({});
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/coursework-submissions/coursework/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setSubmissions(response.data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setSubmissions([]);
      }
    };

    if (id) fetchSubmissions();
  }, [id]);

  const extractFilename = (url: string): string => {
    const parts = url.split("coursework_submissions/")[1];
    const underscoreIndex = parts.indexOf("_");
    return parts.substring(underscoreIndex + 1); // Get filename after the first underscore
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split(".").pop();
    if (ext === "pdf") return "pdf";
    if (ext === "txt") return "txt";
    return "other";
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

  const handleGradeChange = (submissionId: number, grade: string) => {
    setGrades((prev) => ({ ...prev, [submissionId]: grade }));
  };

  const handleFeedbackChange = (submissionId: number, feedback: string) => {
    setFeedbacks((prev) => ({ ...prev, [submissionId]: feedback }));
  };

  const handleGradeSubmit = async (
    submissionId: number,
    submissionDate: string
  ) => {
    const marks = Number(grades[submissionId]);
    const feedback = feedbacks[submissionId] || "";

    try {
      await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/coursework-submissions/${submissionId}`,
        {
          submission_date: submissionDate,
          status: "graded",
          obtained_marks: marks,
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log(`Grade updated successfully for submission ${submissionId}`);
      setEditMode((prev) => ({ ...prev, [submissionId]: false }));

      // ✅ Add this
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                obtained_marks: marks,
                feedback: feedback,
                status: "graded",
              }
            : s
        )
      );
    } catch (error) {
      console.error("Failed to update grade:", error);
    }
  };

  const downloadFile = async (url: string) => {
    const fullUrl = `${import.meta.env.VITE_SERVER_URL}/${url}`;
    const filename = extractFilename(url);

    try {
      const response = await axios.get(fullUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("File download failed:", err);
    }
  };

  return (
    <div className="px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          STUDENT SUBMISSIONS
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Review and evaluate student submissions for the selected assignment.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary text-lg">
            No submissions available for this assignment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((submission) => {
            const studentId = submission.student.id;
            const username = submission.student.user.username;
            const profileImage = submission.student.user.image?.url ?? null;

            const marks = submission.obtained_marks;
            const fb = submission.feedback;

            return (
              <div key={submission.id}>
                <div className="flex items-center space-x-4 mb-4">
                  {profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${profileImage}`}
                      alt={username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <p className="font-bold text-primary-dark text-lg">
                      {username}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Student ID: {studentId}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                    Submitted Files
                  </h4>
                  <ul className="space-y-2">
                    {submission.attachments.map((file, index) => {
                      const name = extractFilename(file.url);
                      const type = getFileType(name);
                      return (
                        <li
                          key={index}
                          className="flex items-center space-x-2 cursor-pointer hover:underline"
                          onClick={() => downloadFile(file.url)}
                        >
                          {getFileIcon(type)}
                          <span className="text-sm text-text-secondary">
                            {name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                    Grade Submission
                  </h4>

                  {marks !== null && marks !== 0 && !editMode[submission.id] ? (
                    <div className="flex items-center flex-wrap gap-2 text-green-600 text-sm font-medium">
                      <span>Graded: {marks} marks</span>
                      {fb && (
                        <span className="text-gray-500 italic">({fb})</span>
                      )}
                      <button
                        onClick={() => {
                          setEditMode((prev) => ({
                            ...prev,
                            [submission.id]: true,
                          }));
                          setGrades((prev) => ({
                            ...prev,
                            [submission.id]: marks?.toString() ?? "",
                          }));
                          setFeedbacks((prev) => ({
                            ...prev,
                            [submission.id]: fb ?? "",
                          }));
                        }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Grade"
                      >
                        ✏️
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="border border-gray-300 rounded px-3 py-1 text-sm w-24"
                          placeholder="Marks"
                          value={
                            grades[submission.id] ?? marks?.toString() ?? ""
                          }
                          onChange={(e) =>
                            handleGradeChange(submission.id, e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-3 py-1 text-sm w-full md:w-64"
                          placeholder="Feedback"
                          value={feedbacks[submission.id] ?? fb ?? ""}
                          onChange={(e) =>
                            handleFeedbackChange(submission.id, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleGradeSubmit(
                            submission.id,
                            submission.submission_date
                          )
                        }
                        disabled={!grades[submission.id]}
                        className="mt-2 text-sm font-bold"
                      >
                        {marks ? "Update" : "Submit"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
