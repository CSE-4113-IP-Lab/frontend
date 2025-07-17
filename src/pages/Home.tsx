import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ChatWidget } from "@/components/agent";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Hero Section with University Building Background */}
      <div
        className="relative bg-cover bg-no-repeat bg-center h-[500px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 36, 76, 0.7), rgba(20, 36, 76, 0.7)), url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop')",
        }}
      >
        {/* CSEDU Header Section */}
        <div className="right-0 bottom-0 left-0 absolute">
          {/* Blue background box */}
          <div className="relative h-32" style={{ backgroundColor: "#14244C" }}>
            {/* Container for both CSE and DU */}
            <div className="-top-8 left-1/2 absolute flex justify-center items-center w-3/4 h-24 -translate-x-1/2 transform">
              {/* Yellow box for CSE - bigger and center aligned */}
              <div
                className="flex justify-end items-center h-full"
                style={{
                  backgroundColor: "#ECB31D",
                  width: "85%",
                  paddingLeft: "2rem",
                }}
              >
                <h1
                  className="font-bold text-6xl tracking-tight"
                  style={{ color: "#14244C" }}
                >
                  CSE
                </h1>
              </div>
              {/* DU text in blue area, right next to yellow box */}
              <div className="flex flex-1 justify-start items-center pl-3 h-full">
                <h1
                  className="font-bold text-6xl tracking-tight"
                  style={{ color: "#ECB31D" }}
                >
                  DU
                </h1>
              </div>
            </div>

            {/* DU text in blue section, positioned to hug the E */}

            {/* Horizontal line separator */}
            <div className="right-0 bottom-12 left-0 absolute bg-white/30 h-px"></div>

            {/* Navigation links at bottom */}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-gray-100 py-20">
        <div className="mx-auto px-8 container">
          {/* Mission Statement */}
          <div className="mx-auto mb-20 max-w-4xl">
            <h2 className="mb-8 font-bold text-gray-900 text-4xl text-center tracking-wide">
              DRIVEN BY CURIOSITY, GUIDED BY PURPOSE
            </h2>
            <p className="mb-10 text-gray-700 text-lg text-center leading-relaxed">
              At CSEDU, we believe that knowledge thrives where imagination
              meets determination. Our mission is rooted in a belief that
              learning should be bold, discovery should be boundless, and every
              challenge holds the potential for transformation. Here, diverse
              perspectives fuel innovation, collaboration drives progress, and
              curiosity leads the way. This is a place where ideas ignite, and
              the future takes shape.
            </p>
            <div className="text-center">
              <Button className="bg-blue-900 hover:bg-blue-800 px-8 py-3 font-medium text-white text-sm tracking-wide">
                MORE
              </Button>
            </div>
          </div>

          {/* News & Announcement Section */}
          <div className="mb-16">
            <h2 className="mb-12 font-bold text-gray-900 text-3xl tracking-wide">
              NEWS & ANNOUNCEMENT
            </h2>
            <div className="gap-12 grid md:grid-cols-2">
              {/* Indoor Games */}
              <div className="bg-white shadow-sm p-8">
                <h3 className="mb-6 font-bold text-gray-900 text-xl">
                  Indoor Games
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  At CSEDU, we believe that knowledge thrives where imagination
                  meets determination. Our mission is rooted in a belief that
                  learning ...
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {/* Freshers Week Event */}
              <div className="bg-white shadow-sm p-8">
                <h3 className="mb-6 font-bold text-gray-900 text-xl">
                  Freshers Week Event
                </h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  At CSEDU, imagination meets determination. Our mission is
                  rooted in a belief that learning ...
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ChatWidget for bottom-left positioning */}
      <ChatWidget />
    </div>
  );
}
