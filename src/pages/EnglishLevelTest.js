import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  LinearProgress,
  CircularProgress,
  Grid,
  IconButton
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ReplayIcon from '@mui/icons-material/Replay';

const EnglishLevelTest = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 14;
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [transcripts, setTranscripts] = useState(Array(totalQuestions).fill(''));
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showReplayButton, setShowReplayButton] = useState(false);
  
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  
  // Questions/slides data
  const questions = [
    {
      id: 1,
      type: 'video',
      title: 'Welcome to the English Level Test!',
      instruction: 'Please introduce yourself and tell us why you want to improve your English.',
      mediaUrl: '/assets/start-test.mp4'
    },
    {
      id: 2,
      type: 'video',
      title: 'Describe Your Weekend Plans',
      instruction: 'Watch the video and describe your own weekend plans using similar expressions.',
      mediaUrl: '/assets/plans-weekend.mp4'
    },
    {
      id: 3,
      type: 'image',
      title: 'Describe This Image',
      instruction: 'What do you see in this picture? Describe it with as much detail as possible.',
      mediaUrl: '/assets/image1.jpg',
      suggestedResponse: "In this image, I can see a family enjoying their time at the park. There are two adults and two children having a picnic on a sunny day. The children appear to be playing with a ball while the parents are setting up food on a blanket. The trees in the background are full of green leaves, suggesting it's summer or spring."
    },
    {
      id: 4,
      type: 'image',
      title: 'Express Your Opinion',
      instruction: 'What do you think about this situation? Do you agree or disagree?',
      mediaUrl: '/assets/image2.jpg',
      suggestedResponse: "I think this situation shows the importance of teamwork. When people collaborate effectively, they can achieve much more than working alone. I agree that working together is beneficial because it brings diverse perspectives and skills to solve complex problems. In my experience, the best results come from teams where everyone contributes their unique strengths."
    },
    {
      id: 5,
      type: 'image',
      title: 'Tell a Story',
      instruction: 'Create a short story based on what you see in this image.',
      mediaUrl: '/assets/image3.jpg',
      suggestedResponse: "Once upon a time, there was a young explorer named Emma who discovered an old map in her grandmother's attic. The map led to a hidden treasure on a remote island. Emma gathered her friends and they set sail on an adventure. After facing stormy seas and solving ancient riddles, they finally found the treasure - not gold or jewels, but a magical book that could answer any question. They realized knowledge was the greatest treasure of all."
    },
    {
      id: 6,
      type: 'image',
      title: 'Compare and Contrast',
      instruction: 'Compare what you see here with something from your own experience.',
      mediaUrl: '/assets/image4.jpg',
      suggestedResponse: "This modern urban landscape reminds me of when I visited Tokyo last year. Both feature tall skyscrapers and busy streets. However, in my hometown, buildings are much lower and there's less traffic. While this city appears to have efficient public transportation, my area relies more on private vehicles. Another difference is that this cityscape has more green spaces integrated into the urban design than what I'm accustomed to seeing."
    },
    {
      id: 7,
      type: 'image',
      title: 'Give Advice',
      instruction: 'What advice would you give to someone in this situation?',
      mediaUrl: '/assets/image5.jpg',
      suggestedResponse: "If you're feeling overwhelmed with your workload, I would suggest taking a step back and prioritizing your tasks. First, make a list of everything you need to do and rank them by importance and deadline. Then, consider delegating some tasks if possible. Remember to schedule breaks to avoid burnout - even a five-minute walk can refresh your mind. Don't hesitate to ask for help when needed, as this shows strength, not weakness."
    },
    {
      id: 8,
      type: 'image',
      title: 'Make Predictions',
      instruction: 'What do you think will happen next in this scenario?',
      mediaUrl: '/assets/image6.jpg',
      suggestedResponse: "I predict that the technology sector will continue to evolve rapidly in the next decade. Artificial intelligence will become more integrated into our daily lives, assisting with tasks from healthcare diagnosis to personalized education. Remote work will remain prevalent, but with more sophisticated virtual reality tools to enhance collaboration. Renewable energy adoption will accelerate, and we'll likely see significant breakthroughs in quantum computing that revolutionize data processing capabilities."
    },
    {
      id: 9,
      type: 'image',
      title: 'Explain a Process',
      instruction: 'Explain the process shown in this image step by step.',
      mediaUrl: '/assets/image7.jpg',
      suggestedResponse: "The process of photosynthesis begins when plants absorb sunlight through their leaves. Next, they take in carbon dioxide from the air through tiny pores called stomata. Simultaneously, water is absorbed through the roots and transported to the leaves. Within the chloroplasts, sunlight energy is used to convert carbon dioxide and water into glucose and oxygen. The plant uses the glucose as food for growth, while oxygen is released into the atmosphere as a byproduct."
    },
    {
      id: 10,
      type: 'image',
      title: 'Discuss Advantages and Disadvantages',
      instruction: 'What are the pros and cons of what you see in this image?',
      mediaUrl: '/assets/image8.jpg',
      suggestedResponse: "Social media platforms offer several advantages: they connect people globally, provide instant access to information, and create opportunities for businesses to reach customers. However, they also have significant disadvantages: they can contribute to privacy concerns as personal data is often collected and sold. Additionally, excessive use may lead to mental health issues like anxiety and depression. Social media can also spread misinformation quickly and create echo chambers where people only encounter viewpoints similar to their own."
    },
    {
      id: 11,
      type: 'image',
      title: 'Express Preferences',
      instruction: 'Would you prefer this option? Why or why not?',
      mediaUrl: '/assets/image9.jpg',
      suggestedResponse: "I would prefer to live in a rural area rather than a big city. The main reason is the peaceful environment with clean air and beautiful natural surroundings. Rural areas offer more space and privacy, with lower housing costs and a stronger sense of community. However, I recognize that cities provide better access to healthcare, education, and job opportunities. Despite these drawbacks, the quality of life and reduced stress of country living makes it my preference."
    },
    {
      id: 12,
      type: 'image',
      title: 'Solve a Problem',
      instruction: 'How would you solve the problem shown in this image?',
      mediaUrl: '/assets/image10.jpg',
      suggestedResponse: "To address traffic congestion in urban areas, I would implement a multi-faceted approach. First, I'd improve public transportation by increasing frequency and reliability. Second, I'd encourage carpooling through dedicated lanes and tax incentives. Third, I'd promote flexible work schedules and remote work options to reduce rush hour traffic. Additionally, investing in smart traffic light systems that adjust to real-time traffic patterns could optimize flow. Finally, developing better bike lanes and pedestrian paths would encourage alternative transportation methods."
    },
    {
      id: 13,
      type: 'image',
      title: 'Persuade Someone',
      instruction: 'Try to convince someone to agree with your point of view about this image.',
      mediaUrl: '/assets/image11.jpg',
      suggestedResponse: "I strongly believe that investing in renewable energy is crucial for our future. The evidence clearly shows that fossil fuels contribute to climate change, which is already causing extreme weather events worldwide. Renewable energy technologies like solar and wind have become increasingly affordable, and they create more jobs per dollar invested than traditional energy sources. By transitioning now, we'll not only protect the environment but also ensure energy independence and economic growth. Can you really argue against a cleaner, more sustainable, and more prosperous future?"
    },
    {
      id: 14,
      type: 'image',
      title: 'Reflect and Conclude',
      instruction: "Reflect on what you've learned from this test and how you'll use it.",
      mediaUrl: '/assets/image12.jpg',
      suggestedResponse: "This English assessment has helped me identify both my strengths and areas for improvement. I've realized that I'm quite comfortable with everyday conversation and vocabulary, but I need to work on using more complex grammatical structures. Moving forward, I plan to practice speaking more regularly with native speakers and focus specifically on mastering conditional tenses. I'll also read more advanced English literature to expand my vocabulary. This experience has motivated me to set a goal of reaching advanced proficiency within the next year."
    }
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscripts(prev => {
          const newTranscripts = [...prev];
          newTranscripts[currentQuestion - 1] = transcript;
          return newTranscripts;
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        clearInterval(intervalId);
        setIntervalId(null);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId, currentQuestion]);

  // Play video for first two questions
  useEffect(() => {
    if (videoRef.current && (currentQuestion === 1 || currentQuestion === 2)) {
      videoRef.current.load();
      setShowReplayButton(false);
    }
  }, [currentQuestion]);

  useEffect(() => {
    // Start the timer when component mounts and keep it running
    const id = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
    
    return () => {
      // Clean up interval on unmount
      clearInterval(id);
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  const handleNext = () => {
    // Stop any ongoing recording
    if (isRecording) {
      stopRecording();
    }
    
    // Reset timer for next question
    setTimer(0);
    
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      // We've reached the end, analyze results
      analyzeResults();
    }
  };

  const analyzeResults = () => {
    setLoading(true);
    
    // Simulate API call to analyze responses
    setTimeout(() => {
      // Fake AI analysis result - in a real app, this would come from an API
      const analysisResult = {
        overallScore: 75,
        fluency: 72,
        grammar: 68,
        vocabulary: 82,
        pronunciation: 78,
        feedback: "You demonstrate good conversational English skills. Your vocabulary is varied and appropriate. Work on grammar consistency and practice more complex sentence structures to improve fluency.",
        level: "Intermediate (B1-B2)",
        nextSteps: [
          "Focus on past perfect and conditional tenses",
          "Practice speaking about abstract concepts",
          "Build vocabulary related to academic topics",
          "Work on sentence stress and intonation patterns"
        ]
      };
      
      setResults(analysisResult);
      setShowResults(true);
      setLoading(false);
    }, 3000);
  };

  // Format timer to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentSlide = questions[currentQuestion - 1];

  // Render results screen
  if (showResults) {
    return (
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh', 
          py: 4
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2E68FF' }}>
            Your English Level Test Results
          </Typography>
          
          <Box sx={{ mt: 4, mb: 5 }}>
            <Typography variant="h5" gutterBottom>
              Overall Score: {results.overallScore}/100
            </Typography>
            <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
              Level: {results.level}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="textSecondary">Fluency</Typography>
                  <Typography variant="h6">{results.fluency}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="textSecondary">Grammar</Typography>
                  <Typography variant="h6">{results.grammar}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="textSecondary">Vocabulary</Typography>
                  <Typography variant="h6">{results.vocabulary}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="textSecondary">Pronunciation</Typography>
                  <Typography variant="h6">{results.pronunciation}%</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>
              Feedback:
            </Typography>
            <Typography variant="body1" paragraph>
              {results.feedback}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Recommended next steps:
            </Typography>
            <ul>
              {results.nextSteps.map((step, index) => (
                <li key={index}>
                  <Typography variant="body1">{step}</Typography>
                </li>
              ))}
            </ul>
          </Box>
          
          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/student-dashboard/speaky')}
              sx={{ px: 4 }}
            >
              Back to Challenges
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: '#ffffff',
      overflow: 'auto',
      '& *': {
        cursor: 'default !important'
      },
      '& button, & a, & [role="button"]': {
        cursor: 'pointer !important'
      },
      '& .MuiIconButton-root': {
        cursor: 'pointer !important'
      }
    }}>
      <Container 
        maxWidth="md" 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          py: 4
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Analyzing your responses...
            </Typography>
          </Box>
        ) : (
          <>
            <Box 
              sx={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1
              }}
            >
              {/* Close button */}
              <Box 
                sx={{ 
                  position: 'fixed', 
                  top: 20, 
                  right: 20,
                  cursor: 'pointer',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  zIndex: 1000,
                  color: '#333',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  '&:hover': {
                    color: '#E53935'
                  }
                }}
                onClick={() => navigate('/student-dashboard/speaky')}
              >
                ✕
              </Box>
              
              {/* Progress counter */}
              <Box 
                sx={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <LinearProgress 
                  variant="determinate" 
                  value={(currentQuestion / totalQuestions) * 100} 
                  sx={{ width: '70%', height: 8, borderRadius: 4 }}
                />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {currentQuestion} / {totalQuestions}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatTime(timer)}
                </Typography>
              </Box>
              
              {/* Main content */}
              <Box 
                sx={{ 
                  textAlign: 'center',
                  mt: 2,
                  mb: 4,
                  width: '100%'
                }}
              >
                <Typography 
                  variant="h5" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  {currentSlide.title}
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    color: '#555'
                  }}
                >
                  {currentSlide.instruction}
                </Typography>
                
                {/* Suggested response for practice */}
                {currentSlide.suggestedResponse && (
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      mb: 4, 
                      backgroundColor: '#f0f7ff',
                      borderLeft: '4px solid #2196f3',
                      maxWidth: '600px',
                      margin: '0 auto 20px auto',
                      textAlign: 'left'
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: '#2196f3' 
                      }}
                    >
                      Practice with this example:
                    </Typography>
                    <Typography variant="body2">
                      {currentSlide.suggestedResponse}
                    </Typography>
                  </Paper>
                )}
                
                {/* Media container */}
                <Box 
                  sx={{ 
                    maxWidth: '600px',
                    width: '100%',
                    margin: '0 auto',
                    mb: 4
                  }}
                >
                  {currentSlide.type === 'video' ? (
                    <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
                      <video 
                        ref={videoRef}
                        autoPlay
                        width="100%"
                        height="auto"
                        style={{ 
                          objectFit: 'cover'
                        }}
                        onEnded={() => {
                          // Show replay button when video ends
                          setShowReplayButton(true);
                          if (videoRef.current) {
                            videoRef.current.style.opacity = '0.7';
                          }
                        }}
                        onError={(e) => {
                          console.error("Video failed to load:", e);
                          // If video fails, replace element with fallback image
                          if (e.target.parentNode) {
                            const img = document.createElement('img');
                            img.src = '/assets/quote.png';
                            img.alt = currentSlide.title;
                            img.style.width = '100%';
                            img.style.height = 'auto';
                            e.target.parentNode.replaceChild(img, e.target);
                          }
                        }}
                      >
                        <source src={currentSlide.mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Replay button overlay - only show when video has ended */}
                      {showReplayButton && (
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            background: 'transparent',
                            padding: '12px',
                            boxShadow: 'none',
                            '&:hover': {
                              background: 'transparent',
                              color: '#ffffff',
                              boxShadow: 'none'
                            }
                          }}
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = 0;
                              videoRef.current.play();
                              videoRef.current.style.opacity = '1';
                              setShowReplayButton(false);
                            }
                          }}
                        >
                          <ReplayIcon fontSize="large" sx={{ fontSize: 60 }} />
                        </IconButton>
                      )}
                    </Box>
                  ) : (
                    <img 
                      src={currentSlide.mediaUrl}
                      alt={currentSlide.title}
                      style={{ 
                        width: '100%',
                        height: 'auto'
                      }}
                      onError={(e) => {
                        // If image fails to load, show a fallback
                        e.target.src = '/assets/quote.png';
                      }}
                    />
                  )}
                </Box>
                
                {/* Transcript display */}
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    maxHeight: '150px', 
                    overflowY: 'auto',
                    bgcolor: '#f9f9f9',
                    mb: 3
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isRecording ? '#E53935' : '#333',
                      fontStyle: transcripts[currentQuestion - 1] ? 'normal' : 'italic'
                    }}
                  >
                    {transcripts[currentQuestion - 1] || 'Your response will appear here...'}
                  </Typography>
                </Paper>
              </Box>
            </Box>
            
            {/* Action buttons */}
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mt: 2,
                mb: 4
              }}
            >
              <Button
                variant="contained"
                startIcon={<MicIcon />}
                onClick={isRecording ? stopRecording : startRecording}
                color={isRecording ? "error" : "primary"}
                sx={{
                  borderRadius: '8px',
                  py: 1.5,
                  px: 3,
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  backgroundColor: isRecording ? '#f44336' : '#7445f8',
                  '&:hover': {
                    backgroundColor: isRecording ? '#d63a3a' : '#5c33d4'
                  }
                }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              
              <Button
                variant="contained"
                endIcon={<NavigateNextIcon />}
                onClick={handleNext}
                disabled={isRecording}
                sx={{
                  backgroundColor: '#4CAF50',
                  borderRadius: '8px',
                  py: 1.5,
                  px: 3,
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: '#388E3C'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#cccccc',
                    color: '#666666'
                  }
                }}
              >
                {currentQuestion === totalQuestions ? 'Finish Test' : 'Next Question'}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default EnglishLevelTest; 