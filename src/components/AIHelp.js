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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
  wordBreak: 'break-word',
  '& ol, & ul': {
    paddingInlineStart: '25px',
    margin: theme.spacing(1, 0)
  }
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

// Add Base64 encoding function for image processing
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

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
  
  // Update the state variables for the new image upload approach
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Add mind map related state variables
  const [showMindMapDialog, setShowMindMapDialog] = useState(false);
  const [mindMapTopic, setMindMapTopic] = useState('');
  const [mindMapComplexity, setMindMapComplexity] = useState(3);
  const [generatingMindMap, setGeneratingMindMap] = useState(false);
  const [mindMapData, setMindMapData] = useState(null);
  const [showMindMapResult, setShowMindMapResult] = useState(false);

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

  // Update the handleFileSelect function to immediately display the image in the input
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.type;
    if (!fileType.includes('image')) {
      alert('Please upload an image file (jpg, png, etc.)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please upload a smaller image.');
      return;
    }
    
    try {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(imageUrl);
      // Focus the input field after adding the image
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    }
  };
  
  // Add a function to remove the image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Focus the input field after removing the image
    inputRef.current?.focus();
  };

  // Add trigger for file input
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Update the mind map regex pattern to be more inclusive
  const mindMapRegex = /(?:create|make|generate|show|display|draw|give me|need|want|neet)\s+(?:a|an)?\s*(?:mind\s*map|concept\s*map|visual\s*map|diagram|outline|overview)?\s*(?:for|about|on|of)?\s*(?:chemistry|physics|biology|math|science|.+?)(?:\s+(?:with|complexity|level)\s+(\d))?$/i;

  // Update handleSendMessage to handle both text and image
  const handleSendMessage = async () => {
    // Check if there's either text or an image to send
    if (!message.trim() && !imageFile) return;

    // Special case for NEET subjects
    const neetSubjectMatch = message.trim().match(/\b(neet)\s+(chemistry|physics|biology)\b/i);
    
    // Check if user is requesting a mind map in their message
    const mindMapMatch = message.trim().match(mindMapRegex);
    
    if ((mindMapMatch || neetSubjectMatch) && !imageFile) {
      // Extract topic from the match
      let topic;
      let complexity = 3;
      
      if (neetSubjectMatch) {
        // If it's a NEET subject request
        topic = `NEET ${neetSubjectMatch[2]}`;
      } else if (mindMapMatch) {
        // Normal mind map request
        topic = mindMapMatch[1].trim();
        complexity = mindMapMatch[2] ? parseInt(mindMapMatch[2]) : 3;
      }
      
      // Create user message
      const userMessage = {
        id: Date.now(),
        text: message,
        isAI: false,
        timestamp: new Date().toISOString()
      };
      
      // Update chat history with user message
      setChatHistory(prev => [...prev, userMessage]);
      
      // Clear input
      setMessage('');
      
      // Generate the mind map
      generateMindMapFromChat(topic, complexity);
      return;
    }

    // Regular message handling (existing code)
    // Create user message
    let userMessage = {
      id: Date.now(),
      text: message,
      isAI: false,
      timestamp: new Date().toISOString()
    };

    // Add image if available
    if (imageFile) {
      const base64Image = await toBase64(imageFile);
      userMessage = {
        ...userMessage,
        hasImage: true,
        imageData: base64Image
      };
    }

    // Update chat history with user message
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    
    // Clear input
    setMessage('');
    setImageFile(null);
    setImagePreview(null);
    
    setLoading(true);

    try {
      if (imageFile) {
        // Handle message with image
        const base64Image = userMessage.imageData;
        
        // Prepare the API request with image and text
        const requestData = {
          contents: [
            {
              role: "user",
              parts: [
                // Include user text if available
                ...(message.trim() ? [{ text: message }] : []),
                // Always include the image
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image.split(',')[1] // Remove data URL prefix
                  }
                }
              ]
            }
          ]
        };
        
        // Make API request to Zerreta
        const response = await axios.post(
          `${ZERRETA_API_URL}?key=${ZERRETA_API_KEY}`,
          requestData
        );
        
        // Extract the response text
        const responseText = response.data.candidates[0].content.parts[0].text;
        
        // Add AI response message
        const aiResponse = {
          id: Date.now(),
          text: responseText,
          isAI: true,
          timestamp: new Date().toISOString()
        };
        
        // Update chat history with AI response
        setChatHistory([...updatedHistory, aiResponse]);
      } else {
        // Handle text-only message (existing logic)
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
      }
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

  // Add new function to generate mind map from chat request
  const generateMindMapFromChat = async (topic, complexity) => {
    if (!topic) return;
    
    // Show loading indicator
    setLoading(true);
    
    try {
      const promptText = `Create a detailed mind map for the topic "${topic}" with complexity level ${complexity} out of 5. 
      Format the mind map as a JSON structure with nodes and connections where:
      1. Each node has an "id", "label" (short text), and "data" (detailed explanation)
      2. The root node should have id "root"
      3. Each connection has "source" (parent node id) and "target" (child node id)
      4. Include ${complexity <= 2 ? '5-8' : complexity === 3 ? '8-12' : '12-20'} main branches
      5. For complexity levels 4-5, include sub-branches and detailed explanations
      
      The response should ONLY contain valid JSON without any explanatory text, following this exact structure:
      {
        "nodes": [
          { "id": "root", "label": "Topic Name", "data": { "description": "Main topic description" } },
          { "id": "node1", "label": "Branch 1", "data": { "description": "Explanation of branch 1" } }
        ],
        "edges": [
          { "source": "root", "target": "node1" }
        ]
      }`;
      
      // Add AI thinking message
      const thinkingMessage = {
        id: Date.now(),
        text: `Creating a mind map for "${topic}"...`,
        isAI: true,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, thinkingMessage]);
      
      // Make API request to Zerreta for mind map data
      const response = await axios.post(
        `${ZERRETA_API_URL}?key=${ZERRETA_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }]
            }
          ]
        }
      );
      
      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      
      // Find the JSON part in the response
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseText.match(/\{[\s\S]*"nodes"[\s\S]*"edges"[\s\S]*\}/);
      
      let parsedData;
      if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        try {
          // Try to parse the entire response as JSON
          parsedData = JSON.parse(responseText);
        } catch (e) {
          throw new Error("Could not parse mind map data");
        }
      }
      
      if (!parsedData.nodes || !parsedData.edges) {
        throw new Error("Invalid mind map data format");
      }
      
      // Set the mind map data
      setMindMapData(parsedData);
      setMindMapTopic(topic);
      
      // Replace thinking message with completed message
      setChatHistory(prev => {
        const newHistory = [...prev];
        // Remove the thinking message
        const thinkingIndex = newHistory.findIndex(msg => msg.id === thinkingMessage.id);
        if (thinkingIndex !== -1) {
          newHistory.splice(thinkingIndex, 1);
        }
        
        // Add the AI response with mind map
        return [
          ...newHistory,
          {
            id: Date.now(),
            text: `Here's your mind map for "${topic}".\n\nThe mind map includes ${parsedData.nodes.length} concepts and ${parsedData.edges.length} connections. You can view the full interactive mind map by clicking the "View Mind Map" button below, or continue our conversation about this topic.`,
            isAI: true,
            hasMindMap: true,
            mindMapData: parsedData,
            mindMapTopic: topic,
            timestamp: new Date().toISOString()
          }
        ];
      });
      
    } catch (err) {
      console.error("Error generating mind map:", err);
      
      // Replace thinking message with error
      setChatHistory(prev => {
        const newHistory = [...prev];
        const thinkingIndex = newHistory.findIndex(msg => msg.id === Date.now());
        if (thinkingIndex !== -1) {
          newHistory.splice(thinkingIndex, 1);
        }
        
        return [
          ...newHistory,
          {
            id: Date.now(),
            text: "Sorry, I encountered an error while creating your mind map. Please try again with a simpler topic or check your connection.",
            isAI: true,
            error: true,
            timestamp: new Date().toISOString()
          }
        ];
      });
    } finally {
      setLoading(false);
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

  // Function to handle opening mind map dialog
  const handleOpenMindMapDialog = () => {
    setShowMindMapDialog(true);
  };

  // Function to handle closing mind map dialog
  const handleCloseMindMapDialog = () => {
    setShowMindMapDialog(false);
  };

  // Function to view mind map
  const handleViewMindMap = (data, topic) => {
    setMindMapData(data);
    setMindMapTopic(topic);
    setShowMindMapResult(true);
  };

  // Update the handleDownloadMindMap function to create a PDF
  const handleDownloadMindMap = () => {
    try {
      const mindMapElement = document.getElementById('mind-map-container');
      if (!mindMapElement) return;
      
      // Show a loading message
      const loadingMessage = document.createElement('div');
      loadingMessage.style.position = 'absolute';
      loadingMessage.style.top = '50%';
      loadingMessage.style.left = '50%';
      loadingMessage.style.transform = 'translate(-50%, -50%)';
      loadingMessage.style.background = 'rgba(0,0,0,0.7)';
      loadingMessage.style.color = 'white';
      loadingMessage.style.padding = '10px 20px';
      loadingMessage.style.borderRadius = '5px';
      loadingMessage.style.zIndex = '9999';
      loadingMessage.textContent = 'Generating PDF...';
      document.body.appendChild(loadingMessage);
      
      // Before capturing, make sure all content is visible (no overflow)
      const mindMapScrollContainer = mindMapElement;
      const originalOverflowY = mindMapScrollContainer.style.overflowY;
      const originalOverflowX = mindMapScrollContainer.style.overflowX;
      const originalHeight = mindMapScrollContainer.style.height;
      
      // Temporarily change the styling to ensure all content is visible
      mindMapScrollContainer.style.overflowY = 'visible';
      mindMapScrollContainer.style.overflowX = 'visible';
      mindMapScrollContainer.style.height = 'auto';
      
      // Get the inner container that holds the actual mind map
      const hierarchyMindMap = mindMapElement.querySelector('.hierarchy-mind-map');
      if (!hierarchyMindMap) {
        document.body.removeChild(loadingMessage);
        alert('Could not find mind map content to export.');
        return;
      }
      
      // Force re-rendering of connections if not already done
      if (!hierarchyMindMap.classList.contains('connections-drawn')) {
        // This will trigger the connection drawing script again
        const event = new Event('resize');
        window.dispatchEvent(event);
        
        // Wait a bit to ensure connections are drawn
        setTimeout(() => {
          captureAndCreatePDF(hierarchyMindMap, mindMapScrollContainer, loadingMessage, originalOverflowY, originalOverflowX, originalHeight);
        }, 1000);
      } else {
        captureAndCreatePDF(hierarchyMindMap, mindMapScrollContainer, loadingMessage, originalOverflowY, originalOverflowX, originalHeight);
      }
    } catch (err) {
      console.error("Error downloading mind map:", err);
      alert("Failed to download mind map. Please try again.");
    }
  };

  // Helper function to capture the mind map and create a PDF
  function captureAndCreatePDF(hierarchyMindMap, mindMapScrollContainer, loadingMessage, originalOverflowY, originalOverflowX, originalHeight) {
    // Calculate the dimensions of the actual mind map content
    const mapRect = hierarchyMindMap.getBoundingClientRect();
    const padding = 20; // Add some padding around the content
    
    // Aggressively ensure leaf nodes don't have connectors
    const leafNodes = hierarchyMindMap.querySelectorAll('.leaf-node, .node-content:not(.has-children)');
    leafNodes.forEach(node => {
      node.classList.add('leaf-node');
      node.classList.add('force-no-connector');
      node.style.setProperty('--show-connector', 'none', 'important');
      
      // Add inline style to really force it
      node.setAttribute('style', node.getAttribute('style') + '; --show-connector: none !important');
      
      // Try to remove the ::after pseudo-element completely with a style tag
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        #${node.id}::after {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
        }
      `;
      document.head.appendChild(styleTag);
    });
    
    // Use html2canvas to convert the mind map to an image with proper dimensions
    html2canvas(hierarchyMindMap, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: mapRect.width + (padding * 2),
      height: mapRect.height + (padding * 2),
      // Important: Make sure to render the SVG connections
      onclone: (clonedDoc) => {
        // Find the SVG in the cloned document
        const svgElement = clonedDoc.querySelector('.connections-svg');
        if (svgElement) {
          // Ensure SVG is set to be visible
          svgElement.style.position = 'absolute';
          svgElement.style.width = '100%';
          svgElement.style.height = '100%';
          svgElement.style.zIndex = '0';
        }
        
        // Ensure all nodes are visible in the cloned document
        const nodeContainers = clonedDoc.querySelectorAll('.node-container');
        nodeContainers.forEach(container => {
          container.style.visibility = 'visible';
          container.style.display = 'flex';
        });
        
        // Super-aggressively remove connectors from leaf nodes in cloned document
        const leafNodes = clonedDoc.querySelectorAll('.leaf-node, .node-content:not(.has-children)');
        leafNodes.forEach(node => {
          // Add an inline style to ensure no connector
          node.style.setProperty('--show-connector', 'none', 'important');
          
          // Add a separate style tag for each node to override all
          const style = document.createElement('style');
          style.textContent = `
            #${node.id}::after {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
              height: 0 !important;
              width: 0 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        });
        
        // Add a global style for ALL leaf nodes
        const globalStyle = document.createElement('style');
        globalStyle.textContent = `
          .leaf-node::after, .force-no-connector::after, .node-content:not(.has-children)::after {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
          }
        `;
        clonedDoc.head.appendChild(globalStyle);
      }
    }).then(canvas => {
      try {
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate PDF dimensions based on the canvas
        // Use A4 as a reference, but adjust based on content ratio
        let pdfWidth = 210; // A4 width in mm
        let pdfHeight = 297; // A4 height in mm
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        if (ratio > 1) {
          // Landscape orientation
          pdfWidth = 297;
          pdfHeight = 210;
        }
        
        // Create PDF with proper orientation
        const orientation = ratio > 1 ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });
        
        // Calculate image dimensions to fit in PDF
        const margin = 10; // mm
        const usableWidth = pdfWidth - (margin * 2);
        const usableHeight = pdfHeight - (margin * 2);
        
        let finalImgWidth, finalImgHeight;
        if (imgWidth / usableWidth > imgHeight / usableHeight) {
          // Width is the limiting factor
          finalImgWidth = usableWidth;
          finalImgHeight = imgHeight * (usableWidth / imgWidth);
        } else {
          // Height is the limiting factor
          finalImgHeight = usableHeight;
          finalImgWidth = imgWidth * (usableHeight / imgHeight);
        }
        
        // Add title
        pdf.setFontSize(16);
        pdf.setTextColor(116, 69, 248); // #7445f8
        pdf.text(`Mind Map: ${mindMapTopic}`, pdfWidth / 2, margin, { align: 'center' });
        
        // Add image
        pdf.addImage(
          imgData, 
          'PNG', 
          (pdfWidth - finalImgWidth) / 2, 
          margin + 10, // Add space below title
          finalImgWidth, 
          finalImgHeight
        );
        
        // Add footer with date
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const today = new Date().toLocaleDateString();
        pdf.text(`Generated on ${today} by Zerreta Learning`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });
        
        // Save the PDF
        pdf.save(`mind_map_${mindMapTopic.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        
        // Clean up loading message
        document.body.removeChild(loadingMessage);
      } catch (err) {
        console.error('Error generating PDF:', err);
        document.body.removeChild(loadingMessage);
        alert('Failed to generate PDF. Please try again.');
      }
    }).catch(err => {
      console.error('Error rendering mind map to image:', err);
      document.body.removeChild(loadingMessage);
      alert('Failed to render mind map. Please try again.');
    }).finally(() => {
      // Restore the original styles
      mindMapScrollContainer.style.overflowY = originalOverflowY;
      mindMapScrollContainer.style.overflowX = originalOverflowX;
      mindMapScrollContainer.style.height = originalHeight;
    });
  }

  // Update the mind map visualization to create a better hierarchical layout
  const generateMindMapHtml = (data) => {
    if (!data || !data.nodes || !data.edges) return null;
    
    const rootNode = data.nodes.find(node => node.id === "root") || data.nodes[0];
    
    // Create a map of parent to children
    const childrenMap = {};
    data.edges.forEach(edge => {
      if (!childrenMap[edge.source]) {
        childrenMap[edge.source] = [];
      }
      childrenMap[edge.source].push(edge.target);
    });
    
    // Create a map to track node depths
    const nodeDepths = {};
    
    // Function to calculate node depths
    const calculateDepths = (nodeId, depth = 0) => {
      nodeDepths[nodeId] = depth;
      (childrenMap[nodeId] || []).forEach(childId => {
        calculateDepths(childId, depth + 1);
      });
    };
    
    // Calculate depths starting from root
    calculateDepths(rootNode.id);
    
    // Group nodes by level
    const nodesByLevel = {};
    Object.keys(nodeDepths).forEach(nodeId => {
      const depth = nodeDepths[nodeId];
      if (!nodesByLevel[depth]) {
        nodesByLevel[depth] = [];
      }
      nodesByLevel[depth].push(nodeId);
    });
    
    // Pre-identify leaf nodes (nodes with no children)
    const leafNodes = new Set();
    data.nodes.forEach(node => {
      if (!childrenMap[node.id] || childrenMap[node.id].length === 0) {
        leafNodes.add(node.id);
      }
    });
    
    // Generate the hierarchical mind map HTML
    let result = `
      <div class="hierarchy-mind-map">
        <div class="root-level">
          <div class="node-container root-node">
            <div class="node-content root ${leafNodes.has(rootNode.id) ? 'leaf-node' : ''}" id="node-${rootNode.id}">
              <span class="node-label">${rootNode.label}</span>
              <div class="node-description">${rootNode.data?.description || ''}</div>
            </div>
          </div>
        </div>
    `;
    
    // Color palette for levels
    const colors = [
      '#7445f8', // Main topic (purple - brand color)
      '#4285F4', // Level 1 (blue)
      '#0F9D58', // Level 2 (green)
      '#F4B400', // Level 3 (yellow)
      '#DB4437', // Level 4 (red)
      '#4527A0'  // Level 5 (deep purple)
    ];
    
    // Generate HTML for each level
    const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number));
    for (let level = 1; level <= maxLevel; level++) {
      const nodesInLevel = nodesByLevel[level] || [];
      if (nodesInLevel.length === 0) continue;
      
      result += `<div class="level level-${level}">`;
      
      // For each node in this level
      nodesInLevel.forEach(nodeId => {
        const node = data.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        // Find parent node
        const parentEdge = data.edges.find(edge => edge.target === nodeId);
        const parentId = parentEdge ? parentEdge.source : null;
        
        const isLeafNode = leafNodes.has(nodeId);
        
        result += `
          <div class="node-container" data-parent="${parentId}">
            <div class="node-content ${isLeafNode ? 'leaf-node' : 'has-children'}" 
              id="node-${nodeId}"
              style="
                border-color: ${colors[Math.min(level, colors.length - 1)]};
                background-color: ${colors[Math.min(level, colors.length - 1)] + '15'};
              "
            >
              <span class="node-label" style="color: ${colors[Math.min(level, colors.length - 1)]}">
                ${node.label}
              </span>
              <div class="node-description">
                ${node.data?.description || ''}
              </div>
            </div>
          </div>
        `;
      });
      
      result += `</div>`;
    }
    
    result += `</div>`;
    
    // Add inline CSS to ensure leaf nodes NEVER show connectors
    result += `
      <style>
        .leaf-node::after {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      </style>
    `;
    
    // Updated JavaScript code for drawing connection lines
    result += `
      <script>
        (function() {
          // Wait longer for DOM to be fully ready
          setTimeout(function() {
            // Function to draw connection lines
            function drawConnections() {
              try {
                const nodeContainers = document.querySelectorAll('.node-container[data-parent]');
                const container = document.querySelector('.hierarchy-mind-map');
                
                if (!container) {
                  console.error('Mind map container not found');
                  return;
                }
                
                // Make SVG cover the entire content
                const svg = document.querySelector('.connections-svg');
                if (!svg) {
                  console.error('SVG element not found');
                  return;
                }
                
                svg.style.position = 'absolute';
                svg.style.top = '0';
                svg.style.left = '0';
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.pointerEvents = 'none';
                svg.style.zIndex = '0';
                
                // Get container dimensions and position
                const containerRect = container.getBoundingClientRect();
                
                // Process each node with parent
                nodeContainers.forEach(container => {
                  const parentId = container.getAttribute('data-parent');
                  if (!parentId) return;
                  
                  const childNode = container.querySelector('.node-content');
                  const parentNode = document.getElementById('node-' + parentId);
                  
                  if (!childNode || !parentNode) {
                    console.warn('Child or parent node not found', { parentId, childId: container.querySelector('.node-content')?.id });
                    return;
                  }
                  
                  // Get positions
                  const parentRect = parentNode.getBoundingClientRect();
                  const childRect = childNode.getBoundingClientRect();
                  
                  // Calculate positions relative to SVG with direct connections to node borders
                  const parentX = parentRect.left + parentRect.width / 2 - containerRect.left;
                  const parentY = parentRect.bottom - containerRect.top; // Bottom of parent
                  
                  const childX = childRect.left + childRect.width / 2 - containerRect.left;
                  const childY = childRect.top - containerRect.top; // Top of child
                  
                  // Draw a path with direct line to ensure connection
                  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  
                  // Modify control points for more direct connection
                  const deltaY = childY - parentY;
                  const midY = parentY + (deltaY * 0.5);
                  
                  // Draw a cubic bezier curve with more direct path
                  const pathData = \`M\${parentX},\${parentY} C\${parentX},\${midY} \${childX},\${midY} \${childX},\${childY}\`;
                  
                  path.setAttribute('d', pathData);
                  path.setAttribute('stroke', '#7445f8');
                  path.setAttribute('stroke-width', '2');
                  path.setAttribute('fill', 'none');
                  path.setAttribute('stroke-opacity', '1'); // Fully opaque for visibility
                  
                  // Add path to SVG
                  svg.appendChild(path);
                });
                
                // Add a class to mark as processed
                container.classList.add('connections-drawn');
                
                // Force leaf nodes to NOT have connectors
                document.querySelectorAll('.leaf-node').forEach(node => {
                  node.style.setProperty('--show-connector', 'none', 'important');
                  node.classList.add('force-no-connector');
                });
              } catch (err) {
                console.error('Error drawing mind map connections:', err);
              }
            }
            
            // Create SVG element for connections
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('connections-svg');
            
            // Add SVG to container
            const container = document.querySelector('.hierarchy-mind-map');
            if (container) {
              container.style.position = 'relative';
              container.insertBefore(svg, container.firstChild);
              
              // Draw connections
              drawConnections();
              
              // Redraw on window resize
              window.addEventListener('resize', function() {
                // Clear previous connections
                while (svg.firstChild) {
                  svg.removeChild(svg.firstChild);
                }
                
                // Redraw connections
                drawConnections();
              });
            }
          }, 1200); // Increased timeout to ensure DOM is fully rendered
        })();
      </script>
    `;
    
    return result;
  };

  // Add handleGenerateMindMap function for use with the dialog
  const handleGenerateMindMap = async () => {
    if (!mindMapTopic.trim()) return;
    
    setGeneratingMindMap(true);
    
    try {
      // Close the input dialog and show the mind map
      setShowMindMapDialog(false);
      
      // Generate the mind map with the topic and complexity from the dialog
      await generateMindMapFromChat(mindMapTopic, mindMapComplexity);
      
      // Show the mind map result
      setShowMindMapResult(true);
    } catch (err) {
      console.error("Error in handleGenerateMindMap:", err);
      setShowMindMapDialog(false);
    } finally {
      setGeneratingMindMap(false);
      setMindMapTopic('');
      setMindMapComplexity(3);
    }
  };

  return (
    <ErrorBoundary>
      <PageContainer>
        <Header>
          <Typography variant="h6" fontWeight="bold">
            Zerreta AI
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex' }}>
            <Tooltip title="Create Mind Map">
              <IconButton
                onClick={handleOpenMindMapDialog}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  width: 28,
                  height: 28
                }}
              >
                <AccountTreeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Image">
              <IconButton
                onClick={handleImageButtonClick}
                size="small"
                sx={{
                  mr: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  width: 28,
                  height: 28
                }}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="New Chat">
              <IconButton
                onClick={handleNewChat}
                size="small"
                sx={{
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
          </Box>
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
                {msg.hasImage && (
                  <Box sx={{ mb: 1, maxWidth: '100%' }}>
                    <img 
                      src={msg.imageData} 
                      alt="Uploaded content" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        objectFit: 'contain'
                      }} 
                    />
                  </Box>
                )}
                <Box sx={{ 
                  '& p': { m: 0 }, 
                  '& pre': { my: 1, maxWidth: '100%', overflow: 'auto' },
                  '& ol, & ul': { width: '100%', paddingInlineStart: '25px' }
                }}>
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
                
                {/* Add mind map view button if the message has a mind map */}
                {msg.hasMindMap && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AccountTreeIcon />}
                      onClick={() => handleViewMindMap(msg.mindMapData, msg.mindMapTopic)}
                      size="small"
                      sx={{ 
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 2,
                        py: 0.5,
                        fontSize: '0.85rem'
                      }}
                    >
                      View Mind Map
                    </Button>
                  </Box>
                )}
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
          
          {imageLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2, color: '#7445f8' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Analyzing image...
              </Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} style={{ height: 20 }} />
        </ChatArea>
        
        <InputContainer>
          {imagePreview ? (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 1,
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                height: 40
              }}
            >
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  height: '100%',
                  maxWidth: '60px',
                  objectFit: 'cover'
                }} 
              />
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)',
                  },
                  width: 20,
                  height: 20
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : null}
          <TextField
            fullWidth
            placeholder={imagePreview ? "Add a message about your image..." : "Type a question..."}
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
            onClick={handleImageButtonClick}
            sx={{ 
              ml: 1,
              bgcolor: '#f5f5f5',
              color: '#7445f8',
              '&:hover': {
                bgcolor: '#ebebeb',
              },
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40
            }}
          >
            <ImageIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <IconButton
            onClick={handleSendMessage}
            disabled={(!message.trim() && !imageFile) || loading}
            sx={{ 
              ml: 1,
              bgcolor: (message.trim() || imageFile) ? '#7445f8' : 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: (message.trim() || imageFile) ? '#6333e4' : 'rgba(0, 0, 0, 0.1)',
              },
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40
            }}
          >
            <SendIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </InputContainer>
        
        {/* Mind Map Dialog */}
        <Dialog 
          open={showMindMapDialog} 
          onClose={handleCloseMindMapDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Create a Mind Map
          </DialogTitle>
          <DialogContent>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                label="Enter a topic for your mind map"
                value={mindMapTopic}
                onChange={(e) => setMindMapTopic(e.target.value)}
                placeholder="e.g., Photosynthesis, Quantum Physics, Newton's Laws of Motion"
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Typography gutterBottom>
                Complexity Level: {mindMapComplexity}
              </Typography>
              <Slider
                value={mindMapComplexity}
                onChange={(e, newValue) => setMindMapComplexity(newValue)}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: 'Basic' },
                  { value: 3, label: 'Balanced' },
                  { value: 5, label: 'Detailed' }
                ]}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Higher complexity will include more branches and detailed explanations.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseMindMapDialog} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateMindMap} 
              variant="contained" 
              color="primary"
              disabled={!mindMapTopic.trim() || generatingMindMap}
              startIcon={generatingMindMap ? <CircularProgress size={20} color="inherit" /> : <AccountTreeIcon />}
            >
              {generatingMindMap ? 'Generating...' : 'Create Mind Map'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Mind Map Result Dialog */}
        <Dialog 
          open={showMindMapResult} 
          onClose={() => setShowMindMapResult(false)}
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: { height: '80vh' }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Mind Map: {mindMapTopic}
            </Typography>
            <Tooltip title="Download Mind Map">
              <IconButton onClick={handleDownloadMindMap} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <DialogContent sx={{ px: 1, py: 0 }}>
            <Box 
              id="mind-map-container" 
              sx={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'auto',
                '& .mind-map-wrapper': {
                  p: 2,
                  fontFamily: theme.typography.fontFamily
                },
                '& .mind-map-title': {
                  textAlign: 'center',
                  color: '#7445f8',
                  mb: 3,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                },
                // Hierarchical mind map styles
                '& .hierarchy-mind-map': {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  width: '100%',
                  minHeight: '500px',
                  padding: '30px 0',
                  position: 'relative'
                },
                '& .root-level': {
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: '70px', // Increased margin for better spacing
                  position: 'relative', // Ensure positioning context
                  zIndex: 1 // Higher z-index to appear above connections
                },
                '& .level': {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  width: '100%',
                  marginBottom: '70px', // Increased margin for better spacing
                  position: 'relative',
                  gap: '40px', // Increased gap for better spacing
                  zIndex: 1 // Higher z-index to appear above connections
                },
                '& .node-container': {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '150px',
                  maxWidth: '250px',
                  position: 'relative',
                  margin: '0 20px'
                },
                '& .node-content': {
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #7445f8',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  width: '100%',
                  margin: '0 auto',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  zIndex: 2, // Higher z-index to appear above connections
                  position: 'relative'
                },
                // Only show connector for nodes with the has-children class
                '& .node-content.has-children::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px', // Extended further to ensure connection
                  left: '50%',
                  width: '2px',
                  height: '15px',
                  backgroundColor: '#7445f8',
                  transform: 'translateX(-50%)',
                  opacity: '1',
                  zIndex: 1
                },
                // Multiple selectors to ensure leaf nodes NEVER show connector
                '& .node-content.leaf-node::after, & .force-no-connector::after, & .leaf-node::after': {
                  display: 'none !important',
                  opacity: '0 !important',
                  visibility: 'hidden !important',
                  height: '0 !important',
                  width: '0 !important'
                },
                '& .node-content.root': {
                  borderColor: '#7445f8',
                  backgroundColor: '#7445f815',
                  minWidth: '200px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                },
                '& .node-content:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)'
                },
                '& .node-label': {
                  display: 'block',
                  fontWeight: 'bold',
                  color: '#7445f8',
                  mb: 1,
                  fontSize: '1rem'
                },
                '& .root-node .node-label': {
                  fontSize: '1.2rem'
                },
                '& .node-description': {
                  fontSize: '0.85rem',
                  color: '#444',
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }
              }}
              dangerouslySetInnerHTML={{ __html: generateMindMapHtml(mindMapData) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMindMapResult(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </ErrorBoundary>
  );
}

export default AIHelp;