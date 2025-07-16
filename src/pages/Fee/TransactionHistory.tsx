import axios from "axios";
import { useEffect, useState } from "react";
import { getUserRole } from "../../utils/auth";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const role = getUserRole();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const endpoint =
        role === "student" ? "/api/v1/payments/me" : "/api/v1/payments";
      const response = await axios.get(endpoint);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Transaction History
        </h1>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Transaction Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transaction.program?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {transaction.payment_method}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${
                        transaction.status === "completed"
                          ? "text-green-600"
                          : transaction.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
