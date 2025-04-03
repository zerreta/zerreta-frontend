import axios from 'axios';
import { format } from 'date-fns';

// Emotion categories
export const EMOTIONS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  SURPRISED: 'surprised',
  CONFUSED: 'confused',
  NEUTRAL: 'neutral',
  FOCUSED: 'focused'
};

// Map emotion to productivity level (for analytics)
export const PRODUCTIVITY_SCORE = {
  [EMOTIONS.HAPPY]: 0.9,
  [EMOTIONS.FOCUSED]: 1.0,
  [EMOTIONS.NEUTRAL]: 0.7,
  [EMOTIONS.SURPRISED]: 0.6,
  [EMOTIONS.CONFUSED]: 0.3,
  [EMOTIONS.SAD]: 0.2,
  [EMOTIONS.ANGRY]: 0.1
};

// Parse emotions from history data
export const parseEmotionsFromHistory = (history = []) => {
  // Default history if none provided
  if (!history || !Array.isArray(history) || history.length === 0) {
    return generateMockEmotionData();
  }
  
  return history.map(entry => ({
    time: format(new Date(entry.timestamp), 'h:mm a'),
    emotion: entry.emotion,
    duration: entry.duration || 5,
    subject: entry.subject || 'Unknown',
    topic: entry.topic || 'General'
  }));
};

// Format emotion data for storage
export const formatEmotionForStorage = (emotionData, studyContext) => {
  const { subject, topic, subtopic } = studyContext || {};
  
  return {
    emotion: emotionData.emotion,
    timestamp: emotionData.timestamp.toISOString(),
    timeString: emotionData.timeString,
    subject: subject || 'Unknown',
    topic: topic || 'General',
    subtopic: subtopic || null,
    productivityScore: PRODUCTIVITY_SCORE[emotionData.emotion] || 0.5
  };
};

// Store emotion data in the backend
export const storeEmotionData = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store locally if no authentication
      const existingData = JSON.parse(localStorage.getItem('emotionData') || '[]');
      existingData.push(data);
      localStorage.setItem('emotionData', JSON.stringify(existingData));
      return true;
    }
    
    // Send to backend
    const response = await axios.post('http://localhost:5000/student/emotion-data', data, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Failed to store emotion data:', error);
    
    // Fallback to local storage
    const existingData = JSON.parse(localStorage.getItem('emotionData') || '[]');
    existingData.push(data);
    localStorage.setItem('emotionData', JSON.stringify(existingData));
    
    return false;
  }
};

// Retrieve emotion data (from backend or local storage)
export const getEmotionData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // Retrieve from local storage if no authentication
      const localData = JSON.parse(localStorage.getItem('emotionData') || '[]');
      return parseEmotionsFromHistory(localData);
    }
    
    // Get from backend
    const response = await axios.get('http://localhost:5000/student/emotion-data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.status === 200 && response.data) {
      return parseEmotionsFromHistory(response.data);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to retrieve emotion data:', error);
    
    // Fallback to local storage
    const localData = JSON.parse(localStorage.getItem('emotionData') || '[]');
    return parseEmotionsFromHistory(localData);
  }
};

// Calculate productivity by time of day
export const calculateProductivityByTimeOfDay = (emotionData = []) => {
  const timeBlocks = {};
  
  emotionData.forEach(item => {
    const hour = parseInt(item.time.split(':')[0]);
    const suffix = item.time.includes('PM') ? 'PM' : 'AM';
    const hourSuffix = suffix === 'PM' && hour !== 12 ? hour + 12 : hour;
    const timeBlock = `${hourSuffix}:00`;
    
    if (!timeBlocks[timeBlock]) {
      timeBlocks[timeBlock] = {
        time: timeBlock,
        productivityScore: 0,
        emotionCounts: {},
        totalEntries: 0
      };
    }
    
    // Add productivity score for this emotion
    const score = PRODUCTIVITY_SCORE[item.emotion] || 0.5;
    timeBlocks[timeBlock].productivityScore += score;
    timeBlocks[timeBlock].totalEntries += 1;
    
    // Count emotions
    if (!timeBlocks[timeBlock].emotionCounts[item.emotion]) {
      timeBlocks[timeBlock].emotionCounts[item.emotion] = 0;
    }
    timeBlocks[timeBlock].emotionCounts[item.emotion] += 1;
  });
  
  // Calculate average productivity and dominant emotion
  return Object.values(timeBlocks).map(block => {
    const avgProductivity = block.totalEntries > 0 
      ? block.productivityScore / block.totalEntries 
      : 0;
    
    // Find dominant emotion
    let dominantEmotion = EMOTIONS.NEUTRAL;
    let maxCount = 0;
    
    Object.entries(block.emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });
    
    return {
      time: block.time,
      productivity: avgProductivity,
      dominantEmotion
    };
  });
};

// Generate mock emotion data for testing/demo
export const generateMockEmotionData = () => {
  const subjects = ['Physics', 'Chemistry', 'Biology'];
  const topics = {
    'Physics': ['Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics'],
    'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    'Biology': ['Genetics', 'Cell Biology', 'Human Anatomy', 'Botany', 'Zoology']
  };
  
  // Generate data points throughout a day
  const data = [];
  const emotions = Object.values(EMOTIONS);
  
  // Morning session (9 AM - 12 PM)
  let hour = 9;
  for (let i = 0; i < 6; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const topicList = topics[subject];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    
    // Bias toward focused/happy in the morning
    let emotion;
    if (Math.random() < 0.7) {
      emotion = Math.random() < 0.5 ? EMOTIONS.FOCUSED : EMOTIONS.HAPPY;
    } else {
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
    }
    
    data.push({
      time: `${hour}:${i % 2 === 0 ? '00' : '30'} AM`,
      emotion,
      duration: 15 + Math.floor(Math.random() * 15),
      subject,
      topic
    });
    
    if (i % 2 === 1) hour++;
  }
  
  // Afternoon session (1 PM - 5 PM)
  hour = 1;
  for (let i = 0; i < 8; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const topicList = topics[subject];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    
    // Bias toward confused/neutral in the afternoon
    let emotion;
    if (Math.random() < 0.6) {
      emotion = Math.random() < 0.5 ? EMOTIONS.CONFUSED : EMOTIONS.NEUTRAL;
    } else {
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
    }
    
    data.push({
      time: `${hour}:${i % 2 === 0 ? '00' : '30'} PM`,
      emotion,
      duration: 15 + Math.floor(Math.random() * 15),
      subject,
      topic
    });
    
    if (i % 2 === 1) hour++;
  }
  
  // Evening session (7 PM - 9 PM)
  hour = 7;
  for (let i = 0; i < 4; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const topicList = topics[subject];
    const topic = topicList[Math.floor(Math.random() * topicList.length)];
    
    // Bias toward focused in the evening
    let emotion;
    if (Math.random() < 0.75) {
      emotion = EMOTIONS.FOCUSED;
    } else {
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
    }
    
    data.push({
      time: `${hour}:${i % 2 === 0 ? '00' : '30'} PM`,
      emotion,
      duration: 15 + Math.floor(Math.random() * 15),
      subject,
      topic
    });
    
    if (i % 2 === 1) hour++;
  }
  
  return data;
};

export default {
  EMOTIONS,
  PRODUCTIVITY_SCORE,
  parseEmotionsFromHistory,
  formatEmotionForStorage,
  storeEmotionData,
  getEmotionData,
  calculateProductivityByTimeOfDay,
  generateMockEmotionData
}; 