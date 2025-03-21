import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
  Divider,
  Alert,
  Fade,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';
import './Login.css';
// Import images directly
import quoteImg from '../assets/quote.png';
import sunImg from '../assets/sun.png';
import kidQuoteImg from '../assets/kid-quote.png';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: theme.palette.background.default
}));

const LoginLeft = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#7445f8',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const QuoteImage = styled('img')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90%',
  maxHeight: '90%',
  objectFit: 'contain',
  zIndex: 2
});

const SunImage = styled('img')({
  position: 'absolute',
  top: '-7%',
  right: '10%',
  maxWidth: '350px',
  maxHeight: '350px',
  objectFit: 'contain',
  zIndex: 1
});

const KidQuoteImage = styled('img')({
  position: 'absolute',
  top: '60%',
  left: '2%',
  maxWidth: '600px',
  maxHeight: '600px',
  objectFit: 'contain',
  zIndex: 1
});

const LoginRight = styled(Box)(({ theme }) => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));

const LoginBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 600,
  borderRadius: 8,
  textTransform: 'none',
  backgroundColor: '#7445f8',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5c33d4',
  }
}));

const Logo = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& h1': {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    fontWeight: 700,
    fontSize: '2.25rem',
    color: '#7445f8',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  '& h2': {
    fontFamily: '"Poppins", "Roboto", sans-serif',
    fontWeight: 500,
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    marginTop: '4px'
  }
}));

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [backendUrl, setBackendUrl] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('student');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setBackendUrl(axiosInstance.defaults.baseURL);
    
    // Clear any existing tokens on login page load
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (_, newRole) => {
    setRole(newRole);
    setError('');
  };

  const fillDefaultCredentials = () => {
    if (role === 'admin') {
      setFormData({
        username: 'admin',
        password: 'admin123'
      });
    } else {
      setFormData({
        username: 'student',
        password: 'student123'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Sending login request to:', backendUrl);
      
      const response = await axiosInstance.post('/login', {
        username: formData.username,
        password: formData.password,
        role
      });
      
      console.log('Login successful:', response.data);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      
      if (rememberMe) {
        // If remember me is checked, store credential preference
        localStorage.setItem('rememberMe', 'true');
      } else {
        // Otherwise, ensure it's cleared
        localStorage.removeItem('rememberMe');
      }
      
      // Force direct navigation
      window.location.href = role === 'admin' ? '/admin' : '/student-dashboard';
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError(error.response?.data?.message || 'Invalid credentials.');
      } else if (error.message === 'Network Error') {
        setError('Cannot connect to the server.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginLeft>
        {/* Images for the left side */}
        <QuoteImage src={quoteImg} alt="Inspirational Quote" />
        <SunImage src={sunImg} alt="Sun" />
        <KidQuoteImage src={kidQuoteImg} alt="Kid Quote" />
      </LoginLeft>
      
      <LoginRight>
        <LoginBox>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Logo>
              <h1>ZERRETA LEARNINGS</h1>
              <h2>Innovate | Empower | Elevate</h2>
            </Logo>
            
            <Divider sx={{ mt: 2, mb: 3 }} />
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Tabs
              value={role}
              onChange={handleRoleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab 
                label="Student" 
                value="student" 
              />
              <Tab 
                label="Admin" 
                value="admin" 
              />
            </Tabs>
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={!!error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember Me"
              sx={{ mb: 2 }}
            />

            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign in'
              )}
            </StyledButton>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                size="small"
                color="primary"
                onClick={fillDefaultCredentials}
                sx={{ textTransform: 'none', color: '#7445f8' }}
              >
                Use demo credentials
              </Button>
            </Box>
          </Box>
        </LoginBox>
      </LoginRight>
    </LoginContainer>
  );
}

export default Login; 