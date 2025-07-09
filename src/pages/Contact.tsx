import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function Contact() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: "#14244C" }}>
          Contact Us
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: "#14244C" }}>
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#ECB31D" }}>
                  <Mail className="h-5 w-5" style={{ color: "#14244C" }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "#14244C" }}>
                    Email
                  </h3>
                  <p className="text-gray-600">info@example.com</p>
                  <p className="text-gray-600">support@example.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#ECB31D" }}>
                  <Phone className="h-5 w-5" style={{ color: "#14244C" }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "#14244C" }}>
                    Phone
                  </h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#ECB31D" }}>
                  <MapPin className="h-5 w-5" style={{ color: "#14244C" }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "#14244C" }}>
                    Address
                  </h3>
                  <p className="text-gray-600">123 Main Street</p>
                  <p className="text-gray-600">City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: "#ECB31D" }}>
                  <Clock className="h-5 w-5" style={{ color: "#14244C" }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "#14244C" }}>
                    Office Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: "#14244C" }}>
              Send us a Message
            </h2>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message here..."></textarea>
              </div>

              <Button
                type="submit"
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: "#14244C" }}>
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2
            className="text-2xl font-semibold mb-6 text-center"
            style={{ color: "#14244C" }}>
            Find Us
          </h2>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Map integration would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
