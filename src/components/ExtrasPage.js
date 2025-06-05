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
import mathOrbitImage from '../assets/mathorbit.png';

const ExtrasPage = () => {
  const navigate = useNavigate();

  const extras = [
    {
      title: 'Speaky',
      description: 'Improve your verbal communication with interactive speaking exercises and AI-powered feedback.',
      icon: <img src={speakyImage} alt="Speaky" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: '0% 30%' }} />,
      path: '/student-dashboard/speaky',
      color: '#f8e9ff'
    },
    {
      title: 'Codezy',
      description: 'Learn to code with interactive programming exercises and challenges designed for beginners.',
      icon: <img src={codezyImage} alt="Codezy" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: '0% 30%' }} />,
      path: '/student-dashboard/codezy',
      color: '#e6f7ff'
    },
    {
      title: 'Apti',
      description: 'Sharpen your aptitude skills with various problem-solving exercises and practice tests.',
      icon: <img src={aptiImage} alt="Apti" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: '0% 30%' }} />,
      path: '/student-dashboard/apti',
      color: '#fff4e3'
    },
    {
      title: 'MathOrbit',
      description: 'Explore the solar system while solving math problems! Interactive orbital mechanics meets mathematics.',
      icon: <img src={mathOrbitImage} alt="MathOrbit" style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: '0% 30%' }} />,
      path: '/student-dashboard/mathorbit',
      color: '#f0f4ff'
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
          Extras
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Explore additional learning tools and resources to enhance your skills
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {extras.map((extra) => (
          <Grid item xs={12} sm={6} md={3} key={extra.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(116, 69, 248, 0.15)',
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 0, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: extra.color,
                  overflow: 'hidden',
                  height: 200
                }}
              >
                {extra.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
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
                  onClick={() => navigate(extra.path)}
                  sx={{
                    backgroundColor: '#7445f8',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1,
                    boxShadow: '0 4px 12px rgba(116, 69, 248, 0.2)',
                    '&:hover': {
                      backgroundColor: '#5c33d4',
                      color: '#fff',
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