import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Park as EcoIcon,
  Abc as AbcIcon,
  Create as CreateIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  DirectionsRun as RunIcon,
  Link as LinkIcon,
  Numbers as NumbersIcon,
  Handshake as HandHeartIcon,
  Palette as PaletteIcon,
  Schedule as ScheduleIcon,
  AutoGraph as AutoGraphIcon,
  Loop as LoopIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const BeginnerGrammar = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/grammar');
  };

  const beginnerTopics = [
    {
      id: 0,
      title: 'Alphabets & Phonics',
      description: 'Learn the 26 letters and their sounds to build a strong foundation.',
      difficulty: 'Very Easy',
      estimatedTime: '15 min',
      icon: <AbcIcon />
    },
    {
      id: 1,
      title: 'Words & Vocabulary',
      description: 'Build your basic vocabulary with common everyday words.',
      difficulty: 'Easy',
      estimatedTime: '20 min',
      icon: <CreateIcon />
    },
    {
      id: 2,
      title: 'Nouns',
      description: 'Understanding people, places, things, and ideas in sentences.',
      difficulty: 'Easy',
      estimatedTime: '25 min',
      icon: <HomeIcon />
    },
    {
      id: 3,
      title: 'Pronouns (I, you, he, she, it, we, they)',
      description: 'Master the words that replace nouns in sentences.',
      difficulty: 'Easy',
      estimatedTime: '30 min',
      icon: <PersonIcon />
    },
    {
      id: 4,
      title: 'Articles (a, an, the)',
      description: 'Learn when and how to use the most common English words.',
      difficulty: 'Medium',
      estimatedTime: '25 min',
      icon: <ArticleIcon />
    },
    {
      id: 5,
      title: 'Verbs – Basic Action Words',
      description: 'Discover action words that make sentences come alive.',
      difficulty: 'Medium',
      estimatedTime: '35 min',
      icon: <RunIcon />
    },
    {
      id: 6,
      title: 'Subject + Verb + Object (S + V + O) Structure',
      description: 'Build perfect sentences with the fundamental English pattern.',
      difficulty: 'Medium',
      estimatedTime: '40 min',
      icon: <LinkIcon />
    },
    {
      id: 7,
      title: 'Singular and Plural Nouns',
      description: 'Learn the difference between one thing and many things.',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      icon: <NumbersIcon />
    },
    {
      id: 8,
      title: 'Helping Verbs (is, am, are, was, were)',
      description: 'Master the verbs that help other verbs express meaning.',
      difficulty: 'Medium',
      estimatedTime: '35 min',
      icon: <HandHeartIcon />
    },
    {
      id: 9,
      title: 'Adjectives (big, small, happy)',
      description: 'Add color and detail to your sentences with descriptive words.',
      difficulty: 'Medium',
      estimatedTime: '30 min',
      icon: <PaletteIcon />
    },
    {
      id: 10,
      title: 'Simple Present Tense',
      description: 'Express current actions and habits with confidence.',
      difficulty: 'Hard',
      estimatedTime: '45 min',
      icon: <ScheduleIcon />
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Very Easy': return '#4CAF50';
      case 'Easy': return '#8BC34A';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#757575';
    }
  };



  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 2 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  flexGrow: 1 
                }}>
                  <EcoIcon sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    color: 'white'
                  }} />
                  <Typography variant="h3" fontWeight={700} sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}>
                    Beginner Grammar
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    alignSelf: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  Back to Grammar Levels
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                Master the fundamentals of English grammar with these essential building blocks.
                Start from the basics and build your confidence step by step.
              </Typography>
              
              {/* Info Stats */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SchoolIcon />
                  <Typography variant="body1" fontWeight={600}>
                    11 Topics
                  </Typography>
                </Box>
                <Box sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <MenuBookIcon />
                  <Typography variant="body1" fontWeight={600}>
                    Foundation Level
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <EcoIcon sx={{ 
                fontSize: '120px',
                opacity: 0.3,
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
              }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} color="#1e293b" gutterBottom sx={{ mb: 1 }}>
          Grammar Topics (0-10)
        </Typography>
        <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
          Complete each topic to build your English grammar foundation
        </Typography>

        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {beginnerTopics.map((topic) => (
            <Grid item xs={12} sm={6} lg={6} key={topic.id}>
                             <Card
                 sx={{
                   height: '100%',
                   borderRadius: 3,
                   border: '2px solid #e5e7eb',
                   backgroundColor: 'white',
                   transition: 'all 0.3s ease',
                   position: 'relative',
                   overflow: 'hidden',
                   '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                     border: '2px solid #667eea',
                   }
                 }}
               >
                 {/* Top indicator */}
                 <Box
                   sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     right: 0,
                     height: 4,
                     background: 'linear-gradient(90deg, #667eea, #764ba2)'
                   }}
                 />

                <CardContent sx={{ p: 4, pb: 2 }}>
                  {/* Header */}
                                     <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                     <Avatar
                       sx={{
                         backgroundColor: '#667eea',
                         width: 56,
                         height: 56,
                         mr: 2,
                         fontSize: '24px'
                       }}
                     >
                       {topic.icon}
                     </Avatar>
                     <Box sx={{ flex: 1 }}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                         <Typography variant="h6" fontWeight={600} color="#1e293b">
                           Topic {topic.id}
                         </Typography>
                       </Box>
                      <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                        {topic.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={topic.difficulty}
                          size="small"
                          sx={{
                            backgroundColor: getDifficultyColor(topic.difficulty),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={topic.estimatedTime}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#d1d5db', color: '#6b7280' }}
                        />
                      </Box>
                    </Box>
                  </Box>

                                     {/* Description */}
                   <Typography variant="body2" color="#475569" sx={{ mb: 2, lineHeight: 1.6 }}>
                     {topic.description}
                   </Typography>
                 </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Study Tips Section */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'white', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AutoGraphIcon sx={{ color: '#1e293b', fontSize: '2rem' }} />
            <Typography variant="h5" fontWeight={600} color="#1e293b">
              Study Tips for Beginner Grammar
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#3b82f6', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <MenuBookIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Start Simple
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Begin with the basics and don't rush. Master each topic before moving forward.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <LoopIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Practice Daily
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consistent daily practice is more effective than long study sessions.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b', width: 48, height: 48, mx: 'auto', mb: 2 }}>
                  <EditIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Use Examples
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your own sentences using the grammar rules you've learned.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BeginnerGrammar; 