import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  FileText,
  Eye,
  Edit,
  Trash,
  Filter,
  Search,
} from "lucide-react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import type { Payment, Fee } from "../../services/paymentService";

const Fee: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [unpaidFees, setUnpaidFees] = useState<Fee[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"student" | "admin" | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    if (userRole === "admin") {
      setViewMode("admin");
    } else {
      setViewMode("student");
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRole = localStorage.getItem("role");

      if (userRole === "admin") {
        // Admin can see all payments and fees
        const [allPayments, allFees] = await Promise.all([
          paymentService.getAllPayments(),
          paymentService.getAllFees(),
        ]);
        setPayments(allPayments);
        setFees(allFees);
      } else {
        // Students see their own payments and unpaid fees
        const [myPayments, myUnpaidFees] = await Promise.all([
          paymentService.getMyPayments(),
          paymentService.getMyUnpaidFees(),
        ]);
        setPayments(myPayments);
        setUnpaidFees(myUnpaidFees);
      }
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
      setError("Failed to load payment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      payment.program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student.user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.id.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
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

  const handleDeleteFee = async (feeId: number) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        await paymentService.deleteFee(feeId);
        setFees(fees.filter((fee) => fee.id !== feeId));
      } catch (error) {
        console.error("Failed to delete fee:", error);
        setError("Failed to delete fee. Please try again.");
      }
    }
  };

  const handleUpdatePaymentStatus = async (
    paymentId: number,
    status: "pending" | "completed" | "failed"
  ) => {
    try {
      await paymentService.updatePaymentStatus(paymentId, { status });
      setPayments(
        payments.map((payment) =>
          payment.id === paymentId ? { ...payment, status } : payment
        )
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setError("Failed to update payment status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-lg text-gray-600">Loading payment data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Fee Management</h1>
              <p className="text-blue-200 mt-1">
                {viewMode === "admin"
                  ? "Manage fee structures, payment deadlines, and monitor all transactions."
                  : "View your payment history, outstanding fees, and make payments."}
              </p>
            </div>
            {viewMode === "admin" && (
              <div className="flex space-x-3">
                <Button
                  onClick={() => navigate("/fee/create")}
                  className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus size={20} />
                  Create Fee
                </Button>
                <Button
                  onClick={() => navigate("/fee/payments")}
                  className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Eye size={20} />
                  All Payments
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Student Unpaid Fees Alert */}
          {viewMode === "student" && unpaidFees.length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Outstanding Fees
                    </h3>
                    <p className="text-red-700">
                      You have {unpaidFees.length} unpaid fee(s). Please make
                      payments before the due date.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/fee/unpaid")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  View Unpaid
                </Button>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-blue-900" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                Filter & Search
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by program, student, or payment ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600">
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-blue-900" size={24} />
              Payment History
            </h2>

            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Program
                      </th>
                      {viewMode === "admin" && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              #{payment.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.program.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.program.type}
                            </div>
                          </div>
                        </td>
                        {viewMode === "admin" && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.student.user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.student.registration_number}
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            ${payment.amount}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {viewMode === "admin" ? (
                            <select
                              value={payment.status}
                              onChange={(e) =>
                                handleUpdatePaymentStatus(
                                  payment.id,
                                  e.target.value as
                                    | "pending"
                                    | "completed"
                                    | "failed"
                                )
                              }
                              className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(
                                payment.status
                              )}`}>
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                payment.status
                              )}`}>
                              {getStatusIcon(payment.status)}
                              <span className="ml-1">{payment.status}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {new Date(
                              payment.transaction_date
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Button
                            onClick={() =>
                              navigate(`/fee/payment/${payment.id}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                            <Eye size={14} />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  No payments found matching your criteria.
                </p>
                <Button
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Admin Fee Management */}
          {viewMode === "admin" && fees.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="text-blue-900" size={24} />
                Fee Structures
              </h2>

              <div className="grid gap-4">
                {fees.map((fee) => (
                  <div
                    key={fee.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {fee.program.name} - {fee.program.type}
                        </h3>
                        <p className="text-gray-600 mt-1">{fee.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xl font-bold text-blue-600">
                            ${fee.amount}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar size={14} />
                            Due: {new Date(fee.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => navigate(`/fee/edit/${fee.id}`)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                          <Edit size={14} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteFee(fee.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                          <Trash size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fee;
