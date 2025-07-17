import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { Fee } from "../../services/paymentService";
import Card from "@/components/Card";

const UnpaidFees: React.FC = () => {
  const navigate = useNavigate();
  const [unpaidFees, setUnpaidFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is student
    const userRole = localStorage.getItem("role");
    if (userRole !== "student") {
      navigate("/fee");
      return;
    }

    fetchUnpaidFees();
  }, [navigate]);

  const fetchUnpaidFees = async () => {
    setLoading(true);
    try {
      const fees = await paymentService.getMyUnpaidFees();
      setUnpaidFees(fees);
    } catch (error) {
      console.error("Failed to fetch unpaid fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleMakePayment = (fee: Fee) => {
    navigate("/fee/payment/new", { state: { fee } });
  };

  if (loading) {
    return (
      <div className="px-4 pr-2 py-12">
        <div className="text-center py-12">
          <div className="text-lg text-text-secondary">
            Loading unpaid fees...
          </div>
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
          OUTSTANDING FEES
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Below are your unpaid fees. Please make payments before the due date
          to avoid late fees and academic holds. You can pay online using
          various payment methods.
        </p>
      </div>

      {/* Summary Card */}
      {unpaidFees.length > 0 && (
        <Card cornerStyle="tl" className="mb-8 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="text-xl font-bold text-red-600">
                  {unpaidFees.length} UNPAID FEE
                  {unpaidFees.length > 1 ? "S" : ""}
                </h2>
                <p className="text-text-secondary">
                  Total Amount: $
                  {unpaidFees
                    .reduce((total, fee) => total + fee.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Overdue Fees:</p>
              <p className="text-lg font-bold text-red-600">
                {
                  unpaidFees.filter((fee) => getDaysUntilDue(fee.due_date) < 0)
                    .length
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Unpaid Fees List */}
      <div className="space-y-6">
        {unpaidFees.map((fee) => {
          const daysUntilDue = getDaysUntilDue(fee.due_date);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

          return (
            <Card
              key={fee.id}
              cornerStyle="tl"
              className={`hover:shadow-lg transition-shadow duration-200 ${
                isOverdue
                  ? "border-l-4 border-red-500"
                  : isDueSoon
                  ? "border-l-4 border-yellow-500"
                  : "border-l-4 border-blue-500"
              }`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fee Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-dark mb-2">
                        {fee.program.name} - {fee.program.type}
                      </h3>
                      <p className="text-text-secondary mb-3 leading-relaxed">
                        {fee.description}
                      </p>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-primary-dark">
                          ${fee.amount}
                        </span>
                        {isOverdue && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-tr font-bold">
                            OVERDUE
                          </span>
                        )}
                        {isDueSoon && !isOverdue && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-tr font-bold">
                            DUE SOON
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Program Details */}
                  <div className="bg-gray-50 p-4 rounded-tl">
                    <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                      PROGRAM DETAILS
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary">Program Type:</p>
                        <p className="font-bold text-primary-dark">
                          {fee.program.type}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-secondary">Duration:</p>
                        <p className="font-bold text-primary-dark">
                          {fee.program.duration} years
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Due Date and Actions */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm uppercase text-primary-dark mb-3">
                      DUE DATE
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary-yellow" />
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              isOverdue ? "text-red-600" : "text-primary-dark"
                            }`}>
                            {new Date(fee.due_date).toLocaleDateString()}
                          </p>
                          <p
                            className={`text-xs ${
                              isOverdue ? "text-red-600" : "text-text-secondary"
                            }`}>
                            {new Date(fee.due_date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary-yellow" />
                        <div>
                          {isOverdue ? (
                            <p className="text-sm font-bold text-red-600">
                              Overdue by {Math.abs(daysUntilDue)} day
                              {Math.abs(daysUntilDue) !== 1 ? "s" : ""}
                            </p>
                          ) : daysUntilDue === 0 ? (
                            <p className="text-sm font-bold text-red-600">
                              Due today!
                            </p>
                          ) : (
                            <p
                              className={`text-sm font-bold ${
                                isDueSoon
                                  ? "text-yellow-600"
                                  : "text-primary-dark"
                              }`}>
                              {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""}{" "}
                              remaining
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Actions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm uppercase text-primary-dark">
                      PAYMENT OPTIONS
                    </h4>
                    <Button
                      cornerStyle="br"
                      className="w-full"
                      onClick={() => handleMakePayment(fee)}>
                      <CreditCard className="inline w-4 h-4 mr-2" />
                      PAY NOW
                    </Button>
                    <Button
                      variant="outline"
                      cornerStyle="bl"
                      className="w-full"
                      onClick={() => navigate(`/fee/details/${fee.id}`)}>
                      <DollarSign className="inline w-4 h-4 mr-2" />
                      VIEW DETAILS
                    </Button>
                  </div>

                  {/* Urgency Indicator */}
                  {(isOverdue || isDueSoon) && (
                    <div
                      className={`p-3 rounded-tr ${
                        isOverdue
                          ? "bg-red-50 border border-red-200"
                          : "bg-yellow-50 border border-yellow-200"
                      }`}>
                      <div className="flex items-center space-x-2">
                        <AlertCircle
                          className={`w-4 h-4 ${
                            isOverdue ? "text-red-500" : "text-yellow-500"
                          }`}
                        />
                        <p
                          className={`text-xs font-bold ${
                            isOverdue ? "text-red-700" : "text-yellow-700"
                          }`}>
                          {isOverdue
                            ? "PAYMENT OVERDUE - Pay immediately to avoid penalties"
                            : "PAYMENT DUE SOON - Pay within the next week"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {unpaidFees.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            All Caught Up!
          </h2>
          <p className="text-text-secondary text-lg mb-6">
            You have no outstanding fees at this time. All your payments are up
            to date.
          </p>
          <Button onClick={() => navigate("/fee")}>VIEW PAYMENT HISTORY</Button>
        </div>
      )}
    </div>
  );
};

export default UnpaidFees;
