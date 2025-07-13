import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";

import { Contact } from "@/pages/Contact";
import { NoticeBoardPage } from "@/pages/Notice/Notices";
import ArchivedNotices from "@/pages/Notice/ArchivedNotices";
import ArchivedNoticeDetail from "@/pages/Notice/ArchivedNoticeDetail";
import ViewNotice from "@/pages/Notice/ViewNotice";
import CreateNotice from "@/pages/Notice/CreateNotice";
import EditNotice from "@/pages/Notice/EditNotice";
import Auth from "@/pages/Auth/Auth";

import AssignmentCreate from "./pages/Assignments/AssignmentCreate";
import Assignments from "./pages/Assignments/Assignments";
import AssignmentDetails from "./pages/Assignments/AssignmentDetails";
import AssignmentSubmission from "./pages/Assignments/AssignmentSubmission";

import Resources from "@/pages/Resources/Resources";
import EquipmentManagement from "@/pages/Admin/EquipmentManagement";

import ClassSchedule from "./pages/Schedule/classSchedule/ClassSchedule";
import ExamSchedule from "./pages/Schedule/examSchedule/ExamSchedule";
import ArchivedEvents from "./pages/Event/ArchivedEvents";
import EventPage from "./pages/Event/EventPage";
import UpcomingEvents from "./pages/Event/UpcomingEvents";
import EventDetails from "./pages/Event/EventDetails";
import TestComponent from "./pages/Test/TestComponent";
import CourseList from "./pages/Courses/CourseList";
import ProgramOutlines from "./pages/Programs/ProgramOutlines";
import SchedulePage from "./pages/Schedule/schedule";
import ErrorPage from "./ErrorPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCourseManagement from "./pages/Admin/AdminCourseManagement";
import AdminScheduleManagement from "./pages/Admin/AdminScheduleManagement";
import AdminProgramManagement from "./pages/Admin/AdminProgramManagement";
import AdminExamScheduleManagement from "./pages/Admin/AdminExamScheduleManagement";
import ApiTestPage from "./pages/ApiTest";

//import { Notice } from "@/pages/Notice";
import FacultyProfile from "@/pages/FacultyProfile";
import FacultyDirectory from "@/pages/FacultyDirectory";
import EditFaculty from "@/pages/EditFaculty";
import FacultyOverview from "@/pages/FacultyOverview";
import ActiveFacultyList from "@/pages/ActiveFacultyList";
import FacultyOnLeaveList from "@/pages/FacultyOnLeaveList";
import NewFacultyYearwise from "@/pages/NewFacultyYearwise";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />, // Placeholder for Auth page, replace with
      },
      // {
      //   path: "notice",
      //   element: <NoticeBoardPage />,
      // },
      {
        path: "notice",
        element: <NoticeBoardPage />,
      },
      {

        path: "notice/archived",
        element: <ArchivedNotices />,
      },
      {
        path: "notice/archived/:id",
        element: <ArchivedNoticeDetail />,
      },
      {
        path: "notice/create",
        element: <CreateNotice />,
      },
      {
        path: "notice/:id/edit",
        element: <EditNotice />,
      },
      {
        path: "notice/:id",
        element: <ViewNotice />,
      },
      {
        path: "contact",
        element: <Contact />,
      },

       // Faculty Routes
       {
        path: "faculty",
        element: <FacultyOverview />, // Faculty Information overall
      },
      {
        path: "faculty/profile/:id",
        element: <FacultyProfile />,
      },
      {
        path: "faculty/directory",
        element: <FacultyDirectory />, // Faculty search by directory
      },
      {
        path: "faculty/edit/:id",
        element: <EditFaculty />, // Edit Faculty
      },
      {
        path: "faculty/active",
        element: <ActiveFacultyList />, // Active Faculty List
      },
      {
        path: "faculty/on-leave",
        element: <FacultyOnLeaveList />, // Faculty on leave list
      },
      {
        path: "faculty/yearly",
        element: <NewFacultyYearwise />, // New Faculty Information yearwise
      },
      

      {
        path: "exam-schedule",
        element: <ExamSchedule />,
      },
      {
        path: "archived-events",
        element: <ArchivedEvents />,
      },
      {
        path: "event",
        element: <EventPage />,
      },
      {
        path: "upcoming-events",
        element: <UpcomingEvents />,
      },
      {
        path: "event/:id",
        element: <EventDetails />,
      },
      { path: "assignmentsCreate", element: <AssignmentCreate /> },
      { path: `assignmentsEdit/:assignmentId`, element: <AssignmentCreate /> },
      { path: `assignments`, element: <Assignments /> },
      { path: `assignmentDetails/:id`, element: <AssignmentDetails /> },
      { path: `assignmentSubmissions/:id`, element: <AssignmentSubmission /> },
      {
        path: "test",
        element: <TestComponent />,
      },
      {
        path: "courses",
        element: <CourseList />,
      },
      {
        path: "class-schedule",
        element: <ClassSchedule />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "programs",
        element: <ProgramOutlines />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/courses",
        element: <AdminCourseManagement />,
      },
      {
        path: "admin/schedules",
        element: <AdminScheduleManagement />,
      },
      {
        path: "admin/programs",
        element: <AdminProgramManagement />,
      },
      {
        path: "admin/exam-schedules",
        element: <AdminExamScheduleManagement />,
      },
      {
        path: "resources",
        element: <Resources />,
      },
      {
        path: "admin/equipment-management",
        element: <EquipmentManagement />,
      },
      {
        path: "api-test",
        element: <ApiTestPage />,
      },
    ],
  },
]);
