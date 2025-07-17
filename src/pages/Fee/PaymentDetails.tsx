import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { Payment } from "../../services/paymentService";
import Card from "@/components/Card";

const PaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role || "");

    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        const paymentData = await paymentService.getPaymentById(
          Number(paymentId)
        );
        setPayment(paymentData);
      } catch (error) {
        console.error("Failed to fetch payment:", error);
        navigate("/fee");
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId, navigate]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      completed: CheckCircle,
      failed: AlertCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const handleUpdateStatus = async (
    newStatus: "pending" | "completed" | "failed"
  ) => {
    if (!payment) return;

    try {
      await paymentService.updatePaymentStatus(payment.id, {
        status: newStatus,
      });
      setPayment({ ...payment, status: newStatus });
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  if (loading) {
    return (
      <div className="px-4 pr-2 py-12">
        <div className="text-center py-12">
          <div className="text-lg text-text-secondary">
            Loading payment details...
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="px-4 pr-2 py-12">
        <div className="text-center py-12">
          <div className="text-lg text-text-secondary">Payment not found</div>
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
          PAYMENT DETAILS
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          {userRole === "admin"
            ? "View and manage payment transaction details, including status updates and student information."
            : "View your payment receipt and transaction details."}
        </p>
      </div>

      {/* Payment Status Card */}
      <Card cornerStyle="tl" className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-tr text-sm font-bold ${getStatusColor(
                payment.status
              )}`}>
              {getStatusIcon(payment.status)}
              <span>{payment.status.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary-dark">
                Payment #{payment.id}
              </h2>
              <p className="text-text-secondary">
                Transaction Date:{" "}
                {new Date(payment.transaction_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-dark">
              ${payment.amount}
            </p>
            <p className="text-sm text-text-secondary capitalize">
              {payment.payment_method.replace("_", " ")}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Information */}
        <Card cornerStyle="tl">
          <h3 className="text-lg font-bold text-primary-dark mb-6">
            PAYMENT INFORMATION
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-primary-yellow" />
              <div>
                <p className="text-xs text-text-secondary">Amount</p>
                <p className="font-bold text-lg">${payment.amount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-primary-yellow" />
              <div>
                <p className="text-xs text-text-secondary">Payment Method</p>
                <p className="font-bold capitalize">
                  {payment.payment_method.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-yellow" />
              <div>
                <p className="text-xs text-text-secondary">Transaction Date</p>
                <p className="font-bold">
                  {new Date(payment.transaction_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-text-secondary">
                  {new Date(payment.transaction_date).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary-yellow" />
              <div>
                <p className="text-xs text-text-secondary">Transaction ID</p>
                <p className="font-bold">#{payment.id}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Program & Student Information */}
        <Card cornerStyle="tr">
          <h3 className="text-lg font-bold text-primary-dark mb-6">
            PROGRAM & STUDENT DETAILS
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-secondary mb-1">Program</p>
              <p className="font-bold text-lg">{payment.program.name}</p>
              <p className="text-sm text-text-secondary">
                {payment.program.type}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary mb-1">
                Program Description
              </p>
              <p className="text-sm">{payment.program.description}</p>
            </div>

            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-primary-yellow" />
              <div>
                <p className="text-xs text-text-secondary">Student</p>
                <p className="font-bold">{payment.student.user.username}</p>
                <p className="text-sm text-text-secondary">
                  {payment.student.registration_number}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary">Year</p>
                <p className="font-bold">{payment.student.year}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Semester</p>
                <p className="font-bold">{payment.student.semester}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Session</p>
              <p className="font-bold">{payment.student.session}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Actions */}
      {userRole === "admin" && (
        <Card cornerStyle="bl" className="mt-8">
          <h3 className="text-lg font-bold text-primary-dark mb-6">
            ADMIN ACTIONS
          </h3>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-sm font-bold text-primary-dark mb-2">
                UPDATE STATUS
              </label>
              <select
                value={payment.status}
                onChange={(e) =>
                  handleUpdateStatus(
                    e.target.value as "pending" | "completed" | "failed"
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex space-x-3 items-end">
              <Button
                variant="outline"
                size="sm"
                cornerStyle="br"
                onClick={() => window.print()}>
                <FileText className="inline w-3 h-3 mr-1" />
                PRINT RECEIPT
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Student Actions */}
      {userRole === "student" && (
        <Card cornerStyle="br" className="mt-8">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => window.print()}
              cornerStyle="tl">
              <FileText className="inline w-4 h-4 mr-2" />
              PRINT RECEIPT
            </Button>
          </div>
        </Card>
      )}

      {/* Contact Information */}
      <Card cornerStyle="tl" className="mt-8">
        <h3 className="text-lg font-bold text-primary-dark mb-4">NEED HELP?</h3>
        <div className="bg-blue-50 p-4 rounded-tl border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">
            For questions about this payment or billing issues, please contact:
          </p>
          <div className="text-sm text-blue-700">
            <p>
              <strong>Finance Office:</strong> finance@university.edu
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentDetails;
