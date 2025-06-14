import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container
} from '@mui/material';
import physicsImage from '../assets/physics.png';
import chemistryImage from '../assets/chemistry.png';
import biologyImage from '../assets/biology.png';
import mathStatsImage from '../assets/math&stats.png';
import earthSpaceImage from '../assets/earth&space.png';
import {
  Science as PhysicsIcon,
  Biotech as ChemistryIcon,
  Public as EarthSpaceIcon,
  LocalFlorist as BiologyIcon,
  Calculate as MathIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import PhETCredits from './PhETCredits';

const Curriculum = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: 'Physics',
      description: 'Explore the fundamental laws of nature, from mechanics to quantum physics. Understand how the universe works.',
      image: physicsImage,
      path: '/student-dashboard/physics',
      color: '#e3f2fd',
      textColor: '#1976d2'
    },
    {
      title: 'Chemistry',
      description: 'Discover the molecular world through chemical reactions, atomic structure, and laboratory experiments.',
      image: chemistryImage,
      path: '/student-dashboard/chemistry',
      color: '#e8f5e9',
      textColor: '#388e3c'
    },
    {
      title: 'Earth & Space',
      description: 'Journey through our planet and beyond. Study geology, astronomy, meteorology, and space exploration.',
      image: earthSpaceImage,
      path: '/student-dashboard/earth-space',
      color: '#fff3e0',
      textColor: '#f57c00'
    },
    {
      title: 'Biology',
      description: 'Dive into the fascinating world of living organisms, from cellular biology to ecosystems and evolution.',
      image: biologyImage,
      path: '/student-dashboard/biology',
      color: '#f1f8e9',
      textColor: '#689f38'
    },
    {
      title: 'Math & Statistics',
      description: 'Master mathematical concepts and statistical analysis. Build problem-solving skills and logical thinking.',
      image: mathStatsImage,
      path: '/student-dashboard/math-stats',
      color: '#f3e5f5',
      textColor: '#7b1fa2'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard');
  };

  const handleSubjectClick = (path) => {
    switch (path) {
      case '/student-dashboard/physics':
        navigate('/student-dashboard/physics');
        break;
      case '/student-dashboard/chemistry':
        navigate('/student-dashboard/chemistry');
        break;
      case '/student-dashboard/biology':
        navigate('/student-dashboard/biology');
        break;
      case '/student-dashboard/earth-space':
        navigate('/student-dashboard/earth-space');
        break;
      case '/student-dashboard/math-stats':
        navigate('/student-dashboard/math-stats');
        break;
      default:
        alert('This subject module is coming soon! We are developing comprehensive curriculum content.');
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
          Back to Dashboard
        </Button>
      </Box>
      
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
          Curriculum
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Comprehensive academic subjects aligned with standard curriculum requirements
        </Typography>
      </Box>
      


      <Grid container spacing={3}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(116, 69, 248, 0.15)',
                  '& .hover-overlay': {
                    opacity: 1,
                    backdropFilter: 'blur(8px)'
                  },
                  '& .image-background': {
                    filter: 'blur(2px)',
                    transform: 'scale(1.05)'
                  }
                }
              }}
              onClick={() => handleSubjectClick(subject.path)}
            >
              {/* Image Area with Hover Effect */}
              <Box 
                sx={{ 
                  height: 250,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background Image or Gradient */}
                <Box
                  className="image-background"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: subject.image ? `url(${subject.image})` : `linear-gradient(135deg, ${subject.textColor}20 0%, ${subject.textColor}10 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'all 0.4s ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: subject.color
                  }}
                >
                  {/* Icon for subjects without images */}
                  {!subject.image && subject.title === 'Earth & Space' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EarthSpaceIcon sx={{ fontSize: 120, color: subject.textColor, opacity: 0.7 }} />
                    </Box>
                  )}
                </Box>

                {/* Hover overlay for title display */}
                <Box
                  className="hover-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
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
                      mb: 2,
                      transform: 'translateY(20px)',
                      transition: 'transform 0.4s ease-in-out'
                    }}
                  >
                    {subject.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    component="div"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      lineHeight: 1.4,
                      transform: 'translateY(20px)',
                      transition: 'transform 0.4s ease-in-out 0.1s'
                    }}
                  >
                    {subject.description}
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight={600} color="#333">
                  {subject.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subject.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: subject.textColor,
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: `0 4px 12px ${subject.textColor}40`,
                    '&:hover': {
                      backgroundColor: subject.textColor,
                      filter: 'brightness(0.9)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Explore {subject.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* PhET Credits */}
      <PhETCredits />
    </Container>
  );
};

export default Curriculum; 