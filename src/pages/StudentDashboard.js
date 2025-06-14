import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  useTheme
} from '@mui/material';
import { Science as PhysicsIcon, Biotech as BiotechIcon, LocalFlorist as BiologyIcon, Star, Timeline, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { physicsTopics, chemistryTopics, biologyTopics } from '../components/SyllabusData';

const StatCard = ({ icon, value, label, color, gradient }) => (
  <Card sx={{ borderRadius: 3, background: gradient, color: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {icon}
        <Typography variant="h3" fontWeight="bold">{value}</Typography>
      </Box>
      <Typography variant="body2" sx={{ opacity: 0.85 }}>{label}</Typography>
    </CardContent>
  </Card>
);

const SubjectSyllabus = ({ icon, color, title, topics }) => (
  <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
    <CardHeader
      avatar={icon}
      title={<Typography variant="h5" fontWeight="bold" color={color}>{title}</Typography>}
      sx={{ pb: 0 }}
    />
    <Divider />
    <CardContent>
      <List>
        {topics.map((chapter) => (
          <ListItem key={chapter.number} alignItems="flex-start" sx={{ mb: 1 }}>
            <ListItemText
              primary={<Typography variant="subtitle1" fontWeight="bold" color={color}>{chapter.number}. {chapter.title}</Typography>}
              secondary={
                <>
                  {chapter.topics && (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {chapter.topics.map((topic, idx) => (
                        <li key={idx} style={{ fontSize: '0.97rem', color: '#555' }}>{topic}</li>
                      ))}
                    </ul>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const StudentDashboard = () => {
  const theme = useTheme();
  const [nPoints, setNPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Simulate fetching student data and points
    setTimeout(() => {
      setStudentData({ name: 'Student' });
      setNPoints(225);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 3 }, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Welcome back, {studentData?.name || 'Student'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your NEET preparation journey
          </Typography>
        </Box>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard icon={<Timeline sx={{ fontSize: 40, opacity: 0.8 }} />} value="78%" label="Overall Progress" gradient="linear-gradient(145deg, #667eea 0%, #764ba2 100%)" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard icon={<Star sx={{ fontSize: 40, opacity: 0.8 }} />} value="92%" label="Average Score" gradient="linear-gradient(145deg, #4CAF50 0%, #388E3C 100%)" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard icon={<TrophyIcon sx={{ fontSize: 40, opacity: 0.8 }} />} value={nPoints} label="N.POINTS" gradient="linear-gradient(145deg, #FF9800 0%, #F57C00 100%)" />
          </Grid>
        </Grid>

        {/* Syllabus Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, mt: 6, textAlign: 'center' }}>
          Complete NEET Syllabus
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <SubjectSyllabus
              icon={<PhysicsIcon sx={{ color: '#667eea', fontSize: 36 }} />}
              color="primary.main"
              title="Physics"
              topics={physicsTopics}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SubjectSyllabus
              icon={<BiotechIcon sx={{ color: '#4CAF50', fontSize: 36 }} />}
              color="success.main"
              title="Chemistry"
              topics={chemistryTopics}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SubjectSyllabus
              icon={<BiologyIcon sx={{ color: '#FF9800', fontSize: 36 }} />}
              color="warning.main"
              title="Biology"
              topics={biologyTopics}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard; 