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
  Container,
  Chip
} from '@mui/material';
import {
  School as ProgressIcon,
  Analytics as AnalyticsIcon,
  Assessment as SummaryIcon,
  BookmarkBorder as ResourcesIcon,
  Assignment as TestHistoryIcon,
  Lightbulb as AIHelpIcon,
  EmojiEvents as LeaderboardIcon,
  AutoAwesome as PremiumIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon
} from '@mui/icons-material';

const NEETDashboard = () => {
  const navigate = useNavigate();

  const neetFeatures = [
    {
      title: 'My Progress',
      description: 'Track your NEET preparation progress with detailed analytics.',
      icon: <ProgressIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
      path: '/student-dashboard/neet/progress',
      color: '#e8f5e9'
    },
    {
      title: 'Analytics',
      description: 'Analyze your performance across different subjects and topics.',
      icon: <AnalyticsIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
      path: '/student-dashboard/neet/analytics',
      color: '#e3f2fd'
    },
    {
      title: 'Analytics Summary',
      description: 'Get a comprehensive overview of your preparation status.',
      icon: <SummaryIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
      path: '/student-dashboard/neet/analytics-summary',
      color: '#f3e5f5'
    },
    {
      title: 'Resources',
      description: 'Access study materials and resources for NEET preparation.',
      icon: <ResourcesIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
      path: '/student-dashboard/neet/resources',
      color: '#fff3e0'
    },
    {
      title: 'Test History',
      description: 'Review your past test performances and identify improvement areas.',
      icon: <TestHistoryIcon sx={{ fontSize: 60, color: '#f44336' }} />,
      path: '/student-dashboard/neet/test-history',
      color: '#ffebee'
    },
    {
      title: 'AI Help',
      description: 'Get personalized assistance and guidance from AI tutor.',
      icon: <AIHelpIcon sx={{ fontSize: 60, color: '#ffeb3b' }} />,
      path: '/student-dashboard/neet/ai-help',
      color: '#fffde7'
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank among other NEET aspirants.',
      icon: <LeaderboardIcon sx={{ fontSize: 60, color: '#e91e63' }} />,
      path: '/student-dashboard/neet/leaderboard',
      color: '#fce4ec'
    }
  ];

    return (
    <Container maxWidth="xl">
        <Box>
          {/* Premium Header */}
          <Paper sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,215,0,0.2)'
            }} />
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PremiumIcon sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
                  <Typography variant="h3" fontWeight={800}>
                    NEET Preparation Hub
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Advanced tools and analytics designed for medical entrance success
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip icon={<TrendingIcon />} label="Performance Tracking" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip icon={<StarIcon />} label="AI-Powered Insights" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  <Chip icon={<LeaderboardIcon />} label="National Rankings" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                </Box>
              </Grid>
                             <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                 <Typography variant="h4" fontWeight={700} color="#FFD700">
                   NEET Hub
                 </Typography>
                 <Typography variant="body2" sx={{ opacity: 0.8 }}>
                   Your preparation center
                 </Typography>
               </Grid>
            </Grid>
          </Paper>

          {/* Feature Cards */}
          <Grid container spacing={3}>
            {neetFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)',
                      }
                    }}
                  >
                                         <Box 
                       sx={{ 
                         p: 3, 
                         display: 'flex', 
                         justifyContent: 'center', 
                         alignItems: 'center',
                         backgroundColor: feature.color,
                         minHeight: 140,
                         position: 'relative'
                       }}
                     >
                       {feature.icon}
                     </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography gutterBottom variant="h5" component="h2" fontWeight={700} color="#333">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                    
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button 
                        size="large" 
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(feature.path)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          fontWeight: 700,
                          borderRadius: 3,
                          py: 1.5,
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                          }
                        }}
                      >
                        Access {feature.title}
                      </Button>
                    </Box>
                  </Card>
              </Grid>
            ))}
          </Grid>

          
        </Box>
    </Container>
  );
};

export default NEETDashboard; 