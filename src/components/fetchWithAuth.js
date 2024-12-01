import { useNavigate } from 'react-router-dom';

export const useFetchWithAuth = () => {
  const navigate = useNavigate();

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`, // Include the token
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      // Handle Unauthorized responses
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate('/auth'); // Redirect to login page
      throw new Error('Unauthorized: Redirecting to login');
    }

    return response;
  };

  return fetchWithAuth;
};
