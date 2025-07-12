import React, { useState } from "react";
import type { ExamScheduleItem } from "../../../types";

const initialExam: ExamScheduleItem = {
  id: 0,
  courseName: "",
  examDate: "",
  examTime: "",
  roomNo: "",
  level: "Undergraduate",
};

const ExamScheduleManager: React.FC = () => {
  const [formData, setFormData] = useState<ExamScheduleItem>(initialExam);
  const [data, setData] = useState<ExamScheduleItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (editingId !== null) {
      setData((prev) =>
        prev.map((d) => (d.id === editingId ? { ...formData, id: editingId } : d))
      );
    } else {
      const id = Date.now();
      setData([...data, { ...formData, id }]);
    }
    setFormData(initialExam);
    setEditingId(null);
  };

  const handleEdit = (item: ExamScheduleItem) => {
    setFormData(item);
    setEditingId(item.id);
  };

  const handleDelete = (id: number) => setData(data.filter((d) => d.id !== id));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} Exam</h2>
      <div className="grid grid-cols-2 gap-4">
        <input name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Course Name" className="border px-3 py-2 rounded" />
        <input type="date" name="examDate" value={formData.examDate} onChange={handleChange} className="border px-3 py-2 rounded" />
        <input name="examTime" value={formData.examTime} onChange={handleChange} placeholder="Time" className="border px-3 py-2 rounded" />
        <input name="roomNo" value={formData.roomNo} onChange={handleChange} placeholder="Room No" className="border px-3 py-2 rounded" />
        <select name="level" value={formData.level} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="Undergraduate">Undergraduate</option>
          <option value="Masters">Masters</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white px-4 py-2 rounded col-span-2"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Exam Schedule List</h3>
        {data.map((item) => (
          <div key={item.id} className="bg-gray-100 p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <strong>{item.courseName}</strong> — {item.examDate} at {item.examTime}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamScheduleManager;
