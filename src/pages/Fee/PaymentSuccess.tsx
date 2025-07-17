import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Home,
} from "lucide-react";
import Button from "../../components/Button";
import Card from "@/components/Card";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fee, paymentMethod, amount } = location.state || {};

  useEffect(() => {
    // Check if user is student
    const userRole = localStorage.getItem("role");
    if (userRole !== "student") {
      navigate("/fee");
      return;
    }

    // Redirect if no payment data is provided
    if (!fee || !paymentMethod || !amount) {
      navigate("/fee");
      return;
    }
  }, [navigate, fee, paymentMethod, amount]);

  if (!fee || !paymentMethod || !amount) {
    return null;
  }

  return (
    <div className="px-4 pr-2 py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold uppercase text-green-600 mb-4">
          PAYMENT SUCCESSFUL
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
          Your payment has been processed successfully. You will receive a
          confirmation email shortly with your payment receipt and transaction
          details.
        </p>
      </div>

      {/* Payment Receipt */}
      <Card cornerStyle="tl" className="max-w-2xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-dark mb-2">
            PAYMENT RECEIPT
          </h2>
          <p className="text-text-secondary">
            Transaction ID: #
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fee Information */}
            <div>
              <h3 className="font-bold text-primary-dark mb-3 uppercase text-sm">
                Fee Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-text-secondary">Program</p>
                  <p className="font-bold">
                    {fee.program.name} ({fee.program.type})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Description</p>
                  <p className="text-sm">{fee.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary-yellow" />
                  <div>
                    <p className="text-xs text-text-secondary">
                      Original Due Date
                    </p>
                    <p className="text-sm font-bold">
                      {new Date(fee.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="font-bold text-primary-dark mb-3 uppercase text-sm">
                Payment Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-primary-yellow" />
                  <div>
                    <p className="text-xs text-text-secondary">
                      Payment Method
                    </p>
                    <p className="font-bold capitalize">
                      {paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary-yellow" />
                  <div>
                    <p className="text-xs text-text-secondary">Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${amount}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Payment Date</p>
                  <p className="font-bold">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Payment Time</p>
                  <p className="font-bold">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-primary-dark mb-3 uppercase text-sm">
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-secondary">Student ID</p>
                <p className="font-bold">{localStorage.getItem("id")}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Payment Status</p>
                <span className="inline-flex items-center px-2 py-1 rounded-tr text-xs font-bold bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  COMPLETED
                </span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-primary-dark mb-3 uppercase text-sm">
              Important Notes
            </h3>
            <div className="bg-blue-50 p-4 rounded-tl border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep this receipt for your records</li>
                <li>
                  • A confirmation email has been sent to your registered email
                  address
                </li>
                <li>
                  • Payment processing may take 1-2 business days to reflect in
                  your account
                </li>
                <li>
                  • For any payment-related queries, contact the finance office
                </li>
                <li>
                  • This payment is non-refundable except as per university
                  policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 max-w-2xl mx-auto">
        <Button
          cornerStyle="bl"
          onClick={() => navigate("/fee")}
          className="flex-1 sm:flex-none">
          <FileText className="inline w-4 h-4 mr-2" />
          VIEW PAYMENT HISTORY
        </Button>
        <Button
          variant="outline"
          cornerStyle="br"
          onClick={() => navigate("/fee/unpaid")}
          className="flex-1 sm:flex-none">
          CHECK OTHER FEES
        </Button>
        <Button
          variant="outline"
          cornerStyle="tl"
          onClick={() => navigate("/")}
          className="flex-1 sm:flex-none">
          <Home className="inline w-4 h-4 mr-2" />
          GO TO DASHBOARD
        </Button>
      </div>

      {/* Download Receipt Option */}
      <div className="text-center mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          cornerStyle="tr">
          <FileText className="inline w-3 h-3 mr-1" />
          PRINT RECEIPT
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
