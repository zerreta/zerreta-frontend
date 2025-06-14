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
  console.log('Deployed on Vercel, using zer-backend.onrender.com');
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

// Additional check to ensure baseURL is not empty or undefined
if (!baseURL) {
  baseURL = 'http://localhost:5000'; // Default fallback
  console.warn('No API URL detected, falling back to localhost:5000');
}

console.log('Final API URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for potentially slow render.com free tier
  timeout: 30000, // 30 seconds timeout
});

// Add a request interceptor to include auth token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx
    const method = response.config.method.toUpperCase();
    const url = response.config.url;
    
    console.log(`${method} ${url} - Status: ${response.status}`);
    
    // Return the response to continue the chain
    return response;
  },
  (error) => {
    // Log errors for debugging
    console.error('API Error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Error ${error.response.status} for ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.config?.url);
      // Provide more user-friendly error message for network issues
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    // Pass the error down the chain
    return Promise.reject(error);
  }
);

// Add helper methods for common operations
axiosInstance.testConnection = async () => {
  try {
    const response = await axiosInstance.get('/health');
    return response.data && response.data.status === 'ok';
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

export default axiosInstance; 