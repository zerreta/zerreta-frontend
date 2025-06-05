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
import StudentData from './components/StudentData';
import InstitutionsList from './components/InstitutionsList';
import InstitutionStudents from './components/InstitutionStudents';
import Syllabus from './components/Syllabus';
import Resources from './components/Resources';

// Import the new AdvancedAssessment component
import AdvancedAssessment from './components/AdvancedAssessment';

// Import the new AdminTestHistory component
import AdminTestHistory from './components/AdminTestHistory';

// Import Grammar components
import GrammarQuestionManager from './components/GrammarQuestionManager';
import GrammarTest from './components/GrammarTest';

// Import Speaky, Apti, Codezy, MathOrbit, and ExtrasPage components
import Speaky from './components/Speaky';
import SpeakyGrammar from './components/SpeakyGrammar';
import BeginnerGrammar from './components/BeginnerGrammar';
import Vocabulary from './components/Vocabulary';
import Reading from './components/Reading';
import Listening from './components/Listening';
import ListeningA1 from './components/ListeningA1';
import ListeningB1 from './components/ListeningB1';
import ListeningC1 from './components/ListeningC1';
import ListeningPack from './components/ListeningPack';
import Apti from './components/Apti';
import Codezy from './components/Codezy';
import MathOrbit from './components/MathOrbit';
import ExtrasPage from './components/ExtrasPage';

// Import the new EnglishLevelTest component
import EnglishLevelTest from './pages/EnglishLevelTest';

// Import the SidebarProvider
import { SidebarProvider } from './context/SidebarContext';

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
    // Check if token exists
    if (!token) return false;
    
    // Additional check - token should be a JWT (basic format validation)
    // A JWT consists of three parts separated by dots
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Invalid token format detected');
      return false;
    }
    
    // We could add token expiration check here in the future
    
    return true;
  };

  const isAdmin = () => {
    if (!isAuthenticated()) return false;
    
    const role = localStorage.getItem('role');
    return role === 'admin';
  };

  const isStudent = () => {
    if (!isAuthenticated()) return false;
    
    const role = localStorage.getItem('role');
    return role === 'student';
  };

  // Create reusable protected route components for cleaner routing
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
      console.warn('Unauthenticated access attempt to admin route');
      return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin()) {
      console.warn('Unauthorized access attempt to admin route');
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  const StudentRoute = ({ children }) => {
    if (!isAuthenticated()) {
      console.warn('Unauthenticated access attempt to student route');
      return <Navigate to="/login" replace />;
    }
    
    if (!isStudent()) {
      console.warn('Unauthorized access attempt to student route');
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <SidebarProvider>
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
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="questions" element={<QuestionManager />} />
            <Route path="grammar-questions" element={<GrammarQuestionManager />} />
            <Route path="student-levels" element={<StudentLevels />} />
            <Route path="student-points" element={<StudentPoints />} />
            <Route path="student-data" element={<StudentData />} />
            <Route path="institutions" element={<InstitutionsList />} />
            <Route path="institutions/:institution" element={<InstitutionStudents />} />
            <Route path="test-history" element={<AdminTestHistory />} />
          </Route>
          
          {/* Student Dashboard routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <StudentRoute>
                <DashboardLayout />
              </StudentRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="progress" element={<Progress />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics-summary" element={<AnalyticsSummary />} />
            <Route path="resources" element={<Resources />} />
            <Route path="ai-help" element={<AIHelp />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="test-history" element={<TestHistory />} />
            {/* Extras page and individual features */}
            <Route path="extras" element={<ExtrasPage />} />
            <Route path="speaky" element={<Speaky />} />
            <Route path="speaky/grammar" element={<SpeakyGrammar />} />
            <Route path="speaky/vocabulary" element={<Vocabulary />} />
            <Route path="speaky/reading" element={<Reading />} />
            <Route path="speaky/listening" element={<Listening />} />
            <Route path="apti" element={<Apti />} />
            <Route path="codezy" element={<Codezy />} />
            <Route path="mathorbit" element={<MathOrbit />} />
          </Route>
          
          {/* TestResults routes */}
          <Route
            path="/test-results"
            element={
              <StudentRoute>
                <TestResults />
              </StudentRoute>
            }
          />
          
          <Route
            path="/test-results/:testId"
            element={
              <StudentRoute>
                <TestResults />
              </StudentRoute>
            }
          />
          
          <Route
            path="/student-dashboard/test-results/:testId"
            element={
              <StudentRoute>
                <TestResults />
              </StudentRoute>
            }
          />
          
          <Route
            path="/results/:testId"
            element={
              <StudentRoute>
                <TestResults />
              </StudentRoute>
            }
          />
          
          {/* Add the new route */}
          <Route path="/advanced-assessment" element={
            <StudentRoute>
              <AdvancedAssessment />
            </StudentRoute>
          } />
          
          <Route path="/test" element={
            <StudentRoute>
              <TestPage />
            </StudentRoute>
          } />
          
          {/* Add a new route for test details */}
          <Route
            path="/student-dashboard/test-details/:testId"
            element={
              <StudentRoute>
                <TestResults />
              </StudentRoute>
            }
          />
          
          {/* Add a new route for the English Level Test */}
          <Route
            path="/challenge/english-level-test"
            element={
              <StudentRoute>
                <EnglishLevelTest />
              </StudentRoute>
            }
          />
          
          {/* Add Grammar Test route */}
          <Route
            path="/grammar-test"
            element={
              <StudentRoute>
                <GrammarTest />
              </StudentRoute>
            }
          />
          
          {/* Direct routes for speaky modules */}
          <Route
            path="/speaky/grammar"
            element={
              <StudentRoute>
                <SpeakyGrammar />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/grammar/beginner"
            element={
              <StudentRoute>
                <BeginnerGrammar />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/vocabulary"
            element={
              <StudentRoute>
                <Vocabulary />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/reading"
            element={
              <StudentRoute>
                <Reading />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/listening"
            element={
              <StudentRoute>
                <Listening />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/listening/a1"
            element={
              <StudentRoute>
                <ListeningA1 />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/listening/b1"
            element={
              <StudentRoute>
                <ListeningB1 />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/listening/c1"
            element={
              <StudentRoute>
                <ListeningC1 />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/listening/:level/pack/:packId"
            element={
              <StudentRoute>
                <ListeningPack />
              </StudentRoute>
            }
          />
        </Routes>
      </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
