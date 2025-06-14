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
  Public as EarthIcon,
  Rocket as SpaceIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import PhETCredits from './PhETCredits';

const EarthSpace = () => {
  const navigate = useNavigate();

  const earthSpaceLevels = [
    {
      level: 'Elementary School',
      grade: 'Grades K-5',
      description: 'Explore our planet Earth and the wonders of space through observations and simple experiments.',
      icon: <ElementaryIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      color: '#e8f5e9',
      topics: [
        'Weather and Seasons',
        'Day and Night',
        'Earth\'s Surface Features',
        'Solar System Basics',
        'Rocks and Minerals',
        'Water Cycle'
      ],
      activities: [
        'Weather Tracking',
        'Rock Collection',
        'Solar System Models',
        'Moon Observations'
      ],
      path: '/student-dashboard/earth-space/elementary',
      difficulty: 'Beginner',
      duration: '28+ Activities'
    },
    {
      level: 'Middle School',
      grade: 'Grades 6-8',
      description: 'Study Earth\'s systems and explore space with more detailed investigations and data analysis.',
      icon: <MiddleSchoolIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      color: '#e3f2fd',
      topics: [
        'Plate Tectonics',
        'Climate and Weather Systems',
        'Earth\'s Atmosphere',
        'Solar System Dynamics',
        'Stars and Galaxies',
        'Natural Resources',
        'Environmental Science',
        'Space Exploration'
      ],
      activities: [
        'Geological Investigations',
        'Climate Studies',
        'Telescope Observations',
        'Environmental Projects'
      ],
      path: '/student-dashboard/earth-space/middle',
      difficulty: 'Intermediate',
      duration: '42+ Experiments'
    },
    {
      level: 'High School',
      grade: 'Grades 9-12',
      description: 'Advanced earth science and astronomy with quantitative analysis and current research topics.',
      icon: <HighSchoolIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      color: '#f3e5f5',
      topics: [
        'Advanced Geology',
        'Atmospheric Physics',
        'Oceanography',
        'Astrophysics',
        'Planetary Science',
        'Environmental Chemistry',
        'Climate Change Science',
        'Space Technology'
      ],
      activities: [
        'Spectroscopy Analysis',
        'Geological Field Work',
        'Climate Modeling',
        'Research Projects'
      ],
      path: '/student-dashboard/earth-space/high',
      difficulty: 'Advanced',
      duration: '70+ Concepts'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/curriculum');
  };

  const handleLevelClick = (path, level) => {
    if (level === 'Elementary School') {
      navigate('/student-dashboard/earth-space/elementary');
    } else {
      alert(`${level} Earth & Space Science module is under development! We're creating comprehensive content for this level.`);
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
      
      <Box mb={4} textAlign="center">
        <Typography variant="h3" fontWeight={700} color="#333" gutterBottom>
          Earth & Space Science Hub
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2}>
          Explore our planet and the universe beyond
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<EarthIcon />} 
            label="Earth Systems" 
            variant="outlined" 
            sx={{ borderColor: '#4caf50', color: '#4caf50' }}
          />
          <Chip 
            icon={<SpaceIcon />} 
            label="Space Exploration" 
            variant="outlined" 
            sx={{ borderColor: '#2196f3', color: '#2196f3' }}
          />
          <Chip 
            icon={<ExploreIcon />} 
            label="Scientific Discovery" 
            variant="outlined" 
            sx={{ borderColor: '#9c27b0', color: '#9c27b0' }}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {earthSpaceLevels.map((level, index) => (
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
          Why Study Earth & Space Science?
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <EarthIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Planet Earth
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand Earth's systems, natural resources, and environmental processes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <SpaceIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Space Exploration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the cosmos, from our solar system to distant galaxies
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <ExploreIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Future Careers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prepare for careers in geology, meteorology, astronomy, and environmental science
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

export default EarthSpace; 