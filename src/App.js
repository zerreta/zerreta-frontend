import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentLevels from './components/StudentLevels';
import Progress from './components/Progress';
import Analytics from './components/Analytics';
import AIHelp from './components/AIHelp';
import Leaderboard from './components/Leaderboard';
import TestPage from './components/TestPage';
import QuestionManager from './components/QuestionManager';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import theme from './theme';
import './App.css';
import LeaderboardPage from './components/LeaderboardPage';
import StudentPoints from './components/StudentPoints';
import AnalyticsSummary from './components/AnalyticsSummary';
import TestHistory from './components/TestHistory';
import TestResults from './components/TestResults';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Import the new pages from the pages directory
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';

// Create a simple TestSelection component
const TestSelection = () => {
  return (
    <div>
      <h2>Select a Test</h2>
      <p>Choose a subject and level to begin your test.</p>
    </div>
  );
};

// Add fonts from Google Fonts
const globalStyles = (
  <GlobalStyles
    styles={{
      '@import': 'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap")',
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      body: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        backgroundColor: '#f9fafb',
      },
    }}
  />
);

function App() {
  // Clear any potential stored auth data when the app loads for the first time in a session
  useEffect(() => {
    // Check if this is the first load in this browser session
    const isFirstLoadInSession = !sessionStorage.getItem('appInitialized');
    
    if (isFirstLoadInSession) {
      // Clear authentication data to force login
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Mark that the app has been initialized in this session
      sessionStorage.setItem('appInitialized', 'true');
    }
  }, []);
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // Additional validation could be added here to check token validity
    return !!token;
  };

  const isAdmin = () => {
    const role = localStorage.getItem('role');
    return role === 'admin';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <Router>
        <PWAInstallPrompt />
        <Routes>
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? (
                isAdmin() ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student-dashboard" replace />
                )
              ) : (
                <Login />
              )
            } 
          />
          
          {/* Admin routes with AdminLayout */}
          <Route 
            path="/admin"
            element={
              isAuthenticated() && isAdmin() ? (
                <AdminLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="student-levels" element={<StudentLevels />} />
            <Route path="questions" element={<QuestionManager />} />
            <Route path="student-points" element={<StudentPoints />} />
            <Route path="student-data" element={<div>Student Data Coming Soon</div>} />
          </Route>
          
          {/* Student Dashboard routes */}
          <Route 
            path="/student-dashboard" 
            element={
              isAuthenticated() && !isAdmin() ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="progress" element={<Progress />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics-summary" element={<AnalyticsSummary />} />
            <Route path="ai-help" element={<AIHelp />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            {/* <Route path="test-history" element={<TestHistory />} /> */}
          </Route>
          
          
          
          {/* TestResults route moved outside DashboardLayout */}
          <Route
            path="/student-dashboard/test-results/:testId"
            element={
              isAuthenticated() && !isAdmin() ? (
                <TestResults />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          <Route
            path="/test"
            element={
              isAuthenticated() && !isAdmin() ? (
                <TestPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
