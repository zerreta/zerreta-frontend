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
  Nature as NatureIcon,
  Biotech as BiotechIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import PhETCredits from './PhETCredits';
import biologyImage from '../assets/biology.png';
import elementaryImage from '../assets/elementaryschool.png';
import middleSchoolImage from '../assets/middleschool.png';
import highSchoolImage from '../assets/highschool.png';

const Biology = () => {
  const navigate = useNavigate();

  const biologyLevels = [
    {
      level: 'Elementary School',
      grade: 'Grades K-5',
      description: 'Explore the world of living things through observations, experiments, and nature studies.',
      icon: <ElementaryIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      color: '#e8f5e9',
      coverImage: elementaryImage,
      topics: [
        'Animal Classification',
        'Plant Life Cycles',
        'Human Body Systems',
        'Habitats and Ecosystems',
        'Living vs Non-Living',
        'Food Chains'
      ],
      activities: [
        'Nature Observations',
        'Plant Growing Projects',
        'Animal Behavior Studies',
        'Ecosystem Dioramas'
      ],
      path: '/student-dashboard/biology/elementary',
      difficulty: 'Beginner',
      duration: '30+ Activities'
    },
    {
      level: 'Middle School',
      grade: 'Grades 6-8',
      description: 'Dive deeper into life science with cellular biology, genetics, and environmental studies.',
      icon: <MiddleSchoolIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      color: '#e3f2fd',
      coverImage: middleSchoolImage,
      topics: [
        'Cell Structure and Function',
        'Genetics and Heredity',
        'Evolution and Natural Selection',
        'Body Systems',
        'Ecology and Environment',
        'Classification Systems',
        'Reproduction and Development',
        'Microscopy Techniques'
      ],
      activities: [
        'Microscope Investigations',
        'Genetics Labs',
        'Ecosystem Studies',
        'Dissection Activities'
      ],
      path: '/student-dashboard/biology/middle',
      difficulty: 'Intermediate',
      duration: '45+ Experiments'
    },
    {
      level: 'High School',
      grade: 'Grades 9-12',
      description: 'Advanced biology with molecular focus, biochemistry, and preparation for college-level studies.',
      icon: <HighSchoolIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      coverImage: highSchoolImage,
      topics: [
        'Molecular Biology',
        'Biochemistry',
        'Advanced Genetics',
        'Biotechnology',
        'Anatomy and Physiology',
        'Microbiology',
        'Environmental Science',
        'Research Methods'
      ],
      activities: [
        'DNA Extraction Labs',
        'Enzyme Studies',
        'Biotechnology Projects',
        'Scientific Research'
      ],
      path: '/student-dashboard/biology/high',
      difficulty: 'Advanced',
      duration: '80+ Concepts'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/curriculum');
  };

  const handleLevelClick = (path, level) => {
    if (level === 'Elementary School') {
      navigate('/student-dashboard/biology/elementary');
    } else {
      alert(`${level} Biology module is under development! We're creating comprehensive biology content for this level.`);
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
            backgroundImage: `url(${biologyImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'all 0.4s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
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
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))',
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
              Biology Learning Hub
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
              Discover the wonders of life through interactive exploration
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Chip 
                icon={<NatureIcon />} 
                label="Living Systems" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#4caf50',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<BiotechIcon />} 
                label="Scientific Inquiry" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2196f3',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                icon={<PsychologyIcon />} 
                label="Life Science Thinking" 
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
            Biology
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
            Living Systems & Scientific Inquiry
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {biologyLevels.map((level, index) => (
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

              {/* Header Section */}
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: level.color,
                  textAlign: 'center'
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
                <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
                  {level.level}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {level.grade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
          Why Study Biology?
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <NatureIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Understanding Life
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore how living organisms function and interact with their environment
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <BiotechIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Medical Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Apply biological knowledge to medicine, health, and biotechnology
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <PsychologyIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Environmental Awareness
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand ecosystems and our role in environmental conservation
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

export default Biology; 