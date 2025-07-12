import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Search,
  Save,
  X,
  Calendar,
} from "lucide-react";
import {
  adminService,
  type ProgramCreateRequest,
  type ProgramUpdateRequest,
} from "../../services/adminService";
import type { ProgramResponse } from "../../services/programService";

interface ProgramFormData {
  name: string;
  type: string;
  duration: number;
  description: string;
  is_active: number;
}

const AdminProgramManagement: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<ProgramFormData>({
    name: "",
    type: "Undergraduate",
    duration: 4,
    description: "",
    is_active: 1,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const programsData = await adminService.getAllPrograms();
      setPrograms(programsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs");
      console.error("Error loading program data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter programs
  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      name: "",
      type: "Undergraduate",
      duration: 4,
      description: "",
      is_active: 1,
    });
    setShowModal(true);
  };

  const openEditModal = (program: ProgramResponse) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      type: program.type || "Undergraduate",
      duration: program.duration || 4,
      description: program.description || "",
      is_active: program.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProgram) {
        // Update program
        const updateData: ProgramUpdateRequest = formData;
        await adminService.updateProgram(editingProgram.id, updateData);
      } else {
        // Create program
        const createData: ProgramCreateRequest = formData;
        await adminService.createProgram(createData);
      }

      setShowModal(false);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save program");
    }
  };

  const handleDelete = async (programId: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      await adminService.deleteProgram(programId);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete program");
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
                Program Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage academic programs and degree requirements
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Program
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

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {program.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {program.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(program)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Edit program">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete program">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {program.duration} years
                  </div>

                  {program.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {program.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        program.is_active === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {program.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No programs found
            </h3>
            <p className="text-gray-500">
              Get started by creating your first academic program.
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
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.is_active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: parseInt(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                  {editingProgram ? "Update" : "Create"} Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgramManagement;
