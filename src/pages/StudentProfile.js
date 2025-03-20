import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Chip,
  Badge,
  useTheme,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Edit as EditIcon, 
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: '4px solid white',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  margin: '-75px auto 0',
  position: 'relative',
  zIndex: 5
}));

const ProfileCover = styled(Box)(({ theme }) => ({
  height: 200,
  width: '100%',
  background: 'linear-gradient(135deg, #7445f8, #a17ffd)',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  borderRadius: '16px 16px 0 0',
  overflow: 'hidden'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
  }
}));

const UploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 5,
  right: 5,
  borderRadius: '50%',
  padding: 8,
  background: 'white',
  color: '#7445f8',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  }
}));

const StudentProfile = () => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    bio: ''
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.user) {
          setProfileData({
            name: response.data.user.name || 'User',
            email: response.data.user.email || 'email@example.com',
            phone: response.data.user.phone || 'Not provided',
            location: response.data.user.location || 'Not provided',
            joinDate: response.data.user.createdAt ? new Date(response.data.user.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            }) : 'Not available',
            bio: response.data.user.bio || 'No bio available'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set fallback data
        setProfileData({
          name: 'User',
          email: 'email@example.com',
          phone: 'Not provided',
          location: 'Not provided',
          joinDate: 'Not available',
          bio: 'No bio available'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put('/api/user/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 10 }}>
        <CircularProgress sx={{ color: '#7445f8' }} />
      </Box>
    );
  }

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
          <ProfileCover>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.3,
                backgroundImage: 'url(https://images.unsplash.com/photo-1532777946373-b6783242f211)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </ProfileCover>
          
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <ProfileAvatar 
                src="/student-avatar.jpg" 
                alt={profileData.name}
              >
                {profileData.name ? profileData.name.charAt(0) : 'U'}
              </ProfileAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <UploadButton size="small">
                    <UploadIcon fontSize="small" />
                  </UploadButton>
                }
              >
                <span />
              </Badge>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {profileData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Student
            </Typography>
            <Chip 
              label="NEET Aspirant" 
              sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)', color: '#7445f8', fontWeight: 500 }}
            />
          </Box>
        </Paper>
          
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <StyledCard>
              <CardHeader 
                title="Personal Information" 
                action={
                  <IconButton 
                    onClick={() => setEditMode(!editMode)}
                    color={editMode ? "error" : "default"}
                  >
                    {editMode ? <CloseIcon /> : <EditIcon />}
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                {editMode ? (
                  <Box component="form">
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="primary"
                        onClick={handleSaveProfile}
                        sx={{ color: '#7445f8' }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <List disablePadding>
                    <ListItem
                      disableGutters
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)' }}>
                          <EmailIcon sx={{ color: '#7445f8' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Email" 
                        secondary={profileData.email}
                      />
                    </ListItem>
                    <ListItem
                      disableGutters
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)' }}>
                          <PhoneIcon sx={{ color: '#7445f8' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Phone" 
                        secondary={profileData.phone}
                      />
                    </ListItem>
                    <ListItem
                      disableGutters
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)' }}>
                          <LocationIcon sx={{ color: '#7445f8' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Location" 
                        secondary={profileData.location}
                      />
                    </ListItem>
                    <ListItem
                      disableGutters
                      sx={{ py: 1.5 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'rgba(116, 69, 248, 0.1)' }}>
                          <CalendarIcon sx={{ color: '#7445f8' }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Joined" 
                        secondary={profileData.joinDate}
                      />
                    </ListItem>
                  </List>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <StyledCard>
              <CardHeader title="About Me" />
              <Divider />
              <CardContent>
                {editMode ? (
                  <TextField
                    fullWidth
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body1">
                    {profileData.bio}
                  </Typography>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default StudentProfile; 