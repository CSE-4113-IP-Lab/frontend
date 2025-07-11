import React, { useState } from "react";
import ClassSchedule from "./classSchedule/ClassSchedule";
import ExamSchedule from "./examSchedule/ExamSchedule";

const SchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"class" | "exam">("class");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Department Schedule Dashboard</h1>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 mx-2 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "class"
                ? "bg-blue-800 text-white shadow-lg"
                : "bg-white text-blue-800 border border-blue-800 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("class")}
          >
            Class Schedule
          </button>
          <button
            className={`px-6 py-3 mx-2 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "exam"
                ? "bg-blue-800 text-white shadow-lg"
                : "bg-white text-blue-800 border border-blue-800 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("exam")}
          >
            Exam Schedule
          </button>
        </div>

        {/* Conditional Rendering */}
        <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300">
          {activeTab === "class" ? <ClassSchedule /> : <ExamSchedule />}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
