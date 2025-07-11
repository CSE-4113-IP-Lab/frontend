import React from "react";

interface Props {
  total: number;
  timeSlots: number;
  days: number;
}

const Statistics: React.FC<Props> = ({ total, timeSlots, days }) => (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-700">Total Classes</h3>
      <p className="text-2xl font-bold text-blue-600">{total}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-700">Time Slots</h3>
      <p className="text-2xl font-bold text-green-600">{timeSlots}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-700">Active Days</h3>
      <p className="text-2xl font-bold text-purple-600">{days}</p>
    </div>
  </div>
);

export default Statistics;
