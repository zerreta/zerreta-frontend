import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Chip,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as ElementaryIcon,
  MenuBook as MiddleSchoolIcon,
  Science as HighSchoolIcon,
  Calculate as MathIcon,
  TrendingUp as StatsIcon,
  Psychology as LogicIcon
} from '@mui/icons-material';
import PhETCredits from './PhETCredits';
import mathStatsImage from '../assets/math&stats.png';
import elementaryImage from '../assets/elementaryschool.png';
import middleSchoolImage from '../assets/middleschool.png';
import highSchoolImage from '../assets/highschool.png';

const MathStats = () => {
  const navigate = useNavigate();

  const mathStatsLevels = [
    {
      level: 'Elementary School',
      grade: 'Grades 3-5',
      description: 'Build foundational math skills through hands-on activities, visual learning, and interactive exploration.',
      icon: <ElementaryIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      color: '#e8f5e9',
      coverImage: elementaryImage,
      topics: [
        'Number Sense & Operations',
        'Fractions',
        'Geometry Basics',
        'Measurement',
        'Data and Graphs',
        'Problem Solving'
      ],
      activities: [
        'Interactive Number Games',
        'Fraction Builders',
        'Shape Explorations',
        'Math Simulations'
      ],
      path: '/student-dashboard/math-stats/elementary',
      difficulty: 'Beginner',
      duration: '13+ Simulations'
    },
    {
      level: 'Middle School',
      grade: 'Grades 6-7',
      description: 'Develop algebraic thinking, statistical reasoning, and advanced problem-solving strategies.',
      icon: <MiddleSchoolIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      color: '#e3f2fd',
      coverImage: middleSchoolImage,
      topics: [
        'Algebra & Functions',
        'Area Models',
        'Ratios & Proportions',
        'Probability & Statistics',
        'Geometry',
        'Mathematical Relationships'
      ],
      activities: [
        'Function Builders',
        'Statistical Investigations',
        'Proportion Playground',
        'Probability Experiments'
      ],
      path: '/student-dashboard/math-stats/middle',
      difficulty: 'Intermediate',
      duration: '15+ Simulations'
    },
    {
      level: 'High School',
      grade: 'Grades 8-9',
      description: 'Master advanced mathematics and statistics, preparing for college-level coursework and careers.',
      icon: <HighSchoolIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      coverImage: highSchoolImage,
      topics: [
        'Advanced Algebra',
        'Quadratic Functions',
        'Trigonometry',
        'Calculus Introduction',
        'Statistical Analysis',
        'Mathematical Modeling'
      ],
      activities: [
        'Function Analysis',
        'Regression Studies',
        'Trigonometric Exploration',
        'Calculus Concepts'
      ],
      path: '/student-dashboard/math-stats/high',
      difficulty: 'Advanced', 
      duration: '8+ Simulations'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/curriculum');
  };

  const handleLevelClick = (path, level) => {
    if (level === 'Elementary School') {
      navigate('/student-dashboard/math-stats/elementary');
    } else if (level === 'Middle School') {
      navigate('/student-dashboard/math-stats/middle');
    } else if (level === 'High School') {
      navigate('/student-dashboard/math-stats/high');
    } else {
      alert(`${level} Math & Statistics module is under development! We're creating comprehensive content for this level.`);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#4caf50';
      case 'Intermediate': return '#ff9800';
      case 'Advanced': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            '&:hover': {
              borderColor: '#5c33d4',
              backgroundColor: 'rgba(116, 69, 248, 0.04)',
            }
          }}
        >
          Back to Curriculum
        </Button>
      </Box>
      
      {/* Cover Image Section */}
      <Box 
        sx={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: 4,
          height: '300px',
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${mathStatsImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              marginBottom: 2 
            }}
          >
            Math & Statistics Learning Hub
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#fff',
              margin: '0 auto',
              fontWeight: 'normal',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              mb: 3,
              maxWidth: '600px'
            }}
          >
            Build mathematical thinking and statistical reasoning skills through interactive learning across all grade levels
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Chip 
              label="36+ Simulations" 
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                color: '#4caf50',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }} 
            />
            <Chip 
              label="All Grade Levels" 
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                color: '#2196f3',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }} 
            />
            <Chip 
              label="Interactive Learning" 
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                color: '#9c27b0',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }} 
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {mathStatsLevels.map((level, index) => (
          <Grid item xs={12} md={4} key={level.level}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: '0 20px 40px rgba(76, 175, 80, 0.2)',
                }
              }}
            >
              {/* Level Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                  zIndex: 1
                }}
              >
                <Chip
                  label={level.difficulty}
                  size="small"
                  sx={{
                    backgroundColor: getDifficultyColor(level.difficulty),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>

              {/* Header Section with Cover Image and Hover Effect */}
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  height: '200px',
                  background: level.color,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${level.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    '& .level-text': {
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }
                  },
                  '&::after': {
                    content: '"Hover to see image"',
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    opacity: 0.8,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::after': {
                    opacity: 0
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: 'transparent',
                    mb: 2
                  }}
                >
                  {level.icon}
                </Avatar>
                <Typography 
                  variant="h5" 
                  fontWeight={600} 
                  gutterBottom
                  className="level-text"
                  sx={{ 
                    color: '#333',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {level.level}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  className="level-text"
                  sx={{ 
                    color: 'text.secondary',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {level.grade}
                </Typography>
                <Typography 
                  variant="body2"
                  className="level-text"
                  sx={{ 
                    color: 'text.secondary',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {level.description}
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box mb={3}>
                  <Typography variant="h6" fontWeight={600} color="#333" gutterBottom>
                    Key Topics
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {level.topics.slice(0, 4).map((topic, topicIndex) => (
                      <Chip
                        key={topicIndex}
                        label={topic}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {level.topics.length > 4 && (
                      <Chip
                        label={`+${level.topics.length - 4} more`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                      />
                    )}
                  </Box>
                </Box>

                <Box mb={3}>
                  <Typography variant="h6" fontWeight={600} color="#333" gutterBottom>
                    Learning Activities
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {level.activities.map((activity, actIndex) => (
                      <Typography 
                        key={actIndex} 
                        component="li" 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {activity}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={level.duration}
                    size="small"
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      fontWeight: 500
                    }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth
                  variant="contained"
                  onClick={() => handleLevelClick(level.path, level.level)}
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      backgroundColor: '#388e3c',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                    }
                  }}
                >
                  Start {level.level}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={6} p={4} sx={{ backgroundColor: '#f8f9fa', borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
          Why Study Math & Statistics?
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <MathIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Critical Thinking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Develop logical reasoning and analytical problem-solving skills
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <StatsIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Data Literacy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn to analyze, interpret, and make decisions based on data
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <LogicIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Career Preparation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build foundation for STEM careers and everyday quantitative reasoning
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* PhET Credits */}
      <PhETCredits />
    </Container>
  );
};

export default MathStats; 