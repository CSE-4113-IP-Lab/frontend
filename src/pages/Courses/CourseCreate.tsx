import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {
  programService,
  type CourseCreateRequest,
  type ProgramResponse,
} from "../../services/programService";

const CourseCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [formData, setFormData] = useState<CourseCreateRequest>({
    name: "",
    course_code: "",
    program_id: 0,
    teacher_id: 0,
    credits: 3,
    description: "",
    semester: 1,
    year: 1,
    batch: "",
  });

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const programsData = await programService.getPrograms();
        setPrograms(programsData);
        if (programsData.length > 0) {
          setFormData((prev) => ({ ...prev, program_id: programsData[0].id }));
        }
      } catch (error) {
        console.error("Failed to load programs:", error);
      }
    };

    loadPrograms();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "program_id",
        "teacher_id",
        "credits",
        "semester",
        "year",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await programService.createCourse(formData);
      navigate("/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8 px-5">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            cornerStyle="bl"
            onClick={() => navigate("/courses")}>
            <ArrowLeft className="inline w-4 h-4 mr-2" />
            BACK TO COURSES
          </Button>
        </div>
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          CREATE COURSE
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Create a new course with detailed information and requirements.
        </p>
      </div>

      {/* Form */}
      <Card cornerStyle="tl" className="">
        <form onSubmit={handleSubmit} className="space-y-6 w-full p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-2">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                COURSE NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Programming"
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required
              />
            </div>

            {/* Course Code */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                COURSE CODE
              </label>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                placeholder="e.g., CSE 101"
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required
              />
            </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                PROGRAM
              </label>
              <select
                name="program_id"
                value={formData.program_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required>
                <option value={0}>Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.type} in {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher ID */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                TEACHER ID
              </label>
              <input
                type="number"
                name="teacher_id"
                value={formData.teacher_id || ""}
                onChange={handleInputChange}
                placeholder="Teacher ID"
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>

            {/* Credits */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                CREDITS
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                min="1"
                max="6"
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                SEMESTER
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                YEAR
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required>
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Year 5</option>
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
                BATCH
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                placeholder="e.g., 2024"
                className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2 w-full p-2">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide a detailed description of the course..."
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 w-full p-2">
            <Button
              type="button"
              variant="outline"
              cornerStyle="bl"
              onClick={() => navigate("/courses")}>
              CANCEL
            </Button>
            <Button type="submit" cornerStyle="br" disabled={isLoading} className="bg-[#14244c] text-white hover:bg-[#ecb31d] cursor-pointer">
              {isLoading ? (
                "CREATING..."
              ) : (
                <>
                  <Save className="inline w-4 h-4 mr-2" />
                  CREATE COURSE
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CourseCreate;
