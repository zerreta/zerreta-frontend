import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Container,
  Divider,
  useTheme,
  CircularProgress,
  Grid,
  alpha,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Stack,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  BookOutlined as BookIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import axiosInstance from '../components/axios-config';

// Style the profile avatar
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid white',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  fontSize: '3rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}));

// Style the profile container
const ProfileContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
  position: 'relative',
  marginBottom: theme.spacing(3)
}));

// Style the info card
const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
  }
}));

// Style the achievement badge
const AchievementBadge = styled(Box)(({ theme, color = '#667eea' }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: alpha(color, 0.1),
  color: color,
  margin: theme.spacing(0.5)
}));

// Style the progress section
const ProgressSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  marginBottom: theme.spacing(2)
}));

const StudentProfile = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    studentId: '',
    institution: '',
    email: '',
    phone: '',
    joinedDate: '',
    subjects: {
      physics: { level: 1, progress: 0 },
      chemistry: { level: 1, progress: 0 },
      biology: { level: 1, progress: 0 }
    }
  });
  
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get('/student/profile');
        
        if (response.data) {
          setProfileData({
            name: response.data.name || 'Student',
            studentId: response.data.studentId || response.data._id || 'N/A',
            institution: response.data.institution || 'NEET Academy',
            email: response.data.email || 'student@neetacademy.com',
            phone: response.data.phone || '+91 XXXXXXXXXX',
            joinedDate: response.data.createdAt ? new Date(response.data.createdAt).toLocaleDateString() : 'Recently',
            subjects: {
              physics: { 
                level: parseInt(response.data.subjects?.physics?.level) || 1, 
                progress: Math.random() * 100 // Mock progress data
              },
              chemistry: { 
                level: parseInt(response.data.subjects?.chemistry?.level) || 1, 
                progress: Math.random() * 100 // Mock progress data
              },
              biology: { 
                level: parseInt(response.data.subjects?.biology?.level) || 1, 
                progress: Math.random() * 100 // Mock progress data
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching student profile:', error);
        // Set fallback data with mock values
        setProfileData({
          name: 'Student',
          studentId: 'N/A',
          institution: 'NEET Academy',
          email: 'student@neetacademy.com',
          phone: '+91 XXXXXXXXXX',
          joinedDate: 'Recently',
          subjects: {
            physics: { level: 1, progress: 45 },
            chemistry: { level: 1, progress: 60 },
            biology: { level: 1, progress: 30 }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  const achievements = [
    { icon: <TrophyIcon />, color: '#FFD700', title: 'First Test' },
    { icon: <StarIcon />, color: '#FF6B6B', title: 'Top Scorer' },
    { icon: <BookIcon />, color: '#4ECDC4', title: 'Study Streak' },
    { icon: <QuizIcon />, color: '#45B7D1', title: 'Quiz Master' }
  ];

  return (
    <Box sx={{ 
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, sm: 2, md: 3 },
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="md" sx={{ mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Profile Header */}
          <ProfileContainer elevation={0}>
            {/* Background decorations */}
            <Box sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 250,
              height: 250,
              borderRadius: '50%',
              backgroundColor: alpha('#fff', 0.1),
              zIndex: 0
            }} />
            
            <Box sx={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: alpha('#fff', 0.08),
              zIndex: 0
            }} />

            {/* Profile content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                mb: 4
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#4CAF50' }}>
                      <StarIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  }
                >
                  <ProfileAvatar alt={profileData.name}>
                    {profileData.name.charAt(0)}
                  </ProfileAvatar>
                </Badge>
                
                <Box sx={{ 
                  ml: { xs: 0, sm: 3 },
                  mt: { xs: 2, sm: 0 },
                  flex: 1
                }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {profileData.name}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.9, 
                      mb: 2,
                      fontWeight: 400
                    }}
                  >
                    NEET Aspirant • Level {Math.max(...Object.values(profileData.subjects).map(s => s.level))}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                    <Chip 
                      label="Active Student" 
                      sx={{ 
                        bgcolor: alpha('#fff', 0.2), 
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                    <Chip 
                      label={`Joined ${profileData.joinedDate}`} 
                      sx={{ 
                        bgcolor: alpha('#fff', 0.15), 
                        color: 'white'
                      }} 
                    />
                                     </Stack>
                 </Box>
               </Box>
            </Box>
          </ProfileContainer>

          {/* Profile Information Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <InfoCard>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                      Personal Information
                    </Typography>
                    
                    <Stack spacing={2.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Student ID</Typography>
                          <Typography variant="body1" fontWeight="600">{profileData.studentId}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Institution</Typography>
                          <Typography variant="body1" fontWeight="600">{profileData.institution}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Joined Date</Typography>
                          <Typography variant="body1" fontWeight="600">{profileData.joinedDate}</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </InfoCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <InfoCard>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                      Contact Information
                    </Typography>
                    
                    <Stack spacing={2.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Email Address</Typography>
                          <Typography variant="body1" fontWeight="600">{profileData.email}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ color: '#667eea', mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                          <Typography variant="body1" fontWeight="600">{profileData.phone}</Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </InfoCard>
              </motion.div>
            </Grid>
          </Grid>

          {/* Subject Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <InfoCard sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TimelineIcon sx={{ color: '#667eea', mr: 2 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                    Subject Progress
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {Object.entries(profileData.subjects).map(([subject, data]) => (
                    <Grid item xs={12} sm={4} key={subject}>
                      <ProgressSection>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                            {subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Level {data.level}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={data.progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha('#667eea', 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#667eea'
                            }
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {Math.round(data.progress)}% Complete
                        </Typography>
                      </ProgressSection>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </InfoCard>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <InfoCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                  Recent Achievements
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AchievementBadge color={achievement.color}>
                        {achievement.icon}
                      </AchievementBadge>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'center', 
                          mt: 1,
                          color: 'text.secondary'
                        }}
                      >
                        {achievement.title}
                      </Typography>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </InfoCard>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentProfile; 