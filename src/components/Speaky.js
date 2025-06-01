import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Container 
} from '@mui/material';
import grammarImage from '../assets/grammar.png';
import vocabularyImage from '../assets/Vocabulary.png';
import speakingImage from '../assets/speaking.png';
import readingImage from '../assets/reading.png';
import writingImage from '../assets/writing.png';

const Speaky = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/extras');
  };

  const modules = [
    {
      id: 1,
      title: 'Grammar',
      bgColor: '#f8e9ff',
      image: grammarImage,
      description: 'Master English grammar rules and structures',
      path: '/speaky/grammar'
    },
    {
      id: 2,
      title: 'Vocabulary', 
      bgColor: '#e6f7ff',
      image: vocabularyImage,
      description: 'Expand your English vocabulary',
      path: '/speaky/vocabulary'
    },
    {
      id: 3,
      title: 'Speaking',
      bgColor: '#fff4e3',
      image: speakingImage,
      description: 'Improve your speaking and pronunciation',
      path: '/speaky/speaking'
    },
    {
      id: 4,
      title: 'Listening',
      bgColor: '#f0f9ff',
      image: speakingImage, // Using speaking image as placeholder for listening
      description: 'Enhance your listening comprehension skills',
      path: '/speaky/listening'
    },
    {
      id: 5,
      title: 'Reading',
      bgColor: '#f3e8ff',
      image: readingImage,
      description: 'Develop reading comprehension and speed',
      path: '/speaky/reading'
    },
    {
      id: 6,
      title: 'Writing',
      bgColor: '#f0fdfa',
      image: writingImage,
      description: 'Master writing skills and composition',
      path: '/speaky/writing'
    }
  ];

  const handleModuleClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg">
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
          Back to Extras
        </Button>
      </Box>
      
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
          English Learning Modules
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Master English with our comprehensive learning modules
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
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
                  backgroundColor: module.bgColor,
                  overflow: 'hidden',
                  height: 200
                }}
              >
                <img 
                  src={module.image} 
                  alt={module.title} 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    objectPosition: '0% 30%' 
                  }} 
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight={600} color="#333">
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth
                  variant="contained"
                  onClick={() => handleModuleClick(module.path)}
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
                  Start {module.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Speaky;