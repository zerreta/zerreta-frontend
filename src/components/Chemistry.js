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
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import PhETCredits from './PhETCredits';
import chemistryImage from '../assets/chemistry.png';
import elementaryImage from '../assets/elementaryschool.png';
import middleSchoolImage from '../assets/middleschool.png';
import highSchoolImage from '../assets/highschool.png';

const Chemistry = () => {
  const navigate = useNavigate();

  const chemistryLevels = [
    {
      level: 'Elementary School',
      grade: 'Grades K-5',
      description: 'Introduction to basic chemistry concepts through safe experiments and everyday observations.',
      icon: <ElementaryIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      color: '#e8f5e9',
      coverImage: elementaryImage,
      topics: [
        'States of Matter',
        'Mixtures and Solutions',
        'Chemical vs Physical Changes',
        'Acids and Bases',
        'Simple Reactions',
        'Matter and Materials'
      ],
      activities: [
        'Safe Kitchen Chemistry',
        'Color-Changing Reactions',
        'Crystal Growing',
        'pH Testing with Indicators'
      ],
      path: '/student-dashboard/chemistry/elementary',
      difficulty: 'Beginner',
      duration: '25+ Activities'
    },
    {
      level: 'Middle School',
      grade: 'Grades 6-8',
      description: 'Explore fundamental chemistry principles with hands-on experiments and molecular understanding.',
      icon: <MiddleSchoolIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      color: '#e3f2fd',
      coverImage: middleSchoolImage,
      topics: [
        'Atomic Structure',
        'Elements and Compounds',
        'Chemical Bonding',
        'Chemical Reactions',
        'Periodic Table',
        'Acids, Bases, and pH',
        'Solutions and Mixtures',
        'Gas Laws'
      ],
      activities: [
        'Build Atomic Models',
        'Chemical Reaction Labs',
        'Periodic Table Games',
        'pH and Titration Labs'
      ],
      path: '/student-dashboard/chemistry/middle',
      difficulty: 'Intermediate',
      duration: '40+ Experiments'
    },
    {
      level: 'High School',
      grade: 'Grades 9-12',
      description: 'Advanced chemistry concepts with quantitative analysis, preparing for college-level chemistry.',
      icon: <HighSchoolIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      coverImage: highSchoolImage,
      topics: [
        'Stoichiometry',
        'Thermochemistry',
        'Chemical Equilibrium',
        'Reaction Kinetics',
        'Electrochemistry',
        'Organic Chemistry',
        'Nuclear Chemistry',
        'Advanced Bonding Theory'
      ],
      activities: [
        'Quantitative Analysis Labs',
        'Spectroscopy Studies',
        'Organic Synthesis',
        'Research Projects'
      ],
      path: '/student-dashboard/chemistry/high',
      difficulty: 'Advanced',
      duration: '75+ Concepts'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/curriculum');
  };

  const handleLevelClick = (path, level) => {
    if (level === 'Elementary School') {
      navigate('/student-dashboard/chemistry/elementary');
    } else {
      alert(`${level} Chemistry module is under development! We're creating comprehensive chemistry content for this level.`);
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
      
      {/* Cover Image Section with Hover Effect */}
      <Box 
        sx={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: 4,
          height: '300px',
          cursor: 'pointer',
          '&:hover': {
            '& .hover-overlay': {
              opacity: 1,
              backdropFilter: 'blur(8px)'
            },
            '& .image-background': {
              filter: 'blur(3px)',
              transform: 'scale(1.05)'
            }
          }
        }}
      >
        {/* Background Image */}
        <Box
          className="image-background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${chemistryImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'all 0.4s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {/* Default Overlay with visible text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
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
              Chemistry Learning Hub
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
              Discover the molecular world through interactive learning
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Chip 
                icon={<LightbulbIcon />} 
                label="Interactive Experiments" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#4caf50',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<SpeedIcon />} 
                label="Molecular Modeling" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2196f3',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<PsychologyIcon />} 
                label="Chemical Reasoning" 
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

        {/* Hover overlay for enhanced text display */}
        <Box
          className="hover-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'all 0.4s ease-in-out',
            backdropFilter: 'blur(0px)',
            padding: 3
          }}
        >
          <Typography 
            variant="h2" 
            component="div"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
              mb: 2,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out'
            }}
          >
            Chemistry
          </Typography>
          
          <Typography 
            variant="h4" 
            component="div"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              lineHeight: 1.4,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out 0.1s',
              mb: 2
            }}
          >
            Learning Hub
          </Typography>

          <Typography 
            variant="h6" 
            component="div"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              lineHeight: 1.4,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out 0.2s'
            }}
          >
            Molecular Modeling & Chemical Reasoning
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {chemistryLevels.map((level, index) => (
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

              {/* Header Section with Cover Image and Blur on Hover */}
              <Box 
                sx={{ 
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    '& .card-image-background': {
                      filter: 'blur(3px)',
                      transform: 'scale(1.05)'
                    },
                    '& .card-hover-overlay': {
                      opacity: 1,
                      backdropFilter: 'blur(8px)'
                    }
                  }
                }}
              >
                {/* Background Image */}
                <Box
                  className="card-image-background"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${level.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'all 0.4s ease-in-out',
                  }}
                />

                {/* Default Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      mb: 2
                    }}
                  >
                    {level.icon}
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    fontWeight={600} 
                    gutterBottom
                    sx={{ 
                      color: '#fff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}
                  >
                    {level.level}
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {level.grade}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {level.description}
                  </Typography>
                </Box>

                {/* Hover overlay for enhanced text display */}
                <Box
                  className="card-hover-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'all 0.4s ease-in-out',
                    backdropFilter: 'blur(0px)',
                    padding: 3
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      mb: 2
                    }}
                  >
                    {level.icon}
                  </Avatar>
                  <Typography 
                    variant="h4" 
                    component="div"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textAlign: 'center',
                      textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                      mb: 1
                    }}
                  >
                    {level.level}
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    component="div"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 500,
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      lineHeight: 1.4
                    }}
                  >
                    {level.grade}
                  </Typography>
                </Box>
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
          Why Study Chemistry?
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <LightbulbIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Scientific Understanding
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand how matter behaves and changes at the molecular level
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <SpeedIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Real-World Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apply chemistry to medicine, materials science, and environmental solutions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <PsychologyIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Career Preparation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build foundation for careers in medicine, engineering, and research
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

export default Chemistry; 