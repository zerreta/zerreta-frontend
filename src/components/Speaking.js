import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  IconButton,
  Toolbar,
  AppBar,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  Send as SendIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const Speaking = () => {
  const navigate = useNavigate();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);
  
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);
  const [micPermission, setMicPermission] = useState(null);

  // Initialize microphone permissions
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setMicPermission(false);
        setError('Microphone access is required for voice conversation.');
      }
    };
    
    checkMicPermission();
  }, []);

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process audio through OpenAI pipeline
  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Speech to Text (Whisper)
      const transcript = await speechToText(audioBlob);
      setCurrentTranscript(transcript);
      
      // Add user message to conversation
      const userMessage = { role: 'user', content: transcript, timestamp: Date.now() };
      setConversation(prev => [...prev, userMessage]);
      
      // Step 2: Get AI response (GPT-3.5 Turbo with streaming)
      const aiResponse = await getAIResponse(transcript);
      
      // Add AI message to conversation
      const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() };
      setConversation(prev => [...prev, aiMessage]);
      
      // Step 3: Text to Speech
      await textToSpeech(aiResponse);
      
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setCurrentTranscript('');
    }
  };

  // OpenAI Whisper API for Speech-to-Text
  const speechToText = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  };

  // OpenAI GPT-3.5 Turbo for conversation
  const getAIResponse = async (userInput) => {
    const conversationHistory = conversation.slice(-6); // Keep last 6 messages for context
    
    const messages = [
      {
        role: 'system',
        content: 'You are a friendly English conversation partner helping students practice speaking English. Keep responses natural, encouraging, and conversational. Respond in 1-2 sentences maximum to maintain quick conversation flow. Ask follow-up questions to keep the conversation going.'
      },
      ...conversationHistory,
      { role: 'user', content: userInput }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 150,
        temperature: 0.7,
        stream: false // Using non-stream for simplicity, can be upgraded later
      }),
    });

    if (!response.ok) {
      throw new Error(`GPT API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // OpenAI TTS for Text-to-Speech
  const textToSpeech = async (text) => {
    setIsPlaying(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'nova', // Fast, natural voice
          input: text,
          speed: 1.0
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio
      if (audioElementRef.current) {
        audioElementRef.current.src = audioUrl;
        audioElementRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        await audioElementRef.current.play();
      }
    } catch (err) {
      setIsPlaying(false);
      throw err;
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setConversation([]);
    setCurrentTranscript('');
    setError(null);
  };

  // Handle mic permission error
  if (micPermission === false) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <MicOffIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Microphone Access Required
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Please allow microphone access to start voice conversations.
          </Typography>
          <Button variant="contained" onClick={handleGoBack}>
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#FF9800' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🗣️ English Conversation Practice
          </Typography>
          <IconButton color="inherit" onClick={clearConversation}>
            <ClearIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 2, mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Status Card */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            {isRecording && (
              <Box>
                <Chip 
                  icon={<MicIcon />} 
                  label="Recording..." 
                  color="error" 
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Speak clearly and tap stop when finished
                </Typography>
              </Box>
            )}
            
            {isProcessing && (
              <Box>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Chip label="Processing..." color="primary" />
                {currentTranscript && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    "{currentTranscript}"
                  </Typography>
                )}
              </Box>
            )}
            
            {isPlaying && (
              <Chip 
                icon={<VolumeUpIcon />} 
                label="AI Speaking..." 
                color="success" 
              />
            )}
            
            {!isRecording && !isProcessing && !isPlaying && (
              <Typography variant="body1" color="text.secondary">
                Tap the microphone to start speaking
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Paper sx={{ flexGrow: 1, p: 2, mb: 2, maxHeight: '60vh', overflow: 'auto' }}>
          {conversation.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Start Your English Conversation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Practice speaking English naturally with AI. Just speak and get instant responses!
              </Typography>
            </Box>
          ) : (
            <List>
              {conversation.map((message, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    px: 0
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f3e5f5',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1">
                      {message.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.role === 'user' ? 'You' : 'AI'} • {new Date(message.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* Recording Controls */}
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isPlaying}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: isRecording ? '#f44336' : '#4caf50',
              '&:hover': {
                backgroundColor: isRecording ? '#d32f2f' : '#388e3c',
              },
              '&:disabled': {
                backgroundColor: '#bdbdbd',
              }
            }}
          >
            {isRecording ? <MicOffIcon sx={{ fontSize: 32 }} /> : <MicIcon sx={{ fontSize: 32 }} />}
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isRecording ? 'Tap to stop recording' : 'Tap to start speaking'}
          </Typography>
        </Paper>
      </Container>

      {/* Hidden audio element for playback */}
      <audio ref={audioElementRef} style={{ display: 'none' }} />

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Speaking; 