import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentDeadlines = () => {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const response = await axios.get("/api/v1/payments/fees");
      setDeadlines(response.data);
    } catch (error) {
      console.error("Error fetching payment deadlines:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Deadlines
        </h1>
        {deadlines.length > 0 ? (
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deadlines.map((deadline: any) => (
                  <tr key={deadline.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {deadline.program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      ${deadline.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {deadline.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(deadline.due_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No payment deadlines available.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentDeadlines;
