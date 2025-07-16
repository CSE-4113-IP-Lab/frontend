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
import Grades from "./pages/Grades/Grades";

import Resources from "@/pages/Resources/Resources";
import AdminResources from "@/pages/Resources/AdminResources";
import StudentResources from "@/pages/Resources/StudentResources";
import FacultyResources from "@/pages/Resources/FacultyResources";
import EquipmentManagement from "@/pages/Admin/AdminEquipmentManagement";
import StudentEquipmentPage from "@/pages/Student/StudentEquipment";
import FacultyEquipmentPage from "@/pages/Faculty/FacultyEquipment";
import {
  AdminRoute,
  StudentRoute,
  FacultyRoute,
} from "@/components/ProtectedRoute";

import ApiTest from "@/pages/ApiTest";

import {
  AvailableRooms,
  BookRoom,
  MyBookings,
  RoomBookingDashboard,
} from "@/pages/RoomBooking";

import ClassSchedule from "./pages/Schedule/classSchedule/ClassSchedule";
import CreateSchedule from "./pages/Schedule/classSchedule/CreateSchedule";
import EditSchedule from "./pages/Schedule/classSchedule/EditSchedule";
import ExamSchedule from "./pages/Schedule/examSchedule/ExamSchedule";
import ArchivedEvents from "./pages/Event/ArchivedEvents";
import EventPage from "./pages/Event/EventPage";
import UpcomingEvents from "./pages/Event/UpcomingEvents";
import EventDetails from "./pages/Event/EventDetails";
import TestComponent from "./pages/Test/TestComponent";
import CourseList from "./pages/Courses/CourseList";
import CourseCreate from "./pages/Courses/CourseCreate";
import CourseEdit from "./pages/Courses/CourseEdit";
import ProgramOutlines from "./pages/Programs/ProgramOutlines";
import ProgramCreate from "./pages/Programs/ProgramCreate";
import ProgramEdit from "./pages/Programs/ProgramEdit";
import ErrorPage from "./ErrorPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCourseManagement from "./pages/Admin/AdminCourseManagement";
import AdminScheduleManagement from "./pages/Admin/AdminScheduleManagement";
import AdminProgramManagement from "./pages/Admin/AdminProgramManagement";
import AdminExamScheduleManagement from "./pages/Admin/AdminExamScheduleManagement";
import ApiTestPage from "./pages/ApiTest";

import FacultyProfile from "@/pages/FacultyInformation/FacultyProfile";
import FacultyDirectory from "@/pages/FacultyInformation/FacultyDirectory";
import EditFaculty from "@/pages/FacultyInformation/EditFaculty";
import FacultyOverview from "@/pages/FacultyInformation/FacultyOverview";
import ActiveFacultyList from "@/pages/FacultyInformation/ActiveFacultyList";
import NewFacultyYearwise from "@/pages/FacultyInformation/NewFacultyYearwise";
import FacultyByResearch from "@/pages/FacultyInformation/FacultyByResearch";
import FacultyOnLeaveList from "@/pages/FacultyInformation/FacultyOnLeaveList";

import FeeStructure from "@/pages/Fee/FeeStructure";
import PaymentDeadlines from "@/pages/Fee/PaymentDeadlines";
import TransactionHistory from "@/pages/Fee/TransactionHistory";
import ConfirmationFeedback from "@/pages/Fee/ConfirmationFeedback";
import FeeCreate from "@/pages/Fee/FeeCreate";


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
        element: <Auth />,
      },
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

      // Fee Routes
      {
        path: "fee/structure",
        element: <FeeStructure />,
      },
      {
        path: "fee/deadlines",
        element: <PaymentDeadlines />,
      },
      {
        path: "fee/history",
        element: <TransactionHistory />,
      },
      {
        path: "fee/confirm",
        element: <ConfirmationFeedback />,
      },
      {
        path: "fee/create",
        element: <FeeCreate />,
      },

     // Faculty Routes
      {
        path: "faculty",
        element: <FacultyOverview />,
      },
      {
        path: "faculty/profile/:id",
        element: <FacultyProfile />,
      },
      {
        path: "faculty/directory",
        element: <FacultyDirectory />,
      },
      {
        path: "faculty/edit/:id",
        element: <EditFaculty />,
      },
      {
        path: "faculty/active",
        element: <ActiveFacultyList />,
      },
      {
        path: "faculty/on-leave",
        element: <FacultyOnLeaveList />,
      },
      {
        path: "faculty/yearly",
        element: <NewFacultyYearwise />,
      },
      {
        path: "faculty/byresearch",
        element: <FacultyByResearch />,
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

      { path: `grades`, element: <Grades /> },
      {
        path: "test",
        element: <TestComponent />,
      },
      {
        path: "courses",
        element: <CourseList />,
      },
      {
        path: "courses/create",
        element: (
          <AdminRoute>
            <CourseCreate />
          </AdminRoute>
        ),
      },
      {
        path: "courses/edit/:id",
        element: (
          <AdminRoute>
            <CourseEdit />
          </AdminRoute>
        ),
      },
      {
        path: "schedule",
        element: <ClassSchedule />,
      },
      {
        path: "class-schedule",
        element: <ClassSchedule />,
      },
      {
        path: "schedule/create",
        element: (
          <AdminRoute>
            <CreateSchedule />
          </AdminRoute>
        ),
      },
      {
        path: "schedule/edit/:id",
        element: (
          <AdminRoute>
            <EditSchedule />
          </AdminRoute>
        ),
      },
      {
        path: "programs",
        element: <ProgramOutlines />,
      },
      {
        path: "programs/create",
        element: (
          <AdminRoute>
            <ProgramCreate />
          </AdminRoute>
        ),
      },
      {
        path: "programs/edit/:id",
        element: (
          <AdminRoute>
            <ProgramEdit />
          </AdminRoute>
        ),
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
        path: "resources/admin",
        element: (
          <AdminRoute>
            <AdminResources />
          </AdminRoute>
        ),
      },
      {
        path: "resources/student",
        element: (
          <StudentRoute>
            <StudentResources />
          </StudentRoute>
        ),
      },
      {
        path: "resources/faculty",
        element: (
          <FacultyRoute>
            <FacultyResources />
          </FacultyRoute>
        ),
      },
      {
        path: "admin/equipment-management",
        element: (
          <AdminRoute>
            <EquipmentManagement />
          </AdminRoute>
        ),
      },
      {
        path: "student/equipment",
        element: (
          <StudentRoute>
            <StudentEquipmentPage />
          </StudentRoute>
        ),
      },
      {
        path: "faculty/equipment",
        element: (
          <FacultyRoute>
            <FacultyEquipmentPage />
          </FacultyRoute>
        ),
      },
      {
        path: "api-test",
        element: <ApiTestPage />,
      },
      {
        path: "room-booking",
        element: <RoomBookingDashboard />,
      },
      {
        path: "room-booking/available",
        element: <AvailableRooms />,
      },
      {
        path: "room-booking/book",
        element: (
          <FacultyRoute>
            <BookRoom />
          </FacultyRoute>
        ),
      },
      {
        path: "room-booking/my-bookings",
        element: <MyBookings />,
      },
    ],
  },
]);
