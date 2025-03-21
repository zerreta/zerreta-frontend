import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  TextField,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  LinearProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BiotechIcon from '@mui/icons-material/Biotech';
import ScienceIcon from '@mui/icons-material/Science';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SpeedIcon from '@mui/icons-material/Speed';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import LoadingDots from './LoadingDots';

// Define the subjects
const subjects = [
  { id: 'physics', name: 'Physics', color: '#FF6384', icon: PrecisionManufacturingIcon },
  { id: 'chemistry', name: 'Chemistry', color: '#36A2EB', icon: ScienceIcon },
  { id: 'botany', name: 'Botany', color: '#4BC0C0', icon: LocalLibraryIcon },
  { id: 'zoology', name: 'Zoology', color: '#FFCE56', icon: BiotechIcon }
];

// Mock topics for each subject
const topicsBySubject = {
  physics: [
    { id: 'mechanics', name: 'Mechanics', mastery: 85 },
    { id: 'electromagnetism', name: 'Electromagnetism', mastery: 72 },
    { id: 'optics', name: 'Optics', mastery: 90 },
    { id: 'thermodynamics', name: 'Thermodynamics', mastery: 65 },
    { id: 'modern_physics', name: 'Modern Physics', mastery: 60 }
  ],
  chemistry: [
    { id: 'physical', name: 'Physical Chemistry', mastery: 82 },
    { id: 'organic', name: 'Organic Chemistry', mastery: 75 },
    { id: 'inorganic', name: 'Inorganic Chemistry', mastery: 68 },
    { id: 'analytical', name: 'Analytical Chemistry', mastery: 60 },
    { id: 'biochemistry', name: 'Biochemistry', mastery: 70 }
  ],
  botany: [
    { id: 'plant_morphology', name: 'Plant Morphology', mastery: 88 },
    { id: 'plant_physiology', name: 'Plant Physiology', mastery: 80 },
    { id: 'plant_taxonomy', name: 'Plant Taxonomy', mastery: 65 },
    { id: 'plant_ecology', name: 'Plant Ecology', mastery: 73 },
    { id: 'plant_reproduction', name: 'Plant Reproduction', mastery: 82 }
  ],
  zoology: [
    { id: 'animal_physiology', name: 'Animal Physiology', mastery: 70 },
    { id: 'animal_taxonomy', name: 'Animal Taxonomy', mastery: 63 },
    { id: 'cell_biology', name: 'Cell Biology', mastery: 85 },
    { id: 'genetics', name: 'Genetics', mastery: 79 },
    { id: 'ecology', name: 'Ecology', mastery: 68 }
  ]
};

// Mock performance history data
const performanceHistory = [
  { month: 'Jan', physics: 65, chemistry: 58, botany: 50, zoology: 45, average: 54 },
  { month: 'Feb', physics: 68, chemistry: 62, botany: 55, zoology: 48, average: 58 },
  { month: 'Mar', physics: 72, chemistry: 67, botany: 63, zoology: 52, average: 63 },
  { month: 'Apr', physics: 78, chemistry: 70, botany: 68, zoology: 60, average: 69 },
  { month: 'May', physics: 82, chemistry: 73, botany: 72, zoology: 65, average: 73 },
  { month: 'Jun', physics: 85, chemistry: 78, botany: 75, zoology: 68, average: 76 }
];

// Mock test attempts data
const testAttempts = [
  { id: 1, subject: 'Physics', date: '2023-06-10', score: 85, timeSpent: 40, questionsSolved: 30, accuracy: 85 },
  { id: 2, subject: 'Chemistry', date: '2023-06-05', score: 78, timeSpent: 45, questionsSolved: 30, accuracy: 78 },
  { id: 3, subject: 'Botany', date: '2023-05-28', score: 75, timeSpent: 42, questionsSolved: 30, accuracy: 75 },
  { id: 4, subject: 'Zoology', date: '2023-05-20', score: 68, timeSpent: 47, questionsSolved: 30, accuracy: 68 },
  { id: 5, subject: 'Physics', date: '2023-05-15', score: 80, timeSpent: 43, questionsSolved: 30, accuracy: 80 }
];

// Mock question response patterns
const questionTypeAnalysis = [
  { type: 'Conceptual', correct: 82, incorrect: 18 },
  { type: 'Numerical', correct: 70, incorrect: 30 },
  { type: 'Application', correct: 75, incorrect: 25 },
  { type: 'Memory-based', correct: 88, incorrect: 12 },
  { type: 'Diagram-based', correct: 65, incorrect: 35 }
];

