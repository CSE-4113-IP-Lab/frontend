import React, { useState } from 'react';
import { eventService } from '../../services/eventService';

interface RegisterFormProps {
  eventId: number;
  eventTitle: string;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ eventId, eventTitle, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        setError('Please log in to register for events');
        setLoading(false);
        return;
      }

      await eventService.registerForEvent(eventId, parseInt(userId));
      setSubmitted(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to register for event';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-2xl max-w-md mx-auto border">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully registered for <strong className="text-[#14244c]">{eventTitle}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive further details via email soon.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white py-3 px-6 rounded-lg hover:from-[#1e3a5f] hover:to-[#14244c] transition-all duration-200 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-2xl max-w-md mx-auto border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Registration</h2>
        <p className="text-gray-600">
          Register for: <strong className="text-[#14244c]">{eventTitle}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Registration Details:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Free registration for all students and faculty</li>
          <li>• Confirmation email will be sent upon registration</li>
          <li>• Event details and location will be provided via email</li>
          <li>• Limited seats available - register now!</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#14244c] to-[#1e3a5f] text-white hover:from-[#1e3a5f] hover:to-[#14244c] transform hover:scale-105'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Registering...
            </div>
          ) : (
            'Confirm Registration'
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
