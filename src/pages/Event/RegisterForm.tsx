import React, { useState } from 'react';

interface RegisterFormProps {
  eventId: number;
  eventTitle: string;
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ eventId, eventTitle, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }

    // Simulate API call
    console.log('Registering:', { eventId, name, email });
    setSubmitted(true);
    setError('');
  };

  if (submitted) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Registration Successful!</h2>
        <p className="mb-4">Thanks for registering for <strong>{eventTitle}</strong>.</p>
        <button
          onClick={onClose}
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register for: {eventTitle}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
