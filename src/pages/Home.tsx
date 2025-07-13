import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ChatWidget } from "@/components/agent";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with University Building Background */}
      <div
        className="relative h-[500px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 36, 76, 0.7), rgba(20, 36, 76, 0.7)), url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop')",
        }}>
        {/* CSEDU Header Section */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Blue background box */}
          <div className="relative h-32" style={{ backgroundColor: "#14244C" }}>
            {/* Container for both CSE and DU */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 h-24 w-3/4 flex items-center justify-center">
              {/* Yellow box for CSE - bigger and center aligned */}
              <div
                className="flex items-center justify-end h-full"
                style={{
                  backgroundColor: "#ECB31D",
                  width: "85%",
                  paddingLeft: "2rem",
                }}>
                <h1
                  className="text-6xl font-bold tracking-tight"
                  style={{ color: "#14244C" }}>
                  CSE
                </h1>
              </div>
              {/* DU text in blue area, right next to yellow box */}
              <div className="flex items-center justify-start pl-3 h-full flex-1">
                <h1
                  className="text-6xl font-bold tracking-tight"
                  style={{ color: "#ECB31D" }}>
                  DU
                </h1>
              </div>
            </div>

            {/* DU text in blue section, positioned to hug the E */}

            {/* Horizontal line separator */}
            <div className="absolute bottom-12 left-0 right-0 h-px bg-white/30"></div>

            {/* Navigation links at bottom */}
            <div className="absolute bottom-3 left-0 right-0">
              <div className="flex justify-center space-x-8">
                <button className="text-white hover:text-gray-300 font-medium text-lg padding-y-5">
                  Academics
                </button>
                <button className="text-white hover:text-gray-300 font-medium text-lg padding-y-5">
                  Research
                </button>
                <button className="text-white hover:text-gray-300 font-medium text-lg padding-y-5">
                  Admissions
                </button>
                <button className="text-white hover:text-gray-300 font-medium text-lg padding-y-5">
                  Faculty
                </button>
                <button className="text-white hover:text-gray-300 font-medium text-lg padding-y-5">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-8">
          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 tracking-wide">
              DRIVEN BY CURIOSITY, GUIDED BY PURPOSE
            </h2>
            <p className="text-gray-700 leading-relaxed text-center mb-10 text-lg">
              At CSEDU, we believe that knowledge thrives where imagination
              meets determination. Our mission is rooted in a belief that
              learning should be bold, discovery should be boundless, and every
              challenge holds the potential for transformation. Here, diverse
              perspectives fuel innovation, collaboration drives progress, and
              curiosity leads the way. This is a place where ideas ignite, and
              the future takes shape.
            </p>
            <div className="text-center">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 text-sm font-medium tracking-wide">
                MORE
              </Button>
            </div>
          </div>

          {/* News & Announcement Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-12 text-gray-900 tracking-wide">
              NEWS & ANNOUNCEMENT
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Indoor Games */}
              <div className="bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  Indoor Games
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At CSEDU, we believe that knowledge thrives where imagination
                  meets determination. Our mission is rooted in a belief that
                  learning ...
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </div>
              </div>

              {/* Freshers Week Event */}
              <div className="bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  Freshers Week Event
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At CSEDU, imagination meets determination. Our mission is
                  rooted in a belief that learning ...
                </p>
                <div className="flex justify-end">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
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
