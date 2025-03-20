import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

// Gemini API key
const GEMINI_API_KEY = "AIzaSyB2vBt8DezWCC7FdryTDDQEHRV4wGqu6Qs";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function AIHelp() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI study assistant. How can I help you today?',
      isAI: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState('default');
  const [historyMenuAnchor, setHistoryMenuAnchor] = useState(null);
  const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('aiChatConversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Initialize with a default conversation
      const defaultConversation = {
        id: 'default',
        name: 'New Conversation',
        messages: [{
          id: 1,
          text: 'Hello! I\'m your AI study assistant. How can I help you today?',
          isAI: true,
        }],
        createdAt: new Date().toISOString()
      };
      setConversations([defaultConversation]);
      localStorage.setItem('aiChatConversations', JSON.stringify([defaultConversation]));
    }
  }, []);

  // Load current conversation
  useEffect(() => {
    if (conversations.length > 0) {
      const currentConversation = conversations.find(conv => conv.id === currentConversationId) || conversations[0];
      setChatHistory(currentConversation.messages);
      setCurrentConversationId(currentConversation.id);
    }
  }, [conversations, currentConversationId]);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Function to format the response text properly
  const formatResponseText = (text) => {
    // Replace markdown bold syntax with HTML
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace markdown italic syntax with HTML
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace markdown code blocks with HTML
    formattedText = formattedText.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    
    // Replace markdown inline code with HTML
    formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Replace newlines with HTML line breaks
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  };

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
    
    // Save to current conversation
    updateConversation(updatedHistory);
    
    setMessage('');
    setLoading(true);

    try {
      // Prepare conversation context
      const previousMessages = updatedHistory
        .filter(msg => msg.id !== 1) // Skip the initial greeting
        .map(msg => msg.text);
      
      // Format the request according to Gemini API requirements
      const requestData = {
        contents: [{
          parts: [{ text: previousMessages.length > 1 ? 
            `Previous conversation: ${previousMessages.slice(0, -1).join('\n\n')}\n\nCurrent question: ${message}` : 
            message }]
        }]
      };

      // Make API request to Gemini
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
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
      const finalHistory = [...updatedHistory, aiResponse];
      setChatHistory(finalHistory);
      
      // Save to current conversation
      updateConversation(finalHistory);
      
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      
      // Add error message to chat
      const errorResponse = {
        id: Date.now(),
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isAI: true,
        error: true,
        timestamp: new Date().toISOString()
      };
      
      const finalHistory = [...updatedHistory, errorResponse];
      setChatHistory(finalHistory);
      
      // Save to current conversation
      updateConversation(finalHistory);
      
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = (messages) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        // Update conversation name based on first user message if it's still the default name
        let name = conv.name;
        if (name === 'New Conversation' && messages.find(m => !m.isAI)) {
          const firstUserMessage = messages.find(m => !m.isAI);
          name = firstUserMessage.text.substring(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
        }
        
        return {
          ...conv,
          messages: messages,
          name: name,
          updatedAt: new Date().toISOString()
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    localStorage.setItem('aiChatConversations', JSON.stringify(updatedConversations));
  };

  const handleNewConversation = () => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      name: 'New Conversation',
      messages: [{
        id: 1,
        text: 'Hello! I\'m your AI study assistant. How can I help you today?',
        isAI: true,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
    localStorage.setItem('aiChatConversations', JSON.stringify(updatedConversations));
    
    // Close history menu if open
    setHistoryMenuAnchor(null);
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    setHistoryMenuAnchor(null);
  };

  const handleDeleteConversation = (conversationId) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    
    // If we're deleting the current conversation, switch to another one
    if (conversationId === currentConversationId && updatedConversations.length > 0) {
      setCurrentConversationId(updatedConversations[0].id);
    }
    
    // If we deleted the last conversation, create a new one
    if (updatedConversations.length === 0) {
      const newConversation = {
        id: `conv-${Date.now()}`,
        name: 'New Conversation',
        messages: [{
          id: 1,
          text: 'Hello! I\'m your AI study assistant. How can I help you today?',
          isAI: true,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString()
      };
      setConversations([newConversation]);
      setCurrentConversationId(newConversation.id);
      localStorage.setItem('aiChatConversations', JSON.stringify([newConversation]));
    } else {
      setConversations(updatedConversations);
      localStorage.setItem('aiChatConversations', JSON.stringify(updatedConversations));
    }
    
    setHistoryMenuAnchor(null);
  };

  const handleOpenContextMenu = (event, messageId) => {
    setContextMenuAnchor(event.currentTarget);
    setSelectedMessageId(messageId);
  };

  const handleCloseContextMenu = () => {
    setContextMenuAnchor(null);
    setSelectedMessageId(null);
  };

  const handleCopyMessage = () => {
    const message = chatHistory.find(msg => msg.id === selectedMessageId);
    if (message) {
      navigator.clipboard.writeText(message.text);
      setSnackbarMessage('Message copied to clipboard');
      setSnackbarOpen(true);
    }
    handleCloseContextMenu();
  };

  const handleDeleteMessage = () => {
    setShowDeleteDialog(true);
    handleCloseContextMenu();
  };

  const confirmDeleteMessage = () => {
    const updatedHistory = chatHistory.filter(msg => msg.id !== selectedMessageId);
    setChatHistory(updatedHistory);
    updateConversation(updatedHistory);
    setShowDeleteDialog(false);
  };

  const getCurrentConversationName = () => {
    const currentConversation = conversations.find(conv => conv.id === currentConversationId);
    return currentConversation ? currentConversation.name : 'Conversation';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        height: '100vh', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            display: 'inline-block'
          }}>
            AI Study Assistant
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Get instant help with your NEET preparation
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<SmartToyIcon />}
            onClick={handleNewConversation}
            sx={{
              borderRadius: 2,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px'
              }
            }}
          >
            New Chat
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={(e) => setHistoryMenuAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px'
              }
            }}
          >
            History
          </Button>
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          height: 'calc(100vh - 120px)',
          maxHeight: 'calc(100vh - 120px)',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider', 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, #1976d2, #2196F3)'
        }}>
          <Typography variant="h6" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            fontWeight: 500
          }}>
            <SmartToyIcon fontSize="small" />
            {getCurrentConversationName()}
          </Typography>
          <Chip 
            icon={<SmartToyIcon sx={{ color: 'white !important' }} />} 
            label="Gemini AI" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              backdropFilter: 'blur(10px)',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }} 
          />
        </Box>
        
        <List sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          height: 'calc(100% - 130px)',
          maxHeight: 'calc(100% - 130px)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '10px',
            '&:hover': {
              background: 'rgba(0,0,0,0.2)',
            },
          },
        }} ref={listRef}>
          {chatHistory.map((msg) => (
            <ListItem 
              key={msg.id} 
              sx={{ 
                flexDirection: msg.isAI ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
                mb: 2,
                position: 'relative'
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                handleOpenContextMenu(e, msg.id);
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: msg.isAI 
                      ? (msg.error ? 'error.main' : 'primary.main') 
                      : 'secondary.main',
                    boxShadow: 1
                  }}
                >
                  {msg.isAI ? <SmartToyIcon /> : 'U'}
                </Avatar>
              </ListItemAvatar>
              <Box 
                sx={{ 
                  position: 'relative',
                  maxWidth: { xs: '85%', sm: '75%', md: '65%' },
                  '&:hover .message-actions': {
                    opacity: 1
                  }
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: msg.isAI ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    bgcolor: msg.isAI 
                      ? (msg.error ? 'error.light' : 'grey.100') 
                      : 'primary.light',
                    color: msg.isAI ? 'text.primary' : 'white',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                    },
                    '& code': {
                      backgroundColor: msg.isAI ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.2)',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    },
                    '& pre': {
                      backgroundColor: msg.isAI ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxWidth: '100%'
                    }
                  }}
                >
                  {msg.isAI ? (
                    <Typography 
                      variant="body1" 
                      component="div"
                      dangerouslySetInnerHTML={{ 
                        __html: formatResponseText(msg.text) 
                      }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {msg.text}
                    </Typography>
                  )}
                </Paper>
                <Box 
                  className="message-actions"
                  sx={{ 
                    position: 'absolute', 
                    top: 5, 
                    right: msg.isAI ? -40 : 'auto',
                    left: msg.isAI ? 'auto' : -40,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <IconButton 
                    size="small" 
                    sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                    onClick={(e) => handleOpenContextMenu(e, msg.id)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                {msg.timestamp && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5, 
                      color: 'text.secondary',
                      textAlign: msg.isAI ? 'left' : 'right'
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                )}
              </Box>
            </ListItem>
          ))}
          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              my: 2,
              flexDirection: 'column',
              gap: 1
            }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress 
                  size={40} 
                  thickness={4} 
                  sx={{ 
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }} 
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                Thinking...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
        
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider', 
          bgcolor: 'background.paper',
          width: '100%',
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            width: '100%',
            alignItems: 'flex-end'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover, &.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              sx={{ 
                borderRadius: 3,
                minWidth: '100px',
                height: '56px',
                boxShadow: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* History Menu */}
      <Menu
        anchorEl={historyMenuAnchor}
        open={Boolean(historyMenuAnchor)}
        onClose={() => setHistoryMenuAnchor(null)}
        PaperProps={{
          sx: { width: 320, maxHeight: 500, maxWidth: '90vw' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Conversation History</Typography>
        </Box>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {conversations.length === 0 ? (
            <MenuItem disabled>No conversations found</MenuItem>
          ) : (
            conversations.map((conv) => (
              <MenuItem 
                key={conv.id}
                selected={conv.id === currentConversationId}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 1.5
                }}
              >
                <Box 
                  onClick={() => handleSelectConversation(conv.id)}
                  sx={{ 
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Typography variant="body1" noWrap>{conv.name}</Typography>
                  <Typography variant="caption" color="textSecondary" noWrap>
                    {new Date(conv.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  sx={{ visibility: conversations.length > 1 ? 'visible' : 'hidden' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>

      {/* Message Context Menu */}
      <Menu
        anchorEl={contextMenuAnchor}
        open={Boolean(contextMenuAnchor)}
        onClose={handleCloseContextMenu}
        PaperProps={{
          sx: { minWidth: 150 }
        }}
      >
        <MenuItem onClick={handleCopyMessage}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copy
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteMessage} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      />
    </motion.div>
  );
}

export default AIHelp; 