import React, { useState, useEffect } from 'react';
import { equipmentService } from '../services/equipmentService';
import type { Equipment, EquipmentRequest } from '../services/equipmentService';
import { authService } from '../services/authService';

const ApiTestPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Test credentials
  const [testEmail, setTestEmail] = useState('admin@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.login({ email: testEmail, password: testPassword });
      setIsAuthenticated(true);
      console.log('Login successful');
    } catch (err: any) {
      setError(`Login failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setEquipment([]);
    setRequests([]);
  };

  const fetchEquipment = async () => {
    if (!isAuthenticated) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
      console.log('Equipment fetched:', data);
    } catch (err: any) {
      setError(`Failed to fetch equipment: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    if (!isAuthenticated) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await equipmentService.getEquipmentRequests();
      setRequests(data);
      console.log('Requests fetched:', data);
    } catch (err: any) {
      setError(`Failed to fetch requests: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addTestEquipment = async () => {
    if (!isAuthenticated) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newEquipment = await equipmentService.addEquipment({
        name: `Test Equipment ${Date.now()}`,
        description: 'Test equipment for API testing',
        quantity: 5,
        category: 'Testing',
        location: 'Lab 1',
        condition: 'New'
      });
      console.log('Equipment added:', newEquipment);
      await fetchEquipment(); // Refresh the list
    } catch (err: any) {
      setError(`Failed to add equipment: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestRequest = async (equipmentId: number) => {
    if (!isAuthenticated) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newRequest = await equipmentService.createEquipmentRequest({
        equipment_id: equipmentId,
        quantity: 1,
        purpose: 'Testing API integration'
      });
      console.log('Request created:', newRequest);
      await fetchRequests(); // Refresh the list
    } catch (err: any) {
      setError(`Failed to create request: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>
      
      {/* Authentication Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Authentication</h2>
        {!isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-green-600 mb-2">✓ Authenticated</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-blue-600 mb-4">Loading...</div>
      )}

      {/* API Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={fetchEquipment}
          disabled={!isAuthenticated || loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Fetch Equipment
        </button>
        <button
          onClick={fetchRequests}
          disabled={!isAuthenticated || loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Fetch Requests
        </button>
        <button
          onClick={addTestEquipment}
          disabled={!isAuthenticated || loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Add Test Equipment
        </button>
      </div>

      {/* Equipment List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Equipment ({equipment.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white p-4 border rounded-lg shadow">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm">
                Quantity: {item.quantity} | Available: {item.available_quantity}
              </p>
              <p className="text-sm">Location: {item.location}</p>
              <button
                onClick={() => createTestRequest(item.id)}
                disabled={!isAuthenticated || loading || item.available_quantity === 0}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Equipment Requests ({requests.length})</h2>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white p-4 border rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{request.equipment?.name}</h3>
                  <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                  <p className="text-sm">Quantity: {request.quantity}</p>
                  <p className="text-sm">Date: {new Date(request.request_date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
