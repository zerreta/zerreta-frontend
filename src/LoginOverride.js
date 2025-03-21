import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './components/axios-config';

// This is a completely new Login component that bypasses all existing code
const LoginOverride = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendUrl, setBackendUrl] = useState('');
  
  // Get the backend URL from axios config
  useEffect(() => {
    setBackendUrl(axiosInstance.defaults.baseURL);
  }, []);
  
  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (e.target.value === 'admin') {
      setCredentials({
        username: 'admin',
        password: 'admin123'
      });
    } else {
      setCredentials({
        username: 'student',
        password: 'student123'
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log(`Sending login request to ${backendUrl}/login with role: ${role}`);
    
    // Use axiosInstance instead of fetch
    axiosInstance.post('/login', {
      username: credentials.username,
      password: credentials.password,
      role
    })
    .then(response => {
      console.log('Login successful:', response.data);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      
      // Force navigation
      console.log('Redirecting to', role === 'admin' ? '/admin' : '/student-dashboard');
      
      // Redirect to dashboard
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/student-dashboard';
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to server');
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box width="100%">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            
            {backendUrl && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Connecting to: {backendUrl}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <FormLabel>Role</FormLabel>
                <RadioGroup row value={role} onChange={handleRoleChange}>
                  <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                </RadioGroup>
              </FormControl>
              
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                margin="normal"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginOverride; 