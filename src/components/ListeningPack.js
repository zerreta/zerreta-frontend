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
    // Add more specific titles for other packs as content is added
    return `Listening Practice ${packId}`;
  };

  const currentVideo = getCurrentVideo();

  // Sample data for Pack 1 - A1 Level
  const packData = {
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
    packData.practice.conversation.forEach(line => {
      line.blanks.forEach(blank => {
        total++;
        if (practiceAnswers[blank.id] === blank.correct) correct++;
      });
    });
    return { correct, total };
  };

  const getTotalPracticeBlanks = () => {
    let total = 0;
    packData.practice.conversation.forEach(line => {
      total += line.blanks.length;
    });
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

      <Card sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} color="#2E7D32" gutterBottom>
            Conversation 1
          </Typography>
          <Box sx={{ pl: 2 }}>
            {packData.practice.conversation.map((line, index) => (
              <Box key={index} sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="body1" fontWeight={600} color="#2E7D32" sx={{ minWidth: '80px', mr: 2, mt: 0.5 }}>
                  {line.speaker}:
                </Typography>
                {renderTextWithDropdowns(line.text, line.blanks)}
              </Box>
            ))}
          </Box>
          
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
        </CardContent>
      </Card>

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