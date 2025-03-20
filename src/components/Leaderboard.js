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
  Avatar,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FilterListIcon from '@mui/icons-material/FilterList';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function Leaderboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentTab, setCurrentTab] = useState('overall');
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Calculate score based on levels (25 points per level)
  const calculateLevelScore = (subjectLevels) => {
    if (!subjectLevels) return 0;
    
    let totalScore = 0;
    
    // Calculate score for each subject
    if (subjectLevels.physics) {
      totalScore += (parseInt(subjectLevels.physics.level) * 25);
    }
    
    if (subjectLevels.chemistry) {
      totalScore += (parseInt(subjectLevels.chemistry.level) * 25);
    }
    
    if (subjectLevels.botany) {
      totalScore += (parseInt(subjectLevels.botany.level) * 25);
    }
    
    if (subjectLevels.zoology) {
      totalScore += (parseInt(subjectLevels.zoology.level) * 25);
    }
    
    return totalScore;
  };

  // Calculate subject-specific level score
  const calculateSubjectScore = (subjectLevels, subject) => {
    if (!subjectLevels || !subjectLevels[subject]) return 0;
    return parseInt(subjectLevels[subject].level) * 25;
  };

  // Fetch students data from backend
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        'http://localhost:5000/student/leaderboard',
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // If API is not yet implemented, fetch student list from admin API
      let studentsData = response.data;
      
      if (!studentsData || studentsData.length === 0) {
        // Fallback to admin student list if leaderboard API not yet implemented
        const adminResponse = await axios.get(
          'http://localhost:5000/admin/students',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        studentsData = adminResponse.data;
      }
      
      // Transform students data to include scores based on levels
      const processedStudents = studentsData.map(student => ({
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        avatar: student.name.split(' ').map(n => n[0]).join(''),
        subjects: student.subjects,
        overallScore: calculateLevelScore(student.subjects),
        physicsScore: calculateSubjectScore(student.subjects, 'physics'),
        chemistryScore: calculateSubjectScore(student.subjects, 'chemistry'),
        botanyScore: calculateSubjectScore(student.subjects, 'botany'),
        zoologyScore: calculateSubjectScore(student.subjects, 'zoology'),
        // Get highest level across all subjects
        highestLevel: Math.max(
          parseInt(student.subjects?.physics?.level || 0),
          parseInt(student.subjects?.chemistry?.level || 0),
          parseInt(student.subjects?.botany?.level || 0),
          parseInt(student.subjects?.zoology?.level || 0)
        ),
        // Track the sum of all levels
        totalLevels: (
          parseInt(student.subjects?.physics?.level || 0) +
          parseInt(student.subjects?.chemistry?.level || 0) +
          parseInt(student.subjects?.botany?.level || 0) +
          parseInt(student.subjects?.zoology?.level || 0)
        )
      }));
      
      setStudents(processedStudents);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      if (err.response) {
        setError(`Failed to fetch students: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to fetch students: No response from server');
      } else {
        setError(`Failed to fetch students: ${err.message}`);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);
  
  // Get the appropriate rankings based on the selected tab
  const getRankings = () => {
    if (loading || !students || students.length === 0) {
      return [];
    }
    
    let sortedStudents = [...students];
    
    switch(currentTab) {
      case 'physics':
        return sortedStudents.sort((a, b) => b.physicsScore - a.physicsScore);
      case 'chemistry':
        return sortedStudents.sort((a, b) => b.chemistryScore - a.chemistryScore);
      case 'botany':
        return sortedStudents.sort((a, b) => b.botanyScore - a.botanyScore);
      case 'zoology':
        return sortedStudents.sort((a, b) => b.zoologyScore - a.zoologyScore);
      case 'levels':
        return sortedStudents.sort((a, b) => b.totalLevels - a.totalLevels);
      default:
        return sortedStudents.sort((a, b) => b.overallScore - a.overallScore);
    }
  };
  
  const rankings = getRankings();
  
  // Get medal color based on rank
  const getMedalColor = (index) => {
    switch(index) {
      case 0:
        return { color: '#FFD700', bgcolor: 'rgba(255, 215, 0, 0.1)' }; // Gold
      case 1:
        return { color: '#C0C0C0', bgcolor: 'rgba(192, 192, 192, 0.1)' }; // Silver
      case 2:
        return { color: '#CD7F32', bgcolor: 'rgba(205, 127, 50, 0.1)' }; // Bronze
      default:
        return { color: 'text.secondary', bgcolor: 'transparent' };
    }
  };
  
  // Get tab label with icon
  const getTabLabel = (label, icon) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <span>{label}</span>
    </Box>
  );

  // Calculate the total number of levels (Physics + Chemistry + Botany + Zoology)
  const getSubjectLevelInfo = (student) => {
    const physicsLevel = parseInt(student.subjects?.physics?.level || 0);
    const chemistryLevel = parseInt(student.subjects?.chemistry?.level || 0);
    const botanyLevel = parseInt(student.subjects?.botany?.level || 0);
    const zoologyLevel = parseInt(student.subjects?.zoology?.level || 0);
    
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          size="small"
          label={`Physics: L${physicsLevel}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Chemistry: L${chemistryLevel}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Botany: L${botanyLevel}`}
          color="success"
          variant="outlined"
        />
        <Chip
          size="small"
          label={`Zoology: L${zoologyLevel}`}
          color="warning"
          variant="outlined"
        />
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: { xs: 2, sm: 3, md: 4 },
        pb: 8
      }}>
        {/* Header Section */}
        <Box 
          component={Paper} 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            right: -20, 
            top: -20, 
            opacity: 0.1, 
            fontSize: 180 
          }}>
            <EmojiEventsIcon fontSize="inherit" />
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Leaderboard
              </Typography>
              <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
                Top Performers
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
                See how you rank against other students. Compete by clearing levels and earn 25 points for each level you clear!
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<SchoolIcon />} 
                  label={`${rankings.length} Students`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label="25 Points Per Level" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
                <Chip 
                  icon={<LocalFireDepartmentIcon />} 
                  label="NEET Competition" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ 
                position: 'relative', 
                width: 200, 
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 160, color: 'rgba(255,255,255,0.9)' }} />
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Tab Navigation */}
        <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <Tab 
              value="overall" 
              label={getTabLabel("Overall", <EmojiEventsIcon />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
            <Tab 
              value="levels" 
              label={getTabLabel("Levels", <StarIcon />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
            <Tab 
              value="physics" 
              label={getTabLabel("Physics", <WhatshotIcon sx={{ color: theme.palette.primary.main }} />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
            <Tab 
              value="chemistry" 
              label={getTabLabel("Chemistry", <WhatshotIcon sx={{ color: theme.palette.secondary.main }} />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
            <Tab 
              value="botany" 
              label={getTabLabel("Botany", <WhatshotIcon sx={{ color: theme.palette.success.main }} />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
            <Tab 
              value="zoology" 
              label={getTabLabel("Zoology", <WhatshotIcon sx={{ color: theme.palette.warning.main }} />)} 
              sx={{ textTransform: 'none', py: 2 }}
            />
          </Tabs>
        </Paper>
        
        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Top 3 Cards for Desktop View */}
            {!isMobile && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {rankings.slice(0, 3).map((student, index) => (
                  <Grid item xs={12} md={4} key={student.id}>
                    <Card 
                      component={motion.div}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        height: '100%',
                        boxShadow: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative'
                      }}
                    >
                      {index === 0 && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: -8, 
                            right: -8, 
                            background: 'linear-gradient(45deg, #FF9800 30%, #FF5722 90%)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                            zIndex: 1
                          }}
                        >
                          <Typography variant="button" sx={{ color: 'white', fontWeight: 'bold' }}>
                            #1
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ 
                        py: 4, 
                        px: 2, 
                        textAlign: 'center',
                        bgcolor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 
                                index === 1 ? 'rgba(192, 192, 192, 0.1)' : 
                                'rgba(205, 127, 50, 0.1)'
                      }}>
                        <Avatar
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mx: 'auto', 
                            mb: 2,
                            bgcolor: index === 0 ? 'warning.main' : 
                                    index === 1 ? 'secondary.main' : 
                                    'primary.main',
                            border: '4px solid',
                            borderColor: index === 0 ? '#FFD700' : 
                                        index === 1 ? '#C0C0C0' : 
                                        '#CD7F32'
                          }}
                        >
                          {student.avatar}
                        </Avatar>
                        
                        <Typography variant="h6" gutterBottom>
                          {student.name}
                        </Typography>
                        
                        <Chip 
                          icon={<WorkspacePremiumIcon />}
                          label={`${currentTab === 'levels' ? student.totalLevels + ' Levels' : 
                                  currentTab === 'physics' ? student.physicsScore + ' pts' :
                                  currentTab === 'chemistry' ? student.chemistryScore + ' pts' :
                                  currentTab === 'botany' ? student.botanyScore + ' pts' :
                                  currentTab === 'zoology' ? student.zoologyScore + ' pts' :
                                  student.overallScore + ' pts'}`}
                          sx={{
                            bgcolor: index === 0 ? 'rgba(255, 215, 0, 0.2)' : 
                                    index === 1 ? 'rgba(192, 192, 192, 0.2)' : 
                                    'rgba(205, 127, 50, 0.2)',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <Divider />
                      <CardContent sx={{ p: 2 }}>
                        {getSubjectLevelInfo(student)}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Leaderboard Table */}
            <Paper 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden', 
                boxShadow: 2,
                height: '100%',
                mb: 4
              }}
            >
              <TableContainer component={Box} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'background.paper' }}>
                      <TableCell sx={{ width: 80, fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                      {!isMobile && (
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Levels</TableCell>
                      )}
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rankings.length > 0 ? (
                      rankings.map((student, index) => {
                        const medalColor = getMedalColor(index);
                        
                        return (
                          <TableRow 
                            key={student.id}
                            component={motion.tr}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            sx={{ 
                              bgcolor: medalColor.bgcolor,
                              '&:hover': { 
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' 
                              }
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {index < 3 ? (
                                  <EmojiEventsIcon 
                                    sx={{ 
                                      color: medalColor.color,
                                      mr: 1,
                                      fontSize: 20
                                    }} 
                                  />
                                ) : (
                                  <Typography sx={{ fontWeight: 'bold', ml: 1 }}>
                                    {index + 1}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    bgcolor: theme.palette.primary.main,
                                    mr: 2
                                  }}
                                >
                                  {student.avatar}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    ID: {student.studentId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="center">
                                {getSubjectLevelInfo(student)}
                              </TableCell>
                            )}
                            <TableCell align="right">
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: index < 3 ? medalColor.color : 'text.primary'
                                }}
                              >
                                {currentTab === 'levels' ? student.totalLevels + ' Levels' : 
                                 currentTab === 'physics' ? student.physicsScore + ' pts' :
                                 currentTab === 'chemistry' ? student.chemistryScore + ' pts' :
                                 currentTab === 'botany' ? student.botanyScore + ' pts' :
                                 currentTab === 'zoology' ? student.zoologyScore + ' pts' :
                                 student.overallScore + ' pts'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isMobile ? 3 : 4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1">No students found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            {/* Legend */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                How Scores Are Calculated
              </Typography>
              <Typography variant="body2" paragraph>
                Each cleared level in every subject earns you 25 points. The leaderboard rewards your progress across all subjects.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<StarIcon />} 
                  label="Each Level = 25 Points" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<EmojiEventsIcon />} 
                  label="Overall = Sum of All Subject Points" 
                  color="secondary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<PersonIcon />} 
                  label="Subject Score = Level × 25" 
                  color="default" 
                  variant="outlined"
                />
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </motion.div>
  );
}

export default Leaderboard; 