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
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axiosInstance from '../components/axios-config';

// Style the profile avatar
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: '3px solid white',
  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #3253b7 0%, #190a5c 100%)'
}));

// Style the profile container
const ProfileContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  backgroundImage: 'linear-gradient(160deg, #1a237e 0%, #303f9f 100%)',
  color: 'white',
  padding: theme.spacing(3),
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  position: 'relative'
}));

// Style the info box
const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  backdropFilter: 'blur(8px)',
  borderRadius: 8,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
  }
}));

// Style the info labels
const InfoLabel = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.7),
  fontWeight: 500,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: theme.spacing(0.5)
}));

// Style the info values
const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: '1.1rem'
}));

const StudentProfile = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    studentId: '',
    institution: ''
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
            institution: response.data.institution || 'NEET Academy'
          });
        }
      } catch (error) {
        console.error('Error fetching student profile:', error);
        // Set fallback data
        setProfileData({
          name: 'Student',
          studentId: 'N/A',
          institution: 'NEET Academy'
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
        background: 'linear-gradient(160deg, #1a237e 0%, #303f9f 100%)'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: { xs: 2, md: 4 }, 
      px: { xs: 1, sm: 2, md: 3 },
      background: theme.palette.grey[100],
      minHeight: '100vh'
    }}>
      <Container maxWidth="sm" sx={{ mx: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileContainer elevation={3}>
            {/* Background decoration */}
            <Box sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: alpha('#fff', 0.05),
              zIndex: 0
            }} />
            
            <Box sx={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: alpha('#fff', 0.05),
              zIndex: 0
            }} />

            {/* Profile information */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                textAlign: { xs: 'center', sm: 'left' },
                mb: 3
              }}>
                <ProfileAvatar alt={profileData.name}>
                  {profileData.name.charAt(0)}
                </ProfileAvatar>
                
                <Box sx={{ 
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 2, sm: 0 }
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {profileData.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.7, 
                      mt: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      display: 'inline-block',
                      bgcolor: alpha('#fff', 0.1)
                    }}
                  >
                    NEET Aspirant
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ 
                mb: 3, 
                borderColor: alpha('#fff', 0.1),
                opacity: 0.6
              }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <InfoLabel>Student ID</InfoLabel>
                    <InfoValue>{profileData.studentId}</InfoValue>
                  </InfoBox>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <InfoLabel>Institution</InfoLabel>
                    <InfoValue>{profileData.institution}</InfoValue>
                  </InfoBox>
                </Grid>
              </Grid>
            </Box>
          </ProfileContainer>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StudentProfile; 