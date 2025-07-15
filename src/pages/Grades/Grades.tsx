import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Eye,
} from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import FilterBar from "../../components/FilterBar";
import LineChart from "@/components/LineChart";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Grades: React.FC = () => {
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"student" | "faculty" | "">("");
  const [stGrades, setStGrades] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredStGrades, setFilteredStGrades] = useState<any[]>([]);
  const [filtededCourses, setFilteredCourses] = useState<any[]>([]);
  const [marksByCourse, setMarksByCourse] = useState<Record<string, any[]>>({});
  const [courseCompleted, setCourseCompleted] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalCGPA, setTotalCGPA] = useState<number[]>([]);
  const [cgpa, setCgpa] = useState("");

  const generateTranscriptData = () => {
    const fields = ["incourse", "final", "other"];

    return filtededCourses.map((course) => {
      const courseId = course.id.toString();
      const courseMarks = marksByCourse[courseId] || [];

      // Build marks lookup
      const marks: Record<string, { value: number; max: number }> = {};
      courseMarks.forEach((entry: any) => {
        marks[entry.type] = {
          value: entry.marks_obtained,
          max: entry.total_marks,
        };
      });

      // Calculate total obtained (denominator is always 100)
      let totalObtained = 0;
      fields.forEach((field) => {
        totalObtained += marks[field]?.value ?? 0;
      });

      const percentage = (totalObtained / 100) * 100;

      // GPA & Grade
      let gpa = 0;
      let letter = "_";
      if (percentage >= 80) {
        gpa = 4.0;
        letter = "A+";
      } else if (percentage >= 75) {
        gpa = 3.75;
        letter = "A";
      } else if (percentage >= 70) {
        gpa = 3.5;
        letter = "A-";
      } else if (percentage >= 65) {
        gpa = 3.25;
        letter = "B+";
      } else if (percentage >= 60) {
        gpa = 3.0;
        letter = "B";
      } else if (percentage >= 55) {
        gpa = 2.75;
        letter = "B-";
      } else if (percentage >= 50) {
        gpa = 2.5;
        letter = "C+";
      } else if (percentage >= 45) {
        gpa = 2.25;
        letter = "C";
      } else if (percentage >= 40) {
        gpa = 2.0;
        letter = "D";
      } else {
        gpa = 0;
        letter = "F";
      }

      return {
        course_code: course.course_code,
        name: course.name,
        credits: course.credits,
        marks: marks, // { incourse, final, other } (some might be missing)
        totalObtained,
        letter,
        gpa,
      };
    });
  };

  const generateTranscriptPDF = ({
    name,
    regNumber,
    semester,
    courseData,
  }: {
    name: string;
    regNumber: string;
    semester: string | number;
    courseData: any[]; // This is your filteredCourses.map output combined with marks
  }) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Department of Computer Science & Engineering", 105, 20, {
      align: "center",
    });
    doc.text("University of Dhaka", 105, 28, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Student Name : ${name}      Registration Number : ${regNumber}`,
      14,
      38
    );
    doc.text(`Semester - ${semester} Results`, 14, 46);

    // Table Header & Body
    const headers = [
      [
        "COURSE",
        "CREDITS",
        "MIDTERM",
        "FINAL",
        "OTHER",
        "TOTAL",
        "GRADE",
        "GPA",
      ],
    ];

    const body = courseData.map((course) => [
      `CSE - ${course.course_code}\n${course.name}`,
      course.credits,
      course.marks?.incourse
        ? `${course.marks.incourse.value}/${course.marks.incourse.max}`
        : "_",
      course.marks?.final
        ? `${course.marks.final.value}/${course.marks.final.max}`
        : "_",
      course.marks?.other
        ? `${course.marks.other.value}/${course.marks.other.max}`
        : "_",
      `${course.totalObtained}/100`,
      course.letter,
      course.gpa?.toFixed(2),
    ]);

    // AutoTable
    autoTable(doc, {
      startY: 54,
      head: headers,
      body: body,
      styles: {
        halign: "center",
        fontSize: 10,
        textColor: 20,
      },
      headStyles: {
        fillColor: [200, 200, 200], // light gray
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`Transcript_Semester_${semester}_${name}.pdf`);
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("id");

    if (userRole === "faculty") {
      setViewMode("faculty");
    } else {
      setViewMode("student");
    }

    const fetchCourses = async () => {
      let filterCourses, grades;
      try {
        if (userRole === "faculty") {
          const res = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/courses`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );

          console.log("Fetched courses:", res.data);

          filterCourses = res.data;

          filterCourses = res.data.filter(
            (course: any) =>
              course.teacher_id?.toString() === userId?.toString()
          );
        } else {
          const resSt = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/students/courses`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          filterCourses = resSt.data;
        }

        // Set course ID list for internal use
        console.log(filterCourses);
        setCourses(filterCourses);
        setFilteredCourses(filterCourses);

        if (userRole === "faculty") {
        } else {
          const gradeResSt = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/marks/student/${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true",
              },
            }
          );
          grades = gradeResSt.data;
          setStGrades(grades);
          setFilteredStGrades(grades);
        }

        const marksByCourse: Record<string, any[]> = {};

        for (const course of filterCourses) {
          const courseId = course.id.toString();
          marksByCourse[courseId] = grades.filter(
            (mark: any) => mark.course_id?.toString() === courseId
          );
        }

        console.log("Marks grouped by course_id:", marksByCourse);
        setMarksByCourse(marksByCourse);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (viewMode === "student") {
      const filtered = stGrades.filter((grade) => {
        if (semesterFilter == "all") return true;
        return grade.semester == semesterFilter;
      });
      setFilteredStGrades(filtered);
      const filteredCourses = courses.filter((course) => {
        if (semesterFilter == "all") return true;
        return course.semester == semesterFilter;
      });
      setFilteredCourses(filteredCourses);

      const totalCourseCount = filteredCourses.length;

      const totalCredits = filteredCourses.reduce(
        (sum, course) => sum + course.credits,
        0
      );

      console.log("Course Count:", totalCourseCount);
      console.log("Total Credits:", totalCredits);

      setCourseCompleted(totalCourseCount);
      setTotalCredits(totalCredits);

      const semesterWiseCGPA = [];

      for (let sem = 1; sem <= 8; sem++) {
        const semCourses = filteredCourses.filter(
          (course) => course.semester === sem
        );
        const marksDict = marksByCourse || {};

        let totalCredits = 0;
        let weightedGPASum = 0;

        semCourses.forEach((course) => {
          const courseId = course.id.toString();
          const marksList = marksDict[courseId] || [];

          // Build marks map
          const marks: Record<string, { value: number; max: number }> = {};
          marksList.forEach((entry: any) => {
            marks[entry.type] = {
              value: entry.marks_obtained,
              max: entry.total_marks,
            };
          });

          const fields = ["incourse", "final", "other"];
          let totalObtained = 0;

          fields.forEach((field) => {
            totalObtained += marks[field]?.value ?? 0;
          });

          const percentage = totalObtained; // since denominator is always 100

          // GPA logic
          let gpa = 0;
          if (percentage >= 80) gpa = 4.0;
          else if (percentage >= 75) gpa = 3.75;
          else if (percentage >= 70) gpa = 3.5;
          else if (percentage >= 65) gpa = 3.25;
          else if (percentage >= 60) gpa = 3.0;
          else if (percentage >= 55) gpa = 2.75;
          else if (percentage >= 50) gpa = 2.5;
          else if (percentage >= 45) gpa = 2.25;
          else if (percentage >= 40) gpa = 2.0;
          else gpa = 0;

          totalCredits += course.credits;
          weightedGPASum += gpa * course.credits;
        });

        const semCgpa = totalCredits > 0 ? weightedGPASum / totalCredits : 0;
        semesterWiseCGPA.push(Number(semCgpa.toFixed(2)));
      }

      console.log("CGPA per semester:", semesterWiseCGPA);
      setTotalCGPA(semesterWiseCGPA);
    }

    console.log(semesterFilter, typeof semesterFilter);
  }, [semesterFilter, stGrades, viewMode, courses]);

  useEffect(() => {
    if (!totalCGPA || totalCGPA.length === 0) return;

    if (semesterFilter === "all") {
      const sum = totalCGPA.reduce((acc, val) => acc + val, 0);
      const count = totalCGPA.filter((val) => val > 0).length;
      const overallCGPA = count > 0 ? (sum / count).toFixed(2) : "0.00";
      setCgpa(overallCGPA);
    } else {
      const semIndex = semesterFilter - 1;
      const cgpaValue = totalCGPA[semIndex] ?? 0;
      setCgpa(cgpaValue.toFixed(2));
    }
  }, [totalCGPA, semesterFilter]);

  const studentGrades = [
    {
      courseCode: "CSE 425",
      courseName: "Artificial Intelligence",
      semester: 7,
      year: "2024-25",
      instructor: "Dr. Mohammad Rahman",
      credits: 3,
      grades: {
        midterm: 22,
        final: 35,
        assignments: 18,
        quizzes: 8,
        attendance: 5,
        total: 88,
        letterGrade: "A",
        gpa: 4.0,
      },
      maxMarks: {
        midterm: 25,
        final: 40,
        assignments: 20,
        quizzes: 10,
        attendance: 5,
        total: 100,
      },
    },
    {
      courseCode: "CSE 301",
      courseName: "Database Management Systems",
      semester: 5,
      year: "2023-24",
      instructor: "Dr. Fatima Khan",
      credits: 3,
      grades: {
        midterm: 20,
        final: 32,
        assignments: 16,
        quizzes: 7,
        attendance: 4,
        total: 79,
        letterGrade: "B+",
        gpa: 3.5,
      },
      maxMarks: {
        midterm: 25,
        final: 40,
        assignments: 20,
        quizzes: 10,
        attendance: 5,
        total: 100,
      },
    },
    {
      courseCode: "CSE 201",
      courseName: "Data Structures and Algorithms",
      semester: 3,
      year: "2022-23",
      instructor: "Dr. Ahmed Hassan",
      credits: 3,
      grades: {
        midterm: 23,
        final: 36,
        assignments: 19,
        quizzes: 9,
        attendance: 5,
        total: 92,
        letterGrade: "A+",
        gpa: 4.0,
      },
      maxMarks: {
        midterm: 25,
        final: 40,
        assignments: 20,
        quizzes: 10,
        attendance: 5,
        total: 100,
      },
    },
    {
      courseCode: "CSE 401",
      courseName: "Software Engineering",
      semester: 8,
      year: "2024-25",
      instructor: "Dr. Sarah Ahmed",
      credits: 3,
      grades: {
        midterm: 21,
        final: 34,
        assignments: 17,
        quizzes: 8,
        attendance: 5,
        total: 85,
        letterGrade: "A-",
        gpa: 3.7,
      },
      maxMarks: {
        midterm: 25,
        final: 40,
        assignments: 20,
        quizzes: 10,
        attendance: 5,
        total: 100,
      },
    },
  ];

  const facultyGradeInput = [
    {
      studentId: "2019-1-60-001",
      studentName: "Ahmed Rahman",
      courseCode: "CSE 425",
      midterm: "",
      final: "",
      assignments: "",
      quizzes: "",
      attendance: "",
    },
    {
      studentId: "2019-1-60-002",
      studentName: "Fatima Khan",
      courseCode: "CSE 425",
      midterm: "22",
      final: "",
      assignments: "18",
      quizzes: "8",
      attendance: "5",
    },
    {
      studentId: "2019-1-60-003",
      studentName: "Mohammad Ali",
      courseCode: "CSE 425",
      midterm: "20",
      final: "35",
      assignments: "16",
      quizzes: "7",
      attendance: "4",
    },
  ];

  const semesterOptions = [
    { label: "All Semesters", value: "all" },
    { label: "8th Semester", value: "8" },
    { label: "7th Semester", value: "7" },
    { label: "6th Semester", value: "6" },
    { label: "5th Semester", value: "5" },
    { label: "4th Semester", value: "4" },
    { label: "3rd Semester", value: "3" },
    { label: "2nd Semester", value: "2" },
    { label: "1st Semester", value: "1" },
  ];

  const allLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const allData = [3.25, 3.4, 3.1, 3.6, 2.9, 3.7, 3.4, 2.8];

  const filteredGrades = studentGrades.filter((grade) => {
    if (semesterFilter == "all") return true;
    return grade.semester == semesterFilter;
  });

  const calculateCGPA = () => {
    const totalCredits = filteredGrades.reduce(
      (sum, grade) => sum + grade.credits,
      0
    );
    const totalGradePoints = filteredGrades.reduce(
      (sum, grade) => sum + grade.grades.gpa * grade.credits,
      0
    );
    return totalCredits > 0
      ? (totalGradePoints / totalCredits).toFixed(2)
      : "0.00";
  };

  const getGradeColor = (letterGrade: string) => {
    const colors = {
      "A+": "bg-green-100 text-green-800",
      A: "bg-green-100 text-green-800",
      "A-": "bg-blue-100 text-blue-800",
      "B+": "bg-blue-100 text-blue-800",
      B: "bg-yellow-100 text-yellow-800",
      "B-": "bg-yellow-100 text-yellow-800",
      "C+": "bg-orange-100 text-orange-800",
      C: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    };
    return (
      colors[letterGrade as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getPercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(1);
  };

  return (
    <div className="px-5 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          GRADES & RESULTS
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          {viewMode === "student"
            ? "View your academic performance, track grades across semesters, and monitor your CGPA progress."
            : "Input and manage student grades for your courses. Track student performance and generate reports."}
        </p>
      </div>

      {viewMode === "student" ? (
        <>
          {/* Student Dashboard */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary-yellow mx-auto mb-3" />
              <h3 className="font-bold text-2xl text-primary-dark mb-1">
                {cgpa}
              </h3>
              <p className="text-text-secondary text-sm">CURRENT CGPA</p>
            </div>

            <div className="text-center">
              <BookOpen className="w-12 h-12 text-primary-yellow mx-auto mb-3" />
              <h3 className="font-bold text-2xl text-primary-dark mb-1">
                {courseCompleted}
              </h3>
              <p className="text-text-secondary text-sm">COURSES COMPLETED</p>
            </div>

            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary-yellow mx-auto mb-3" />
              <h3 className="font-bold text-2xl text-primary-dark mb-1">
                {totalCredits}
              </h3>
              <p className="text-text-secondary text-sm">TOTAL CREDITS</p>
            </div>
          </div>

          {/* Filter */}
          <FilterBar
            title="Filter by Semester"
            options={semesterOptions}
            activeFilter={semesterFilter}
            onFilterChange={setSemesterFilter}
          />

          {/* Grades Table */}
          <Card cornerStyle="tl" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase text-primary-dark">
                ACADEMIC PERFORMANCE
              </h2>
              <Button
                size="sm"
                cornerStyle="br"
                disabled={semesterFilter === "all"}
                onClick={async () => {
                  const userId = localStorage.getItem("id");
                  const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/students/${userId}`,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                        "ngrok-skip-browser-warning": "true",
                      },
                    }
                  );
                  generateTranscriptPDF({
                    name: res.data.user.username,
                    regNumber: res.data.registration_number,
                    semester: semesterFilter,
                    courseData: generateTranscriptData(),
                  });
                }}
              >
                <Download className="inline w-4 h-4 mr-2" />
                DOWNLOAD TRANSCRIPT
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-secondary-gray">
                    <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm text-primary-dark">
                      COURSE
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      CREDITS
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      MIDTERM
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      FINAL
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      ASSIGNMENTS
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      TOTAL
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      GRADE
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                      GPA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtededCourses.map((course) => {
                    const courseId = course.id.toString();
                    const marksList = marksByCourse[courseId] || [];

                    // Build a marks lookup
                    const marks: Record<
                      string,
                      { value: number; max: number }
                    > = {};
                    marksList.forEach((entry: any) => {
                      marks[entry.type] = {
                        value: entry.marks_obtained,
                        max: entry.total_marks,
                      };
                    });

                    const fields = ["incourse", "final", "other"];

                    // Calculate total
                    let totalObtained = 0;
                    let totalMax = 0;

                    fields.forEach((field) => {
                      totalObtained += marks[field]?.value ?? 0;
                      totalMax += marks[field]?.max ?? 0;
                    });

                    const percentage = (totalObtained / 100) * 100; // since totalMax is always 100

                    // GPA & Letter grade logic (you can adjust as needed)
                    let gpa = 0;
                    let letter = "_";
                    if (totalMax > 0) {
                      if (percentage >= 80) {
                        gpa = 4.0;
                        letter = "A+";
                      } else if (percentage >= 75) {
                        gpa = 3.75;
                        letter = "A";
                      } else if (percentage >= 70) {
                        gpa = 3.5;
                        letter = "A-";
                      } else if (percentage >= 65) {
                        gpa = 3.25;
                        letter = "B+";
                      } else if (percentage >= 60) {
                        gpa = 3.0;
                        letter = "B";
                      } else if (percentage >= 55) {
                        gpa = 2.75;
                        letter = "B-";
                      } else if (percentage >= 50) {
                        gpa = 2.5;
                        letter = "C+";
                      } else if (percentage >= 45) {
                        gpa = 2.25;
                        letter = "C";
                      } else if (percentage >= 40) {
                        gpa = 2.0;
                        letter = "D";
                      } else {
                        gpa = 0;
                        letter = "F";
                      }
                    }

                    return (
                      <tr key={courseId} className="hover:bg-gray-50">
                        {/* Course Code and Name */}
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <p className="font-bold text-primary-dark">
                              CSE - {course.course_code}
                            </p>
                            <p className="text-sm text-text-secondary">
                              {course.name}
                            </p>
                          </div>
                        </td>

                        {/* Credit */}
                        <td className="border border-gray-300 px-4 py-3 text-center font-bold text-primary-dark">
                          {course.credits}
                        </td>

                        {/* Incourse / Final / Other marks */}
                        {fields.map((field) => {
                          const mark = marks[field];
                          return (
                            <td
                              key={field}
                              className="border border-gray-300 px-4 py-3 text-center"
                            >
                              {mark ? (
                                <div>
                                  <p className="font-bold text-primary-dark">
                                    {mark.value}/{mark.max}
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    {getPercentage(mark.value, mark.max)}%
                                  </p>
                                </div>
                              ) : (
                                <div className="font-bold text-xl text-gray-400">
                                  _
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Total Marks (Fixed Denominator = 100) */}
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div>
                            <p className="font-bold text-primary-dark">
                              {totalObtained}/100
                            </p>
                            <p className="text-xs text-text-secondary">
                              {((totalObtained / 100) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </td>

                        {/* Letter Grade */}
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-tr text-xs font-bold ${getGradeColor(
                              letter
                            )}`}
                          >
                            {letter}
                          </span>
                        </td>

                        {/* GPA */}
                        <td className="border border-gray-300 px-4 py-3 text-center font-bold text-primary-dark">
                          {gpa.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Performance Chart Placeholder */}
          <Card cornerStyle="tl">
            <h2 className="text-xl font-bold uppercase text-primary-dark mb-6">
              <BarChart3 className="inline w-6 h-6 mr-2" />
              PERFORMANCE TRENDS
            </h2>
            <div className="bg-secondary-gray p-8 rounded-tl text-center">
              <LineChart allLabels={allLabels} allData={totalCGPA} />
              <p className="text-primary-dark font-bold">PERFORMANCE CHART</p>
              <p className="text-text-secondary text-sm mt-2">
                Interactive chart showing GPA trends across semesters would be
                displayed here.
              </p>
            </div>
          </Card>
        </>
      ) : (
        /* Faculty Grade Input Panel */
        <Card cornerStyle="tl">
          <h2 className="text-xl font-bold uppercase text-primary-dark mb-6">
            GRADE INPUT PANEL
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              SELECT COURSE
            </label>
            <select className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent">
              <option>CSE 425 - Artificial Intelligence</option>
              <option>CSE 301 - Database Management Systems</option>
              <option>CSE 201 - Data Structures and Algorithms</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary-gray">
                  <th className="border border-gray-300 px-4 py-3 text-left font-bold text-sm text-primary-dark">
                    STUDENT
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    MIDTERM (25)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    FINAL (40)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    ASSIGNMENTS (20)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    QUIZZES (10)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    ATTENDANCE (5)
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-bold text-sm text-primary-dark">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {facultyGradeInput.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <div>
                        <p className="font-bold text-primary-dark">
                          {student.studentName}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {student.studentId}
                        </p>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={student.midterm}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                        max="25"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={student.final}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                        max="40"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={student.assignments}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                        max="20"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={student.quizzes}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                        max="10"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <input
                        type="number"
                        defaultValue={student.attendance}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        min="0"
                        max="5"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      <Button size="sm" cornerStyle="br">
                        SAVE
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" cornerStyle="bl">
              <Eye className="inline w-4 h-4 mr-2" />
              PREVIEW GRADES
            </Button>
            <Button cornerStyle="br">PUBLISH ALL GRADES</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Grades;