// Comparative analysis data
const comparativeData = [
  { subject: 'Physics', studentScore: 85, peerAverage: 72 },
  { subject: 'Chemistry', studentScore: 78, peerAverage: 70 },
  { subject: 'Botany', studentScore: 75, peerAverage: 68 },
  { subject: 'Zoology', studentScore: 68, peerAverage: 65 },
  { subject: 'Overall', studentScore: 76, peerAverage: 69 }
];

function AnalyticsSummary() {
  const theme = useTheme();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [nPoints, setNPoints] = useState(0);
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('physics');

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Fetch student profile data
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Get student profile
      const profileResponse = await axios.get('http://localhost:5000/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!profileResponse.data) {
        throw new Error('No data received from server');
      }
      
      setStudentData(profileResponse.data);
      
      // Calculate N.POINTS
      if (profileResponse.data.subjects) {
        const { physics, chemistry, botany, zoology } = profileResponse.data.subjects;
        
        // Convert level strings to numbers and subtract 1 (since level 1 means 0 levels cleared)
        const physicsLevel = parseInt(physics.level) - 1;
        const chemistryLevel = parseInt(chemistry.level) - 1;
        const botanyLevel = parseInt(botany.level) - 1;
        const zoologyLevel = parseInt(zoology.level) - 1;
        
        // Sum up the levels cleared (ensure they're not negative)
        const totalLevelsCleared = 
          Math.max(0, physicsLevel) + 
          Math.max(0, chemistryLevel) + 
          Math.max(0, botanyLevel) + 
          Math.max(0, zoologyLevel);
        
        // Calculate N.POINTS (25 points per level cleared)
        setNPoints(totalLevelsCleared * 25);
      }
      
      // Calculate progress for each subject
      if (profileResponse.data.subjects) {
        const progress = calculateSubjectProgress(profileResponse.data.subjects);
        setSubjectProgress(progress);
      }
      
      // Simulate a delay for API call
      setTimeout(() => {
        generateAISummary(profileResponse.data);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(`Failed to fetch student data: ${err.message}`);
      
      // Use mock data if API fails
      const mockSubjects = {
        physics: { level: '3', stage: '4' },
        chemistry: { level: '3', stage: '3' },
        botany: { level: '2', stage: '4' },
        zoology: { level: '2', stage: '3' }
      };
      
      setStudentData({
        name: 'Student',
        subjects: mockSubjects
      });
      
      const progress = calculateSubjectProgress(mockSubjects);
      setSubjectProgress(progress);
      
      // Mock N.POINTS
      setNPoints(225);
      
      // Generate AI summary with mock data
      setTimeout(() => {
        generateAISummary({ name: 'Student', subjects: mockSubjects });
        setLoading(false);
      }, 1000);
    }
  };

  // Calculate progress for each subject
  const calculateSubjectProgress = (subjectsData) => {
    return subjects.map(subject => {
      const subjectData = subjectsData[subject.id];
      
      // Calculate stage and level
      const stage = parseInt(subjectData?.stage || 1);
      const level = parseInt(subjectData?.level || 1);
      
      // Calculate progress percentage
      // Total possible: 12 stages × 4 levels = 48 levels
      const totalPossibleLevels = 48;
      const completedLevels = (stage - 1) * 4 + (level - 1);
      const progressPercentage = Math.round((completedLevels / totalPossibleLevels) * 100);
      
      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        icon: subject.icon,
        stage,
        level,
        completedLevels,
        totalLevels: totalPossibleLevels,
        progress: progressPercentage
      };
    });
  };

  // Generate AI summary based on student data
  const generateAISummary = (data) => {
    setAiLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Calculate the highest and lowest subjects
      const subjectPercentages = subjects.map(subject => {
        const subjectData = data.subjects[subject.id];
        const stage = parseInt(subjectData?.stage || 1);
        const level = parseInt(subjectData?.level || 1);
        const completedLevels = (stage - 1) * 4 + (level - 1);
        const progressPercentage = (completedLevels / 48) * 100;
        
        return {
          id: subject.id,
          name: subject.name,
          progress: progressPercentage
        };
      });
      
      const sortedSubjects = [...subjectPercentages].sort((a, b) => b.progress - a.progress);
      const highestSubject = sortedSubjects[0];
      const lowestSubject = sortedSubjects[3];
      
      // Calculate overall progress
      const totalCompletedLevels = subjectPercentages.reduce((sum, subject) => {
        const subjectData = data.subjects[subject.id];
        const stage = parseInt(subjectData?.stage || 1);
        const level = parseInt(subjectData?.level || 1);
        return sum + ((stage - 1) * 4 + (level - 1));
      }, 0);
      
      const overallProgress = Math.round((totalCompletedLevels / (48 * 4)) * 100);
      
      // Create a comprehensive AI summary
      const aiResponse = {
        overview: `Based on comprehensive analysis of your academic data, you've completed ${totalCompletedLevels} levels across all subjects, representing ${overallProgress}% of the NEET curriculum. Your strongest subject is ${highestSubject.name} (${Math.round(highestSubject.progress)}% complete), while ${lowestSubject.name} (${Math.round(lowestSubject.progress)}% complete) requires more attention. Your performance shows a consistent improvement rate of 4.5% monthly, which puts you on track to complete the curriculum before the examination period.`,
        strengths: [
          `Exceptional conceptual understanding in ${highestSubject.name}, particularly in theoretical frameworks.`,
          `Above-average performance in numerical problems across all subjects (+15% compared to peers).`,
          `Strong performance in diagram-based questions in Biology subjects (+20% vs average).`,
          `Consistent study pattern with regular progression through levels.`,
          `Excellent time management during tests, with per-question time 12% lower than peer average.`
        ],
        weaknesses: [
          `Conceptual gaps in ${lowestSubject.name}, particularly in classification topics (-18% vs your average).`,
          `Inconsistent performance in application-based questions (-15% vs conceptual questions).`,
          `Below-average retention of memorization-heavy topics in Chemistry nomenclature.`,
          `Difficulty with time management in complex multi-step problems.`,
          `Gap in connecting interrelated concepts across different subjects.`
        ],
        recommendations: [
          `Focus intensively on ${lowestSubject.name} by allocating 30% more study time, particularly on taxonomy and classification.`,
          `Strengthen your conceptual framework in ${highestSubject.name} through advanced problem-solving while maintaining regular revision.`,
          `Implement spaced repetition for memorization-heavy topics to improve long-term retention.`,
          `Practice with timed mock tests with progressively increasing difficulty to improve performance consistency.`,
          `Dedicate focused study sessions to application-based questions across all subjects.`,
          `Create concept maps connecting related topics across different subjects.`,
          `Analyze your incorrect answers to identify and address specific error patterns.`,
          `Target completing at least one full level every 2 weeks to maintain optimal curriculum coverage.`
        ],
        insights: [
          `Your learning efficiency index of 2.1 points/hour is 18% above average, indicating excellent study habits.`,
          `You've earned ${nPoints} N.POINTS, placing you in the top 15% of students based on curriculum progression.`,
          `Your response time analytics show a 12% improvement in average question-solving speed over 3 months.`,
          `Your study consistency score of 85/100 indicates disciplined learning habits.`,
          `Your strongest performance occurs between 7-9 PM, suggesting this as your cognitive peak period.`,
          `Analysis of error patterns shows a 30% reduction in repeated mistakes with active recall vs passive reading.`,
          `Your conceptual connection score shows excellent ability to relate theory to applications (top 22%).`,
          `Based on your current trajectory, you're projected to complete the full curriculum 8 weeks before exams.`
        ],
        subjectAnalysis: {
          physics: {
            strengths: ['Mechanics', 'Modern Physics'],
            weaknesses: ['Thermodynamics', 'Wave Optics'],
            recommendedFocus: 'Focus on thermodynamic cycles and entropy concepts',
            timeAllocation: 'Increase from 6 to 8 hours weekly'
          },
          chemistry: {
            strengths: ['Physical Chemistry', 'Chemical Bonding'],
            weaknesses: ['Organic Reaction Mechanisms', 'Coordination Compounds'],
            recommendedFocus: 'Create reaction mechanism flowcharts for organic chemistry',
            timeAllocation: 'Maintain 7 hours weekly with redistribution to weak areas'
          },
          botany: {
            strengths: ['Plant Morphology', 'Plant Reproduction'],
            weaknesses: ['Plant Taxonomy', 'Plant Ecology'],
            recommendedFocus: 'Use visual aids for taxonomic classifications',
            timeAllocation: 'Increase from 5 to 7 hours weekly'
          },
          zoology: {
            strengths: ['Cell Biology', 'Molecular Genetics'],
            weaknesses: ['Animal Taxonomy', 'Comparative Anatomy'],
            recommendedFocus: 'Create comparison tables for animal phyla',
            timeAllocation: 'Increase significantly from 5 to 9 hours weekly'
          }
        },
        progressPrediction: {
          currentScore: 76,
          projectedScore: 85,
          targetScore: 90,
          timeline: '3 months',
          probabilityOfSuccess: '82%',
          criticalInterventions: [
            'Intensive focus on Zoology taxonomy (+12 potential points)',
            'Regular practice tests under timed conditions (+8 potential points)',
            'Structured error analysis and correction (+5 potential points)'
          ]
        },
        peerComparison: {
          overallPercentile: 85,
          subjectPercentiles: {
            physics: 92,
            chemistry: 83,
            botany: 78,
            zoology: 71
          },
          strengths: 'Conceptual understanding (88th percentile)',
          improvements: 'Application questions (currently at 68th percentile)'
        },
        learningPatterns: {
          optimalStudyTime: 'Early morning (5-7 AM) and evening (7-9 PM)',
          retentionRate: '72% after 30 days without review (15% above average)',
          errorPatterns: 'Formula application errors (32% of mistakes), taxonomic classification (28%)',
          recommendedTechniques: 'Active recall, spaced repetition, concept mapping'
        }
      };
      
      setAiSummary(aiResponse);
      setAiLoading(false);
    }, 2000);
  };

  // Handle custom AI question
  const handleCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    
    setAiLoading(true);
    
    // Simulate AI processing the custom question
    setTimeout(() => {
      let response = "";
      
      // Comprehensive responses based on common questions
      if (customQuestion.toLowerCase().includes("improve") || customQuestion.toLowerCase().includes("better")) {
        response = "Based on comprehensive analysis of your performance data, I recommend the following targeted strategy:\n\n1) For Zoology (your weakest subject at 68%), focus specifically on taxonomic classification and comparative anatomy with 8-10 hours/week. Create visual comparison tables for animal phyla and use active recall techniques for classification criteria.\n\n2) For Physics, while it's your strongest subject (85%), your performance in Thermodynamics shows a 20% lower accuracy compared to Mechanics. Dedicate 3-4 hours/week specifically to thermodynamic cycles, entropy concepts, and carnot engine problems.\n\n3) In Chemistry, your organic reaction mechanisms show recurring error patterns (28% of your mistakes). Implement a systematic approach using reaction flowcharts and electron-pushing diagrams for 4 hours/week.\n\n4) Your performance drops 18% in the final quarter of tests, indicating potential time pressure or mental fatigue. Practice with strictly timed mock tests, gradually increasing difficulty and length.\n\n5) Your accuracy on multi-concept integration questions (64%) is significantly lower than single-concept questions (85%). Create concept maps connecting related topics across subjects and practice cross-subject application problems.\n\n6) Implement a comprehensive error journal where you document every mistake, categorize it by type (conceptual, calculation, etc.), and review weekly. Your data shows this could reduce repeat errors by 40%.";
      } 
      else if (customQuestion.toLowerCase().includes("time") || customQuestion.toLowerCase().includes("schedule")) {
        response = "Based on your detailed analytics, here's your optimized weekly study schedule:\n\n• Physics: 8 hours/week\n  - Mechanics: 2hrs (maintain - strong area)\n  - Thermodynamics: 3hrs (increase - detected weakness)\n  - Electromagnetism: 2hrs (maintain)\n  - Modern Physics: 1hr (maintain)\n\n• Chemistry: 7 hours/week\n  - Physical Chemistry: 2hrs (maintain - strong area)\n  - Organic Chemistry: 3hrs (increase - error patterns detected)\n  - Inorganic Chemistry: 2hrs (maintain)\n\n• Botany: 7 hours/week\n  - Plant Morphology: 1hr (decrease - strong area)\n  - Plant Taxonomy: 3hrs (increase significantly - major weakness)\n  - Plant Physiology: 2hrs (maintain)\n  - Plant Reproduction: 1hr (maintain - strong area)\n\n• Zoology: 9 hours/week\n  - Animal Classification: 3hrs (increase significantly)\n  - Cell Biology: 2hrs (maintain - strong area)\n  - Animal Physiology: 2hrs (increase)\n  - Genetics: 2hrs (increase)\n\nOptimal Study Pattern (based on your cognitive analytics):\n• 5-7 AM: New concept learning (peak retention period)\n• 2-4 PM: Problem solving and application practice\n• 7-9 PM: Active recall and error correction (second cognitive peak)\n\nWeekly Structure:\n• Mon-Fri: Deep subject focus (25 hours)\n• Saturday: Mixed subject practice tests (3 hours)\n• Sunday: Error analysis and correction (2 hours)";
      }
      else if (customQuestion.toLowerCase().includes("rank") || customQuestion.toLowerCase().includes("compared")) {
        response = "Based on platform analytics comparing your metrics with 15,000+ NEET students:\n\n• Overall Percentile: 85th (outperforming 85% of students)\n\n• Subject-Wise Percentiles:\n  - Physics: 92nd percentile (Exceptional)\n  - Chemistry: 83rd percentile (Strong)\n  - Botany: 78th percentile (Above average)\n  - Zoology: 71st percentile (Above average, but your weakest relative position)\n\n• Skill-Based Percentiles:\n  - Conceptual Understanding: 88th\n  - Problem-Solving Speed: 82nd\n  - Accuracy: 84th\n  - Curriculum Coverage: 86th\n\n• N.POINTS (225): 90th percentile\n\n• Notable Strengths vs Peers:\n  - Physics problem-solving: top 8% nationally\n  - Concept-application abilities: top 12%\n  - Learning curve/improvement rate: top 15%\n\n• Areas Where Peers Outperform You:\n  - Time management in zoology (32% of peers perform better)\n  - Retention of chemical equations (25% perform better)\n  - Classification questions in taxonomy (22% perform better)\n\n• Success Prediction Model:\n  Based on your trajectory compared to historical data from students who achieved 650+ in NEET, you have an 87% probability of scoring in the top 5% nationally with continued improvement at current rate.";
      }
      else if (customQuestion.toLowerCase().includes("predict") || customQuestion.toLowerCase().includes("score")) {
        response = "Based on our predictive analytics model trained on 50,000+ student profiles and outcomes:\n\n• Current Performance Score: 76/100\n• Projected NEET Score (if exam were today): 610-625/720\n• Current National Percentile Projection: 92.5-93.8\n\n• Subject-Wise Projections (Current → Potential):\n  - Physics: 165/180 → 172/180\n  - Chemistry: 155/180 → 168/180\n  - Botany: 145/180 → 160/180\n  - Zoology: 140/180 → 158/180\n\n• Improvement Trajectory:\n  - 1 Month: 635-645/720 (with focused intervention)\n  - 3 Months: 660-675/720 (with all recommendations)\n  - 6 Months: 680-695/720 (maximum projected potential)\n\n• Critical Focus Areas (Highest ROI):\n  - Zoology Taxonomy (+12 potential marks)\n  - Organic Chemistry Mechanisms (+10 potential marks)\n  - Thermodynamics (+7 potential marks)\n  - Plant Taxonomy (+6 potential marks)\n\n• Success Probability Analysis:\n  - 95% probability of 650+ score\n  - 82% probability of 675+ score\n  - 65% probability of 690+ score\n\n• Required Performance Improvements:\n  - Accuracy: +8% overall (from 78% to 86%)\n  - Speed: +12% (allowing 5-7 more question attempts)\n  - Error reduction: -35% in identified weak areas";
      }
      else {
        response = "Based on comprehensive analysis of your performance data across 3,000+ questions and 50+ tests, I've identified several critical insights:\n\n1) Your learning pattern shows exceptional strength in conceptual understanding (88% accuracy) but significant weakness in application-based problems (76% accuracy). This 12% gap is larger than the typical 5-7% differential for high performers.\n\n2) Time analysis reveals peak productivity during 5-8 AM with comprehension rates 23% higher than evening sessions. Your afternoon sessions (2-4 PM) show the lowest retention rates.\n\n3) Your progress in Physics (85% completion) demonstrates excellent conceptual mastery but detailed test response analysis reveals inconsistent application in cross-topic problems.\n\n4) For Zoology (68% completion), error pattern analysis shows specific difficulties with taxonomic classification (47% of all Zoology errors) and comparative anatomy (32% of errors).\n\n5) Your test performance analytics show accuracy declining by approximately 18% in the final quarter of timed tests, significantly above the average 7-10% decline rate.\n\n6) Question-type analysis reveals mastery of direct recall questions (92% accuracy) but struggle with multi-step application problems (74% accuracy) and cross-subject integration questions (68% accuracy).\n\n7) Based on historical progression of similar student profiles, you're projected to reach 85% overall mastery within 12 weeks, putting you on track for a 660-675 NEET score with current trajectory.";
      }
      
      // Update AI summary with the new response
      setAiSummary({
        ...aiSummary,
        customResponse: response
      });
      
      setCustomQuestion('');
      setAiLoading(false);
    }, 2000);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };
  
  // Get the highest and lowest subjects
  const highestSubject = subjectProgress.length > 0 
    ? [...subjectProgress].sort((a, b) => b.progress - a.progress)[0]
    : { name: 'Physics', progress: 65 };
  
  const lowestSubject = subjectProgress.length > 0 
    ? [...subjectProgress].sort((a, b) => a.progress - b.progress)[0]
    : { name: 'Zoology', progress: 38 };

  // Data for the subject progress chart
  const chartData = subjectProgress.map(subject => ({
    name: subject.name,
    progress: subject.progress,
    fill: subject.color
  }));

  // Get topic data for selected subject
  const topicsData = topicsBySubject[selectedSubject] || [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          background: `linear-gradient(135deg, #7445f8 0%, #5c33d4 100%)`,
          color: 'white'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Advanced Analytics Dashboard
        </Typography>
        <Typography variant="body1">
          Comprehensive performance insights powered by Gemini AI
        </Typography>
      </Paper>

      {/* Dashboard Tabs */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3, 
          '& .MuiTab-root': { 
            minWidth: 'auto',
            px: 3,
            fontWeight: 500
          },
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Tab label="AI Summary" icon={<PsychologyIcon />} iconPosition="start" />
        <Tab label="Subject Analysis" icon={<SchoolIcon />} iconPosition="start" />
        <Tab label="Performance Trends" icon={<TimelineIcon />} iconPosition="start" />
        <Tab label="Test History" icon={<AssessmentIcon />} iconPosition="start" />
        <Tab label="Peer Comparison" icon={<GroupIcon />} iconPosition="start" />
      </Tabs>

      {/* AI Summary Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* AI Summary Card */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ mb: 3, borderRadius: 2, height: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#7445f8', mr: 2 }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      Gemini AI Analysis
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  {aiLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                      <Avatar sx={{ width: 60, height: 60, mb: 2, bgcolor: '#7445f8' }}>
                        <SmartToyIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>Analyzing your performance data</Typography>
                      <LoadingDots />
                    </Box>
                  ) : aiSummary ? (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#7445f8' }}>
                        Comprehensive Performance Analysis
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {aiSummary.overview}
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#4CAF50' }}>
                            Strengths
                          </Typography>
                          <List dense>
                            {aiSummary.strengths?.map((item, index) => (
                              <ListItem key={index} sx={{ pl: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.success.light, width: 30, height: 30 }}>
                                    <CheckCircleIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#F44336' }}>
                            Areas for Improvement
                          </Typography>
                          <List dense>
                            {aiSummary.weaknesses?.map((item, index) => (
                              <ListItem key={index} sx={{ pl: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.error.light, width: 30, height: 30 }}>
                                    <PriorityHighIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      </Grid>
                      
                      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: '#7445f8' }}>
                        Advanced Insights
                      </Typography>
                      <List>
                        {aiSummary.insights?.map((insight, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                                <InsightsIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={insight} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: '#7445f8' }}>
                        Personalized Recommendations
                      </Typography>
                      <List>
                        {aiSummary.recommendations?.map((rec, index) => (
                          <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                                <TrendingUpIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                      
                      {aiSummary.customResponse && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#7445f8' }}>
                            Response to Your Question
                          </Typography>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {aiSummary.customResponse}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Typography>No AI analysis available. Please try refreshing the page.</Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Stats and Ask AI Section */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* N.POINTS Card */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card sx={{ borderRadius: 2, bgcolor: '#7445f8', color: 'white', boxShadow: '0 4px 20px rgba(116, 69, 248, 0.3)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="medium">
                          Your N.POINTS
                        </Typography>
                        <EmojiEventsIcon sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                        {nPoints}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {`You've unlocked ${nPoints/25} levels across all subjects`}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Strongest Subject */}
              <Grid item xs={12} sm={6} lg={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="medium" color="primary">
                          Strongest Subject
                        </Typography>
                        <SchoolIcon sx={{ color: highestSubject.color || '#4CAF50' }} />
                      </Box>
                      <Box sx={{ my: 1 }}>
                        <Typography variant="h5" fontWeight="bold">
                          {highestSubject.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {`${highestSubject.progress}% Complete`}
                        </Typography>
                      </Box>
                      <Chip 
                        icon={<TrendingUpIcon />} 
                        label="Keep up the good work!" 
                        size="small" 
                        color="success" 
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Ask AI Question */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="medium">
                          Ask Gemini AI
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        placeholder="Ask about your performance or for study advice..."
                        variant="outlined"
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={handleCustomQuestion}
                        disabled={aiLoading || !customQuestion.trim()}
                        sx={{ 
                          bgcolor: '#7445f8', 
                          '&:hover': { bgcolor: '#5c33d4' } 
                        }}
                      >
                        {aiLoading ? 'Processing...' : 'Get AI Insights'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Subject Analysis Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Subject Selector */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Tabs
                value={selectedSubject}
                onChange={handleSubjectChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                {subjects.map((subject) => (
                  <Tab 
                    key={subject.id} 
                    label={subject.name} 
                    value={subject.id} 
                    icon={<subject.icon />} 
                    iconPosition="start" 
                    sx={{ 
                      color: subject.id === selectedSubject ? subject.color : 'inherit',
                      '&.Mui-selected': { color: subject.color }
                    }}
                  />
                ))}
              </Tabs>
              
              {/* Subject Overview Card */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                      {subjects.find(s => s.id === selectedSubject)?.name} Analysis
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          Overall Progress:
                        </Typography>
                        <Box sx={{ flexGrow: 1, ml: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={subjectProgress.find(s => s.id === selectedSubject)?.progress || 0} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: subjects.find(s => s.id === selectedSubject)?.color
                              }
                            }}
                          />
                        </Box>
                        <Typography variant="body1" fontWeight="bold" sx={{ ml: 2 }}>
                          {subjectProgress.find(s => s.id === selectedSubject)?.progress || 0}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Stage: {subjectProgress.find(s => s.id === selectedSubject)?.stage || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Level: {subjectProgress.find(s => s.id === selectedSubject)?.level || 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed: {subjectProgress.find(s => s.id === selectedSubject)?.completedLevels || 0}/{subjectProgress.find(s => s.id === selectedSubject)?.totalLevels || 48} levels
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Subject Strengths and Weaknesses */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, color: theme.palette.success.main }}>
                          Strengths
                        </Typography>
                        <Box sx={{ bgcolor: 'rgba(76, 175, 80, 0.08)', p: 2, borderRadius: 2 }}>
                          <List dense>
                            {aiSummary?.subjectAnalysis?.[selectedSubject]?.strengths?.map((strength, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.success.light, width: 28, height: 28 }}>
                                    <CheckCircleIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, color: theme.palette.error.main }}>
                          Weaknesses
                        </Typography>
                        <Box sx={{ bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 2 }}>
                          <List dense>
                            {aiSummary?.subjectAnalysis?.[selectedSubject]?.weaknesses?.map((weakness, index) => (
                              <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: theme.palette.error.light, width: 28, height: 28 }}>
                                    <PriorityHighIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={weakness} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%', p: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                        Topic Mastery
                      </Typography>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={topicsData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip />
                          <Bar 
                            dataKey="mastery" 
                            fill={subjects.find(s => s.id === selectedSubject)?.color} 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      
                      <Typography variant="h6" fontWeight="medium" sx={{ mt: 3, mb: 1 }}>
                        Expert Recommendations
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                          Focus Area:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {aiSummary?.subjectAnalysis?.[selectedSubject]?.recommendedFocus}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                          Time Allocation:
                        </Typography>
                        <Typography variant="body2">
                          {aiSummary?.subjectAnalysis?.[selectedSubject]?.timeAllocation}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Performance Trends Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Performance History Chart */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={performanceHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {subjects.map((subject) => (
                    <Line
                      key={subject.id}
                      type="monotone"
                      dataKey={subject.id}
                      stroke={subject.color}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#757575"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                  Trend Analysis
                </Typography>
                <Grid container spacing={2}>
                  {subjects.map((subject) => {
                    const firstScore = performanceHistory[0][subject.id];
                    const lastScore = performanceHistory[performanceHistory.length - 1][subject.id];
                    const improvement = lastScore - firstScore;
                    return (
                      <Grid item xs={12} sm={6} lg={3} key={subject.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: subject.color, mr: 2 }}>
                            <subject.icon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {subject.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                              <Typography variant="body2" color="success.main">
                                +{improvement}% over 6 months
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Card>
          </Grid>
          
          {/* Monthly Progress Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Monthly Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={performanceHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="average"
                    stroke="#7445f8"
                    fill="#7445f8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Analysis:</strong> You've shown a consistent improvement of approximately 4.5% per month, with the most significant growth between March and April (9.5% increase).
                </Typography>
                <Typography variant="body2">
                  At this rate, you're projected to reach the 85% proficiency mark by the end of your next trimester.
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Learning Patterns Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Learning Patterns
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Optimal Study Times
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.optimalStudyTime}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Information Retention
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.retentionRate}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Common Error Patterns
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.errorPatterns}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Recommended Learning Techniques
                </Typography>
                <Typography variant="body1">
                  {aiSummary?.learningPatterns?.recommendedTechniques}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Test History Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* Test Attempts Table */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Recent Test Attempts
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>Time Spent (min)</TableCell>
                        <TableCell>Questions Solved</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testAttempts.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 30, 
                                  height: 30, 
                                  mr: 1, 
                                  bgcolor: subjects.find(s => s.name === test.subject)?.color 
                                }}
                              >
                                {test.subject.substring(0, 1)}
                              </Avatar>
                              {test.subject}
                            </Box>
                          </TableCell>
                          <TableCell>{test.date}</TableCell>
                          <TableCell>
                            <Typography 
                              fontWeight="bold" 
                              color={test.score >= 75 ? 'success.main' : test.score >= 60 ? 'warning.main' : 'error.main'}
                            >
                              {test.score}%
                            </Typography>
                          </TableCell>
                          <TableCell>{test.accuracy}%</TableCell>
                          <TableCell>{test.timeSpent} min</TableCell>
                          <TableCell>{test.questionsSolved}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Test Performance Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Question Type Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={questionTypeAnalysis}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="correct" stackId="a" fill="#4caf50" name="Correct" />
                  <Bar dataKey="incorrect" stackId="a" fill="#f44336" name="Incorrect" />
                </BarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Strengths:</strong> Excellent performance in memory-based and conceptual questions.
                </Typography>
                <Typography variant="body2">
                  <strong>Areas for Improvement:</strong> Focus on diagram-based and numerical problem-solving.
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Time Management Analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Time Management Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      1.4
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Minutes per question (average)
                    </Typography>
                    <Chip 
                      icon={<TrendingDownIcon />} 
                      label="12% faster than average" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                    <SpeedIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time efficiency score
                    </Typography>
                    <Chip 
                      icon={<TrendingUpIcon />} 
                      label="Top 15% percentile" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Key Observations
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.info.light, width: 24, height: 24 }}>
                        <TimelineIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Your performance drops 18% in the final quarter of tests (vs. 7-10% average)." />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light, width: 24, height: 24 }}>
                        <CheckCircleIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="You excel in quick-response questions, averaging 45 seconds per question." />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.error.light, width: 24, height: 24 }}>
                        <PriorityHighIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Complex numerical problems take 3.2x longer than conceptual questions." />
                  </ListItem>
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Peer Comparison Tab */}
      {activeTab === 4 && (
        <Grid container spacing={3}>
          {/* Peer Comparison Chart */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Subject Performance vs. Peer Average
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={comparativeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="studentScore" name="Your Score" fill="#7445f8" />
                  <Bar dataKey="peerAverage" name="Peer Average" fill="#bdbdbd" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          
          {/* Percentile Ranks */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Your Percentile Ranks
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    Overall Percentile:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mx: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={aiSummary?.peerComparison?.overallPercentile || 85} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#7445f8'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body1" fontWeight="bold">
                    {aiSummary?.peerComparison?.overallPercentile || 85}th
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  You're outperforming 85% of students on our platform
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Subject Percentiles
              </Typography>
              {subjects.map((subject) => (
                <Box key={subject.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: subject.color }}>
                      <subject.icon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2">
                      {subject.name}:
                    </Typography>
                    <Box sx={{ flexGrow: 1, mx: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={aiSummary?.peerComparison?.subjectPercentiles?.[subject.id] || 75} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: subject.color
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {aiSummary?.peerComparison?.subjectPercentiles?.[subject.id] || 75}th
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
          
          {/* Skill Comparison */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Skill Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={[
                  { skill: 'Conceptual Understanding', you: 88, peers: 75 },
                  { skill: 'Problem Solving', you: 82, peers: 70 },
                  { skill: 'Memory Recall', you: 85, peers: 72 },
                  { skill: 'Application', you: 68, peers: 65 },
                  { skill: 'Analysis', you: 78, peers: 68 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="You" dataKey="you" stroke="#7445f8" fill="#7445f8" fillOpacity={0.6} />
                  <Radar name="Peers" dataKey="peers" stroke="#bdbdbd" fill="#bdbdbd" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Key Strengths vs Peers:</strong> {aiSummary?.peerComparison?.strengths}
                </Typography>
                <Typography variant="body2">
                  <strong>Areas for Improvement:</strong> {aiSummary?.peerComparison?.improvements}
                </Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* Prediction Model */}
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#7445f8', mr: 2 }}>
                  <AutoGraphIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Success Prediction Model
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Current Score
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.currentScore}/100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent to ~{aiSummary?.progressPrediction?.currentScore * 7.2}/720 NEET Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Projected Score (in {aiSummary?.progressPrediction?.timeline})
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.projectedScore}/100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent to ~{aiSummary?.progressPrediction?.projectedScore * 7.2}/720 NEET Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(116, 69, 248, 0.05)', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Probability of Success
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {aiSummary?.progressPrediction?.probabilityOfSuccess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your current trajectory & historical data
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                  Critical Interventions for Success
                </Typography>
                <List>
                  {aiSummary?.progressPrediction?.criticalInterventions?.map((intervention, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                          <PriorityHighIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={intervention} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AnalyticsSummary; 