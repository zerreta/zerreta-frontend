import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './axios-config';
import { Box, Typography, Button, Paper, CircularProgress, Alert, Divider, Chip } from '@mui/material';

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [configData, setConfigData] = useState({});
  
  // The backend URLs to test
  const backendUrls = [
    'https://zer-backend.onrender.com',
    process.env.REACT_APP_API_URL || 'http://localhost:5000'
  ];

  // Get configuration information on component mount
  useEffect(() => {
    setConfigData({
      apiUrl: axiosInstance.defaults.baseURL,
      hostname: window.location.hostname,
      environment: process.env.NODE_ENV,
      reactAppApiUrl: process.env.REACT_APP_API_URL || 'Not set'
    });
  }, []);

  // Test connection using axios directly
  const testDirectConnection = async (url) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log(`Testing direct connection to: ${url}`);
      const res = await axios.get(`${url}/api/health`);
      setResponse({
        type: 'direct',
        url,
        data: res.data,
        status: res.status
      });
      console.log('Direct response:', res);
    } catch (err) {
      console.error(`Error connecting directly to ${url}:`, err);
      setError({
        type: 'direct',
        url,
        message: err.message,
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  };

  // Test connection using axiosInstance
  const testAxiosInstance = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log(`Testing axiosInstance connection to: ${axiosInstance.defaults.baseURL}`);
      const res = await axiosInstance.get('/api/health');
      setResponse({
        type: 'axiosInstance',
        url: axiosInstance.defaults.baseURL,
        data: res.data,
        status: res.status
      });
      console.log('axiosInstance response:', res);
    } catch (err) {
      console.error(`Error connecting with axiosInstance:`, err);
      setError({
        type: 'axiosInstance',
        url: axiosInstance.defaults.baseURL,
        message: err.message,
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>API Connection Tester</Typography>
      
      <Typography paragraph>
        This tool helps diagnose connection issues between your frontend and backend.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Environment Information:</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography><strong>Current API URL:</strong> {configData.apiUrl || 'Loading...'}</Typography>
          <Typography><strong>Hostname:</strong> {configData.hostname || 'Loading...'}</Typography>
          <Typography><strong>Environment:</strong> {configData.environment || 'Loading...'}</Typography>
          <Typography><strong>REACT_APP_API_URL:</strong> {configData.reactAppApiUrl || 'Not set'}</Typography>
        </Paper>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Chip label="Direct Connection Tests" />
      </Divider>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {backendUrls.map((url) => (
          <Button 
            key={url}
            variant="contained" 
            onClick={() => testDirectConnection(url)} 
            disabled={loading}
          >
            Test Direct Connection to {url}
          </Button>
        ))}
      </Box>

      <Divider sx={{ my: 3 }}>
        <Chip label="Axios Instance Test" />
      </Divider>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={testAxiosInstance} 
          disabled={loading}
          fullWidth
        >
          Test Using axiosInstance
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle1"><strong>Error Type:</strong> {error.type} connection</Typography>
          <Typography><strong>URL:</strong> {error.url}</Typography>
          <Typography><strong>Message:</strong> {error.message}</Typography>
          <Typography><strong>Code:</strong> {error.code}</Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Possible Solution:</Typography>
            {error.code === 'ERR_NETWORK' && (
              <Typography>
                The server at {error.url} is unreachable. Possible causes:
                <ul>
                  <li>The backend server is not running or has crashed</li>
                  <li>There's a network connectivity issue</li>
                  <li>CORS is not properly configured on the backend</li>
                  <li>The URL is incorrect</li>
                </ul>
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {response && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle1"><strong>Success!</strong> ({response.type} connection)</Typography>
          <Typography><strong>URL:</strong> {response.url}</Typography>
          <Typography><strong>Status:</strong> {response.status}</Typography>
          <Typography variant="subtitle2">Response Data:</Typography>
          <Box component="pre" sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            overflowX: 'auto'
          }}>
            {JSON.stringify(response.data, null, 2)}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography>
              Your API is connected properly! If other parts of your application are still having issues,
              check the specific API calls they're making.
            </Typography>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default TestConnection; 