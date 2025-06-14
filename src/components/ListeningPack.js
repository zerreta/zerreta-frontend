import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Toolbar,
  AppBar,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  VolumeUp as VolumeUpIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Video data for all packs and levels
const videoData = {
  a1: {
    1: { videoId: 'nuXyJazvm4U', url: 'https://youtu.be/nuXyJazvm4U?si=Yodo-SfklmHvqVkA' },
    2: { videoId: 'zLInXXh3Tbw', url: 'https://youtu.be/zLInXXh3Tbw?si=jnOM_UvZI4hE8dNE' },
    3: { videoId: 'rDc6mGC1f_w', url: 'https://youtu.be/rDc6mGC1f_w?si=ACcTUCJi4ktn9JX0' },
    4: { videoId: 'YZKCS60loaQ', url: 'https://youtu.be/YZKCS60loaQ?si=SDCVim1WDd86F_RO' },
    5: { videoId: '4Q_SycFWuTs', url: 'https://youtu.be/4Q_SycFWuTs?si=Y7G1W7ojtUk9n2rr' },
    6: { videoId: '1mKeXz5Bf7c', url: 'https://youtu.be/1mKeXz5Bf7c?si=ptUM8JqnjcgTuOM1' },
    7: { videoId: 'UANUTB1GsVU', url: 'https://youtu.be/UANUTB1GsVU?si=ykY5hz6xLa5c9TQj' },
    8: { videoId: 'pSRbZkQH04A', url: 'https://youtu.be/pSRbZkQH04A?si=j1d-1yFYdYo4AlyV' },
    9: { videoId: 'o4fIGY9cWVc', url: 'https://youtu.be/o4fIGY9cWVc?si=Et_QKQYcOKxIsImT' },
    10: { videoId: 'mvXtayfK6GI', url: 'https://youtu.be/mvXtayfK6GI?si=oAenCks3vy1Y3u9I' }
  },
  b1: {
    1: { videoId: '3uD2ma0ORL4', url: 'https://youtu.be/3uD2ma0ORL4?si=R-CsteEuGCS7YPfn' },
    2: { videoId: 'aUbUltNQ7Ng', url: 'https://youtu.be/aUbUltNQ7Ng?si=Z5XVPGk7Ad2gXMrJ' },
    3: { videoId: '9U-IhdRWUSA', url: 'https://youtu.be/9U-IhdRWUSA?si=ah10tjrweMis7Rl1' },
    4: { videoId: 'JsQwmXD6fXU', url: 'https://youtu.be/JsQwmXD6fXU?si=DGajiNtKlRy911tt' },
    5: { videoId: 'JtDMV_j6hVg', url: 'https://youtu.be/JtDMV_j6hVg?si=PrZWy1gbb66l_ZZN' },
    6: { videoId: 'Z_WzSQM2-mk', url: 'https://youtu.be/Z_WzSQM2-mk?si=c1CdbprO1ZpEF83e' },
    7: { videoId: 'VM_utRANKTI', url: 'https://youtu.be/VM_utRANKTI?si=Gb24WoSkLM6UlQF2' },
    8: { videoId: 'kfGrr3mZQaE', url: 'https://youtu.be/kfGrr3mZQaE?si=WCXmO_W4y48DUuYO' },
    9: { videoId: 'eJg60qr-QK8', url: 'https://youtu.be/eJg60qr-QK8?si=iX19Zg4zvuZF-83V' },
    10: { videoId: 'nuSB39nDfeQ', url: 'https://youtu.be/nuSB39nDfeQ?si=3F5BL4mQEJoaZHXY' }
  },
  c1: {
    // C1 videos can be added here when available
  }
};

