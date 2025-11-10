// Decode JWT token to extract user info
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // The role is stored in Microsoft's standard claim format
  const role =
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  return role || null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem('jwtToken');
  return !!token;
};
