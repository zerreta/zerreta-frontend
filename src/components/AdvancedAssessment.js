import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Divider, Chip,
  Container, FormControl, Select, MenuItem, Slider,
  List, ListItem, ListItemIcon, ListItemText, Checkbox,
  Avatar, Tab, Tabs, InputLabel, Card, CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Assessment as AssessmentIcon,
  PlayArrow as PlayArrowIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Biotech as BiotechIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdvancedAssessment = () => {
  const navigate = useNavigate();
  
  // State variables
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [timeLimit, setTimeLimit] = useState(45);
  const [questionCount, setQuestionCount] = useState(45);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  
  // Subjects data with icons
  const subjectsData = [
    { 
      id: 'physics', 
      name: 'Physics', 
      color: '#3f51b5', 
      icon: <ScienceIcon />,
      topics: Array.from({ length: 15 }, (_, i) => ({ 
        id: `physics-${i+1}`, 
        number: i+1, 
        title: `Physics Topic ${i+1}`,
        questionsCount: Math.floor(Math.random() * 50) + 30
      }))
    },
    { 
      id: 'chemistry', 
      name: 'Chemistry', 
      color: '#f44336', 
      icon: <PsychologyIcon />,
      topics: Array.from({ length: 15 }, (_, i) => ({ 
        id: `chemistry-${i+1}`, 
        number: i+1, 
        title: `Chemistry Topic ${i+1}`,
        questionsCount: Math.floor(Math.random() * 50) + 30
      }))
    },
    { 
      id: 'biology', 
      name: 'Biology', 
      color: '#4caf50', 
      icon: <BiotechIcon />,
      topics: Array.from({ length: 15 }, (_, i) => ({ 
        id: `biology-${i+1}`, 
        number: i+1, 
        title: `Biology Topic ${i+1}`,
        questionsCount: Math.floor(Math.random() * 50) + 30 
      }))
    },
    { 
      id: 'zoology', 
      name: 'Zoology', 
      color: '#ff9800', 
      icon: <LocalHospitalIcon />,
      topics: Array.from({ length: 15 }, (_, i) => ({ 
        id: `zoology-${i+1}`, 
        number: i+1, 
        title: `Zoology Topic ${i+1}`,
        questionsCount: Math.floor(Math.random() * 50) + 30
      }))
    }
  ];
  
  useEffect(() => {
    // Simulate loading subjects from API
    setLoading(true);
    setTimeout(() => {
      setSubjects(subjectsData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Function to handle subject selection
  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        // Remove subject
        const newSelected = prev.filter(id => id !== subjectId);
        setTopicsBySubject(prevTopics => {
          const newTopics = {...prevTopics};
          delete newTopics[subjectId];
          return newTopics;
        });
        return newSelected;
      } else {
        // Add subject
        return [...prev, subjectId];
      }
    });
  };

  // Function to handle topic selection for a specific subject
  const handleTopicToggle = (subjectId, topicId) => {
    setTopicsBySubject(prev => {
      const subjectTopics = prev[subjectId] || [];
      
      if (subjectTopics.includes(topicId)) {
        // Remove topic
        return {
          ...prev,
          [subjectId]: subjectTopics.filter(id => id !== topicId)
        };
      } else {
        // Add topic
        return {
          ...prev,
          [subjectId]: [...subjectTopics, topicId]
        };
      }
    });
  };

  // Function to select all topics for a subject
  const selectAllTopicsForSubject = (subjectId) => {
    const subjectData = subjects.find(s => s.id === subjectId);
    if (subjectData && subjectData.topics) {
      const allTopicIds = subjectData.topics.map(topic => topic.number);
      setTopicsBySubject(prev => ({
        ...prev,
        [subjectId]: allTopicIds
      }));
    }
  };
  
  // Calculate the total number of selected topics
  const getTotalSelectedTopics = () => {
    return Object.values(topicsBySubject).reduce((total, topics) => total + topics.length, 0);
  };
  
  // Function to start the assessment
  const handleStartAssessment = () => {
    if (selectedSubjects.length > 0 && Object.keys(topicsBySubject).length > 0) {
      // Format the topicsBySubject object properly
      const formattedTopicsBySubject = {};
      
      // Ensure each selected subject has a valid array of topic IDs
      selectedSubjects.forEach(subjectId => {
        if (topicsBySubject[subjectId] && topicsBySubject[subjectId].length > 0) {
          // Convert topic IDs to strings if they're not already
          formattedTopicsBySubject[subjectId] = topicsBySubject[subjectId].map(topicId => 
            typeof topicId === 'string' ? topicId : String(topicId)
          );
        }
      });
      
      console.log("Starting combined test with:", {
        selectedSubjects,
        topicsBySubject: formattedTopicsBySubject,
        questionCount,
        timeLimit
      });
      
      // Navigate to test page with combined test configuration
      navigate('/test', {
        state: {
          mode: 'assessment',
          multiSubject: true,
          selectedSubjects: selectedSubjects,
          topicsBySubject: formattedTopicsBySubject,
          questionCount: questionCount || 45,
          timeLimit: timeLimit * 60 // Convert minutes to seconds
        }
      });
    } else {
      alert("Please select at least one subject and topic before starting the assessment.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#6200ea', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <AssessmentIcon fontSize="large" />
            <Typography variant="h4" component="h1">Advanced Assessment</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Configure a comprehensive test across multiple subjects and topics
          </Typography>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Subject Selection Section */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                1. Select Subjects
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {loading ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography>Loading subjects...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {subjects.map(subj => (
                    <Chip
                      key={subj.id}
                      icon={subj.icon}
                      label={subj.name}
                      onClick={() => handleSubjectToggle(subj.id)}
                      sx={{ 
                        bgcolor: selectedSubjects.includes(subj.id) ? subj.color : 'default',
                        color: selectedSubjects.includes(subj.id) ? 'white' : 'text.primary',
                        '& .MuiChip-icon': {
                          color: selectedSubjects.includes(subj.id) ? 'white' : 'inherit',
                        },
                        '&:hover': {
                          bgcolor: selectedSubjects.includes(subj.id) 
                            ? `${subj.color}` 
                            : `${subj.color}22`,
                          color: selectedSubjects.includes(subj.id) ? 'white' : 
                                 subj.id === 'physics' ? '#3f51b5' : 
                                 subj.id === 'chemistry' ? '#f44336' : '#4caf50',
                          '& .MuiChip-icon': {
                            color: selectedSubjects.includes(subj.id) ? 'white' : 
                                   subj.id === 'physics' ? '#3f51b5' : 
                                   subj.id === 'chemistry' ? '#f44336' : '#4caf50',
                          },
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        px: 2,
                        py: 3,
                        height: 'auto',
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '1rem'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          
          {/* Topic Selection Section */}
          {selectedSubjects.length > 0 && (
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  2. Select Topics
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                  {selectedSubjects.map((subjectId, index) => {
                    const subject = subjects.find(s => s.id === subjectId);
                    return (
                      <Tab 
                        key={subjectId}
                        label={subject?.name || subjectId}
                        icon={subject?.icon}
                        iconPosition="start"
                        sx={{ 
                          minHeight: 48,
                          textTransform: 'none',
                          fontWeight: 'medium',
                          color: subject?.color || 'primary.main',
                          '&.Mui-selected': {
                            color: subject?.color || 'primary.main',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    );
                  })}
                </Tabs>
                
                {selectedSubjects.map((subjectId, index) => {
                  const subject = subjects.find(s => s.id === subjectId);
                  const topicList = subject?.topics || [];
                  
                  return (
                    <Box key={subjectId} sx={{ display: tabValue === index ? 'block' : 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: subject?.color || 'primary.main', mr: 1 }}>
                            {subject?.icon}
                          </Avatar>
                          <Typography variant="h6">
                            {subject?.name || subjectId} Topics
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="outlined"
                          size="small" 
                          sx={{ 
                            color: subject?.color || 'primary.main',
                            borderColor: subject?.color || 'primary.main',
                            '&:hover': {
                              borderColor: subject?.color || 'primary.main',
                              bgcolor: `${subject?.color || '#3f51b5'}10`
                            }
                          }}
                          onClick={() => selectAllTopicsForSubject(subjectId)}
                        >
                          Select All Topics
                        </Button>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Selected: {(topicsBySubject[subjectId] || []).length} of {topicList.length} topics
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        {topicList.map(topic => (
                          <Grid item xs={12} sm={6} md={4} key={topic.id || topic.number}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                borderColor: (topicsBySubject[subjectId] || []).includes(topic.number) ? subject?.color || 'primary.main' : 'divider',
                                bgcolor: (topicsBySubject[subjectId] || []).includes(topic.number) ? `${subject?.color || '#3f51b5'}10` : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: subject?.color || 'primary.main',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }
                              }}
                              onClick={() => handleTopicToggle(subjectId, topic.number)}
                            >
                              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
                                <Checkbox 
                                  checked={(topicsBySubject[subjectId] || []).includes(topic.number)}
                                  sx={{ 
                                    color: subject?.color || 'primary.main',
                                    '&.Mui-checked': { color: subject?.color || 'primary.main' },
                                    p: 1
                                  }}
                                />
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                                    Topic {topic.number}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {topic.title}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {topic.questionsCount} questions available
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                })}
              </Paper>
            </Grid>
          )}
          
          {/* Test Duration and Question Count */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                3. Configure Test Parameters
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Number of Questions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                    {[45, 90, 180].map(count => (
                      <Paper 
                        key={count}
                        elevation={questionCount === count ? 3 : 0}
                        sx={{ 
                          p: 2, 
                          width: { xs: '100%', sm: 'auto', flex: 1 },
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 2,
                          border: questionCount === count ? 
                            '2px solid #6200ea' : '1px solid rgba(0, 0, 0, 0.12)',
                          bgcolor: questionCount === count ? 'rgba(98, 0, 234, 0.08)' : 'background.paper',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setQuestionCount(count)}
                      >
                        <Typography variant="h5" fontWeight="bold" color={questionCount === count ? '#6200ea' : 'text.primary'}>
                          {count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          questions
                        </Typography>
                        <Chip 
                          size="small" 
                          label={count === 45 ? "Standard" : count === 90 ? "Extended" : "Full Length"} 
                          sx={{ 
                            mt: 1, 
                            bgcolor: questionCount === count ? '#6200ea' : 'rgba(0, 0, 0, 0.08)',
                            color: questionCount === count ? 'white' : 'text.secondary'
                          }} 
                        />
                      </Paper>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Time Limit (minutes)
                  </Typography>
                  <Box sx={{ px: 2, mt: 3 }}>
                    <Slider
                      value={timeLimit}
                      onChange={(e, newValue) => setTimeLimit(newValue)}
                      step={5}
                      marks={[
                        { value: 45, label: '45 min' },
                        { value: 90, label: '90 min' },
                        { value: 180, label: '180 min' }
                      ]}
                      min={45}
                      max={180}
                      valueLabelDisplay="on"
                      sx={{
                        color: '#6200ea',
                        '& .MuiSlider-thumb': {
                          width: 24,
                          height: 24,
                          transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                          '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                          },
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0px 0px 0px 8px rgb(98 0 234 / 16%)',
                          },
                        }
                      }}
                    />
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Chip 
                        label={`${timeLimit} minutes (${timeLimit === questionCount ? '1 minute per question' : 
                          timeLimit > questionCount ? `${(timeLimit/questionCount).toFixed(1)} minutes per question` : 
                          `${(questionCount/timeLimit).toFixed(1)} questions per minute`})`}
                        color="primary"
                        sx={{ px: 2, py: 3, height: 'auto' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Summary and Start Button */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: '#f9f9f9' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Test Summary
                  </Typography>
                  <Typography variant="body1">
                    <strong>{selectedSubjects.length}</strong> subjects, <strong>{getTotalSelectedTopics()}</strong> topics selected
                  </Typography>
                  <Typography variant="body1">
                    <strong>{questionCount}</strong> questions, <strong>{timeLimit}</strong> minutes
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  disabled={getTotalSelectedTopics() === 0}
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartAssessment}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    mt: { xs: 3, md: 0 },
                    fontSize: '1.1rem',
                    bgcolor: '#6200ea',
                    '&:hover': { bgcolor: '#4a00b8' },
                    minWidth: 220
                  }}
                >
                  Start Assessment
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default AdvancedAssessment; 