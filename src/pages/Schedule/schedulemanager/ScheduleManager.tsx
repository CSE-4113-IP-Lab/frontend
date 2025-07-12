import React, { useState } from "react";
import ExamScheduleManager from "./ExamScheduleManager";
import ClassScheduleManager from "./ClassScheduleManager";

const ScheduleManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"class" | "exam">("class");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Schedules</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "class" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("class")}
        >
          Class Schedule
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === "exam" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("exam")}
        >
          Exam Schedule
        </button>
      </div>

      {activeTab === "class" ? <ClassScheduleManager /> : <ExamScheduleManager />}
    </div>
  );
};

export default ScheduleManager;
