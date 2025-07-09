import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6" style={{ color: "#14244C" }}>
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Built with Vite, React, TypeScript, Tailwind CSS, and Shadcn/ui
          components. Featuring your custom brand colors.
        </p>

        {/* Buttons showcasing your brand colors */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            className="text-white hover:opacity-90"
            style={{ backgroundColor: "#14244C" }}>
            Primary Button (#14244C)
          </Button>
          <Button
            variant="secondary"
            className="hover:opacity-90"
            style={{ backgroundColor: "#ECB31D", color: "#14244C" }}>
            Secondary Button (#ECB31D)
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#14244C" }}>
            <span className="text-white font-bold">V</span>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#14244C" }}>
            Vite
          </h3>
          <p className="text-gray-600">
            Lightning fast build tool with hot module replacement
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#ECB31D" }}>
            <span style={{ color: "#14244C" }} className="font-bold">
              R
            </span>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#14244C" }}>
            React 19
          </h3>
          <p className="text-gray-600">
            Latest React with concurrent features and improved performance
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-white shadow-sm">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "#14244C" }}>
            <span className="text-white font-bold">T</span>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#14244C" }}>
            TypeScript
          </h3>
          <p className="text-gray-600">
            Type-safe development with excellent developer experience
          </p>
        </div>
      </div>

      {/* Additional Content */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#14244C" }}>
          Ready to Build Something Amazing?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          This template includes everything you need to start building modern
          web applications.
        </p>
        <Button
          size="lg"
          className="text-white hover:opacity-90"
          style={{ backgroundColor: "#14244C" }}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
