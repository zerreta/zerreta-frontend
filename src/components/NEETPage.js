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
  Container
} from '@mui/material';
import {
  School as ProgressIcon,
  Analytics as AnalyticsIcon,
  Assessment as SummaryIcon,
  BookmarkBorder as ResourcesIcon,
  Assignment as TestHistoryIcon,
  Lightbulb as AIHelpIcon,
  EmojiEvents as LeaderboardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const NEETPage = () => {
  const navigate = useNavigate();

  const neetFeatures = [
    {
      title: 'My Progress',
      description: 'Track your learning progress, completed topics, and performance insights.',
      icon: <ProgressIcon sx={{ fontSize: 120, color: '#4caf50' }} />,
      path: '/student-dashboard/progress',
      color: '#e8f5e9'
    },
    {
      title: 'Analytics',
      description: 'Detailed performance analytics and learning insights to optimize your preparation.',
      icon: <AnalyticsIcon sx={{ fontSize: 120, color: '#2196f3' }} />,
      path: '/student-dashboard/analytics',
      color: '#e3f2fd'
    },
    {
      title: 'Analytics Summary',
      description: 'Comprehensive summary of your academic performance and improvement areas.',
      icon: <SummaryIcon sx={{ fontSize: 120, color: '#9c27b0' }} />,
      path: '/student-dashboard/analytics-summary',
      color: '#f3e5f5'
    },
    {
      title: 'Resources',
      description: 'Access study materials, reference books, and additional learning resources.',
      icon: <ResourcesIcon sx={{ fontSize: 120, color: '#ff9800' }} />,
      path: '/student-dashboard/resources',
      color: '#fff3e0'
    },
    {
      title: 'Test History',
      description: 'Review your past test performances, scores, and detailed answer analysis.',
      icon: <TestHistoryIcon sx={{ fontSize: 120, color: '#f44336' }} />,
      path: '/student-dashboard/test-history',
      color: '#ffebee'
    },
    {
      title: 'AI Help',
      description: 'Get personalized AI-powered assistance for your questions and study guidance.',
      icon: <AIHelpIcon sx={{ fontSize: 120, color: '#ffeb3b' }} />,
      path: '/student-dashboard/ai-help',
      color: '#fffde7'
    },
    {
      title: 'Leaderboard',
      description: 'See your ranking among peers and compete with other NEET aspirants.',
      icon: <LeaderboardIcon sx={{ fontSize: 120, color: '#e91e63' }} />,
      path: '/student-dashboard/leaderboard',
      color: '#fce4ec'
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
          NEET Preparation Hub
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Comprehensive tools and features designed specifically for NEET exam preparation
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {neetFeatures.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
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
                  backgroundColor: feature.color,
                  overflow: 'hidden',
                  height: 200
                }}
              >
                {feature.icon}
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" fontWeight={600} color="#333">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(feature.path)}
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
                  Open {feature.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NEETPage; 