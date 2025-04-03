import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Grid,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import FaceIcon from '@mui/icons-material/Face';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Sample data - in a real app, this would come from props
const sampleEmotionData = [
  { time: '9:00 AM', emotion: 'focused', duration: 25, subject: 'Physics', topic: 'Mechanics' },
  { time: '9:30 AM', emotion: 'confused', duration: 10, subject: 'Physics', topic: 'Thermodynamics' },
  { time: '10:00 AM', emotion: 'happy', duration: 15, subject: 'Chemistry', topic: 'Organic Chemistry' },
  { time: '10:30 AM', emotion: 'neutral', duration: 20, subject: 'Chemistry', topic: 'Inorganic Chemistry' },
  { time: '1:00 PM', emotion: 'focused', duration: 30, subject: 'Biology', topic: 'Genetics' },
  { time: '1:45 PM', emotion: 'confused', duration: 15, subject: 'Physics', topic: 'Electromagnetism' },
  { time: '2:30 PM', emotion: 'happy', duration: 25, subject: 'Biology', topic: 'Human Anatomy' }
];

// Emotion to icon mapping
const getEmotionIcon = (emotion) => {
  switch(emotion) {
    case 'happy':
      return <SentimentSatisfiedAltIcon color="success" />;
    case 'sad':
    case 'confused':
      return <SentimentDissatisfiedIcon color="warning" />;
    case 'angry':
      return <SentimentVeryDissatisfiedIcon color="error" />;
    case 'focused':
      return <PsychologyIcon color="primary" />;
    default:
      return <SentimentNeutralIcon color="action" />;
  }
};

// Emotion to color mapping
const getEmotionColor = (emotion, theme) => {
  switch(emotion) {
    case 'happy':
      return theme.palette.success.main;
    case 'focused':
      return theme.palette.primary.main;
    case 'sad':
    case 'confused':
      return theme.palette.warning.main;
    case 'angry':
      return theme.palette.error.main;
    case 'surprised':
      return theme.palette.info.main;
    default:
      return theme.palette.text.secondary;
  }
};

// Get emotion distribution for charts
const getEmotionDistribution = (data) => {
  const distribution = {};
  
  data.forEach(item => {
    if (!distribution[item.emotion]) {
      distribution[item.emotion] = 0;
    }
    distribution[item.emotion] += item.duration;
  });
  
  return Object.keys(distribution).map(emotion => ({
    emotion,
    minutes: distribution[emotion]
  }));
};

// Get emotion timeline for the area chart
const getEmotionTimeline = (data) => {
  // Map emotions to numeric values for the area chart
  const emotionValues = {
    'happy': 10,
    'focused': 8,
    'neutral': 5,
    'surprised': 6,
    'confused': 3,
    'sad': 2,
    'angry': 1
  };
  
  return data.map(item => ({
    time: item.time,
    value: emotionValues[item.emotion] || 5,
    emotion: item.emotion,
    subject: item.subject
  }));
};

function EmotionSummary({ emotionData = sampleEmotionData }) {
  const theme = useTheme();
  
  // Prepare data for charts
  const distributionData = getEmotionDistribution(emotionData);
  const timelineData = getEmotionTimeline(emotionData);
  
  // Calculate optimal study times based on emotions
  const calculateOptimalTimes = (data) => {
    const productiveEmotions = ['focused', 'happy'];
    const timeBlocks = {};
    
    // Group by hour
    data.forEach(item => {
      const hour = item.time.split(':')[0];
      const suffix = item.time.includes('PM') ? 'PM' : 'AM';
      const timeBlock = `${hour}${suffix}`;
      
      if (!timeBlocks[timeBlock]) {
        timeBlocks[timeBlock] = { productive: 0, total: 0, emotions: {} };
      }
      
      timeBlocks[timeBlock].total += item.duration;
      
      if (productiveEmotions.includes(item.emotion)) {
        timeBlocks[timeBlock].productive += item.duration;
      }
      
      if (!timeBlocks[timeBlock].emotions[item.emotion]) {
        timeBlocks[timeBlock].emotions[item.emotion] = 0;
      }
      timeBlocks[timeBlock].emotions[item.emotion] += item.duration;
    });
    
    // Calculate productivity ratio and sort
    const sortedBlocks = Object.keys(timeBlocks).map(time => ({
      time,
      productivity: timeBlocks[time].productive / timeBlocks[time].total,
      duration: timeBlocks[time].total,
      dominantEmotion: Object.keys(timeBlocks[time].emotions).reduce((a, b) => 
        timeBlocks[time].emotions[a] > timeBlocks[time].emotions[b] ? a : b
      )
    })).sort((a, b) => b.productivity - a.productivity);
    
    return sortedBlocks;
  };
  
  const optimalTimes = calculateOptimalTimes(emotionData);
  
  return (
    <Box>
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
              <FaceIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Emotion Tracking Analysis
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Analysis of your emotional states during study sessions helps identify optimal learning conditions and times when you're most receptive to new information.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Emotion Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Emotion Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distributionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="emotion" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar 
                    dataKey="minutes" 
                    name="Duration (minutes)"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            
            {/* Emotion Timeline Chart */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Emotion Timeline
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis hide domain={[0, 10]} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <Tooltip 
                    formatter={(value, name, props) => [props.payload.emotion, props.payload.subject]}
                    labelFormatter={(value) => `Time: ${value}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={theme.palette.primary.main} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Optimal Study Times */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.success.light, mr: 2 }}>
              <AccessTimeIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Optimal Study Times
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Based on your emotional patterns, these time blocks show when you're most productive and focused.
          </Typography>
          
          <Grid container spacing={2}>
            {optimalTimes.slice(0, 3).map((timeBlock, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card 
                  elevation={1} 
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: index === 0 ? 'rgba(116, 69, 248, 0.1)' : 'background.paper',
                    border: index === 0 ? '1px solid rgba(116, 69, 248, 0.3)' : 'none'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {timeBlock.time}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getEmotionIcon(timeBlock.dominantEmotion)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Primarily {timeBlock.dominantEmotion}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(timeBlock.productivity * 100)}% productive
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Emotion Timeline */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.info.light, mr: 2 }}>
              <ShowChartIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Detailed Emotion Timeline
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Your emotional journey throughout study sessions, mapped to subjects and topics.
          </Typography>
          
          <Box sx={{ position: 'relative', pl: 4 }}>
            <Box sx={{ 
              position: 'absolute', 
              left: 16, 
              top: 0, 
              bottom: 0, 
              width: 2, 
              bgcolor: 'rgba(0,0,0,0.06)',
              zIndex: 0
            }} />
            
            {emotionData.map((item, index) => (
              <Box 
                key={index} 
                sx={{ 
                  position: 'relative', 
                  mb: 3,
                  pb: 3,
                  borderBottom: index < emotionData.length - 1 ? '1px dashed rgba(0,0,0,0.1)' : 'none' 
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: -16, 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: 'background.paper',
                    border: `2px solid ${getEmotionColor(item.emotion, theme)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}
                >
                  {getEmotionIcon(item.emotion)}
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.time}
                    </Typography>
                    <Chip 
                      label={item.emotion} 
                      size="small"
                      sx={{ 
                        bgcolor: `${getEmotionColor(item.emotion, theme)}20`,
                        color: getEmotionColor(item.emotion, theme),
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
                    Studying <strong>{item.subject}</strong> - {item.topic}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    Duration: {item.duration} minutes
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmotionSummary; 