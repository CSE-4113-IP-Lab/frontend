import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import axios from "axios";

const AssignmentCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assignmentId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    course_id: "",
    due_date: "",
    marks: "",
    description: "",
  });

  const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/courses`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        setCourses(response.data);
        console.log("Fetched courses:", response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCoursework = async () => {
      console.log(assignmentId);

      if (!assignmentId) return;

      try {
        console.log("try");

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/courseworks/${assignmentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        const data = response.data;
        console.log("data" + data);

        setFormData({
          title: data.title,
          course_id: data.course_id.toString(), // Convert to string for <select>
          due_date: new Date(data.due_date).toISOString().slice(0, 16), // Format for input[datetime-local]
          marks: data.marks.toString(),
          description: data.description || "",
        });
      } catch (err: any) {
        console.error(err);
        alert("Failed to load assignment data.");
      }
    };

    fetchCoursework();
  }, [assignmentId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const created_by = parseInt(localStorage.getItem("id") || "");
    if (!created_by) {
      alert("User not logged in");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      course_id: parseInt(formData.course_id),
      due_date: formData.due_date,
      marks: parseFloat(formData.marks),
      type: "ASSIGNMENT",
      created_by,
    };

    try {
      if (location.pathname.includes("/assignmentsEdit")) {
        // EDIT MODE
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/courseworks/${assignmentId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        alert("Assignment updated successfully!");
      } else {
        // CREATE MODE
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/courseworks`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        alert("Assignment created successfully!");
      }
      navigate("/assignments");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <Card cornerStyle="tl" className="mb-8 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-primary-dark mb-6">
        {location.pathname.includes("/edit")
          ? "EDIT ASSIGNMENT"
          : "CREATE ASSIGNMENT"}
      </h2>
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-primary-dark mb-2">
            ASSIGNMENT TITLE *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            placeholder="Enter assignment title..."
            required
          />
        </div>

        {/* Course */}
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-primary-dark mb-2">
            COURSE *
          </label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-primary-dark mb-2">
            DUE DATE *
          </label>
          <input
            name="due_date"
            type="datetime-local"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            required
          />
        </div>

        {/* Marks */}
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-primary-dark mb-2">
            MAX MARKS *
          </label>
          <input
            name="marks"
            type="number"
            value={formData.marks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            placeholder="Enter maximum marks..."
            required
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="block text-left text-sm font-bold text-primary-dark mb-2">
            DESCRIPTION *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-yellow focus:border-transparent"
            placeholder="Enter detailed assignment description..."
            required
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="w-full flex space-x-4">
          <Button type="submit" cornerStyle="br">
            SUBMIT
          </Button>
          <Button
            type="button"
            variant="outline"
            cornerStyle="bl"
            onClick={() => navigate("/assignments")}
          >
            CANCEL
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AssignmentCreate;
