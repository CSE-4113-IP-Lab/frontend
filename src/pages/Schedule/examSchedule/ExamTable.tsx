
import type { ExamScheduleItem } from '../../../types'; 



type ExamTableProps = {
  exams: ExamScheduleItem[];
  onDownload: (exams: ExamScheduleItem[]) => void;
};

const ExamTable: React.FC<ExamTableProps> = ({ exams, onDownload }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

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
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, idx) => (
              <tr key={exam.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-sm text-gray-800 border-b">{exam.courseName}</td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">{formatDate(exam.examDate)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">{exam.examTime}</td>
                <td className="px-6 py-4 text-sm text-gray-600 border-b">{exam.roomNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t text-right">
        <button
          onClick={() => onDownload(exams)}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default ExamTable;
