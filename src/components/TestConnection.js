import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from './axios-config';
import { Box, Typography, Button, Paper, CircularProgress, TextField } from '@mui/material';

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [directUrl, setDirectUrl] = useState('https://zer-backend.onrender.com');

  // Test connection using axios instance
  const testAxiosInstance = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axiosInstance.get('/');
      setResponse(res.data);
      console.log('Response:', res.data);
    } catch (err) {
      setError(err.toString());
      console.error('Error using axios instance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test connection using direct axios to root URL
  const testDirectAxios = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.get(directUrl);
      setResponse(res.data);
      console.log('Direct response:', res.data);
    } catch (err) {
      setError(err.toString());
      console.error('Error with direct axios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test health endpoint
  const testHealthEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.get(`${directUrl}/api/health`);
      setResponse(res.data);
      console.log('Health response:', res.data);
    } catch (err) {
      setError(err.toString());
      console.error('Error checking health endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test echo endpoint
  const testEchoEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.post(`${directUrl}/api/echo`, {
        message: 'Hello from test page',
        timestamp: new Date().toISOString()
      });
      setResponse(res.data);
      console.log('Echo response:', res.data);
    } catch (err) {
      setError(err.toString());
      console.error('Error with echo endpoint:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>API Connection Tester</Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Backend URL"
          value={directUrl}
          onChange={(e) => setDirectUrl(e.target.value)}
          margin="normal"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" onClick={testAxiosInstance} disabled={loading}>
          Test Axios Instance
        </Button>
        <Button variant="contained" onClick={testDirectAxios} disabled={loading}>
          Test Direct URL
        </Button>
        <Button variant="contained" onClick={testHealthEndpoint} disabled={loading}>
          Test Health Endpoint
        </Button>
        <Button variant="contained" onClick={testEchoEndpoint} disabled={loading}>
          Test Echo Endpoint
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper sx={{ p: 2, bgcolor: '#ffebee', mb: 3 }}>
          <Typography variant="h6" color="error">Error:</Typography>
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {error}
          </Typography>
        </Paper>
      )}

      {response && (
        <Paper sx={{ p: 2, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="h6" color="success.main">Response:</Typography>
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(response, null, 2)}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Environment Info:</Typography>
        <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {`REACT_APP_API_URL: ${process.env.REACT_APP_API_URL || 'Not set'}`}
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestConnection; 