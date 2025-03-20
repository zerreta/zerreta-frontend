import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  
  // The backend URLs to test
  const backendUrls = [
    'https://zer-backend.onrender.com',
    'https://zerreta-backend-1.onrender.com',
    process.env.REACT_APP_API_URL || 'http://localhost:5000'
  ];

  // Test connection to a specific URL
  const testConnection = async (url) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      console.log(`Testing connection to: ${url}`);
      const res = await axios.get(`${url}/api/health`);
      setResponse({
        url,
        data: res.data,
        status: res.status
      });
      console.log('Response:', res);
    } catch (err) {
      console.error(`Error connecting to ${url}:`, err);
      setError({
        url,
        message: err.message,
        code: err.code
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>API Connection Tester</Typography>
      
      <Typography paragraph>
        Testing connection to backend APIs to help diagnose connection issues.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Environment Variables:</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography>REACT_APP_API_URL: {process.env.REACT_APP_API_URL || 'Not set'}</Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {backendUrls.map((url) => (
          <Button 
            key={url}
            variant="contained" 
            onClick={() => testConnection(url)} 
            disabled={loading}
          >
            Test {url}
          </Button>
        ))}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper sx={{ p: 2, bgcolor: '#ffebee', mb: 3 }}>
          <Typography variant="h6" color="error">Error:</Typography>
          <Typography><strong>URL:</strong> {error.url}</Typography>
          <Typography><strong>Message:</strong> {error.message}</Typography>
          <Typography><strong>Code:</strong> {error.code}</Typography>
        </Paper>
      )}

      {response && (
        <Paper sx={{ p: 2, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="h6" color="success.main">Success!</Typography>
          <Typography><strong>URL:</strong> {response.url}</Typography>
          <Typography><strong>Status:</strong> {response.status}</Typography>
          <Typography variant="h6">Response Data:</Typography>
          <Box component="pre" sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1,
            overflowX: 'auto'
          }}>
            {JSON.stringify(response.data, null, 2)}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TestConnection; 