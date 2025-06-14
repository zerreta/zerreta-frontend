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
import {
  RecordVoiceOver as SpeakyIcon,
  Calculate as AptiIcon,
  Code as CodeIcon,
  ArrowBack as ArrowBackIcon,
  Functions as MathIcon
} from '@mui/icons-material';
import codezyImage from '../assets/codezy.png';
import speakyImage from '../assets/speaky.png';
import aptiImage from '../assets/apti.png';

const ExtrasPage = () => {
  const navigate = useNavigate();

  const extras = [
    {
      title: 'Speaky',
      description: 'Improve your verbal communication with interactive speaking exercises and AI-powered feedback.',
      image: speakyImage,
      path: '/student-dashboard/speaky',
      color: '#f8e9ff',
      textColor: '#7b1fa2'
    },
    {
      title: 'Codezy',
      description: 'Learn to code with interactive programming exercises and challenges designed for beginners.',
      image: codezyImage,
      path: '/student-dashboard/codezy',
      color: '#e6f7ff',
      textColor: '#1976d2'
    },
    {
      title: 'Apti',
      description: 'Sharpen your aptitude skills with various problem-solving exercises and practice tests.',
      image: aptiImage,
      path: '/student-dashboard/apti',
      color: '#fff4e3',
      textColor: '#f57c00'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard');
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
          Skills
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Develop essential skills with specialized tools and interactive learning modules
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {extras.map((extra) => (
          <Grid item xs={12} sm={6} md={4} key={extra.title}>
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
              onClick={() => navigate(extra.path)}
            >
              {/* Image Area with Hover Effect */}
              <Box 
                sx={{ 
                  height: 250,
                  position: 'relative',
                  overflow: 'hidden'
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
                    backgroundImage: `url(${extra.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transition: 'all 0.4s ease-in-out',
                    backgroundColor: extra.color
                  }}
                />

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
                    {extra.title}
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
                    {extra.description}
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight={600} color="#333">
                  {extra.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {extra.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: extra.textColor,
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: `0 4px 12px ${extra.textColor}40`,
                    '&:hover': {
                      backgroundColor: extra.textColor,
                      filter: 'brightness(0.9)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Open {extra.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExtrasPage; 