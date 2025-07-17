import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  Calendar,
  CreditCard,
  User,
  Filter,
} from "lucide-react";
import Button from "../../components/Button";
import { paymentService } from "../../services/paymentService";
import type { Payment } from "../../services/paymentService";

const AllPayments: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Failed", value: "failed" },
  ];

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem("role");
    if (userRole !== "admin") {
      navigate("/fee");
      return;
    }

    fetchAllPayments();
  }, [navigate]);

  const fetchAllPayments = async () => {
    setLoading(true);
    try {
      const paymentsData = await paymentService.getAllPayments();
      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = React.useCallback(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.student.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.student.registration_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.program.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Filter by program
    if (programFilter !== "all") {
      filtered = filtered.filter(
        (payment) => payment.program_id.toString() === programFilter
      );
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, programFilter]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleUpdateStatus = async (
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
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Payment ID",
      "Student Name",
      "Registration Number",
      "Program",
      "Amount",
      "Payment Method",
      "Status",
      "Transaction Date",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredPayments.map((payment) =>
        [
          payment.id,
          payment.student.user.username,
          payment.student.registration_number,
          `"${payment.program.name}"`,
          payment.amount,
          payment.payment_method,
          payment.status,
          new Date(payment.transaction_date).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-lg text-gray-600">Loading all payments...</div>
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
              <h1 className="text-2xl font-bold">All Payments</h1>
              <p className="text-blue-200 mt-1">
                View and manage all payment transactions across all programs.
                Filter, search, and export payment data.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate("/fee")}
                className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Fees
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {payments.length}
              </p>
              <p className="text-sm text-gray-500">Total Payments</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {payments.filter((p) => p.status === "completed").length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {payments.filter((p) => p.status === "pending").length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                $
                {payments
                  .reduce((total, payment) => total + payment.amount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="text-blue-900" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">
                Search & Filter
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Payments
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
                    placeholder="Search by student name, ID, or program..."
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
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setProgramFilter("all");
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
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
                      <span className="text-sm font-medium text-gray-900">
                        #{payment.id}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-blue-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.student.user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.student.registration_number}
                          </div>
                        </div>
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
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        ${payment.amount}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm capitalize">
                          {payment.payment_method.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={payment.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            payment.id,
                            e.target.value as "pending" | "completed" | "failed"
                          )
                        }
                        className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(
                          payment.status
                        )}`}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <div>
                          <div>
                            {new Date(
                              payment.transaction_date
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              payment.transaction_date
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button
                        onClick={() => navigate(`/fee/payment/${payment.id}`)}
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

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                No payments found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setProgramFilter("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPayments;
