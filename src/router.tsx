import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Notice } from "@/pages/Notice";
import { Contact } from "@/pages/Contact";

import ClassSchedule from "./pages/Schedule/classSchedule/ClassSchedule";
import ExamSchedule from "./pages/Schedule/examSchedule/ExamSchedule";
import SchedulePage from "./pages/Schedule/schedule";
import ArchivedEvents from "./pages/Event/ArchivedEvents";
import EventPage from "./pages/Event/EventPage";
import UpcomingEvents from "./pages/Event/UpcomingEvents";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        index: true,
        element: <Home />,
      },
      {
        path: "notice",
        element: <Notice />,
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

    ],
 },] );
