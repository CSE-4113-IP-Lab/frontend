import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, FileText, Save, ArrowLeft } from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { CreateFeeRequest } from "../../services/paymentService";
import axios from "axios";

interface Program {
  id: number;
  name: string;
  type: string;
  duration: number;
  description: string;
  is_active: number;
}

const CreateFee: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateFeeRequest>({
    program_id: 0,
    amount: 0,
    description: "",
    due_date: "",
  });

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      navigate("/fee");
      return;
    }

    fetchPrograms();
  }, [navigate]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/programs`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      setPrograms(response.data);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setError("Failed to load programs. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "program_id" || name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.program_id === 0) {
        setError("Please select a program");
        return;
      }

      if (formData.amount <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      if (!formData.description.trim()) {
        setError("Please enter a description");
        return;
      }

      if (!formData.due_date) {
        setError("Please select a due date");
        return;
      }

      await paymentService.createFee(formData);
      alert("Fee created successfully!");
      navigate("/fee");
    } catch (error) {
      console.error("Failed to create fee:", error);
      setError("Failed to create fee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedProgram = programs.find((p) => p.id === formData.program_id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create New Fee</h1>
              <p className="text-blue-200 mt-1">
                Create a new fee structure for a program. Set the amount, due
                date, and description.
              </p>
            </div>
            <Button
              onClick={() => navigate("/fee")}
              className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Fees
            </Button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Create Fee Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2" />
                  Program *
                </label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  <option value={0}>Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter fee amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Enter fee description (e.g., Tuition fee for Fall 2025 semester)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => navigate("/fee")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={loading}>
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Save size={16} />
                    Create Fee
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Preview Card */}
          {selectedProgram && formData.amount > 0 && formData.description && (
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preview
              </h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedProgram.name} ({selectedProgram.type})
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${formData.amount}
                    </p>
                    {formData.due_date && (
                      <p className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
                        <Calendar size={14} />
                        Due: {new Date(formData.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFee;
