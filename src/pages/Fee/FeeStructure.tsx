import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

const FeeStructure = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    // if (!isAuthorized(["admin", "student", "faculty"])) {
    //   navigate("/unauthorized");
    // } else {
      fetchFees();
    // }
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/payments/fees");
      setFees(response.data);
    } catch (err) {
      setError("Failed to fetch fees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (role === "admin") {
      try {
        await axios.delete(`/api/v1/payments/fees/${id}`);
        fetchFees();
      } catch (err) {
        alert("Failed to delete fee. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fee Structure</h1>
          {role === "admin" && (
            <button
              onClick={() => navigate("/fee/create")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Fee
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading fees...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : fees.length === 0 ? (
          <p className="text-center text-gray-500">No fees available.</p>
        ) : (
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
                  {role === "admin" && (
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fees.map((fee: any) => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {fee.program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      ${fee.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {fee.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(fee.due_date).toLocaleDateString()}
                    </td>
                    {role === "admin" && (
                      <td className="px-6 py-4 text-sm text-gray-800 flex space-x-2">
                        <button
                          onClick={() => navigate(`/fee/edit/${fee.id}`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fee.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeStructure;
