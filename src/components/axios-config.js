import axios from 'axios';

// Determine baseURL based on environment
let baseURL;

// When in development (localhost)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  baseURL = 'http://localhost:5000'; 
  console.log('Development environment detected, using localhost backend');
} 
// When deployed on Vercel - always use HTTPS
else if (window.location.hostname.includes('vercel.app')) {
  baseURL = 'https://zer-backend.onrender.com';
  console.log('Deployed on Vercel, using render.com backend');
}
// Fallback to environment variable or default
else {
  baseURL = process.env.REACT_APP_API_URL || 'https://zer-backend.onrender.com';
  console.log('Using environment variable or default backend URL');
}

// Make sure we're using https for production environments
if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
  if (baseURL.startsWith('http:')) {
    baseURL = baseURL.replace('http:', 'https:');
    console.log('Forced HTTP to HTTPS for security');
  }
}

console.log('Final API URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for potentially slow render.com free tier
  timeout: 60000,
});

// Add a request interceptor to include auth token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 