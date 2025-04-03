import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Paper,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// API Key
const ZERRETA_API_KEY = "AIzaSyB2vBt8DezWCC7FdryTDDQEHRV4wGqu6Qs";
const ZERRETA_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 'calc(100vh - 64px)', // Ensure minimum height
  width: '100%',
  overflow: 'hidden',
  backgroundColor: '#efefef',
  position: 'relative',
  zIndex: 1 // Ensure proper stacking context
}));

const Header = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2),
  backgroundColor: '#7445f8',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 5
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0, // This is important for flex child to scroll
  marginBottom: 60 // Add space for the input container
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  backgroundColor: '#fff',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  zIndex: 10,
  height: 60,
  [theme.breakpoints.down('sm')]: {
    height: 56
  }
}));

const MessageBubble = styled(Paper)(({ theme, isai }) => ({
  padding: theme.spacing(2),
  borderRadius: 16,
  backgroundColor: isai === 'true' ? '#ffffff' : '#EFE7FF',
  border: isai === 'true' ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
  maxWidth: '85%',
  alignSelf: isai === 'true' ? 'flex-start' : 'flex-end',
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word'
}));

const CircleAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%'
}));

// Add an error boundary class at the top of the file
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AI Help Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong with the AI assistant
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Error: {this.state.error?.message || 'Unknown error'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              sessionStorage.removeItem('aiChatQuestion');
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload AI Assistant
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

function AIHelp() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your Zerreta study assistant. How can I help you today?',
      isAI: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Check for question from TestResults component on mount
  useEffect(() => {
    const checkForQuestionFromResults = () => {
      try {
        const storedQuestion = sessionStorage.getItem('aiChatQuestion');
        if (storedQuestion) {
          // Parse the stored question
          const questionData = JSON.parse(storedQuestion);
          
          // Format a comprehensive question for the AI
          let formattedQuestion = `I don't understand this question and need help:\n\n`;
          formattedQuestion += `Question: ${questionData.questionText}\n\n`;
          formattedQuestion += `Options:\n`;
          if (questionData.options && Array.isArray(questionData.options)) {
            questionData.options.forEach((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              formattedQuestion += `${optionLetter}. ${option}\n`;
            });
          }
          
          formattedQuestion += `\nCorrect Answer: ${questionData.correctOption}\n`;
          formattedQuestion += `My Answer: ${questionData.selectedOption || 'Not answered'}\n\n`;
          formattedQuestion += `Explanation provided: ${questionData.explanation}\n\n`;
          formattedQuestion += `Can you explain this in a simpler way and help me understand the concept better?`;
          
          // Add the user message to chat history immediately
          const userMessage = {
            id: Date.now(),
            text: formattedQuestion,
            isAI: false,
            timestamp: new Date().toISOString()
          };

          // Update chat history with user message
          const updatedHistory = [...chatHistory, userMessage];
          setChatHistory(updatedHistory);
          
          // Clear the stored question to prevent it from being used again on refresh
          sessionStorage.removeItem('aiChatQuestion');
          
          // Set loading state
          setLoading(true);

          // Call Zerreta API with error handling
          axios.post(
            `${ZERRETA_API_URL}?key=${ZERRETA_API_KEY}`,
            {
              contents: updatedHistory.map(msg => ({
                role: msg.isAI ? "model" : "user",
                parts: [{ text: msg.text }]
              }))
            }
          )
          .then(response => {
            if (response.data && 
                response.data.candidates && 
                response.data.candidates[0] && 
                response.data.candidates[0].content && 
                response.data.candidates[0].content.parts && 
                response.data.candidates[0].content.parts[0]) {
              
              // Extract the response text
              const responseText = response.data.candidates[0].content.parts[0].text;
              
              // Create AI response message
              const aiResponse = {
                id: Date.now(),
                text: responseText,
                isAI: true,
                timestamp: new Date().toISOString()
              };

              // Update chat history with AI response
              setChatHistory([...updatedHistory, aiResponse]);
            } else {
              throw new Error("Invalid API response format");
            }
          })
          .catch(err => {
            console.error("Error calling Zerreta API:", err);
            
            // Add detailed error message to chat
            const errorResponse = {
              id: Date.now(),
              text: `Sorry, I encountered an error while processing your request: ${err.message || 'Unknown error'}. Please try again or refresh the page.`,
              isAI: true,
              error: true,
              timestamp: new Date().toISOString()
            };
            
            setChatHistory([...updatedHistory, errorResponse]);
          })
          .finally(() => {
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error processing stored question:", error);
        // Add a UI error message
        setChatHistory(prev => [
          ...prev, 
          {
            id: Date.now(),
            text: `Sorry, there was an error processing your question: ${error.message}. Please try asking again.`,
            isAI: true,
            error: true,
            timestamp: new Date().toISOString()
          }
        ]);
        setLoading(false);
      }
    };

    checkForQuestionFromResults();
  }, [chatHistory]); // Add chatHistory as dependency

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isAI: false,
      timestamp: new Date().toISOString()
    };

    // Update chat history with user message
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    
    setMessage('');
    setLoading(true);

    try {
      // Prepare conversation history for context
      const conversationMessages = updatedHistory.map(msg => ({
        role: msg.isAI ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      // Format the request with conversation history for context
      const requestData = {
        contents: conversationMessages
      };

      // Make API request to Zerreta
      const response = await axios.post(
        `${ZERRETA_API_URL}?key=${ZERRETA_API_KEY}`,
        requestData
      );

      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Create AI response message
      const aiResponse = {
        id: Date.now(),
        text: responseText,
        isAI: true,
        timestamp: new Date().toISOString()
      };

      // Update chat history with AI response
      setChatHistory([...updatedHistory, aiResponse]);
      
    } catch (err) {
      console.error("Error calling Zerreta API:", err);
      
      // Add error message to chat
      const errorResponse = {
        id: Date.now(),
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isAI: true,
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory([...updatedHistory, errorResponse]);
    } finally {
      setLoading(false);
      // Focus the input field after sending a message
      inputRef.current?.focus();
    }
  };

  // Function to start a new chat
  const handleNewChat = () => {
    setChatHistory([
      {
        id: Date.now(),
        text: 'Hello! I\'m your Zerreta study assistant. How can I help you today?',
        isAI: true,
        timestamp: new Date().toISOString()
      }
    ]);
    setMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <ErrorBoundary>
      <PageContainer>
        <Header>
          <Typography variant="h6" fontWeight="bold">
            Zerreta AI
          </Typography>
          <Tooltip title="New Chat">
            <IconButton
              onClick={handleNewChat}
              size="small"
              sx={{
                ml: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                width: 28,
                height: 28
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Header>
        
        <ChatArea>
          {chatHistory.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isAI ? 'flex-start' : 'flex-end',
                mb: 3
              }}
            >
              <MessageBubble isai={msg.isAI ? 'true' : 'false'}>
                <Box sx={{ '& p': { m: 0 }, '& pre': { my: 1, maxWidth: '100%', overflow: 'auto' } }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </Box>
              </MessageBubble>
            </Box>
          ))}
          
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2, color: '#7445f8' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Thinking...
              </Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} style={{ height: 20 }} />
        </ChatArea>
        
        <InputContainer>
          <TextField
            fullWidth
            placeholder="Type a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            variant="outlined"
            inputRef={inputRef}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                backgroundColor: '#f5f5f5',
                fontSize: isMobile ? '0.875rem' : 'inherit'
              },
              '& .MuiOutlinedInput-input': {
                padding: isMobile ? '10px 14px' : undefined
              }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!message.trim() || loading}
            sx={{ 
              ml: 1,
              bgcolor: message.trim() ? '#7445f8' : 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: message.trim() ? '#6333e4' : 'rgba(0, 0, 0, 0.1)',
              },
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40
            }}
          >
            <SendIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </InputContainer>
      </PageContainer>
    </ErrorBoundary>
  );
}

export default AIHelp;