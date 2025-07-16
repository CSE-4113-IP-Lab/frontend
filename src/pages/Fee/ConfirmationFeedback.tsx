import React, { useState } from "react";
import axios from "axios";

const ConfirmationFeedback = () => {
  const [formData, setFormData] = useState({
    program_id: "",
    amount: "",
    payment_method: "",
  });

  const [errors, setErrors] = useState({
    program_id: "",
    amount: "",
    payment_method: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {
      program_id: "",
      amount: "",
      payment_method: "",
    };

    if (!formData.program_id) {
      newErrors.program_id = "Program ID is required.";
    }

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    }

    if (!formData.payment_method) {
      newErrors.payment_method = "Payment method is required.";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/v1/payments", formData);
      alert("Payment confirmed!");
      setFormData({
        program_id: "",
        amount: "",
        payment_method: "",
      });
      setErrors({
        program_id: "",
        amount: "",
        payment_method: "",
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Payment Confirmation
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="program_id"
              className="block text-sm font-medium text-gray-700"
            >
              Program ID
            </label>
            <input
              id="program_id"
              type="text"
              value={formData.program_id}
              onChange={(e) =>
                setFormData({ ...formData, program_id: e.target.value })
              }
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.program_id ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Enter Program ID"
            />
            {errors.program_id && (
              <p className="text-red-500 text-sm mt-1">{errors.program_id}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Enter Amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="payment_method"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method
            </label>
            <input
              id="payment_method"
              type="text"
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.payment_method ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Enter Payment Method"
            />
            {errors.payment_method && (
              <p className="text-red-500 text-sm mt-1">
                {errors.payment_method}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? "Submitting..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationFeedback;