const ListeningPack = () => {
  const navigate = useNavigate();
  const { level, packId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showPracticeResults, setShowPracticeResults] = useState(false);
  const [practiceAttempts, setPracticeAttempts] = useState(3);

  const handleGoBack = () => {
    navigate(`/speaky/listening/${level}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get video data for current level and pack
  const getCurrentVideo = () => {
    const currentVideo = videoData[level]?.[parseInt(packId)];
    return currentVideo || { videoId: 'nuXyJazvm4U', url: 'https://youtu.be/nuXyJazvm4U' }; // fallback
  };

  // Get appropriate title for each pack
  const getPackTitle = () => {
    if (level === 'a1' && packId === '1') {
      return 'First Day at School';
    }
    if (level === 'a1' && packId === '2') {
      return 'Everyday Questions';
    }
    if (level === 'a1' && packId === '3') {
      return 'Talking About Food and Drinks';
    }
    if (level === 'a1' && packId === '4') {
      return 'Daily Routine';
    }
    if (level === 'a1' && packId === '5') {
      return 'Simple Present Questions';
    }
    if (level === 'a1' && packId === '6') {
      return 'Third Person Singular';
    }
    if (level === 'a1' && packId === '7') {
      return 'Describing Things with Adjectives';
    }
    // Add more specific titles for other packs as content is added
    return `Listening Practice ${packId}`;
  };

  const currentVideo = getCurrentVideo();

  // Get pack data based on level and packId
  const getPackData = () => {
    if (level === 'a1' && packId === '2') {
      return pack2A1Data;
    }
    if (level === 'a1' && packId === '3') {
      return pack3A1Data;
    }
    if (level === 'a1' && packId === '4') {
      return pack4A1Data;
    }
    if (level === 'a1' && packId === '5') {
      return pack5A1Data;
    }
    if (level === 'a1' && packId === '6') {
      return pack6A1Data;
    }
    if (level === 'a1' && packId === '7') {
      return pack7A1Data;
    }
    return pack1A1Data; // Default for other packs
  };

  // Pack 2 A1 Level Data - Everyday Questions
  const pack2A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'Are you hot?' },
            { speaker: 'Woman', text: 'Yes, I am very hot.' },
            { speaker: 'Man', text: 'Is the air-conditioning on?' },
            { speaker: 'Woman', text: 'No, it is off.' },
            { speaker: 'Man', text: 'Can I turn it on?' },
            { speaker: 'Woman', text: 'Yes, please do. And can you turn on the radio, too?' },
            { speaker: 'Man', text: 'Of course. Is jazz music alright?' },
            { speaker: 'Woman', text: 'Yes, I love jazz music.' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'Is your house big?' },
            { speaker: 'Woman', text: 'Yes, it is pretty big.' },
            { speaker: 'Man', text: 'Is it new?' },
            { speaker: 'Woman', text: 'No, it is very old.' },
            { speaker: 'Man', text: 'Is it nice?' },
            { speaker: 'Woman', text: 'Not really. It is cold in winter.' },
            { speaker: 'Man', text: 'Oh, no! That\'s not good.' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'I like your shoes. Are they new?' },
            { speaker: 'Woman', text: 'Yes, they are.' },
            { speaker: 'Man', text: 'Are they expensive?' },
            { speaker: 'Woman', text: 'No, they are very cheap.' },
            { speaker: 'Man', text: 'Are they comfortable?' },
            { speaker: 'Woman', text: 'Yes, they are very comfortable.' },
            { speaker: 'Man', text: 'Are they from the discount shoe shop?' },
            { speaker: 'Woman', text: 'Yes! How did you guess?' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'Are you hungry?' },
            { speaker: 'Woman', text: 'Yes, I am very hungry.' },
            { speaker: 'Man', text: 'Do you want pizza?' },
            { speaker: 'Woman', text: 'Yes, let\'s get some.' },
            { speaker: 'Man', text: 'Is the pizza shop still open?' },
            { speaker: 'Woman', text: 'Yes, it is open until 10.' },
            { speaker: 'Man', text: 'What time is it now?' },
            { speaker: 'Woman', text: 'Eight. It\'s open for two more hours.' },
            { speaker: 'Man', text: 'Great! I\'m starving.' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Be Verbs - Yes / No Questions - Present Simple',
      points: [
        {
          number: 1,
          title: 'Yes/No questions with I - 1st person singular.',
          examples: [
            { category: 'Questions', items: ['Am I late? (adjective)', 'Am I in your seat? (prepositional phrase)', 'Am I your best friend? (noun phrase)'] },
            { category: 'Answers', items: ['Yes, you are.', 'No, you are not.'] }
          ]
        },
        {
          number: 2,
          title: 'Yes/No questions with you - 2nd person singular.',
          examples: [
            { category: 'Questions', items: ['Are you hungry?', 'Are you at home?', 'Are you a teacher?'] },
            { category: 'Answers', items: ['Yes, I am.', 'No, I\'m not.'] }
          ]
        },
        {
          number: 3,
          title: 'Yes/No questions with she - 3rd person singular.',
          examples: [
            { category: 'Questions', items: ['Is Mary mad?', 'Is she on the phone?', 'Is she your friend?'] },
            { category: 'Answers', items: ['Yes, she is.', 'No, she isn\'t.'] }
          ]
        },
        {
          number: 4,
          title: 'Yes/No questions with he - 3rd person singular.',
          examples: [
            { category: 'Questions', items: ['Is Jason upset?', 'Is he in the room?', 'Is he a nice person?'] },
            { category: 'Answers', items: ['Yes, he is.', 'No, he isn\'t.'] }
          ]
        },
        {
          number: 5,
          title: 'Yes/No questions with it - 3rd person singular.',
          examples: [
            { category: 'Questions', items: ['Is the computer expensive?', 'Is it on sale?', 'Is it a good computer?'] },
            { category: 'Answers', items: ['Yes, it is.', 'No, it isn\'t.'] }
          ]
        },
        {
          number: 6,
          title: 'Yes/No questions with they - 3rd person plural.',
          examples: [
            { category: 'Questions', items: ['Are Bob and Mary married?', 'Are they in the office?', 'Are they a couple?'] },
            { category: 'Answers', items: ['Yes, they are.', 'No, they aren\'t.'] }
          ]
        },
        {
          number: 7,
          title: 'Yes/No questions with we - 1st person plural.',
          examples: [
            { category: 'Questions', items: ['Are we next?', 'Are we in trouble?', 'Are we a good team?'] },
            { category: 'Answers', items: ['Yes, we are.', 'No, we aren\'t.'] }
          ]
        },
        {
          number: 8,
          title: 'Yes/No questions with you - 2nd person plural.',
          examples: [
            { category: 'Questions', items: ['Are you (guys) hungry?', 'Are you (all) at home?', 'Are you (two) good friends?'] },
            { category: 'Answers', items: ['Yes, we are.', 'No, we are not.'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Is it hot in the car?',
          options: ['Yes, it is.', 'No, it is not.'],
          correct: 0
        },
        {
          id: 2,
          question: 'Is her house nice?',
          options: ['Yes, it is.', 'No, it is not.'],
          correct: 1
        },
        {
          id: 3,
          question: 'Are the shoes expensive?',
          options: ['Yes, they are.', 'No, they are not.'],
          correct: 1
        },
        {
          id: 4,
          question: 'Is the pizza shop closed?',
          options: ['Yes, it is.', 'No, it is not.'],
          correct: 1
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversation: [
        { 
          speaker: 'Man', 
          text: 'Are you _____?',
          blanks: [{ id: 1, options: ['hot', 'cold', 'tired'], correct: 'hot' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Yes, _____ very hot.',
          blanks: [{ id: 2, options: ['I am', 'you are', 'it is'], correct: 'I am' }]
        },
        { 
          speaker: 'Man', 
          text: '_____ the air-conditioning on?',
          blanks: [{ id: 3, options: ['Is', 'Are', 'Am'], correct: 'Is' }]
        },
        { 
          speaker: 'Woman', 
          text: 'No, it is _____.',
          blanks: [{ id: 4, options: ['off', 'on', 'broken'], correct: 'off' }]
        },
        { 
          speaker: 'Man', 
          text: '_____ I turn it on?',
          blanks: [{ id: 5, options: ['Can', 'Do', 'Am'], correct: 'Can' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Yes, please do. And can you turn _____ the radio, too?',
          blanks: [{ id: 6, options: ['on', 'off', 'up'], correct: 'on' }]
        },
        { 
          speaker: 'Man', 
          text: 'Of course. Is _____ music alright?',
          blanks: [{ id: 7, options: ['jazz', 'rock', 'pop'], correct: 'jazz' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Yes, I _____ jazz music.',
          blanks: [{ id: 8, options: ['love', 'hate', 'like'], correct: 'love' }]
        }
      ]
    }
  };

  // Pack 3 A1 Level Data - Food and Drinks
  const pack3A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'So, what foods do you like?' },
            { speaker: 'Woman', text: 'I like ice cream, and pizza, and apples.' },
            { speaker: 'Man', text: 'Ooh, I like those foods, too.' },
            { speaker: 'Woman', text: 'What foods do you like?' },
            { speaker: 'Man', text: 'I like fish, vegetables, and bananas.' },
            { speaker: 'Woman', text: 'Together?' },
            { speaker: 'Man', text: 'No, not together!' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'What drinks do you like?' },
            { speaker: 'Woman', text: 'I like tea, and I like juice.' },
            { speaker: 'Man', text: 'Ooh, hot tea or cold tea?' },
            { speaker: 'Woman', text: 'Both. What about you?' },
            { speaker: 'Man', text: 'I like coffee and hot chocolate.' },
            { speaker: 'Woman', text: 'Ooh, I like both, too!' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'What desserts do you like?' },
            { speaker: 'Woman', text: 'I really like ice cream.' },
            { speaker: 'Man', text: 'Oh! What flavor do you like?' },
            { speaker: 'Woman', text: 'Hmm, I like strawberry. I like vanilla, too.' },
            { speaker: 'Man', text: 'Nice! I like cake, and I like pie.' },
            { speaker: 'Woman', text: 'What kind of pie?' },
            { speaker: 'Man', text: 'I really like apple pie with ice cream.' },
            { speaker: 'Woman', text: 'Yum!' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'What snacks do you like?' },
            { speaker: 'Woman', text: 'I like to eat fruit.' },
            { speaker: 'Man', text: 'Oh yeah? And what fruits do you like?' },
            { speaker: 'Woman', text: 'I like apples and oranges. And you?' },
            { speaker: 'Man', text: 'I like strawberries and watermelon.' },
            { speaker: 'Woman', text: 'Do you like to eat cookies?' },
            { speaker: 'Man', text: 'Of course! I love chocolate chip cookies.' },
            { speaker: 'Woman', text: 'Me, too!' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Expressing Likes and Asking About Preferences',
      points: [
        {
          number: 1,
          title: 'You can ask about likes with the following pattern: What (____) do you like?',
          examples: [
            { category: 'Questions', items: ['What movies do you like?', 'What sports do you like?', 'What foods do you like?', 'What desserts do you like?'] }
          ]
        },
        {
          number: 2,
          title: 'You can express likes with the following pattern: I like (____)',
          examples: [
            { category: 'Examples', items: ['I like action movies.', 'I like soccer.', 'I like pizza.', 'I like ice cream.'] }
          ]
        },
        {
          number: 3,
          title: 'For Yes / No Questions, we use the pattern: Do you like (____)?',
          examples: [
            { category: 'Questions', items: ['Do you like pizza?', 'Do you like baseball?', 'Do you like video games?', 'Do you like coffee?'] }
          ]
        },
        {
          number: 4,
          title: 'You can answer a Yes / No Question in the following ways:',
          examples: [
            { category: 'Positive', items: ['Yes, I do.', 'Of course. (= Yes, I do)'] },
            { category: 'Negative', items: ['No, I don\'t.', 'Not really. (= No, I don\'t)'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What food does she like?',
          options: ['pizza', 'pasta'],
          correct: 0
        },
        {
          id: 2,
          question: 'What does he like?',
          options: ['tea', 'coffee'],
          correct: 1
        },
        {
          id: 3,
          question: 'What flavor does she like?',
          options: ['vanilla', 'chocolate'],
          correct: 0
        },
        {
          id: 4,
          question: 'What snack does she like?',
          options: ['cookies', 'potato chips'],
          correct: 0
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversations: [
        {
          title: 'Conversation 1',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'So what foods _____ you like?',
              blanks: [{ id: 1, options: ['do', 'are', 'is'], correct: 'do' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I like _____, and pizza, and apples.',
              blanks: [{ id: 2, options: ['ice cream', 'hot dogs', 'soup'], correct: 'ice cream' }]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, I like _____ foods _____.',
              blanks: [
                { id: 3, options: ['those', 'these', 'this'], correct: 'those' },
                { id: 4, options: ['too', 'also', 'very'], correct: 'too' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: '_____ foods do _____ like?',
              blanks: [
                { id: 5, options: ['What', 'Which', 'How'], correct: 'What' },
                { id: 6, options: ['you', 'we', 'they'], correct: 'you' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'I like fish, vegetables, _____ bananas.',
              blanks: [{ id: 7, options: ['and', 'or', 'but'], correct: 'and' }]
            },
            { 
              speaker: 'Man', 
              text: 'No, _____ together!',
              blanks: [{ id: 8, options: ['not', 'no', 'never'], correct: 'not' }]
            }
          ]
        },
        {
          title: 'Conversation 2',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What _____ do you like?',
              blanks: [{ id: 9, options: ['drinks', 'foods', 'movies'], correct: 'drinks' }]
            },
            { 
              speaker: 'Woman', 
              text: '_____ like tea, and I like _____.',
              blanks: [
                { id: 10, options: ['I', 'You', 'We'], correct: 'I' },
                { id: 11, options: ['juice', 'water', 'soda'], correct: 'juice' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'Hot tea or _____ tea?',
              blanks: [{ id: 12, options: ['cold', 'warm', 'ice'], correct: 'cold' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Both. _____ about you?',
              blanks: [{ id: 13, options: ['What', 'How', 'When'], correct: 'What' }]
            },
            { 
              speaker: 'Man', 
              text: 'I like coffee and _____.',
              blanks: [{ id: 14, options: ['hot chocolate', 'cold milk', 'orange juice'], correct: 'hot chocolate' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Ooh, I _____ both, _____!',
              blanks: [
                { id: 15, options: ['like', 'love', 'want'], correct: 'like' },
                { id: 16, options: ['too', 'also', 'very'], correct: 'too' }
              ]
            }
          ]
        }
      ]
    }
  };

  // Original Pack 1 A1 Level Data
  const pack1A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'Hello! Are you a new student?' },
            { speaker: 'Woman', text: 'Yes, I am. Today is my first day.' },
            { speaker: 'Man', text: 'Well, welcome. My name is Tony.' },
            { speaker: 'Woman', text: 'Hi, Tony. I\'m Beth.' },
            { speaker: 'Man', text: 'Are you new in town?' },
            { speaker: 'Woman', text: 'Yes, I\'m from New York.' },
            { speaker: 'Man', text: 'Wow! The Big City!' },
            { speaker: 'Woman', text: 'Are you from around here?' },
            { speaker: 'Man', text: 'Yes, I am.' },
            { speaker: 'Woman', text: 'That is so cool. Well, it is nice to meet you.' },
            { speaker: 'Man', text: 'Nice to meet you, too.' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'Hey Beth, how is your first day?' },
            { speaker: 'Woman', text: 'It is really good. This school is great!' },
            { speaker: 'Man', text: 'How are your classes?' },
            { speaker: 'Woman', text: 'They are fun! My teachers are so nice.' },
            { speaker: 'Man', text: 'Who are your teachers?' },
            { speaker: 'Woman', text: 'My English teacher is Mr. Wong.' },
            { speaker: 'Man', text: 'Oh, he is really nice.' },
            { speaker: 'Woman', text: 'Yes, he is. My Spanish teacher is Mrs. Garcia.' },
            { speaker: 'Man', text: 'Oh, she is really nice, too.' },
            { speaker: 'Woman', text: 'Yes, her class is a lot of fun!' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'What is your favorite class?' },
            { speaker: 'Woman', text: 'Spanish. I love it. My Spanish is not very good, though. I am just a beginner.' },
            { speaker: 'Man', text: 'Well, Spanish is my first language. My name is Tony, short for Antonio.' },
            { speaker: 'Woman', text: 'Really! That is so cool.' },
            { speaker: 'Man', text: 'Yeah, my dad is from Mexico, and my mom is from Costa Rica.' },
            { speaker: 'Woman', text: 'Wow! You are so lucky.' },
            { speaker: 'Man', text: 'Yeah, Spanish is easy for me, so I can help you if you like.' },
            { speaker: 'Woman', text: 'I\'d like that. Thank you!' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Woman', text: 'Tony, where is the computer lab?' },
            { speaker: 'Man', text: 'It\'s just down the hall.' },
            { speaker: 'Woman', text: 'My Spanish class is there tomorrow.' },
            { speaker: 'Man', text: 'Oh, when is the class?' },
            { speaker: 'Woman', text: 'It\'s at 6, after school.' },
            { speaker: 'Man', text: 'Why isn\'t the class online?' },
            { speaker: 'Woman', text: 'It is, but I\'m still new in town, so I don\'t have internet at home yet.' },
            { speaker: 'Man', text: 'Oh, I see. Well, good luck with the class.' },
            { speaker: 'Woman', text: 'Thanks. I\'m excited for it. I think online classes are fun!' },
            { speaker: 'Man', text: 'I think so, too.' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Be Verbs (am, is, are) Simple Present',
      points: [
        {
          number: 1,
          title: 'The Be verb has three forms in the present tense: am, is, are.',
          description: 'It connects a subject with a noun, adjective, or preposition.',
          examples: [
            { category: 'Before Nouns', items: ['I am a teacher.', 'You are a student.'] },
            { category: 'Before Adjectives', items: ['I am hungry.', 'It is hot today.'] },
            { category: 'Before Prepositions', items: ['She is at home.', 'The books are on the table.'] }
          ]
        },
        {
          number: 2,
          title: 'Use am and am not for the pronoun I.',
          examples: [
            { category: 'Positive', items: ['I am American.', 'I\'m happy. (am = \'m)'] },
            { category: 'Negative', items: ['I am not tired.', 'I\'m not sad. (am = \'m)'] }
          ]
        },
        {
          number: 3,
          title: 'Use are and are not for the pronoun you.',
          examples: [
            { category: 'Positive', items: ['You are a student.', 'You\'re a nice person. (are = \'re)'] },
            { category: 'Negative', items: ['You are not a teacher.', 'You\'re not late. (are not = \'re not)', 'You aren\'t late. (are not = aren\'t)'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Who is from New York?',
          options: ['Beth', 'Tony'],
          correct: 0
        },
        {
          id: 2,
          question: 'Who is her English Teacher?',
          options: ['Mr. Wong', 'Mrs. Garcia'],
          correct: 0
        },
        {
          id: 3,
          question: 'Who is from Costa Rica?',
          options: ['His dad', 'His mom'],
          correct: 1
        },
        {
          id: 4,
          question: 'When is her online class?',
          options: ['Today', 'Tomorrow'],
          correct: 1
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks with the correct be verbs',
      conversation: [
        { 
          speaker: 'Man', 
          text: 'Hello! _____ you a new student?', 
          blanks: [{ id: 1, options: ['am', 'are', 'is'], correct: 'are' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Yes, I _____. Today _____ my first day.', 
          blanks: [
            { id: 2, options: ['am', 'are', 'is'], correct: 'am' },
            { id: 3, options: ['am', 'are', 'is'], correct: 'is' }
          ]
        },
        { 
          speaker: 'Man', 
          text: 'Well, welcome. My name _____ Tony.', 
          blanks: [{ id: 4, options: ['am', 'are', 'is'], correct: 'is' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Hi, Tony. I _____ Beth.', 
          blanks: [{ id: 5, options: ['am', 'are', 'is'], correct: 'am' }]
        },
        { 
          speaker: 'Man', 
          text: '_____ you new in town?', 
          blanks: [{ id: 6, options: ['am', 'are', 'is'], correct: 'are' }]
        },
        { 
          speaker: 'Woman', 
          text: 'Yes, I _____ from New York.', 
          blanks: [{ id: 7, options: ['am', 'are', 'is'], correct: 'am' }]
        },
        { 
          speaker: 'Man', 
          text: 'Wow! The Big City! Well, I hope you like our small town.',
          blanks: []
        },
        { 
          speaker: 'Woman', 
          text: '_____ you from around here?', 
          blanks: [{ id: 8, options: ['am', 'are', 'is'], correct: 'are' }]
        },
        { 
          speaker: 'Man', 
          text: 'Yes, I _____. Born and raised here.', 
          blanks: [{ id: 9, options: ['am', 'are', 'is'], correct: 'am' }]
        },
        { 
          speaker: 'Woman', 
          text: 'That _____ so cool. Well, it _____ nice to meet you.', 
          blanks: [
            { id: 10, options: ['am', 'are', 'is'], correct: 'is' },
            { id: 11, options: ['am', 'are', 'is'], correct: 'is' }
          ]
        },
        { 
          speaker: 'Man', 
          text: 'Nice to meet you, too.',
          blanks: []
        }
      ]
    }
  };

  // Pack 4 A1 Level Data - Daily Routine
  const pack4A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'What do you do in the morning?' },
            { speaker: 'Woman', text: 'I wake up. I take a shower. I get dressed, and I eat breakfast.' },
            { speaker: 'Man', text: 'Oh! When do you get up?' },
            { speaker: 'Woman', text: 'I get up at 6.' },
            { speaker: 'Man', text: 'Wow! That\'s early.' },
            { speaker: 'Woman', text: 'I know! I like mornings, though.' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'What do you do during the day?' },
            { speaker: 'Woman', text: 'Well, I go to school. I teach students.' },
            { speaker: 'Man', text: 'Ooh! What do you teach?' },
            { speaker: 'Woman', text: 'I teach math. What do you do?' },
            { speaker: 'Man', text: 'I work at a bike shop.' },
            { speaker: 'Woman', text: 'Really? What do you do at the shop?' },
            { speaker: 'Man', text: 'I fix and sell bikes.' },
            { speaker: 'Woman', text: 'Sounds fun.' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'What do you do at lunch?' },
            { speaker: 'Woman', text: 'I eat with my friends. And you?' },
            { speaker: 'Man', text: 'I eat in the park.' },
            { speaker: 'Woman', text: 'That\'s nice.' },
            { speaker: 'Man', text: 'Yeah, I like to read on my lunch break.' },
            { speaker: 'Woman', text: 'Ooh, what do you read?' },
            { speaker: 'Man', text: 'I read about history.' },
            { speaker: 'Woman', text: 'Interesting.' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'What do you do on the weekend?' },
            { speaker: 'Woman', text: 'I play sports at the park. How about you?' },
            { speaker: 'Man', text: 'I study at the library.' },
            { speaker: 'Woman', text: 'Oh, right! You love books.' },
            { speaker: 'Man', text: 'Yeah. So, what sports do you play?' },
            { speaker: 'Woman', text: 'I play soccer with my friends.' },
            { speaker: 'Man', text: 'Sounds fun.' },
            { speaker: 'Woman', text: 'It is!' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Basic Verbs',
      points: [
        {
          number: 1,
          title: 'Questions',
          examples: [
            { category: 'Question Words', items: ['What do you eat for breakfast?', 'Where do you eat lunch?', 'When do you eat dinner?', 'Who do you talk to?', 'How do you get to work?', 'Why do you study English?'] }
          ]
        },
        {
          number: 2,
          title: 'Affirmative',
          examples: [
            { category: 'Positive Statements', items: ['I eat toast and fruit.', 'I work at home.', 'I live near the station.'] }
          ]
        },
        {
          number: 3,
          title: 'Negative',
          examples: [
            { category: 'Negative Statements', items: ['I do not eat cereal.', 'I do not work in town.', 'I do not live by my work.'] }
          ]
        },
        {
          number: 4,
          title: 'Negative Contraction',
          examples: [
            { category: 'Contractions', items: ['I don\'t eat cereal.', 'I don\'t work in town.', 'I don\'t live by my work.'] }
          ]
        },
        {
          number: 5,
          title: 'Yes / No Questions',
          examples: [
            { category: 'Questions', items: ['Do you eat at home?'] },
            { category: 'Positive Answers', items: ['Yes, I do.', 'Yes, I eat at home.'] },
            { category: 'Negative Answers', items: ['No, I don\'t.', 'No, I don\'t eat at home.'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'When does she get up?',
          options: ['5', '6'],
          correct: 1
        },
        {
          id: 2,
          question: 'What does he do at the bike shop?',
          options: ['Fix bikes', 'Ride bikes'],
          correct: 0
        },
        {
          id: 3,
          question: 'What does she read?',
          options: ['History', 'Stories'],
          correct: 0
        },
        {
          id: 4,
          question: 'What sport does she play?',
          options: ['Soccer', 'Tennis'],
          correct: 0
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What _____ you do in the _____?',
              blanks: [
                { id: 1, options: ['do', 'are', 'can'], correct: 'do' },
                { id: 2, options: ['morning', 'evening', 'afternoon'], correct: 'morning' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'I wake _____, I take a shower, I get dressed, and I eat _____.',
              blanks: [
                { id: 3, options: ['up', 'down', 'out'], correct: 'up' },
                { id: 4, options: ['breakfast', 'lunch', 'dinner'], correct: 'breakfast' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'Oh! _____ do you get up?',
              blanks: [{ id: 5, options: ['When', 'Where', 'Why'], correct: 'When' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I get up _____ 6.',
              blanks: [{ id: 6, options: ['at', 'in', 'on'], correct: 'at' }]
            },
            { 
              speaker: 'Man', 
              text: 'Wow, that\'s _____.',
              blanks: [{ id: 7, options: ['early', 'late', 'good'], correct: 'early' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I _____! I _____ mornings though!',
              blanks: [
                { id: 8, options: ['know', 'think', 'believe'], correct: 'know' },
                { id: 9, options: ['like', 'hate', 'love'], correct: 'like' }
              ]
            }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What do you do _____ the day?',
              blanks: [{ id: 10, options: ['during', 'in', 'at'], correct: 'during' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Well, I go to school. I _____ students.',
              blanks: [{ id: 11, options: ['teach', 'help', 'see'], correct: 'teach' }]
            },
            { 
              speaker: 'Man', 
              text: 'Ooh! _____ do you teach?',
              blanks: [{ id: 12, options: ['What', 'Where', 'When'], correct: 'What' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I teach _____. What do you _____?',
              blanks: [
                { id: 13, options: ['math', 'English', 'science'], correct: 'math' },
                { id: 14, options: ['do', 'work', 'study'], correct: 'do' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'I _____ at a bike shop!',
              blanks: [{ id: 15, options: ['work', 'play', 'study'], correct: 'work' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Really, what do you do _____ the shop?',
              blanks: [{ id: 16, options: ['at', 'in', 'on'], correct: 'at' }]
            },
            { 
              speaker: 'Man', 
              text: 'I fix and _____ bikes!',
              blanks: [{ id: 17, options: ['sell', 'buy', 'ride'], correct: 'sell' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Sounds _____!',
              blanks: [{ id: 18, options: ['fun', 'boring', 'hard'], correct: 'fun' }]
            }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ do you do at lunch?',
              blanks: [{ id: 19, options: ['What', 'Where', 'When'], correct: 'What' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I _____ with my friends. And you?',
              blanks: [{ id: 20, options: ['eat', 'talk', 'play'], correct: 'eat' }]
            },
            { 
              speaker: 'Man', 
              text: 'I eat in the _____.',
              blanks: [{ id: 21, options: ['park', 'office', 'home'], correct: 'park' }]
            },
            { 
              speaker: 'Woman', 
              text: 'That\'s _____.',
              blanks: [{ id: 22, options: ['nice', 'bad', 'strange'], correct: 'nice' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yeah, I like to _____ on my lunch _____.',
              blanks: [
                { id: 23, options: ['read', 'sleep', 'walk'], correct: 'read' },
                { id: 24, options: ['break', 'time', 'hour'], correct: 'break' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Ooh! What _____ you read?',
              blanks: [{ id: 25, options: ['do', 'can', 'will'], correct: 'do' }]
            },
            { 
              speaker: 'Man', 
              text: 'I read about _____.',
              blanks: [{ id: 26, options: ['history', 'science', 'math'], correct: 'history' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Interesting!',
              blanks: []
            }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What do you do _____ the _____?',
              blanks: [
                { id: 27, options: ['on', 'at', 'in'], correct: 'on' },
                { id: 28, options: ['weekend', 'week', 'day'], correct: 'weekend' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'I play sports _____ the _____. How about you?',
              blanks: [
                { id: 29, options: ['at', 'in', 'on'], correct: 'at' },
                { id: 30, options: ['park', 'gym', 'school'], correct: 'park' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'I study at the _____.',
              blanks: [{ id: 31, options: ['library', 'school', 'home'], correct: 'library' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Oh, right! You _____ books.',
              blanks: [{ id: 32, options: ['love', 'hate', 'read'], correct: 'love' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yeah, so what _____ do you play?',
              blanks: [{ id: 33, options: ['sports', 'games', 'music'], correct: 'sports' }]
            },
            { 
              speaker: 'Woman', 
              text: 'I _____ soccer with my friends.',
              blanks: [{ id: 34, options: ['play', 'watch', 'like'], correct: 'play' }]
            },
            { 
              speaker: 'Man', 
              text: 'Sounds _____!',
              blanks: [{ id: 35, options: ['fun', 'hard', 'easy'], correct: 'fun' }]
            },
            { 
              speaker: 'Woman', 
              text: 'It is!',
              blanks: []
            }
          ]
        }
      ]
    }
  };

  // Pack 5 A1 Level Data - Simple Present Questions
  const pack5A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'Do you play sports?' },
            { speaker: 'Woman', text: 'Yes, I do. I really love basketball.' },
            { speaker: 'Man', text: 'Do you play on a team?' },
            { speaker: 'Woman', text: 'Yes, but we do not play in winter.' },
            { speaker: 'Man', text: 'Oh, do you play in summer?' },
            { speaker: 'Woman', text: 'Yes, we play in spring and summer.' },
            { speaker: 'Man', text: 'Do you play at the gym in town?' },
            { speaker: 'Woman', text: 'No, we play at a high school.' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'Do you have any pets?' },
            { speaker: 'Woman', text: 'Yes, I have a cat. What about you? Do you?' },
            { speaker: 'Man', text: 'I don\'t have a cat, but I have a dog.' },
            { speaker: 'Woman', text: 'Nice! Do you have a big yard?' },
            { speaker: 'Man', text: 'Yes, I have a big yard, so it is perfect for my dog.' },
            { speaker: 'Woman', text: 'Yeah, I don\'t have a yard, so I can only have a cat.' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'Do you cook much?' },
            { speaker: 'Woman', text: 'Yes, I cook all the time. Do you cook?' },
            { speaker: 'Man', text: 'No, I don\'t like to cook very much.' },
            { speaker: 'Woman', text: 'Oh, so do you buy your dinner?' },
            { speaker: 'Man', text: 'Yes, I buy it at the supermarket.' },
            { speaker: 'Woman', text: 'Do you buy dinner every night?' },
            { speaker: 'Man', text: 'Yes, I never cook.' },
            { speaker: 'Woman', text: 'Wow! That is expensive.' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'Do you live downtown?' },
            { speaker: 'Woman', text: 'Yes, I live near the train station.' },
            { speaker: 'Man', text: 'Do you take the train to work?' },
            { speaker: 'Woman', text: 'Yes, most days. What about you?' },
            { speaker: 'Man', text: 'I live far away, so I drive to work.' },
            { speaker: 'Woman', text: 'Do you have a nice car?' },
            { speaker: 'Man', text: 'No, my car is old, but I like it.' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Simple Present Yes/No Questions with Do/Does',
      points: [
        {
          number: 1,
          title: 'Most simple present Yes/No questions use do to make a basic question.',
          examples: [
            { category: 'Basic Questions', items: ['Do you live here?', 'Do you like pizza?', 'Do you play sports?', 'Do you have a dog?'] }
          ]
        },
        {
          number: 2,
          title: 'The pronouns I, you, they, we use do in Yes/No questions.',
          examples: [
            { category: 'Questions with Do', items: ['Do you know Bob?', 'Do I need a ticket?', 'Do they speak English?', 'Do we have time?'] }
          ]
        },
        {
          number: 3,
          title: 'It is more polite to answer Yes/No questions in three words, not one.',
          examples: [
            { category: 'Questions', items: ['Do you know Bob?', 'Do I need a ticket?', 'Do they speak English?', 'Do we have time?'] },
            { category: 'Positive Answers', items: ['Yes, I do.', 'Yes, you do.', 'Yes, they do.', 'Yes, we do.'] },
            { category: 'Negative Answers', items: ['No, I don\'t.', 'No, you don\'t.', 'No, they don\'t.', 'No, we don\'t.'] },
            { category: 'Note', items: ['Don\'t is much more commonly used than do not.'] }
          ]
        },
        {
          number: 4,
          title: 'The third-person singular (he, she, it) uses does in Yes/No questions.',
          examples: [
            { category: 'Questions with Does', items: ['Does he play tennis?', 'Does she work with you?', 'Does it snow in winter?'] },
            { category: 'Positive Answers', items: ['Yes, she does.', 'Yes, he does.', 'Yes, it does.'] },
            { category: 'Negative Answers', items: ['No, she doesn\'t.', 'No, he doesn\'t.', 'No, it doesn\'t.'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Who plays basketball?',
          options: ['The man', 'The woman'],
          correct: 1
        },
        {
          id: 2,
          question: 'Who has a cat?',
          options: ['The man', 'The woman'],
          correct: 1
        },
        {
          id: 3,
          question: 'Does the woman cook much?',
          options: ['Yes, she does.', 'No, she does not.'],
          correct: 0
        },
        {
          id: 4,
          question: 'Where does the woman live?',
          options: ['In the city', 'In the country'],
          correct: 0
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ play sports?',
              blanks: [{ id: 1, options: ['Do you', 'Are you', 'Can you'], correct: 'Do you' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, I _____. I really love baseball.',
              blanks: [{ id: 2, options: ['do', 'am', 'can'], correct: 'do' }]
            },
            { 
              speaker: 'Man', 
              text: 'Do you play on a _____?',
              blanks: [{ id: 3, options: ['team', 'field', 'court'], correct: 'team' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, but we _____ play in winter.',
              blanks: [{ id: 4, options: ['do not', 'cannot', 'will not'], correct: 'do not' }]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, _____ in summer?',
              blanks: [{ id: 5, options: ['do you play', 'are you playing', 'will you play'], correct: 'do you play' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, _____ in spring and summer.',
              blanks: [{ id: 6, options: ['we play', 'we are playing', 'we will play'], correct: 'we play' }]
            }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ have any pets?',
              blanks: [{ id: 7, options: ['Do you', 'Are you', 'Will you'], correct: 'Do you' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, I _____ a cat. _____ you? Do you?',
              blanks: [
                { id: 8, options: ['have', 'am', 'like'], correct: 'have' },
                { id: 9, options: ['What about', 'How about', 'Where are'], correct: 'What about' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'I _____ a cat, but I have a dog.',
              blanks: [{ id: 10, options: ['don\'t have', 'am not', 'cannot'], correct: 'don\'t have' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Nice. _____ a big yard?',
              blanks: [{ id: 11, options: ['Do you have', 'Are you having', 'Will you have'], correct: 'Do you have' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, I _____ a big yard, so it is perfect for my dog.',
              blanks: [{ id: 12, options: ['have', 'am', 'like'], correct: 'have' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yeah, I don\'t have a _____, so I can only have a cat.',
              blanks: [{ id: 13, options: ['yard', 'house', 'garden'], correct: 'yard' }]
            }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'Do you _____ much?',
              blanks: [{ id: 14, options: ['cook', 'eat', 'work'], correct: 'cook' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, I cook all the time. _____ cook?',
              blanks: [{ id: 15, options: ['Do you', 'Are you', 'Can you'], correct: 'Do you' }]
            },
            { 
              speaker: 'Man', 
              text: 'No, I _____ to cook very much.',
              blanks: [{ id: 16, options: ['don\'t like', 'am not', 'cannot'], correct: 'don\'t like' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Oh, so _____ your dinner?',
              blanks: [{ id: 17, options: ['do you buy', 'are you buying', 'will you buy'], correct: 'do you buy' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, I _____ it at the supermarket.',
              blanks: [{ id: 18, options: ['buy', 'get', 'take'], correct: 'buy' }]
            },
            { 
              speaker: 'Woman', 
              text: 'That must be _____.',
              blanks: [{ id: 19, options: ['expensive', 'cheap', 'easy'], correct: 'expensive' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, _____.',
              blanks: [{ id: 20, options: ['it is', 'I do', 'that\'s right'], correct: 'it is' }]
            }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ live downtown?',
              blanks: [{ id: 21, options: ['Do you', 'Are you', 'Will you'], correct: 'Do you' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, I _____ near the train station.',
              blanks: [{ id: 22, options: ['live', 'am', 'work'], correct: 'live' }]
            },
            { 
              speaker: 'Man', 
              text: 'Nice, so _____ the train to work?',
              blanks: [{ id: 23, options: ['do you take', 'are you taking', 'will you take'], correct: 'do you take' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, most days. _____ you?',
              blanks: [{ id: 24, options: ['What about', 'How about', 'Where are'], correct: 'What about' }]
            },
            { 
              speaker: 'Man', 
              text: 'I _____ far away, so I drive to work.',
              blanks: [{ id: 25, options: ['live', 'am', 'work'], correct: 'live' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Do you _____ it?',
              blanks: [{ id: 26, options: ['like', 'have', 'want'], correct: 'like' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, it is a _____.',
              blanks: [{ id: 27, options: ['nice drive', 'long way', 'good car'], correct: 'nice drive' }]
            }
          ]
        }
      ]
    }
  };

  // Pack 6 A1 Level Data - Third Person Singular
  const pack6A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Woman', text: 'What does your mom do?' },
            { speaker: 'Man', text: 'She sells women\'s clothing.' },
            { speaker: 'Woman', text: 'Oh, yeah? Where does she work?' },
            { speaker: 'Man', text: 'She has a small shop in the mall.' },
            { speaker: 'Woman', text: 'Does she sell clothing for teens?' },
            { speaker: 'Man', text: 'No, she only has stuff for adults.' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Man', text: 'What does your brother do?' },
            { speaker: 'Woman', text: 'He is a university student. He studies engineering.' },
            { speaker: 'Man', text: 'Oh, does he live at home?' },
            { speaker: 'Woman', text: 'No, he has a small apartment.' },
            { speaker: 'Man', text: 'Does he come home much?' },
            { speaker: 'Woman', text: 'No, he doesn\'t. He doesn\'t have much free time.' },
            { speaker: 'Man', text: 'Oh, when do you see him?' },
            { speaker: 'Woman', text: 'On the holidays. He calls my mom every week, though.' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'Where does your daughter go to school?' },
            { speaker: 'Woman', text: 'She attends the local high school.' },
            { speaker: 'Man', text: 'Does she like her school?' },
            { speaker: 'Woman', text: 'Yes, she plays sports and participates in many clubs.' },
            { speaker: 'Man', text: 'Oh, what sports does she play?' },
            { speaker: 'Woman', text: 'She plays volleyball. She has a game tomorrow.' },
            { speaker: 'Man', text: 'Oh, I hope she wins.' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'When does the movie start?' },
            { speaker: 'Woman', text: 'It starts in about ten minutes.' },
            { speaker: 'Man', text: 'Cool! Who is in the movie?' },
            { speaker: 'Woman', text: 'Brad Pitt. He plays a policeman in the future.' },
            { speaker: 'Man', text: 'Does it have good reviews?' },
            { speaker: 'Woman', text: 'It does. Everyone says it is a great movie.' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Third-Person Singular Pronouns',
      points: [
        {
          number: 1,
          title: 'The third-person singular refers to people or things we talk about. Singular means one!',
          examples: [
            { category: 'Examples', items: ['My dad is a doctor. He is smart.', 'My mom is a police officer. She is brave.', 'My house is old. It is cold in winter.'] }
          ]
        },
        {
          number: 2,
          title: 'The subject pronoun goes before a verb. Use he for males, she for females, and it for things.',
          examples: [
            { category: 'Subject Pronouns', items: ['Bob is my boss. He is really nice.', 'Susan is my teacher. She has fun classes.', 'This car is new. It was very expensive.'] }
          ]
        },
        {
          number: 3,
          title: 'The object pronoun goes after a verb. Use him for males, her for females, and it for things.',
          examples: [
            { category: 'Object Pronouns', items: ['This is Bob. You met him last year.', 'Susan is my boss. I invited her to the party.', 'This is my new watch. My friend got it for me.'] }
          ]
        },
        {
          number: 4,
          title: 'The adjective pronoun goes before a noun. Use his for males, her for females, and its for things.',
          examples: [
            { category: 'Possessive Pronouns', items: ['Joe is having a party. It is at his beach house.', 'Beth is so nice. She let me use her car.', 'I liked the new cafe, but its location is bad.'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'Where does his mom work?',
          options: ['A store', 'A factory'],
          correct: 0
        },
        {
          id: 2,
          question: 'Where does her brother live?',
          options: ['At home', 'Near campus'],
          correct: 1
        },
        {
          id: 3,
          question: 'Who watches her child?',
          options: ['Her mom', 'Her daughter'],
          correct: 0
        },
        {
          id: 4,
          question: 'What does she say about the movie?',
          options: ['It starts soon.', 'It ends soon.'],
          correct: 0
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { 
              speaker: 'Woman', 
              text: 'What does your mom _____?',
              blanks: [{ id: 1, options: ['do', 'work', 'study'], correct: 'do' }]
            },
            { 
              speaker: 'Man', 
              text: 'She _____ women\'s clothing.',
              blanks: [{ id: 2, options: ['sells', 'buys', 'makes'], correct: 'sells' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Oh, yeah? Where does she _____?',
              blanks: [{ id: 3, options: ['work', 'live', 'go'], correct: 'work' }]
            },
            { 
              speaker: 'Man', 
              text: 'She _____ a small shop in the _____.',
              blanks: [
                { id: 4, options: ['has', 'owns', 'rents'], correct: 'has' },
                { id: 5, options: ['mall', 'street', 'town'], correct: 'mall' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: '_____ she sell clothing for _____?',
              blanks: [
                { id: 6, options: ['Does', 'Is', 'Can'], correct: 'Does' },
                { id: 7, options: ['teens', 'kids', 'men'], correct: 'teens' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'No, she _____ has stuff for adults.',
              blanks: [{ id: 8, options: ['only', 'always', 'never'], correct: 'only' }]
            }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What does your _____ do?',
              blanks: [{ id: 9, options: ['brother', 'sister', 'friend'], correct: 'brother' }]
            },
            { 
              speaker: 'Woman', 
              text: 'He _____ a university student. He _____ engineering.',
              blanks: [
                { id: 10, options: ['is', 'was', 'will be'], correct: 'is' },
                { id: 11, options: ['studies', 'teaches', 'learns'], correct: 'studies' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, does he _____ at home?',
              blanks: [{ id: 12, options: ['live', 'stay', 'work'], correct: 'live' }]
            },
            { 
              speaker: 'Woman', 
              text: 'No, he has a small _____.',
              blanks: [{ id: 13, options: ['apartment', 'house', 'room'], correct: 'apartment' }]
            },
            { 
              speaker: 'Man', 
              text: 'Does he come _____ much?',
              blanks: [{ id: 14, options: ['home', 'here', 'back'], correct: 'home' }]
            },
            { 
              speaker: 'Woman', 
              text: 'No, he doesn\'t. He doesn\'t have much _____ time.',
              blanks: [{ id: 15, options: ['free', 'extra', 'spare'], correct: 'free' }]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, _____ do you _____ him?',
              blanks: [
                { id: 16, options: ['when', 'where', 'how'], correct: 'when' },
                { id: 17, options: ['see', 'meet', 'visit'], correct: 'see' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'On the holidays. He _____ my mom every week, though.',
              blanks: [{ id: 18, options: ['calls', 'visits', 'texts'], correct: 'calls' }]
            }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ does your daughter go to school?',
              blanks: [{ id: 19, options: ['Where', 'When', 'How'], correct: 'Where' }]
            },
            { 
              speaker: 'Woman', 
              text: 'She _____ the local high school.',
              blanks: [{ id: 20, options: ['attends', 'goes to', 'studies at'], correct: 'attends' }]
            },
            { 
              speaker: 'Man', 
              text: '_____ she _____ her school?',
              blanks: [
                { id: 21, options: ['Does', 'Is', 'Can'], correct: 'Does' },
                { id: 22, options: ['like', 'love', 'enjoy'], correct: 'like' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, she _____ sports and participates in many _____.',
              blanks: [
                { id: 23, options: ['plays', 'does', 'enjoys'], correct: 'plays' },
                { id: 24, options: ['clubs', 'groups', 'activities'], correct: 'clubs' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, _____ sports does she play?',
              blanks: [{ id: 25, options: ['what', 'which', 'how many'], correct: 'what' }]
            },
            { 
              speaker: 'Woman', 
              text: 'She plays _____. She has a _____ tomorrow.',
              blanks: [
                { id: 26, options: ['volleyball', 'basketball', 'tennis'], correct: 'volleyball' },
                { id: 27, options: ['game', 'match', 'practice'], correct: 'game' }
              ]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, I hope she _____.',
              blanks: [{ id: 28, options: ['wins', 'plays well', 'has fun'], correct: 'wins' }]
            }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ does the movie _____?',
              blanks: [
                { id: 29, options: ['When', 'Where', 'How'], correct: 'When' },
                { id: 30, options: ['start', 'begin', 'play'], correct: 'start' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'It starts in _____ ten minutes.',
              blanks: [{ id: 31, options: ['about', 'around', 'nearly'], correct: 'about' }]
            },
            { 
              speaker: 'Man', 
              text: 'Cool! _____ is in the _____?',
              blanks: [
                { id: 32, options: ['Who', 'What', 'Which'], correct: 'Who' },
                { id: 33, options: ['movie', 'film', 'show'], correct: 'movie' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Brad Pitt. He plays a policeman in the _____.',
              blanks: [{ id: 34, options: ['future', 'past', 'present'], correct: 'future' }]
            },
            { 
              speaker: 'Man', 
              text: '_____ it have good _____?',
              blanks: [
                { id: 35, options: ['Does', 'Is', 'Has'], correct: 'Does' },
                { id: 36, options: ['reviews', 'ratings', 'comments'], correct: 'reviews' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'It does. _____ says it is a great movie.',
              blanks: [{ id: 37, options: ['Everyone', 'People', 'Critics'], correct: 'Everyone' }]
            }
          ]
        }
      ]
    }
  };

  // Pack 7 A1 Level Data - Describing Things with Adjectives
  const pack7A1Data = {
    id: parseInt(packId),
    title: getPackTitle(),
    level: level.toUpperCase(),
    youtubeUrl: currentVideo.url,
    videoId: currentVideo.videoId,
    script: {
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { speaker: 'Man', text: 'How are your classes?' },
            { speaker: 'Woman', text: 'Good. I really like my English class.' },
            { speaker: 'Man', text: 'That\'s good. My English class is fun, too.' },
            { speaker: 'Woman', text: 'How is your Math class?' },
            { speaker: 'Man', text: 'It\'s easy, but the room is small and hot.' },
            { speaker: 'Woman', text: 'Who is the teacher?' },
            { speaker: 'Man', text: 'Mrs. Jones. She is really nice and her classes are interesting.' },
            { speaker: 'Woman', text: 'And what about your Science class?' },
            { speaker: 'Man', text: 'It\'s really hard. I hate it!' }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { speaker: 'Woman', text: 'Hello, can I help you?' },
            { speaker: 'Man', text: 'Yes, can I have a cafe mocha?' },
            { speaker: 'Woman', text: 'OK, hot or cold?' },
            { speaker: 'Man', text: 'Iced mocha, please. Is it sweet?' },
            { speaker: 'Woman', text: 'Yes, a little. Do you still want it?' },
            { speaker: 'Man', text: 'Yes, I do.' },
            { speaker: 'Woman', text: 'What size do you want?' },
            { speaker: 'Man', text: 'Large, please.' },
            { speaker: 'Woman', text: 'OK, that will be 6.50.' },
            { speaker: 'Man', text: 'Wow! That\'s expensive.' },
            { speaker: 'Woman', text: 'Yeah, it\'s not cheap.' }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { speaker: 'Man', text: 'What a beautiful day!' },
            { speaker: 'Woman', text: 'Yes, the weather is perfect.' },
            { speaker: 'Man', text: 'How is the wifi speed?' },
            { speaker: 'Woman', text: 'It\'s fast, but my computer is slow.' },
            { speaker: 'Man', text: 'My computer is slow, too. It\'s very old. I want a new one.' },
            { speaker: 'Woman', text: 'Me, too, but new computers are so expensive.' },
            { speaker: 'Man', text: 'I know. They cost a lot.' }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { speaker: 'Man', text: 'How is your food?' },
            { speaker: 'Woman', text: 'It is OK, but it\'s a little spicy.' },
            { speaker: 'Man', text: 'My food is spicy, too.' },
            { speaker: 'Woman', text: 'Do you like it?' },
            { speaker: 'Man', text: 'Yes, it\'s very delicious, but I am full.' },
            { speaker: 'Woman', text: 'Really, I am still hungry.' },
            { speaker: 'Man', text: 'Oh, then please have mine. I am finished.' },
            { speaker: 'Woman', text: 'Thank you! That\'s so nice of you.' }
          ]
        }
      ]
    },
    grammar: {
      title: 'Adjectives - Words that describe things',
      points: [
        {
          number: 1,
          title: 'Adjectives can go after be verbs.',
          examples: [
            { category: 'After Be Verbs', items: ['My class is fun.', 'My teacher is nice.', 'Math is interesting.'] }
          ]
        },
        {
          number: 2,
          title: 'Adjectives can go before a noun.',
          examples: [
            { category: 'Before Nouns', items: ['I have a big house.', 'That is a nice bag.', 'He is a good teacher.'] }
          ]
        },
        {
          number: 3,
          title: 'You can put adjectives together.',
          examples: [
            { category: 'Two Adjectives', items: ['He is smart and funny.', 'She is kind and friendly.'] },
            { category: 'Three Adjectives', items: ['She is tall, strong, and fast.', 'The test was hard, long, and boring.'] }
          ]
        }
      ]
    },
    quiz: {
      questions: [
        {
          id: 1,
          question: 'How is his math class?',
          options: ['Easy', 'Hard'],
          correct: 0
        },
        {
          id: 2,
          question: 'How does he want his mocha?',
          options: ['Hot', 'Cold'],
          correct: 1
        },
        {
          id: 3,
          question: 'What is slow?',
          options: ['The wifi', 'The computer'],
          correct: 1
        },
        {
          id: 4,
          question: 'Who is not hungry?',
          options: ['The man', 'The woman'],
          correct: 0
        }
      ]
    },
    practice: {
      title: 'Fill in the blanks - Conversation Practice',
      conversations: [
        {
          id: 1,
          title: 'Conversation 1',
          dialogue: [
            { 
              speaker: 'Man', 
              text: '_____ are your classes?',
              blanks: [{ id: 1, options: ['How', 'What', 'Where'], correct: 'How' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Good. I really _____ my English class.',
              blanks: [{ id: 2, options: ['like', 'love', 'enjoy'], correct: 'like' }]
            },
            { 
              speaker: 'Man', 
              text: 'That\'s good. My _____ class is fun, too.',
              blanks: [{ id: 3, options: ['English', 'Math', 'Science'], correct: 'English' }]
            },
            { 
              speaker: 'Woman', 
              text: 'How is your Math _____?',
              blanks: [{ id: 4, options: ['class', 'teacher', 'book'], correct: 'class' }]
            },
            { 
              speaker: 'Man', 
              text: 'It\'s easy, _____ the room is small and hot.',
              blanks: [{ id: 5, options: ['but', 'and', 'so'], correct: 'but' }]
            },
            { 
              speaker: 'Woman', 
              text: '_____ is the teacher?',
              blanks: [{ id: 6, options: ['Who', 'What', 'How'], correct: 'Who' }]
            },
            { 
              speaker: 'Man', 
              text: 'Mrs. Jones. She is really nice and her classes are _____.',
              blanks: [{ id: 7, options: ['interesting', 'boring', 'easy'], correct: 'interesting' }]
            },
            { 
              speaker: 'Woman', 
              text: 'And _____ about your Science class?',
              blanks: [{ id: 8, options: ['what', 'how', 'where'], correct: 'what' }]
            },
            { 
              speaker: 'Man', 
              text: 'It\'s really hard. I _____ it!',
              blanks: [{ id: 9, options: ['hate', 'love', 'like'], correct: 'hate' }]
            }
          ]
        },
        {
          id: 2,
          title: 'Conversation 2',
          dialogue: [
            { 
              speaker: 'Woman', 
              text: 'Hello, can I _____ you?',
              blanks: [{ id: 10, options: ['help', 'serve', 'assist'], correct: 'help' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, can I _____ a cafe mocha?',
              blanks: [{ id: 11, options: ['have', 'get', 'order'], correct: 'have' }]
            },
            { 
              speaker: 'Woman', 
              text: 'OK, hot or _____?',
              blanks: [{ id: 12, options: ['cold', 'iced', 'cool'], correct: 'cold' }]
            },
            { 
              speaker: 'Man', 
              text: 'Iced mocha, please. Is it _____?',
              blanks: [{ id: 13, options: ['sweet', 'bitter', 'strong'], correct: 'sweet' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, a little. Do you still _____ it?',
              blanks: [{ id: 14, options: ['want', 'need', 'like'], correct: 'want' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, I do.',
              blanks: []
            },
            { 
              speaker: 'Woman', 
              text: 'What _____ do you want?',
              blanks: [{ id: 15, options: ['size', 'type', 'kind'], correct: 'size' }]
            },
            { 
              speaker: 'Man', 
              text: 'Large, please.',
              blanks: []
            },
            { 
              speaker: 'Woman', 
              text: 'OK, that will be 6.50.',
              blanks: []
            },
            { 
              speaker: 'Man', 
              text: 'Wow! That\'s _____.',
              blanks: [{ id: 16, options: ['expensive', 'cheap', 'costly'], correct: 'expensive' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yeah, it\'s _____ cheap.',
              blanks: [{ id: 17, options: ['not', 'very', 'so'], correct: 'not' }]
            }
          ]
        },
        {
          id: 3,
          title: 'Conversation 3',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'What a _____ day!',
              blanks: [{ id: 18, options: ['beautiful', 'nice', 'good'], correct: 'beautiful' }]
            },
            { 
              speaker: 'Woman', 
              text: 'Yes, the _____ is perfect.',
              blanks: [{ id: 19, options: ['weather', 'day', 'temperature'], correct: 'weather' }]
            },
            { 
              speaker: 'Man', 
              text: 'How is the wifi _____?',
              blanks: [{ id: 20, options: ['speed', 'connection', 'signal'], correct: 'speed' }]
            },
            { 
              speaker: 'Woman', 
              text: 'It\'s fast, but my computer is _____.',
              blanks: [{ id: 21, options: ['slow', 'old', 'broken'], correct: 'slow' }]
            },
            { 
              speaker: 'Man', 
              text: 'My computer is slow, too. It\'s very _____. I want a _____ one.',
              blanks: [
                { id: 22, options: ['old', 'slow', 'bad'], correct: 'old' },
                { id: 23, options: ['new', 'fast', 'better'], correct: 'new' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Me, too, but new computers are so _____.',
              blanks: [{ id: 24, options: ['expensive', 'costly', 'pricey'], correct: 'expensive' }]
            },
            { 
              speaker: 'Man', 
              text: 'I _____. They cost a _____.',
              blanks: [
                { id: 25, options: ['know', 'think', 'agree'], correct: 'know' },
                { id: 26, options: ['lot', 'fortune', 'much'], correct: 'lot' }
              ]
            }
          ]
        },
        {
          id: 4,
          title: 'Conversation 4',
          dialogue: [
            { 
              speaker: 'Man', 
              text: 'How _____ your food?',
              blanks: [{ id: 27, options: ['is', 'was', 'does'], correct: 'is' }]
            },
            { 
              speaker: 'Woman', 
              text: 'It is OK, but it\'s a _____ spicy.',
              blanks: [{ id: 28, options: ['little', 'bit', 'very'], correct: 'little' }]
            },
            { 
              speaker: 'Man', 
              text: 'My food is spicy, too.',
              blanks: []
            },
            { 
              speaker: 'Woman', 
              text: 'Do you _____ it?',
              blanks: [{ id: 29, options: ['like', 'enjoy', 'love'], correct: 'like' }]
            },
            { 
              speaker: 'Man', 
              text: 'Yes, _____ very delicious, but I am _____.',
              blanks: [
                { id: 30, options: ['it\'s', 'it is', 'this is'], correct: 'it\'s' },
                { id: 31, options: ['full', 'satisfied', 'done'], correct: 'full' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Really, I am _____ hungry.',
              blanks: [{ id: 32, options: ['still', 'very', 'so'], correct: 'still' }]
            },
            { 
              speaker: 'Man', 
              text: 'Oh, then please _____ mine. I am _____.',
              blanks: [
                { id: 33, options: ['have', 'take', 'eat'], correct: 'have' },
                { id: 34, options: ['finished', 'done', 'full'], correct: 'finished' }
              ]
            },
            { 
              speaker: 'Woman', 
              text: 'Thank you! That\'s so _____ of you.',
              blanks: [{ id: 35, options: ['nice', 'kind', 'sweet'], correct: 'nice' }]
            }
          ]
        }
      ]
    }
  };

  // Get the appropriate pack data
  const packData = getPackData();

  const handleQuizSubmit = () => {
    setShowQuizResults(true);
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setShowQuizResults(false);
  };

  const getQuizScore = () => {
    let correct = 0;
    packData.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) correct++;
    });
    return { correct, total: packData.quiz.questions.length };
  };

  const handlePracticeSubmit = () => {
    setShowPracticeResults(true);
  };

  const handlePracticeReset = () => {
    setPracticeAnswers({});
    setShowPracticeResults(false);
    setPracticeAttempts(3);
  };

  const getPracticeScore = () => {
    let correct = 0;
    let total = 0;
    
    if (packData.practice.conversations) {
      // New structure with multiple conversations
      packData.practice.conversations.forEach(conv => {
        conv.dialogue.forEach(line => {
          if (line.blanks) {
            line.blanks.forEach(blank => {
              total++;
              if (practiceAnswers[blank.id] === blank.correct) correct++;
            });
          }
        });
      });
    } else if (packData.practice.conversation) {
      // Old structure with single conversation
    packData.practice.conversation.forEach(line => {
        if (line.blanks) {
      line.blanks.forEach(blank => {
        total++;
        if (practiceAnswers[blank.id] === blank.correct) correct++;
      });
        }
    });
    }
    
    return { correct, total };
  };

  const getTotalPracticeBlanks = () => {
    let total = 0;
    if (packData.practice.conversations) {
      // New structure with multiple conversations
      packData.practice.conversations.forEach(conv => {
        conv.dialogue.forEach(line => {
          if (line.blanks) {
            total += line.blanks.length;
          }
        });
      });
    } else if (packData.practice.conversation) {
      // Old structure with single conversation
    packData.practice.conversation.forEach(line => {
        if (line.blanks) {
      total += line.blanks.length;
        }
    });
    }
    return total;
  };

  const getFilledPracticeBlanks = () => {
    return Object.keys(practiceAnswers).filter(key => practiceAnswers[key] !== '').length;
  };

  const renderTextWithDropdowns = (text, blanks) => {
    if (!blanks || blanks.length === 0) {
      return <Typography variant="body1" color="text.primary">{text}</Typography>;
    }

    const parts = text.split('_____');
    const result = [];

    parts.forEach((part, index) => {
      result.push(
        <Typography key={`text-${index}`} variant="body1" color="text.primary" component="span">
          {part}
        </Typography>
      );

      if (index < blanks.length) {
        const blank = blanks[index];
        const isCorrect = practiceAnswers[blank.id] === blank.correct;
        const hasAnswer = practiceAnswers[blank.id];

        result.push(
          <FormControl key={`dropdown-${blank.id}`} size="small" sx={{ mx: 0.5, minWidth: 80 }}>
            <Select
              value={practiceAnswers[blank.id] || ''}
              onChange={(e) => setPracticeAnswers(prev => ({ ...prev, [blank.id]: e.target.value }))}
              disabled={showPracticeResults}
              sx={{
                backgroundColor: showPracticeResults 
                  ? (isCorrect ? '#E8F5E9' : (hasAnswer ? '#FFEBEE' : '#fff'))
                  : '#fff',
                border: showPracticeResults 
                  ? (isCorrect ? '2px solid #4CAF50' : (hasAnswer ? '2px solid #f44336' : '1px solid #ddd'))
                  : '1px solid #ddd',
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontSize: '0.9rem'
                }
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select...</em>
              </MenuItem>
              {blank.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                  {showPracticeResults && option === blank.correct && (
                    <Chip 
                      label="✓" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        backgroundColor: '#4CAF50', 
                        color: 'white',
                        height: '20px'
                      }} 
                    />
                  )}
                </MenuItem>
              ))}
            </Select>
            {showPracticeResults && hasAnswer && !isCorrect && (
              <Typography variant="caption" color="error" sx={{ ml: 0.5 }}>
                ✗ Correct: {blank.correct}
              </Typography>
            )}
          </FormControl>
        );
      }
    });

    return <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>{result}</Box>;
  };

  const renderVideo = () => (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${packData.videoId}`}
            title={packData.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allowFullScreen
          />
        </Box>
      </Paper>
    </Box>
  );

  const renderScript = () => (
    <Box>
      {packData.script.conversations.map((conv, index) => (
        <Card key={conv.id} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} color="#4CAF50" gutterBottom>
              {conv.title}
            </Typography>
            <Box sx={{ pl: 2 }}>
              {conv.dialogue.map((line, lineIndex) => (
                <Box key={lineIndex} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                  <Typography variant="body1" fontWeight={600} color="#2E7D32" sx={{ minWidth: '80px', mr: 2 }}>
                    {line.speaker}:
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {line.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderGrammar = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} color="#4CAF50" gutterBottom>
        {packData.grammar.title}
      </Typography>
      
      {packData.grammar.points.map((point) => (
        <Card key={point.number} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} color="#2E7D32" gutterBottom>
              Point {point.number}: {point.title}
            </Typography>
            {point.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {point.description}
              </Typography>
            )}
            {point.examples?.map((example, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#4CAF50">
                  {example.category}
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {example.items.map((item, itemIndex) => (
                    <Typography key={itemIndex} variant="body2" sx={{ mb: 0.5 }}>
                      • {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderQuiz = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} color="#4CAF50" gutterBottom>
        Comprehension Quiz
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Answer these questions about the conversations.
      </Typography>

      {packData.quiz.questions.map((question) => (
        <Card key={question.id} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {question.id}) {question.question}
            </Typography>
            <RadioGroup
              value={quizAnswers[question.id] !== undefined ? quizAnswers[question.id].toString() : ''}
              onChange={(e) => setQuizAnswers(prev => ({ ...prev, [question.id]: parseInt(e.target.value) }))}
            >
              {question.options.map((option, index) => {
                const isSelected = quizAnswers[question.id] === index;
                const isCorrect = index === question.correct;
                
                return (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio color="success" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          {String.fromCharCode(97 + index)}) {option}
                        </Typography>
                        {showQuizResults && isCorrect && (
                          <Chip 
                            label="✓ CORRECT" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#4CAF50', 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        )}
                        {showQuizResults && isSelected && !isCorrect && (
                          <Chip 
                            label="✗ WRONG" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#f44336', 
                              color: 'white',
                              fontWeight: 600
                            }} 
                          />
                        )}
                      </Box>
                    }
                    disabled={showQuizResults}
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        width: '100%'
                      }
                    }}
                  />
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
        {!showQuizResults ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length !== packData.quiz.questions.length}
            sx={{ fontWeight: 600 }}
          >
            Check Answers
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleQuizReset} sx={{ fontWeight: 600 }}>
              Reset Quiz
            </Button>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                backgroundColor: getQuizScore().correct === getQuizScore().total ? '#E8F5E9' : '#FFF3E0',
                border: `2px solid ${getQuizScore().correct === getQuizScore().total ? '#4CAF50' : '#FF9800'}`
              }}
            >
              <Typography variant="h6" color={getQuizScore().correct === getQuizScore().total ? '#4CAF50' : '#FF9800'} fontWeight={600}>
                Score: {getQuizScore().correct}/{getQuizScore().total} 
                {getQuizScore().correct === getQuizScore().total ? ' 🎉 Perfect!' : ` (${Math.round((getQuizScore().correct / getQuizScore().total) * 100)}%)`}
              </Typography>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );

  const renderPractice = () => (
    <Box>
      <Typography variant="h5" fontWeight={600} color="#4CAF50" gutterBottom>
        Practice Exercise
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {packData.practice.title}
      </Typography>

      {/* Check if packData has conversations (new structure) or conversation (old structure) */}
      {packData.practice.conversations ? (
        // New structure with multiple conversations (for Pack 3)
        packData.practice.conversations.map((conv, convIndex) => (
          <Card key={convIndex} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} color="#2E7D32" gutterBottom>
                {conv.title}
              </Typography>
              <Box sx={{ pl: 2 }}>
                {conv.dialogue.map((line, index) => (
                  <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="body1" fontWeight={600} color="#2E7D32" sx={{ minWidth: '80px', mr: 2, mt: 0.5 }}>
                      {line.speaker}:
                    </Typography>
                    {renderTextWithDropdowns(line.text, line.blanks)}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        // Old structure with single conversation (for Pack 1)
      <Card sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} color="#2E7D32" gutterBottom>
            Conversation 1
          </Typography>
          <Box sx={{ pl: 2 }}>
              {packData.practice.conversation?.map((line, index) => (
              <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="body1" fontWeight={600} color="#2E7D32" sx={{ minWidth: '80px', mr: 2, mt: 0.5 }}>
                  {line.speaker}:
                </Typography>
                {renderTextWithDropdowns(line.text, line.blanks)}
              </Box>
            ))}
          </Box>
          </CardContent>
        </Card>
      )}
          
          {!showPracticeResults && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              {practiceAttempts} attempts remaining
            </Typography>
          )}

          {showPracticeResults && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mt: 3,
                backgroundColor: getPracticeScore().correct === getPracticeScore().total ? '#E8F5E9' : '#FFF3E0',
                border: `2px solid ${getPracticeScore().correct === getPracticeScore().total ? '#4CAF50' : '#FF9800'}`
              }}
            >
              <Typography variant="h6" color={getPracticeScore().correct === getPracticeScore().total ? '#4CAF50' : '#FF9800'} fontWeight={600}>
                Practice Score: {getPracticeScore().correct}/{getPracticeScore().total} 
                {getPracticeScore().correct === getPracticeScore().total ? ' 🎉 Perfect!' : ` (${Math.round((getPracticeScore().correct / getPracticeScore().total) * 100)}%)`}
              </Typography>
            </Paper>
          )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'center' }}>
        {!showPracticeResults ? (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={handlePracticeSubmit}
              disabled={getFilledPracticeBlanks() !== getTotalPracticeBlanks()}
              sx={{ fontWeight: 600 }}
            >
              Check Practice
            </Button>
            <Typography variant="caption" color="text.secondary">
              ({getFilledPracticeBlanks()}/{getTotalPracticeBlanks()} answered)
            </Typography>
          </>
        ) : (
          <Button variant="outlined" onClick={handlePracticeReset} sx={{ fontWeight: 600 }}>
            Try Again
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50', minHeight: 'auto' }}>
        <Toolbar sx={{ minHeight: '44px !important', py: 0.75 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ 
              mr: 0.5, 
              p: 0.25,
              minWidth: 'auto',
              width: 28,
              height: 28,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
          
          <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
            🎧 {packData.level} - Pack {packData.id}: {packData.title}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Video Section */}
        {renderVideo()}

        {/* Tabs Section */}
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              backgroundColor: '#E8F5E9',
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                color: '#2E7D32'
              },
              '& .Mui-selected': {
                color: '#4CAF50 !important'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#4CAF50'
              }
            }}
          >
            <Tab label="📝 Script" />
            <Tab label="📚 Grammar" />
            <Tab label="❓ Quiz" />
            <Tab label="✏️ Practice" />
          </Tabs>

          <Box sx={{ p: 4, minHeight: '400px' }}>
            {activeTab === 0 && renderScript()}
            {activeTab === 1 && renderGrammar()}
            {activeTab === 2 && renderQuiz()}
            {activeTab === 3 && renderPractice()}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ListeningPack; 