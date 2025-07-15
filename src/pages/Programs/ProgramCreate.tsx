import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import {
  programService,
  type ProgramCreateRequest,
} from "../../services/programService";

const ProgramCreate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProgramCreateRequest>({
    type: "BSc",
    name: "",
    duration: 4,
    description: "",
    is_active: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration" || name === "is_active" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await programService.createProgram(formData);
      navigate("/programs");
    } catch (error) {
      console.error("Failed to create program:", error);
      alert("Failed to create program. Please try again.");
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
            onClick={() => navigate("/programs")}>
            <ArrowLeft className="inline w-4 h-4 mr-2" />
            BACK TO PROGRAMS
          </Button>
        </div>
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          CREATE PROGRAM
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Create a new academic program with course outlines and requirements.
        </p>
      </div>

      {/* Form */}
      <Card cornerStyle="tl" className="">
        <form onSubmit={handleSubmit} className="space-y-6 w-full p-2">
          {/* Program Type */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              PROGRAM TYPE
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              required>
              <option value="BSc">Bachelor of Science</option>
              <option value="MSc">Master of Science</option>
              <option value="PhD">Doctor of Philosophy</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Program Name */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              PROGRAM NAME
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science and Engineering"
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              DURATION (YEARS)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="10"
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Provide a detailed description of the program..."
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            />
          </div>

          {/* Status */}
          <div className="space-y-2 w-full p-2">
            <label className="block text-sm font-bold text-primary-dark mb-2">
              STATUS
            </label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              required>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 w-full p-2">
            <Button
              type="button"
              variant="outline"
              cornerStyle="bl"
              onClick={() => navigate("/programs")}>
              CANCEL
            </Button>
            <Button type="submit" cornerStyle="br" disabled={isLoading} className="bg-[#14244c] text-white hover:bg-[#ecb31d] cursor-pointer">
              {isLoading ? (
                "CREATING..."
              ) : (
                <>
                  <Save className="inline w-4 h-4 mr-2" />
                  CREATE PROGRAM
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProgramCreate;
