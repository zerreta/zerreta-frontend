import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Alert, Paper, CircularProgress } from '@mui/material';
import axiosInstance from './components/axios-config';

const TestConnection = () => {
  const [backendUrl, setBackendUrl] = useState('');
  const [pingResult, setPingResult] = useState(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [loginResult, setLoginResult] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authString, setAuthString] = useState('');

  useEffect(() => {
    setBackendUrl(axiosInstance.defaults.baseURL);

    // Display auth information
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setAuthString(`Authenticated as ${role || 'unknown role'}`);
    } else {
      setAuthString('Not authenticated');
    }
  }, []);

  const testPing = async () => {
    setPingLoading(true);
    setPingResult(null);
    
    try {
      console.log('Testing connection to:', backendUrl);
      const response = await axiosInstance.get('/');
      console.log('Ping response:', response);
      setPingResult({
        success: true,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      console.error('Ping error:', error);
      setPingResult({
        success: false,
        error: error.message,
        response: error.response?.data || 'No response data'
      });
    } finally {
      setPingLoading(false);
    }
  };

  const testLogin = async () => {
    setLoginLoading(true);
    setLoginResult(null);
    
    try {
      console.log('Testing login to:', backendUrl);
      const response = await axiosInstance.post('/login', {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      
      console.log('Login response:', response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'admin');
      
      setLoginResult({
        success: true,
        status: response.status,
        data: response.data
      });
      
      setAuthString('Authenticated as admin');
    } catch (error) {
      console.error('Login error:', error);
      setLoginResult({
        success: false,
        error: error.message,
        response: error.response?.data || 'No response data'
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthString('Not authenticated');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Backend Connection Test
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Connection Info
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            Backend URL: {backendUrl || 'Not configured'}
          </Alert>
          
          <Alert severity={authString.includes('Not') ? 'warning' : 'success'} sx={{ mb: 2 }}>
            {authString}
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={testPing}
              disabled={pingLoading}
            >
              {pingLoading ? <CircularProgress size={24} /> : 'Test Connection'}
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary"
              onClick={testLogin}
              disabled={loginLoading}
            >
              {loginLoading ? <CircularProgress size={24} /> : 'Test Login'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="error"
              onClick={clearAuth}
            >
              Clear Auth
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {pingResult && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Connection Test Result:
          </Typography>
          
          {pingResult.success ? (
            <Alert severity="success">
              Connection successful (Status: {pingResult.status})
            </Alert>
          ) : (
            <Alert severity="error">
              Connection failed: {pingResult.error}
            </Alert>
          )}
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Response data:
          </Typography>
          
          <Box component="pre" sx={{ 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            overflow: 'auto'
          }}>
            {JSON.stringify(pingResult.data || pingResult.response, null, 2)}
          </Box>
        </Paper>
      )}
      
      {loginResult && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Login Test Result:
          </Typography>
          
          {loginResult.success ? (
            <Alert severity="success">
              Login successful (Status: {loginResult.status})
            </Alert>
          ) : (
            <Alert severity="error">
              Login failed: {loginResult.error}
            </Alert>
          )}
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Response data:
          </Typography>
          
          <Box component="pre" sx={{ 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            overflow: 'auto'
          }}>
            {JSON.stringify(loginResult.data || loginResult.response, null, 2)}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TestConnection; 