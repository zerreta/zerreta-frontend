import axios from 'axios';

// Force using HTTPS for the backend URL
let baseURL = process.env.REACT_APP_API_URL || 'https://zer-backend.onrender.com';

// Make sure we're using https and not a relative URL
if (!baseURL.startsWith('http')) {
  baseURL = 'https://' + baseURL;
} 

// When deployed on Vercel, always use the render.com backend
if (window.location.hostname.includes('vercel.app')) {
  baseURL = 'https://zer-backend.onrender.com';
  console.log('Deployed on Vercel, forcing backend URL to:', baseURL);
}

console.log('Using API URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for potentially slow render.com free tier
  timeout: 30000,
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