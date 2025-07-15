import React, { useState } from "react";
import ClassSchedule from "./classSchedule/ClassSchedule";
import ExamSchedule from "./examSchedule/ExamSchedule";
import { Calendar, Clock, BookOpen, FileText } from "lucide-react";

const SchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"class" | "exam">("class");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Department Schedule Dashboard
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Access comprehensive class schedules and exam timetables for all
            programs and batches
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Active Classes
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  24
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Time Slots
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  5
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Courses
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  18
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Upcoming Exams
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  8
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 px-3 sm:px-6">
              <button
                onClick={() => setActiveTab("class")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === "class"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">Class Schedule</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("exam")}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === "exam"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">Exam Schedule</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === "class" ? (
            <div className="w-full">
              <ClassSchedule />
            </div>
          ) : (
            <div className="w-full">
              <ExamSchedule />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
