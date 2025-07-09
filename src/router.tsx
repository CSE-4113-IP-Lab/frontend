import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Notice } from "@/pages/Notice";
import { NoticeBoardPage } from "@/pages/Notices";
import { Event } from "@/pages/Event";
import { Contact } from "@/pages/Contact";

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
        element: <NoticeBoardPage />,
      },
      {
        path: "notice/:id",
        element: <Notice />,
      },
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      // Additional routes that can be accessed via the dropdown menu
      {
        path: "profile",
        element: (
          <div className="container mx-auto px-4 py-16">
            <h1
              className="text-4xl font-bold text-center"
              style={{ color: "#14244C" }}>
              Profile Page
            </h1>
            <p className="text-center text-gray-600 mt-4">
              Profile page content will go here.
            </p>
          </div>
        ),
      },
      {
        path: "settings",
        element: (
          <div className="container mx-auto px-4 py-16">
            <h1
              className="text-4xl font-bold text-center"
              style={{ color: "#14244C" }}>
              Settings Page
            </h1>
            <p className="text-center text-gray-600 mt-4">
              Settings page content will go here.
            </p>
          </div>
        ),
      },
      {
        path: "help",
        element: (
          <div className="container mx-auto px-4 py-16">
            <h1
              className="text-4xl font-bold text-center"
              style={{ color: "#14244C" }}>
              Help Page
            </h1>
            <p className="text-center text-gray-600 mt-4">
              Help page content will go here.
            </p>
          </div>
        ),
      },
    ],
  },
]);
