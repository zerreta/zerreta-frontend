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
import physicsImage from '../assets/physics.png';
import elementaryImage from '../assets/elementaryschool.png';
import middleSchoolImage from '../assets/middleschool.png';
import highSchoolImage from '../assets/highschool.png';

const Physics = () => {
  const navigate = useNavigate();

  const physicsLevels = [
    {
      level: 'Elementary School',
      grade: 'Grades K-5',
      description: 'Introduction to basic physics concepts through fun experiments and everyday observations.',
      icon: <ElementaryIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      color: '#e8f5e9',
      coverImage: elementaryImage,
      topics: [
        'Light and Shadows',
        'Sound and Music',
        'Simple Machines',
        'Magnets and Magnetism',
        'Weather and Seasons',
        'Motion and Forces'
      ],
      activities: [
        'Build Simple Machines',
        'Shadow Experiments',
        'Magnet Discovery',
        'Sound Wave Games'
      ],
      games: [
        {
          name: 'Magnets and Electromagnets',
          url: 'https://phet.colorado.edu/en/simulations/magnets-and-electromagnets'
        },
        {
          name: 'Magnet and Compass',
          url: 'https://phet.colorado.edu/en/simulations/magnet-and-compass'
        },
        {
          name: 'My Solar System',
          url: 'https://phet.colorado.edu/en/simulations/my-solar-system'
        },
        {
          name: 'Geometric Optics: Basics',
          url: 'https://phet.colorado.edu/en/simulations/geometric-optics-basics'
        },
        {
          name: 'Density',
          url: 'https://phet.colorado.edu/en/simulations/density'
        },
        {
          name: 'Gravity Force Lab: Basics',
          url: 'https://phet.colorado.edu/en/simulations/gravity-force-lab-basics'
        },
        {
          name: 'Waves Intro',
          url: 'https://phet.colorado.edu/en/simulations/waves-intro'
        },
        {
          name: 'Gases Intro',
          url: 'https://phet.colorado.edu/en/simulations/gases-intro'
        },
        {
          name: 'Masses and Springs: Basics',
          url: 'https://phet.colorado.edu/en/simulations/masses-and-springs-basics'
        },
        {
          name: 'Energy Forms and Changes',
          url: 'https://phet.colorado.edu/en/simulations/energy-forms-and-changes'
        },
        {
          name: 'Wave Interference',
          url: 'https://phet.colorado.edu/en/simulations/wave-interference'
        },
        {
          name: 'Circuit Construction Kit: DC - Virtual Lab',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc-virtual-lab'
        },
        {
          name: 'Circuit Construction Kit: DC',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc'
        },
        {
          name: 'Pendulum Lab',
          url: 'https://phet.colorado.edu/en/simulations/pendulum-lab'
        }
      ],
      path: '/student-dashboard/physics/elementary',
      difficulty: 'Beginner',
      duration: '30+ Activities'
    },
    {
      level: 'Middle School',
      grade: 'Grades 6-8',
      description: 'Explore fundamental physics principles with hands-on experiments and mathematical relationships.',
      icon: <MiddleSchoolIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      color: '#e3f2fd',
      coverImage: middleSchoolImage,
      topics: [
        'Motion and Speed',
        'Forces and Newton\'s Laws',
        'Energy and Work',
        'Heat and Temperature',
        'Waves and Sound',
        'Light and Optics',
        'Electricity and Circuits',
        'Matter and Density'
      ],
      activities: [
        'Build Electric Circuits',
        'Motion Experiments',
        'Energy Transformations',
        'Wave Properties Lab'
      ],
      path: '/student-dashboard/physics/middle',
      difficulty: 'Intermediate',
      duration: '50+ Experiments'
    },
    {
      level: 'High School',
      grade: 'Grades 9-12',
      description: 'Advanced physics concepts with mathematical analysis, preparing for college-level physics.',
      icon: <HighSchoolIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      coverImage: highSchoolImage,
      topics: [
        'Kinematics and Dynamics',
        'Energy and Momentum',
        'Rotational Motion',
        'Thermodynamics',
        'Electromagnetic Theory',
        'Wave Physics',
        'Modern Physics',
        'Quantum Mechanics Basics'
      ],
      activities: [
        'Advanced Lab Experiments',
        'Mathematical Problem Solving',
        'Research Projects',
        'Physics Simulations'
      ],
      path: '/student-dashboard/physics/high',
      difficulty: 'Advanced',
      duration: '100+ Concepts'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/curriculum');
  };

  const handleLevelClick = (path, level) => {
    if (level === 'Elementary School') {
      navigate('/student-dashboard/physics/elementary');
    } else if (level === 'Middle School') {
      navigate('/student-dashboard/physics/middle');
    } else if (level === 'High School') {
      navigate('/student-dashboard/physics/high');
    } else {
      alert(`${level} Physics module is under development! We're creating comprehensive physics content for this level.`);
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
      
      {/* Cover Image Section with Blur on Hover */}
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
            backgroundImage: `url(${physicsImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'all 0.4s ease-in-out',
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
              Physics Learning Hub
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
              Explore the fundamental laws of nature through interactive learning across all grade levels
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Chip 
                icon={<LightbulbIcon />} 
                label="Interactive Experiments" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2196f3',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<SpeedIcon />} 
                label="Real-World Applications" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#4caf50',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<PsychologyIcon />} 
                label="Problem Solving" 
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
            Physics
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
            Interactive Experiments & Real-World Applications
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {physicsLevels.map((level, index) => (
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
                  boxShadow: '0 20px 40px rgba(116, 69, 248, 0.2)',
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
                      color: 'rgba(255,255,255,0.9)',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                  >
                    {level.grade}
                  </Typography>
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      textAlign: 'center'
                    }}
                  >
                    {level.description}
                  </Typography>
                </Box>

                {/* Hover overlay for enhanced display */}
                <Box
                  className="card-hover-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(33,150,243,0.8) 0%, rgba(33,150,243,0.6) 100%)',
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
                    variant="h4" 
                    component="div"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      textAlign: 'center',
                      textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                      mb: 1,
                      transform: 'translateY(20px)',
                      transition: 'transform 0.4s ease-in-out'
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
                      lineHeight: 1.4,
                      transform: 'translateY(20px)',
                      transition: 'transform 0.4s ease-in-out 0.1s'
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
                    backgroundColor: '#7445f8',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(116, 69, 248, 0.3)',
                    '&:hover': {
                      backgroundColor: '#5c33d4',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(116, 69, 248, 0.4)',
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
          Why Study Physics?
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <LightbulbIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Critical Thinking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Develop analytical skills and logical reasoning through physics problem-solving
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <SpeedIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Real Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand how physics principles apply to technology and everyday life
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
                Build foundation for STEM careers in engineering, research, and technology
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

export default Physics; 