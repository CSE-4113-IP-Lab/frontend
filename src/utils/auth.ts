// Utility functions for authentication
export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// For development/testing purposes
export const setTestToken = () => {
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0YWhzaW5AaG90LmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDU2NDc1fQ.PhzVW9ot9OwU-eZBa1ymjC53ZRc8f6m2-sJyhRPhS5s';
  setAuthToken(testToken);
  console.log('Test token set for faculty user');
};
