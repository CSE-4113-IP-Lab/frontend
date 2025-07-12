import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { NoticeBoardPage } from "@/pages/Notice/Notices";
import ArchivedNotices from "@/pages/Notice/ArchivedNotices";
import ArchivedNoticeDetail from "@/pages/Notice/ArchivedNoticeDetail";
import ViewNotice from "@/pages/Notice/ViewNotice";
import CreateNotice from "@/pages/Notice/CreateNotice";
import EditNotice from "@/pages/Notice/EditNotice";
import { Contact } from "@/pages/Contact";
import Auth from "@/pages/Auth/Auth";
import Resources from "@/pages/Resources/Resources";
import AdminResources from "@/pages/Resources/AdminResources";
import StudentResources from "@/pages/Resources/StudentResources";
import FacultyResources from "@/pages/Resources/FacultyResources";
import EquipmentManagement from "@/pages/Admin/AdminEquipmentManagement";
import StudentEquipmentPage from "@/pages/Student/StudentEquipment";
import FacultyEquipmentPage from "@/pages/Faculty/FacultyEquipment";
import { AdminRoute, StudentRoute, FacultyRoute } from "@/components/ProtectedRoute";
import ApiTest from "@/pages/ApiTest";
import { AvailableRooms, BookRoom, MyBookings, RoomBookingDashboard } from "@/pages/RoomBooking";

import ClassSchedule from "./pages/Schedule/classSchedule/ClassSchedule";
import ExamSchedule from "./pages/Schedule/examSchedule/ExamSchedule";
import SchedulePage from "./pages/Schedule/schedule";
import ArchivedEvents from "./pages/Event/ArchivedEvents";
import EventPage from "./pages/Event/EventPage";
import UpcomingEvents from "./pages/Event/UpcomingEvents";
import ErrorPage from "./ErrorPage";
import EventDetails from "./pages/Event/EventDetails";
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
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "class-schedule",
        element: <ClassSchedule />,
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
        element: <ApiTest />,
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
