import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { researchService, type CreateResearchData } from '@/services/ResearchService';
import { AlertCircle, Save, X, Calendar, Building, BookOpen, ExternalLink } from 'lucide-react';

interface AddResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newResearch: any) => void;
}

export const AddResearchModal: React.FC<AddResearchModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateResearchData>({
    type: '',
    title: '',
    description: '',
    date: '',
    institution: '',
    journal: '',
    link: '',
    supervisor_id: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const newResearch = await researchService.createResearch(formData);
      onSuccess(newResearch);
      onClose();
      setFormData({
        type: '',
        title: '',
        description: '',
        date: '',
        institution: '',
        journal: '',
        link: '',
        supervisor_id: 1
      });
    } catch (err) {
      setError('Failed to create research contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'supervisor_id' ? parseInt(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col bg-white shadow-2xl border border-gray-200 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-50/50 px-6 py-4 border-gray-200 border-b">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 text-xl">Add Research Contribution</h2>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
          {error && (
            <div className="bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800 text-sm">Error</p>
                  <p className="mt-1 text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type and Date */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
              <label className="block font-medium text-gray-700 text-sm">
                Research Type
              </label>
              <div className="relative">
                <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="bg-white py-2.5 pr-10 pl-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                >
                <option value="">Select research type</option>
                <option value="Grant">Grant</option>
                <option value="Fellowship">Fellowship</option>
                <option value="Publication">Publication</option>
                </select>
              </div>
              </div>

              <div className="space-y-2">
              <label className="block font-medium text-gray-700 text-sm">
                <Calendar size={16} className="inline mr-1" />
                Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="e.g., 2024 or March 2024"
                required
                className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
              />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 w-full">
              <label className="font-medium text-gray-700 text-sm">
              Title
              </label>
              <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter research title"
              required
              className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-2 w-full">
              <label className="font-medium text-gray-700 text-sm">
              Description
              </label>
              <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Provide a detailed description of the research contribution"
              required
              className="px-2 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors resize-none"
              />
            </div>{/* Institution and Journal */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 text-sm">
                  <Building size={16} className="inline mr-1" />
                  Institution
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Institution name"
                  required
                  className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-gray-700 text-sm">
                  <BookOpen size={16} className="inline mr-1" />
                  Journal/Conference
                </label>
                <input
                  type="text"
                  name="journal"
                  value={formData.journal}
                  onChange={handleInputChange}
                  placeholder="Publication venue"
                  required
                  className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                />
              </div>
            </div>

            {/* Link and Supervisor ID */}
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block font-medium text-gray-700 text-sm">
                  <ExternalLink size={16} className="inline mr-1" />
                  Link <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-gray-700 text-sm">
                  Supervisor ID
                </label>
                <input
                  type="number"
                  name="supervisor_id"
                  value={formData.supervisor_id}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="px-3 py-2.5 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                />
              </div>
            </div>
          </form>
        </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50/50 px-6 py-4 border-gray-200 border-t">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="hover:bg-gray-100 disabled:opacity-50 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Research
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};