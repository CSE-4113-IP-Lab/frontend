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

import FacultyRoomBooking from "@/pages/Faculty/FacultyRoomBooking";

import ApiTest from "@/pages/ApiTest";

import {
  AdminRoute,
  StudentRoute,
  FacultyRoute,
  AdminOrFacultyRoute,
} from "@/components/ProtectedRoute";
import {
  AvailableRooms,
  BookRoom,
  MyBookings,
  RoomBookingDashboard,
} from "@/pages/RoomBooking";
import RoomBookingTest from "@/pages/RoomBooking/RoomBookingTest";
import RoomDetail from "@/pages/RoomBooking/RoomDetail";

// Admission Pages
import { AdmissionPage } from "./pages/Admission/index";
import { ApplicationForm } from "./pages/Admission/ApplicationForm";
import { ApplicationSuccess } from "./pages/Admission/ApplicationSuccess";
import { AdmissionRequirements } from "./pages/Admission/Requirements";
import ManageTimeline from "./pages/Admission/ManageTimeline";
import CreateTimeline from "./pages/Admission/CreateTimeline";
import EditTimeline from "./pages/Admission/EditTimeline";

import ClassSchedule from "./pages/Schedule/classSchedule/ClassSchedule";
import ExamSchedule from "./pages/Schedule/examSchedule/ExamSchedule";
import CreateExamSchedule from "./pages/Schedule/examSchedule/CreateExamSchedule";
import EditExamSchedule from "./pages/Schedule/examSchedule/EditExamSchedule";
import MeetingPage from "./pages/Meeting/MeetingPage";
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

import ApiTestPage from "./pages/ApiTest";

//import { Notice } from "@/pages/Notice";
import FacultyProfile from "@/pages/FacultyInformation/FacultyProfile";
import FacultyDirectory from "@/pages/FacultyInformation/FacultyDirectory";
import EditFaculty from "@/pages/FacultyInformation/EditFaculty";
import FacultyOverview from "@/pages/FacultyInformation/FacultyOverview";
import ActiveFacultyList from "@/pages/FacultyInformation/ActiveFacultyList";
import NewFacultyYearwise from "@/pages/FacultyInformation/NewFacultyYearwise";
import FacultyByResearch from "@/pages/FacultyInformation/FacultyByResearch";
import FacultyOnLeaveList from "@/pages/FacultyInformation/FacultyOnLeaveList";

import AddRoom from "./pages/Resources/AddRoom";
import RoomManagement from "./pages/Resources/RoomManagement";

import ResearchGallery from "./services/ResearchGallery";
import { CreateSchedule, EditSchedule } from "./pages/Schedule/classSchedule";
import SchedulePage from "./pages/Schedule/schedule";
import AwardsResearchPage from "./components/AwarResearchPage";

import { StudentProfile } from "@/pages/Student/StudentProfile";
import { StudentEditProfile } from "@/pages/Student/EditStudentProfile";
import FeePage from "./pages/Fee/Fee";
import CreateFee from "./pages/Fee/CreateFee";
import EditFee from "./pages/Fee/EditFee";
import UnpaidFees from "./pages/Fee/UnpaidFees";
import MakePayment from "./pages/Fee/MakePayment";
import PaymentSuccess from "./pages/Fee/PaymentSuccess";
import PaymentDetails from "./pages/Fee/PaymentDetails";
import AllPayments from "./pages/Fee/AllPayments";

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
      // Admission Routes
      {
        path: "/admission",
        element: <AdmissionPage />,
      },
      {
        path: "/admission/apply",
        element: <ApplicationForm />,
      },
      {
        path: "/admission/application-success",
        element: <ApplicationSuccess />,
      },
      {
        path: "/admission/requirements",
        element: <AdmissionRequirements />,
      },
      // Admin-only admission routes
      {
        path: "/admission/manage",
        element: (
          <AdminRoute>
            <ManageTimeline />
          </AdminRoute>
        ),
      },
      {
        path: "/admission/create-timeline",
        element: (
          <AdminRoute>
            <CreateTimeline />
          </AdminRoute>
        ),
      },
      {
        path: "/admission/edit/:id",
        element: (
          <AdminRoute>
            <EditTimeline />
          </AdminRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />, // Placeholder for Auth page, replace with
      },

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
        path: "faculty/byresearch",
        element: <FacultyByResearch />,
      },

      {
        path: "exam-schedule",
        element: <ExamSchedule />,
      },
      {
        path: "admin/exam-schedules/create",
        element: (
          <AdminRoute>
            <CreateExamSchedule />
          </AdminRoute>
        ),
      },
      {
        path: "admin/exam-schedules/edit/:scheduleId",
        element: (
          <AdminRoute>
            <EditExamSchedule />
          </AdminRoute>
        ),
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
        path: "schedule",
        element: <SchedulePage />,
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
        path: "class-schedule",
        element: <ClassSchedule />,
      },

      {
        path: "programs",
        element: <ProgramOutlines />,
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
        path: "meetings",
        element: <MeetingPage />,
      },

      {
        path: "class-schedule",
        element: <ClassSchedule />,
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
        element: (
          <AdminRoute>
            <ExamSchedule />
          </AdminRoute>
        ),
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
        path: "student/profile",
        element: <StudentProfile />,
      },
      {
        path: "student/profile/edit",
        element: <StudentEditProfile />,
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
        path: "faculty/room-booking",
        element: (
          <FacultyRoute>
            <FacultyRoomBooking />
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
          <AdminOrFacultyRoute>
            <BookRoom />
          </AdminOrFacultyRoute>
        ),
      },
      {
        path: "room-booking/my-bookings",
        element: <MyBookings />,
      },

      {
        path: "room-booking/room/:id",
        element: <RoomDetail />,
      },
      {
        path: "room-booking/test",
        element: <RoomBookingTest />,
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
          <AdminOrFacultyRoute>
            <BookRoom />
          </AdminOrFacultyRoute>
        ),
      },
      {
        path: "room-booking/my-bookings",
        element: <MyBookings />,
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
      {
        path: "research-gallery",
        element: <ResearchGallery />, // Change to true for admin view
      },

      {
        path: "admin/room-management",
        element: (
          <AdminRoute>
            <RoomManagement />
          </AdminRoute>
        ),
      },

      {
        path: "admin/add-room",
        element: (
          <AdminRoute>
            <AddRoom />
          </AdminRoute>
        ),
      },

      {
        path: "awards",
        element: <AwardsResearchPage />, // Change to true for admin view
      },

      { path: "fee", element: <FeePage /> },
      { path: "fee/create", element: <CreateFee /> },
      { path: "fee/edit/:feeId", element: <EditFee /> },
      { path: "fee/unpaid", element: <UnpaidFees /> },
      { path: "fee/payment/new", element: <MakePayment /> },
      { path: "fee/payment/success", element: <PaymentSuccess /> },
      { path: "fee/payment/:paymentId", element: <PaymentDetails /> },
      { path: "fee/payments", element: <AllPayments /> },
    ],
  },
]);
