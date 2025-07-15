import React from "react";
import type { ExamScheduleItem } from "../../../types";
import { Pencil, Trash2 } from "lucide-react";

type ExamTableProps = {
  exams: ExamScheduleItem[];
  onDownload: (exams: ExamScheduleItem[]) => void;
  userRole?: string | null;
  onEdit?: (examId: number) => void;
  onDelete?: (examId: number) => void;
};

const ExamTable: React.FC<ExamTableProps> = ({
  exams,
  onDownload,
  userRole,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const showActions = userRole === "admin" && (onEdit || onDelete);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Course Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Exam Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Exam Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                Room No.
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, idx) => (
              <tr
                key={exam.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm text-gray-800 border-b">
                  {exam.courseName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">
                  {formatDate(exam.examDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">
                  {exam.examTime}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">
                  {exam.roomNo}
                </td>
                {showActions && (
                  <td className="px-6 py-4 text-sm text-gray-600 border-b">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(exam.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                          title="Edit">
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(exam.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t text-right">
        <button
          onClick={() => onDownload(exams)}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors">
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ExamTable;
