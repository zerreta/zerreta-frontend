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

// Import Aptitude components
import AptiQuestionManager from './components/AptiQuestionManager';

// Import Speaky, Apti, Codezy, MathOrbit, Skills and Curriculum components
import Speaky from './components/Speaky';
import SpeakyGrammar from './components/SpeakyGrammar';
import BeginnerGrammar from './components/BeginnerGrammar';
import Vocabulary from './components/Vocabulary';
import Speaking from './components/Speaking';
import SpeakyWriting from './components/SpeakyWriting';
import ClassWritingQuestions from './components/ClassWritingQuestions';
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
import Curriculum from './components/Curriculum';
import Physics from './components/Physics';
import ElementaryPhysics from './components/ElementaryPhysics';
import MiddleSchoolPhysics from './components/MiddleSchoolPhysics';
import HighSchoolPhysics from './components/HighSchoolPhysics';
import GamePage from './components/GamePage';
import Chemistry from './components/Chemistry';
import Biology from './components/Biology';
import EarthSpace from './components/EarthSpace';
import MathStats from './components/MathStats';
import ElementaryMathStats from './components/ElementaryMathStats';
import MiddleSchoolMathStats from './components/MiddleSchoolMathStats';
import HighSchoolMathStats from './components/HighSchoolMathStats';
import ElementaryChemistry from './components/ElementaryChemistry';
import NEETPage from './components/NEETPage';
import PhETLicense from './components/PhETLicense';

// Import NEET Layout and dashboard
import NEETLayout from './components/NEETLayout';
import NEETDashboard from './components/NEETDashboard';
import CareerGuidance from './components/CareerGuidance';

// Import the new EnglishLevelTest component
import EnglishLevelTest from './pages/EnglishLevelTest';

// Import TuxTyping component
import TuxTyping from './components/TuxTyping';

// Import ScratchGrade5 component
import ScratchGrade5 from './components/ScratchGrade5';

// Import MSPaint component
import MSPaint from './components/MSPaint';

// Import FileManagerSimulation component
import FileManagerSimulation from './components/FileManagerSimulation';

// Import WordProcessing component
import WordProcessing from './components/WordProcessing';

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
          
          {/* Public PhET License page */}
          <Route path="/phet-license" element={<PhETLicense />} />
          
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
            <Route path="aptitude-questions" element={<AptiQuestionManager />} />
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
            {/* Skills page and individual features */}
            <Route path="skills" element={<ExtrasPage />} />
            <Route path="curriculum" element={<Curriculum />} />
            <Route path="physics" element={<Physics />} />
            <Route path="physics/elementary" element={<ElementaryPhysics />} />
            <Route path="physics/elementary/game/:gameId" element={<GamePage />} />
            <Route path="physics/middle" element={<MiddleSchoolPhysics />} />
            <Route path="physics/middle/game/:gameId" element={<GamePage />} />
            <Route path="physics/high" element={<HighSchoolPhysics />} />
            <Route path="physics/high/game/:gameId" element={<GamePage />} />
            <Route path="chemistry" element={<Chemistry />} />
            <Route path="chemistry/elementary" element={<ElementaryChemistry />} />
            <Route path="chemistry/elementary/game/:gameId" element={<GamePage />} />
            <Route path="biology" element={<Biology />} />
            <Route path="earth-space" element={<EarthSpace />} />
            <Route path="math-stats" element={<MathStats />} />
            <Route path="math-stats/elementary" element={<ElementaryMathStats />} />
            <Route path="math-stats/elementary/game/:gameId" element={<GamePage />} />
            <Route path="math-stats/middle" element={<MiddleSchoolMathStats />} />
            <Route path="math-stats/middle/game/:gameId" element={<GamePage />} />
            <Route path="math-stats/high" element={<HighSchoolMathStats />} />
            <Route path="math-stats/high/game/:gameId" element={<GamePage />} />
            <Route path="career-guidance" element={<CareerGuidance />} />
            <Route path="neet" element={<NEETPage />} />
            <Route path="phet-license" element={<PhETLicense />} />
            <Route path="speaky" element={<Speaky />} />
            <Route path="speaky/grammar" element={<SpeakyGrammar />} />
            <Route path="speaky/vocabulary" element={<Vocabulary />} />
            <Route path="speaky/speaking" element={<Speaking />} />
            <Route path="speaky/writing" element={<SpeakyWriting />} />
            <Route path="speaky/writing/:classId" element={<ClassWritingQuestions />} />
            <Route path="speaky/reading" element={<Reading />} />
            <Route path="speaky/listening" element={<Listening />} />
            <Route path="apti" element={<Apti />} />
            <Route path="mathorbit" element={<MathOrbit />} />
          </Route>

          {/* Full screen Codezy route without sidebar */}
          <Route
            path="/student-dashboard/codezy"
            element={
              <StudentRoute>
                <Codezy />
              </StudentRoute>
            }
          />

          {/* NEET routes with NEETLayout using existing components */}
          <Route 
            path="/student-dashboard/neet"
            element={
              <StudentRoute>
                <NEETLayout />
              </StudentRoute>
            }
          >
            <Route index element={<NEETDashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics-summary" element={<AnalyticsSummary />} />
            <Route path="resources" element={<Resources />} />
            <Route path="test-history" element={<TestHistory />} />
            <Route path="ai-help" element={<AIHelp />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />

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
          
          {/* TuxTyping routes */}
          <Route
            path="/student-dashboard/tux-typing/:grade"
            element={
              <StudentRoute>
                <TuxTyping />
              </StudentRoute>
            }
          />
          
          {/* Fullscreen TuxTyping route */}
          <Route
            path="/student-dashboard/codezy/:grade/tux"
            element={
              <StudentRoute>
                <TuxTyping />
              </StudentRoute>
            }
          />
          
          {/* Scratch Grade 5 route */}
          <Route
            path="/student-dashboard/codezy/Scratch/5"
            element={
              <StudentRoute>
                <ScratchGrade5 />
              </StudentRoute>
            }
          />
          
          {/* MS Paint route */}
          <Route
            path="/student-dashboard/codezy/paint"
            element={
              <StudentRoute>
                <MSPaint />
              </StudentRoute>
            }
          />
          
          {/* File Manager route */}
          <Route
            path="/student-dashboard/codezy/file-manager"
            element={
              <StudentRoute>
                <FileManagerSimulation />
              </StudentRoute>
            }
          />
          
          {/* Word Processing route */}
          <Route
            path="/student-dashboard/word-processing"
            element={
              <StudentRoute>
                <WordProcessing />
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
            path="/speaky/speaking"
            element={
              <StudentRoute>
                <Speaking />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/writing"
            element={
              <StudentRoute>
                <SpeakyWriting />
              </StudentRoute>
            }
          />
          <Route
            path="/speaky/writing/:classId"
            element={
              <StudentRoute>
                <ClassWritingQuestions />
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
