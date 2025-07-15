import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

export function Contact() {
  const position: [number, number] = [23.728954658752503, 90.39908289521158];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#14244c]">
          Contact Us
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#14244c]">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#ecb31d]">
                  <Mail className="h-5 w-5 text-[#14244c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14244c]">Email</h3>
                  <p className="text-gray-600">info@example.com</p>
                  <p className="text-gray-600">support@example.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#ecb31d]">
                  <Phone className="h-5 w-5 text-[#14244c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14244c]">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#ecb31d]">
                  <MapPin className="h-5 w-5 text-[#14244c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14244c]">Address</h3>
                  <p className="text-gray-600">123 Main Street</p>
                  <p className="text-gray-600">City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-[#ecb31d]">
                  <Clock className="h-5 w-5 text-[#14244c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#14244c]">Office Hours</h3>
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
            <h2 className="text-2xl font-semibold mb-6 text-[#14244c]">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14244c] focus:border-transparent transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14244c] focus:border-transparent transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14244c] focus:border-transparent transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#14244c] focus:border-transparent transition-colors"
                  placeholder="Your message here..."></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#14244c] hover:bg-[#ecb31d] text-white hover:text-[#14244c] transition-colors cursor-pointer">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#14244c]">
            Find Us
          </h2>
          <div className="h-[450px] w-full rounded-lg shadow-md overflow-hidden">
            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={position}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-[#14244c]">University of Dhaka</h3>
                    <p className="text-sm text-gray-600">Nilkhet Rd, Dhaka 1000</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
