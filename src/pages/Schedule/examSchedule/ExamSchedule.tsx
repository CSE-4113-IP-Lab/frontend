import React, { useState } from "react";
import { examData } from "./examData";
import SearchBar from "./SearchBar";
import LevelFilter from "./LevelFilter";
import ExamTable from "./ExamTable";
import type { ExamScheduleItem } from "../../../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExamSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  // Filter exams by search term and selected level
  const filteredExams: ExamScheduleItem[] = examData.filter((exam) => {
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
    </div>
  );
};

export default ExamSchedule;
