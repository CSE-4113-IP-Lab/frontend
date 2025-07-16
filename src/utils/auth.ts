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
  localStorage.removeItem('user'); // Ensure user data is also removed
};

// For development/testing purposes
export const setTestToken = () => {
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0YWhzaW5AaG90LmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDU2NDc1fQ.PhzVW9ot9OwU-eZBa1ymjC53ZRc8f6m2-sJyhRPhS5s';
  const testUser = {
    id: 4,
    email: 'tahsin@hot.com',
    role: 'faculty', // Example role for testing
  };
  setAuthToken(testToken);
  localStorage.setItem('user', JSON.stringify(testUser)); // Store user data
  console.log('Test token and user set for faculty user');
};

// Get the user's role from localStorage
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || null;
};

// Check if the user is authorized for specific roles
export const isAuthorized = (roles: string[]) => {
  const role = getUserRole();
  if (!role) {
    console.warn('User role not found. Ensure user data is stored in localStorage.');
    return false;
  }
  return roles.includes(role);
};

// Example: Check if the user is logged in
export const isLoggedIn = () => {
  return !!getAuthToken();
};



// // Utility functions for authentication
// export const setAuthToken = (token: string) => {
//   localStorage.setItem('accessToken', token);
// };

// export const getAuthToken = () => {
//   return localStorage.getItem('accessToken');
// };

// export const removeAuthToken = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
// };

// // For development/testing purposes
// export const setTestToken = () => {
//   const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0YWhzaW5AaG90LmNvbSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzUyNDU2NDc1fQ.PhzVW9ot9OwU-eZBa1ymjC53ZRc8f6m2-sJyhRPhS5s';
//   setAuthToken(testToken);
//   console.log('Test token set for faculty user');
// };
// // src/utils/auth.ts
// export const getUserRole = () => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   return user.role || null;
// };

// export const isAuthorized = (roles: string[]) => {
//   const role = getUserRole();
//   return roles.includes(role);
// };
