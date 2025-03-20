import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    
    // Hardcoded URL to ensure correct endpoint
    const backendUrl = 'https://zer-backend.onrender.com';
    
    console.log(`Sending login request to ${backendUrl}/login with role: ${role}`);
    
    fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        role
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      
      // Redirect to dashboard
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to server');
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