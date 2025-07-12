import React, { useState, useEffect } from "react";
import { examData } from "./examData";
import SearchBar from "./SearchBar";
import LevelFilter from "./LevelFilter";
import ExamTable from "./ExamTable";
import type { ExamScheduleItem } from "../../../types";
import { examScheduleService } from "../../../services/examScheduleService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExamSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [examSchedules, setExamSchedules] = useState<ExamScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  // Load exam schedules from API with fallback to mock data
  useEffect(() => {
    const loadExamSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const schedules = await examScheduleService.getPublicExamSchedules();
        setExamSchedules(schedules);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Failed to load exam schedules from API, using fallback data:", err);
        setExamSchedules(examData);
        setUsingFallback(true);
        setError("Could not connect to server. Showing cached data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadExamSchedules();
  }, []);

  // Filter exams by search term and selected level
  const filteredExams: ExamScheduleItem[] = examSchedules.filter((exam) => {
    const matchesSearch = exam.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || exam.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Generate PDF for filtered exam schedule
  const handleDownloadPDF = (exams: ExamScheduleItem[]) => {
    if (exams.length === 0) {
      alert("No exam data to export.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor("#1e3a8a"); // Tailwind blue-900
    doc.text("Exam Schedule", 14, 22);

    const tableColumn = ["Course Name", "Exam Date", "Exam Time", "Room No."];
    const tableRows = exams.map((exam) => [
      exam.courseName,
      new Date(exam.examDate).toLocaleDateString("en-US"),
      exam.examTime,
      exam.roomNo,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 11, cellPadding: 6, halign: "left" },
      headStyles: { fillColor: [30, 58, 138] }, // Tailwind blue-900
      margin: { left: 14, right: 14 },
      theme: "striped",
    });

    doc.save("exam_schedule.pdf");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-b-4 border-blue-900 pb-3 select-none">
        Exam Schedules
      </h1>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <span className="ml-3 text-gray-600">Loading exam schedules...</span>
        </div>
      )}

      {/* Error/Fallback Notice */}
      {usingFallback && error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-800 text-sm">
              {error} The schedule below may not be current.
            </p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
            <SearchBar
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              className="flex-grow md:max-w-md"
              inputClassName="shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-lg transition duration-200"
              placeholder="Search courses..."
            />

            <LevelFilter
              selectedLevel={selectedLevel}
              onChange={setSelectedLevel}
              className="mt-4 md:mt-0"
              buttonClassName="px-5 py-2 rounded-lg text-sm font-semibold transition duration-200"
              activeClassName="bg-blue-900 text-white shadow-lg hover:bg-blue-800"
              inactiveClassName="bg-gray-200 text-gray-700 hover:bg-gray-300"
              levels={["All", "Undergraduate", "Masters"]}
            />
          </div>

          <ExamTable exams={filteredExams} onDownload={handleDownloadPDF} />

          {/* Data Source Indicator */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {usingFallback ? (
              <p>⚠️ Showing cached data • Last updated: Demo data</p>
            ) : (
              <p>✅ Live data • Updated automatically</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamSchedule;
