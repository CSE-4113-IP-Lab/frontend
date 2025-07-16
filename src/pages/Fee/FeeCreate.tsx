import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProgramResponse } from "../../services/programService";
import { programService } from "../../services/programService";

// Define types for better type safety
interface FeeFormData {
  program_id: string;
  amount: string;
  description: string;
  due_date: string;
}

const FeeCreate = () => {
  const [formData, setFormData] = useState<FeeFormData>({
    program_id: "",
    amount: "",
    description: "",
    due_date: "",
  });
  const [programs, setPrograms] = useState<ProgramResponse[]>([]); // State to store programs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsData = await programService.getPublicPrograms();
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching programs:", error);
        alert("Failed to fetch programs. Please try again.");
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate form data
      const programId = parseInt(formData.program_id);
      const amount = parseFloat(formData.amount);

      if (isNaN(programId) || programId <= 0) {
        alert("Please select a valid program.");
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
      }

      if (!formData.description.trim()) {
        alert("Please enter a description.");
        return;
      }

      if (!formData.due_date) {
        alert("Please select a due date.");
        return;
      }

      // Prepare data with correct types for the API
      const submitData = {
        program_id: programId,
        amount: amount,
        description: formData.description.trim(),
        due_date: new Date(formData.due_date).toISOString(), // Convert to ISO datetime
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/payments/fees`,
        submitData,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            "Content-Type": "application/json",
            // Add authorization header if needed
            // "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("Fee created successfully:", response.data);
      alert("Fee created successfully!");
      navigate("/fee/structure"); // Redirect back to Fee Structure page
    } catch (error) {
      console.error("Error creating fee:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        alert(`Failed to create fee: ${errorMessage}`);
      } else {
        alert("Failed to create fee. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Fee
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="program_id"
              className="block text-sm font-medium text-gray-700">
              Program
            </label>
            <select
              id="program_id"
              value={formData.program_id}
              onChange={(e) =>
                setFormData({ ...formData, program_id: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required>
              <option value="" disabled>
                Select a Program
              </option>
              {programs.map((program: ProgramResponse) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Amount"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter Description"
              required
            />
          </div>
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
            {isSubmitting ? "Submitting..." : "Create Fee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeeCreate;
