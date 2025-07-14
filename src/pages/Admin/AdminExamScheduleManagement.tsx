import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Save,
  X,
  Upload,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import {
  adminService,
  type ExamScheduleCreateRequest,
  type ExamScheduleResponse,
} from "../../services/adminService";
import type { ProgramResponse } from "../../services/programService";

interface ExamScheduleFormData {
  program_id: number;
  type: string;
}

const SCHEDULE_TYPES = [
  { value: "exam", label: "Exam Schedule" },
  { value: "class", label: "Class Schedule" },
  { value: "seminar", label: "Seminar Schedule" },
];

const AdminExamScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamScheduleResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<ExamScheduleResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<number | "">("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const [formData, setFormData] = useState<ExamScheduleFormData>({
    program_id: 0,
    type: "exam",
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [schedulesData, programsData] = await Promise.all([
        adminService.getAllExamSchedules(),
        adminService.getAllPrograms(),
      ]);

      setSchedules(schedulesData);
      setPrograms(programsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading exam schedule data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getProgramById = (programId: number) =>
    programs.find((p) => p.id === programId);

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    const program = getProgramById(schedule.program_id);
    const matchesSearch =
      program?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProgram =
      selectedProgram === "" || schedule.program_id === selectedProgram;
    const matchesType = selectedType === "" || schedule.type === selectedType;

    return matchesSearch && matchesProgram && matchesType;
  });

  // Group schedules by type for better organization
  const schedulesByType = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.type]) {
      acc[schedule.type] = [];
    }
    acc[schedule.type].push(schedule);
    return acc;
  }, {} as Record<string, ExamScheduleResponse[]>);

  // Form handlers
  const openCreateModal = () => {
    setEditingSchedule(null);
    setFormData({
      program_id: programs[0]?.id || 0,
      type: "exam",
    });
    setShowModal(true);
  };

  const openEditModal = (schedule: ExamScheduleResponse) => {
    setEditingSchedule(schedule);
    setFormData({
      program_id: schedule.program_id,
      type: schedule.type,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSchedule) {
        // Update schedule
        await adminService.updateExamSchedule(editingSchedule.id, formData);
      } else {
        // Create schedule
        const createData: ExamScheduleCreateRequest = formData;
        await adminService.createExamSchedule(createData);
      }

      setShowModal(false);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save schedule");
    }
  };

  const handleDelete = async (scheduleId: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await adminService.deleteExamSchedule(scheduleId);
      await loadData(); // Reload data
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete schedule"
      );
    }
  };

  const handleImageUpload = async (scheduleId: number, file: File) => {
    try {
      setUploadingImage(scheduleId);
      await adminService.uploadExamScheduleImage(scheduleId, file);
      await loadData(); // Reload data to show new image
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Exam Schedule Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage exam schedules and timetable images by program
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Schedule
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 font-medium mt-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 relative min-w-64">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedProgram}
                onChange={(e) =>
                  setSelectedProgram(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Programs</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                {SCHEDULE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedules by Type */}
        {Object.entries(schedulesByType).map(([type, typeSchedules]) => (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
              {SCHEDULE_TYPES.find((t) => t.value === type)?.label || type} (
              {typeSchedules.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeSchedules.map((schedule) => {
                const program = getProgramById(schedule.program_id);
                return (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {program?.name || "Unknown Program"}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                              {schedule.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(schedule)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit schedule">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete schedule">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Program: {program?.type || "N/A"}</span>
                        </div>

                        {/* Image Section */}
                        <div className="border-t pt-3">
                          {schedule.image_id ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <ImageIcon className="w-4 h-4" />
                                Schedule image uploaded
                              </div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                View Schedule
                              </button>
                            </div>
                          ) : (
                            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                No schedule image
                              </p>
                              <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                                <Upload className="w-4 h-4" />
                                {uploadingImage === schedule.id
                                  ? "Uploading..."
                                  : "Upload Image"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingImage === schedule.id}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageUpload(schedule.id, file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredSchedules.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No schedules found
            </h3>
            <p className="text-gray-500">
              Get started by creating your first exam schedule.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <select
                    required
                    value={formData.program_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        program_id: parseInt(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={0}>Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} ({program.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SCHEDULE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                <p className="text-sm text-gray-600">
                  After creating the schedule entry, you can upload the schedule
                  image using the "Upload Image" button in the schedule card.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Save className="w-4 h-4" />
                  {editingSchedule ? "Update" : "Create"} Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExamScheduleManagement;
