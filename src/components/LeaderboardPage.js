import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  Chip,
  Alert,
  Button,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  StarRate as StarIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import axiosInstance from './axios-config';

function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [subjects, setSubjects] = useState([
    { id: 'all', name: 'All Subjects' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'botany', name: 'Botany' },
    { id: 'zoology', name: 'Zoology' }
  ]);

  // Function to fetch leaderboard data
  const fetchLeaderboard = useCallback(async (subject = 'all') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Fetch real data from server
      const response = await axios.get(
        `/student/leaderboard`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        // Process the data to calculate N.POINTS per subject
        const processedData = response.data.map(student => {
          // Calculate total levels cleared and points
          let totalLevelsCleared = 0;
          let totalPoints = 0;
          
          const subjectBreakdown = {};
          
          if (student.subjects) {
            // Process each subject
            Object.entries(student.subjects).forEach(([subjectName, subjectData]) => {
              const level = parseInt(subjectData.level) || 1;
              const levelsCleared = Math.max(0, level - 1); // Level 1 means 0 levels cleared
              const points = levelsCleared * 25;
              
              subjectBreakdown[subjectName] = {
                points,
                levels: levelsCleared
              };
              
              totalLevelsCleared += levelsCleared;
              totalPoints += points;
            });
          }
          
          return {
            ...student,
            totalPoints: student.nPoints || totalPoints,
            levelsCleared: totalLevelsCleared,
            subjectBreakdown
          };
        });
        
        // Filter by subject if needed
        if (subject !== 'all') {
          const filteredData = processedData.map(student => ({
            ...student,
            activePoints: student.subjectBreakdown[subject]?.points || 0,
            activeLevels: student.subjectBreakdown[subject]?.levels || 0
          })).sort((a, b) => b.activePoints - a.activePoints);
          
          setLeaderboard(filteredData);
        } else {
          // Sort by total points
          const sortedData = processedData.sort((a, b) => b.totalPoints - a.totalPoints);
          setLeaderboard(sortedData);
        }
      } else {
        setLeaderboard([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      if (err.response) {
        setError(`Failed to fetch leaderboard: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to fetch leaderboard: No response from server. Please check your connection.');
      } else {
        setError(`Failed to fetch leaderboard: ${err.message}`);
      }
      setLoading(false);
    }
  }, []);

  // Handle tab change for different subjects
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    fetchLeaderboard(subjects[newValue].id);
  };

  // Fetch leaderboard data on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Function to refresh leaderboard data
  const handleRefresh = () => {
    fetchLeaderboard(subjects[activeTab].id);
  };

  // Generate avatar with initials from student name
  const getNameInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to get avatar color based on ranking
  const getAvatarColor = (index) => {
    if (index === 0) return { bgcolor: '#FFD700', color: '#000' }; // Gold
    if (index === 1) return { bgcolor: '#C0C0C0', color: '#000' }; // Silver
    if (index === 2) return { bgcolor: '#CD7F32', color: '#fff' }; // Bronze
    
    // Generate a random color for other positions
    const colors = [
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', 
      '#4caf50', '#8bc34a', '#cddc39', '#ffc107', '#ff9800'
    ];
    return { bgcolor: colors[index % colors.length], color: '#fff' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrophyIcon sx={{ mr: 1, color: 'primary.main' }} />
            N.POINTS Leaderboard
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
        </Box>

        <Paper elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {subjects.map((subject, index) => (
              <Tab
                key={subject.id}
                label={subject.name}
                icon={subject.id === 'all' ? <TrophyIcon /> : <SchoolIcon />}
                iconPosition="start"
              />
            ))}
          </Tabs>

          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '0 0 8px 8px' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing top students based on N.POINTS. Each level you clear earns you 25 N.POINTS.
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      {activeTab === 0 ? 'Total N.POINTS' : `${subjects[activeTab].name} N.POINTS`}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      {activeTab === 0 ? 'Levels Cleared' : `${subjects[activeTab].name} Levels`}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.length > 0 ? (
                    leaderboard.map((student, index) => (
                      <TableRow key={student._id} hover>
                        <TableCell>
                          <Chip
                            label={index + 1}
                            size="small"
                            color={index < 3 ? 'primary' : 'default'}
                            icon={index < 3 ? <TrophyIcon /> : undefined}
                            sx={{
                              bgcolor: index < 3 ? getAvatarColor(index).bgcolor : undefined,
                              color: index < 3 ? getAvatarColor(index).color : undefined,
                              fontWeight: index < 3 ? 'bold' : 'normal'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                ...getAvatarColor(index),
                                width: 35, 
                                height: 35,
                                mr: 1.5,
                                fontSize: '0.875rem'
                              }}
                            >
                              {getNameInitials(student.name)}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {student.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={activeTab === 0 ? student.totalPoints : student.activePoints || 0}
                            color="primary"
                            size="small"
                            icon={<StarIcon />}
                            sx={{ 
                              fontWeight: 'bold',
                              minWidth: 80
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={activeTab === 0 ? student.levelsCleared : student.activeLevels || 0}
                            size="small"
                            variant="outlined"
                            color="primary"
                            icon={<CheckCircleIcon />}
                            sx={{ minWidth: 80 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                          No leaderboard data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About N.POINTS
          </Typography>
          <Typography variant="body2" paragraph>
            N.POINTS are awarded as you progress through your NEET preparation journey. Each level you clear earns you 25 N.POINTS.
          </Typography>
          <Typography variant="body2">
            • Complete more subjects and levels to earn more points<br />
            • Track your progress against other students<br />
            • Aim for the top of the leaderboard!
          </Typography>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default LeaderboardPage; 