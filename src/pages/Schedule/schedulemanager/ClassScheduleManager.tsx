import React, { useState } from "react";
import type { ScheduleEntry } from "../../../types";

const initialForm: ScheduleEntry & { day: string; time: string } = {
  courseCode: "",
  courseName: "",
  batch: "",
  semester: "",
  instructor: "",
  room: "",
  day: "",
  time: "",
};

const ClassScheduleManager: React.FC = () => {
  const [formData, setFormData] = useState(initialForm);
  const [data, setData] = useState<(ScheduleEntry & { id: number; day: string; time: string })[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
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
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleDelete = (id: number) => setData(data.filter((d) => d.id !== id));
  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "Add"} Class</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(initialForm).map((key) => (
          <input
            key={key}
            name={key}
            value={(formData as any)[key]}
            onChange={handleChange}
            placeholder={key}
            className="border px-3 py-2 rounded"
          />
        ))}
        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white px-4 py-2 rounded col-span-2"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Class Schedule List</h3>
        {data.map((item) => (
          <div key={item.id} className="bg-gray-100 p-3 mb-2 rounded flex justify-between items-center">
            <div>
              <strong>{item.courseCode}</strong> — {item.courseName} ({item.day}, {item.time})
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

export default ClassScheduleManager;
