import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';

const subjects = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'biology', name: 'Biology' },
];

const getStageName = (stageNumber) => {
  const stageNames = [
    'Foundation',
    'Basic Concepts',
    'Intermediate',
    'Advanced',
    'Complex Systems',
    'Problem Solving',
    'Analysis',
    'Synthesis',
    'Application',
    'Integration',
    'Mastery',
    'Expertise',
  ];
  return stageNames[stageNumber - 1] || `Stage ${stageNumber}`;
};

const getLevelName = (levelNumber) => {
  const levelNames = [
    'Introduction',
    'Understanding',
    'Practice',
    'Mastery',
  ];
  return levelNames[levelNumber - 1] || `Level ${levelNumber}`;
};

function StudentLevels() {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    fetchStudents();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchStudents(false); // Silent refresh (no loading indicator)
    }, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchStudents = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      console.log('Fetching students for level management...');
      const response = await axiosInstance.get('/admin/students');
      console.log('Student data received:', response.data);
      setStudents(response.data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchStudents(true);
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };

  const getStudentProgress = (student) => {
    // Get actual progress data from the student object
    if (!student || !student.subjects || !student.subjects[selectedSubject]) {
      // Return default values if student has no progress in this subject
      return {
        stage: 1,
        level: 1,
        progress: 0,
        isLocked: false,
      };
    }
    
    const subjectProgress = student.subjects[selectedSubject];
    const stage = parseInt(subjectProgress.stage) || 1;
    const level = parseInt(subjectProgress.level) || 1;
    
    // Calculate progress as percentage of levels completed
    // Total possible progress: 12 stages × 4 levels = 48 levels
    const totalLevels = 12 * 4;
    // Completed levels: (completed stages × 4 levels) + levels in current stage
    const completedLevels = ((stage - 1) * 4) + (level - 1);
    const progress = Math.round((completedLevels / totalLevels) * 100);
    
    return {
      stage,
      level,
      progress,
      isLocked: false,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Student Progress Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedSubject}
          onChange={handleSubjectChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {subjects.map((subject) => (
            <Tab
              key={subject.id}
              label={subject.name}
              value={subject.id}
            />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Current Stage</TableCell>
                <TableCell>Current Level</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                const progress = getStudentProgress(student);
                return (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrophyIcon color="primary" />
                        {getStageName(progress.stage)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon color="primary" />
                        {getLevelName(progress.level)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" color="textSecondary">
                            {progress.progress}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${progress.progress}%`,
                              height: '100%',
                              bgcolor: 'primary.main',
                              transition: 'width 0.3s ease-in-out',
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={progress.isLocked ? <LockIcon /> : <StarIcon />}
                        label={progress.isLocked ? 'Locked' : 'Active'}
                        color={progress.isLocked ? 'default' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default StudentLevels; 