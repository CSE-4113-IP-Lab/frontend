import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Lock,
  ArrowLeft,
} from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { Fee, CreatePaymentRequest } from "../../services/paymentService";
import Card from "@/components/Card";

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fee = location.state?.fee as Fee;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });
  const [agreement, setAgreement] = useState(false);

  useEffect(() => {
    // Check if user is student
    const userRole = localStorage.getItem("role");
    if (userRole !== "student") {
      navigate("/fee");
      return;
    }

    // Redirect if no fee is provided
    if (!fee) {
      navigate("/fee/unpaid");
      return;
    }
  }, [navigate, fee]);

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!agreement) {
        alert("Please agree to the terms and conditions");
        return;
      }

      // Validate payment details based on payment method
      if (paymentMethod === "credit_card") {
        if (
          !cardDetails.cardNumber ||
          !cardDetails.expiryDate ||
          !cardDetails.cvv ||
          !cardDetails.cardholderName
        ) {
          alert("Please fill in all card details");
          return;
        }
      }

      const paymentData: CreatePaymentRequest = {
        program_id: fee.program_id,
        amount: fee.amount,
        payment_method: paymentMethod,
      };

      await paymentService.createPayment(paymentData);

      // Redirect to success page or fee history
      navigate("/fee/payment/success", {
        state: {
          fee,
          paymentMethod,
          amount: fee.amount,
        },
      });
    } catch (error) {
      console.error("Failed to process payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fee) {
    return null;
  }

  return (
    <div className="px-4 pr-2 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/fee/unpaid")}
            cornerStyle="bl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO UNPAID FEES
          </Button>
        </div>
        <h1 className="text-3xl font-bold uppercase text-primary-dark mb-4">
          MAKE PAYMENT
        </h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">
          Complete your payment securely using our encrypted payment system.
          Your payment will be processed immediately upon submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card cornerStyle="tl" className="mb-6">
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h3 className="text-lg font-bold text-primary-dark mb-4">
                  SELECT PAYMENT METHOD
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      value: "credit_card",
                      label: "Credit Card",
                      icon: CreditCard,
                    },
                    {
                      value: "debit_card",
                      label: "Debit Card",
                      icon: CreditCard,
                    },
                    {
                      value: "bank_transfer",
                      label: "Bank Transfer",
                      icon: DollarSign,
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setPaymentMethod(method.value)}
                        className={`p-4 border-2 rounded-tl transition-all duration-200 ${
                          paymentMethod === method.value
                            ? "border-primary-yellow bg-yellow-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}>
                        <Icon className="w-6 h-6 mx-auto mb-2 text-primary-dark" />
                        <p className="text-sm font-bold text-primary-dark">
                          {method.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Details Form */}
              {(paymentMethod === "credit_card" ||
                paymentMethod === "debit_card") && (
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-4">
                    CARD DETAILS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        CARDHOLDER NAME *
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={cardDetails.cardholderName}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        CARD NUMBER *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 rounded-tr focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        EXPIRY DATE *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-bl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        required
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-br focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === "bank_transfer" && (
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-4">
                    BANK TRANSFER INSTRUCTIONS
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-tl border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      Please transfer the exact amount to the following bank
                      account:
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Bank:</strong> University Bank
                      </p>
                      <p>
                        <strong>Account Name:</strong> University Fee Collection
                      </p>
                      <p>
                        <strong>Account Number:</strong> 1234567890
                      </p>
                      <p>
                        <strong>Routing Number:</strong> 987654321
                      </p>
                      <p>
                        <strong>Reference:</strong> Fee ID {fee.id} -{" "}
                        {fee.program.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {(paymentMethod === "credit_card" ||
                paymentMethod === "debit_card") && (
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-4">
                    BILLING ADDRESS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        ADDRESS
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingAddress.address}
                        onChange={handleBillingAddressChange}
                        placeholder="123 Main Street"
                        className="w-full px-3 py-2 border border-gray-300 rounded-tl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        CITY
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingAddressChange}
                        placeholder="New York"
                        className="w-full px-3 py-2 border border-gray-300 rounded-tr focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        ZIP CODE
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingAddress.zipCode}
                        onChange={handleBillingAddressChange}
                        placeholder="10001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-bl focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-primary-dark mb-2">
                        COUNTRY
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={billingAddress.country}
                        onChange={handleBillingAddressChange}
                        placeholder="United States"
                        className="w-full px-3 py-2 border border-gray-300 rounded-br focus:outline-none focus:ring-2 focus:ring-primary-yellow"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-text-secondary">
                    I agree to the terms and conditions and authorize this
                    payment. I understand that this payment is non-refundable
                    except as specified in the university's refund policy.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="w-full"
                  cornerStyle="br"
                  disabled={loading || !agreement}>
                  {loading ? (
                    "PROCESSING PAYMENT..."
                  ) : (
                    <>
                      <Lock className="inline w-4 h-4 mr-2" />
                      PAY ${fee.amount}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card cornerStyle="tl" className="sticky top-4">
            <h3 className="text-lg font-bold text-primary-dark mb-4">
              PAYMENT SUMMARY
            </h3>

            {/* Fee Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-bold text-primary-dark">
                  {fee.program.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {fee.program.type}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-secondary mb-1">Description:</p>
                <p className="text-sm">{fee.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary-yellow" />
                <div>
                  <p className="text-xs text-text-secondary">Due Date</p>
                  <p className="text-sm font-bold">
                    {new Date(fee.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Fee Amount:</span>
                <span className="text-sm">${fee.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Processing Fee:</span>
                <span className="text-sm">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">${fee.amount}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-green-50 rounded-tl border border-green-200">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-bold">
                  SECURE PAYMENT
                </p>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your payment information is encrypted and secure.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
