import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, DollarSign, Save, ArrowLeft } from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { Fee, UpdateFeeRequest } from "../../services/paymentService";
import Card from "@/components/Card";

const EditFee: React.FC = () => {
  const navigate = useNavigate();
  const { feeId } = useParams<{ feeId: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fee, setFee] = useState<Fee | null>(null);
  const [formData, setFormData] = useState<UpdateFeeRequest>({
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

    const fetchFeeData = async () => {
      setFetchLoading(true);
      try {
        const feeData = await paymentService.getFeeById(Number(feeId));
        setFee(feeData);
        setFormData({
          amount: feeData.amount,
          description: feeData.description,
          due_date: new Date(feeData.due_date).toISOString().slice(0, 16), // Format for datetime-local input
        });
      } catch (error) {
        console.error("Failed to fetch fee:", error);
        navigate("/fee");
      } finally {
        setFetchLoading(false);
      }
    };

    if (feeId) {
      fetchFeeData();
    }
  }, [navigate, feeId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.amount <= 0 || !formData.description || !formData.due_date) {
        alert("Please fill in all required fields");
        return;
      }

      await paymentService.updateFee(Number(feeId), formData);
      navigate("/fee");
    } catch (error) {
      console.error("Failed to update fee:", error);
      alert("Failed to update fee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="px-4 pr-2 py-12">
        <div className="text-center py-12">
          <div className="text-lg text-text-secondary">
            Loading fee details...
          </div>
        </div>
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="px-4 pr-2 py-12">
        <div className="text-center py-12">
          <div className="text-lg text-text-secondary">Fee not found</div>
          <Button onClick={() => navigate("/fee")} className="mt-4">
            BACK TO FEES
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/fee")}
            cornerStyle="bl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO FEES
          </Button>
        </div>
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          EDIT FEE
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Update the fee details for {fee.program.name} ({fee.program.type}).
          Changes will affect all students enrolled in this program.
        </p>
      </div>

      {/* Current Fee Info */}
      <Card cornerStyle="tl" className="mb-8 max-w-4xl">
        <h3 className="text-lg font-bold text-primary-dark mb-4">
          CURRENT FEE DETAILS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-tl">
          <div>
            <p className="text-xs text-text-secondary">Program</p>
            <p className="font-bold">
              {fee.program.name} ({fee.program.type})
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Current Amount</p>
            <p className="font-bold text-lg">${fee.amount}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Current Due Date</p>
            <p className="font-bold">
              {new Date(fee.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Fee Form */}
      <Card cornerStyle="tl" className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <DollarSign className="inline w-4 h-4 mr-2" />
                AMOUNT *
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
                className="w-full px-3 py-2 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                DUE DATE *
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-tr focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-primary-dark mb-2">
                DESCRIPTION *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter fee description"
                className="w-full px-3 py-2 border border-gray-300 rounded-br focus:outline-none focus:ring-2 focus:ring-primary-yellow resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/fee")}
              cornerStyle="bl"
              disabled={loading}>
              CANCEL
            </Button>
            <Button type="submit" cornerStyle="br" disabled={loading}>
              {loading ? (
                "UPDATING..."
              ) : (
                <>
                  <Save className="inline w-4 h-4 mr-2" />
                  UPDATE FEE
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Changes */}
      <Card cornerStyle="tl" className="mt-8 max-w-4xl">
        <h3 className="text-lg font-bold text-primary-dark mb-4">
          PREVIEW CHANGES
        </h3>
        <div className="bg-yellow-50 p-4 rounded-tl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-primary-dark">
                {fee.program.name} ({fee.program.type})
              </h4>
              <p className="text-text-secondary text-sm mt-1">
                {formData.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-dark">
                ${formData.amount}
              </p>
              {formData.due_date && (
                <p className="text-sm text-text-secondary">
                  Due: {new Date(formData.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditFee;
