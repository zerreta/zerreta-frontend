import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Chip,
  Grid,
  Divider,
  Alert,
  Select,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Snackbar,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Toolbar,
  AppBar,
  Tab,
  Tabs,
  ButtonGroup
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  TableChart as TableIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatListBulleted as BulletIcon,
  FormatListNumbered as NumberedIcon,
  SmartToy as AIIcon,
  Star as StarIcon,
  EmojiEvents as BadgeIcon,
  Help as HelpIcon,
  Send as SendIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  Create as CreateIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Print as PrintIcon,
  FileCopy as CopyIcon,
  ContentCut as CutIcon,
  ContentPaste as PasteIcon,
  FormatColorText as TextColorIcon,
  FormatColorFill as HighlightIcon,
  Spellcheck as SpellcheckIcon
} from '@mui/icons-material';

const WordProcessing = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  // Document state
  const [documentTitle, setDocumentTitle] = useState('Document1');
  const [documentContent, setDocumentContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  
  // Formatting state
  const [selectedFont, setSelectedFont] = useState('Calibri');
  const [fontSize, setFontSize] = useState(11);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [textAlign, setTextAlign] = useState('left');
  const [currentTab, setCurrentTab] = useState(1); // Start on Home tab
  
  // AI Assistant state
  const [showAI, setShowAI] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  
  // Progress and gamification
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  // UI state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Font options like MS Word
  const fontOptions = [
    'Calibri', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 
    'Verdana', 'Tahoma', 'Comic Sans MS', 'Impact', 'Trebuchet MS'
  ];
  
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  
  // MS Word-like tasks
  const tasks = [
    {
      id: 'type-document',
      title: 'Start Writing',
      instruction: 'Type a paragraph about your favorite hobby (at least 50 words)',
      xpReward: 50,
      badge: 'Writer',
      checkCondition: () => wordCount >= 50
    },
    {
      id: 'format-title',
      title: 'Format Your Title',
      instruction: 'Make your title bold and increase font size to 18pt',
      xpReward: 30,
      badge: 'Formatter',
      checkCondition: () => isBold && fontSize >= 18
    },
    {
      id: 'change-font',
      title: 'Change Font Style',
      instruction: 'Change your document font to Times New Roman',
      xpReward: 25,
      badge: 'Font Master',
      checkCondition: () => selectedFont === 'Times New Roman'
    },
    {
      id: 'align-center',
      title: 'Center Alignment',
      instruction: 'Center-align your title',
      xpReward: 20,
      badge: 'Alignment Pro',
      checkCondition: () => textAlign === 'center'
    },
    {
      id: 'save-document',
      title: 'Save Your Work',
      instruction: 'Save your document with a custom name',
      xpReward: 40,
      badge: 'Document Saver',
      checkCondition: () => documentTitle !== 'Document1'
    }
  ];

  // Initialize with first task
  useEffect(() => {
    if (!currentTask && completedTasks.length === 0) {
      setCurrentTask(tasks[0]);
    }
  }, []);

  // Update word count and check tasks
  useEffect(() => {
    const text = editorRef.current ? editorRef.current.innerText || '' : '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Check task completion
    if (currentTask && currentTask.checkCondition()) {
      completeTask();
    }
  }, [documentContent, isBold, isItalic, isUnderline, textAlign, documentTitle, selectedFont, fontSize, wordCount]);

  const completeTask = () => {
    if (!currentTask) return;
    
    // Add XP and badge
    setXp(prev => prev + currentTask.xpReward);
    if (currentTask.badge && !badges.includes(currentTask.badge)) {
      setBadges(prev => [...prev, currentTask.badge]);
    }
    
    // Mark as completed
    setCompletedTasks(prev => [...prev, currentTask.id]);
    
    // Show celebration
    setCelebrationMessage(`🎉 Great job! You earned ${currentTask.xpReward} XP and the "${currentTask.badge}" badge!`);
    setShowCelebration(true);
    
    // Move to next task
    setTimeout(() => {
      moveToNextTask();
    }, 2000);
  };

  const moveToNextTask = () => {
    const currentIndex = tasks.findIndex(task => task.id === currentTask?.id);
    
    if (currentIndex < tasks.length - 1) {
      setCurrentTask(tasks[currentIndex + 1]);
    } else {
      setCurrentTask(null); // All tasks completed
      setCelebrationMessage('🎉 Congratulations! You completed all Word Processing tasks!');
      setShowCelebration(true);
    }
  };

  const handleFormatting = (type) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    
    switch (type) {
      case 'bold':
        document.execCommand('bold');
        setIsBold(!isBold);
        break;
      case 'italic':
        document.execCommand('italic');
        setIsItalic(!isItalic);
        break;
      case 'underline':
        document.execCommand('underline');
        setIsUnderline(!isUnderline);
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft');
        setTextAlign('left');
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter');
        setTextAlign('center');
        break;
      case 'alignRight':
        document.execCommand('justifyRight');
        setTextAlign('right');
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList');
        break;
      case 'numberedList':
        document.execCommand('insertOrderedList');
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'redo':
        document.execCommand('redo');
        break;
      default:
        break;
    }
    
    // Update content
    setDocumentContent(editorRef.current.innerHTML);
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('fontName', false, font);
      setDocumentContent(editorRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    if (editorRef.current) {
      editorRef.current.focus();
      // Apply font size to selected text or current position
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const span = document.createElement('span');
          span.style.fontSize = size + 'pt';
          try {
            range.surroundContents(span);
          } catch (e) {
            // If can't surround, insert at cursor
            document.execCommand('fontSize', false, '7');
            const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
            fontElements.forEach(el => {
              el.removeAttribute('size');
              el.style.fontSize = size + 'pt';
            });
          }
        }
      }
      setDocumentContent(editorRef.current.innerHTML);
    }
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([editorRef.current.innerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${documentTitle}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const insertImage = () => {
    const imageUrl = 'https://via.placeholder.com/300x200/4CAF50/white?text=Sample+Image';
    const imageHtml = `<img src="${imageUrl}" alt="Sample Image" style="max-width: 300px; margin: 10px; border: 1px solid #ddd;" />`;
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, imageHtml);
      setDocumentContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="border-collapse: collapse; margin: 10px 0; width: 100%; max-width: 400px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #000; background: #f5f5f5;">Header 1</td>
          <td style="padding: 8px; border: 1px solid #000; background: #f5f5f5;">Header 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #000;">Row 1, Cell 1</td>
          <td style="padding: 8px; border: 1px solid #000;">Row 1, Cell 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #000;">Row 2, Cell 1</td>
          <td style="padding: 8px; border: 1px solid #000;">Row 2, Cell 2</td>
        </tr>
      </table>
    `;
    
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, tableHtml);
      setDocumentContent(editorRef.current.innerHTML);
    }
  };

  const handleAIMessage = async () => {
    if (!aiMessage.trim()) return;
    
    setAiLoading(true);
    
    // Add user message to history
    const newHistory = [...aiHistory, { type: 'user', message: aiMessage }];
    setAiHistory(newHistory);
    
    // Generate AI response
    let response = "I'm here to help you with your writing! Try using the formatting buttons in the toolbar above. You can make text bold, italic, change fonts, and much more! 📝✨";
    
    if (aiMessage.toLowerCase().includes('bold')) {
      response = "To make text bold, select the text you want and click the B button in the toolbar! ✨";
    } else if (aiMessage.toLowerCase().includes('save')) {
      response = "To save your document, click the Save button in the toolbar. You can give it a custom name! 💾";
    } else if (aiMessage.toLowerCase().includes('font')) {
      response = "You can change fonts using the font dropdown in the toolbar. Try Times New Roman or Arial! 🔤";
    }
    
    // Add AI response to history
    setTimeout(() => {
      setAiHistory(prev => [...prev, { type: 'ai', message: response }]);
      setAiLoading(false);
      setAiMessage('');
    }, 1000);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f3f3f3' }}>
      {/* Modern Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <IconButton 
          onClick={() => navigate('/student-dashboard/codezy/3')} 
          sx={{ 
            color: 'white', 
            mr: 2,
            bgcolor: 'rgba(255,255,255,0.1)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <CreateIcon sx={{ fontSize: 32, mr: 1 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '20px' }}>
              Word Studio Pro
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '12px' }}>
              {documentTitle} • Auto-saved
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'rgba(255,255,255,0.15)', 
            borderRadius: 3, 
            px: 2, 
            py: 1 
          }}>
            <StarIcon sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Level {level}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {xp} XP
            </Typography>
          </Box>
          
          <Badge 
            badgeContent={badges.length} 
            color="warning"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: '#ffd700',
                color: '#000',
                fontWeight: 'bold'
              }
            }}
          >
            <Box sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)', 
              borderRadius: 2, 
              p: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              <BadgeIcon sx={{ fontSize: 20 }} />
            </Box>
          </Badge>
        </Box>
      </Box>

      {/* Modern Menu Bar */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '2px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ 
            minHeight: '48px',
            '& .MuiTab-root': { 
              minHeight: '48px', 
              fontSize: '14px', 
              fontWeight: 600,
              textTransform: 'none',
              color: '#666',
              '&.Mui-selected': {
                color: '#667eea',
                bgcolor: '#f8f9ff'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#667eea',
              height: '3px'
            }
          }}
        >
          <Tab label="📁 File" />
          <Tab label="🏠 Home" />
          <Tab label="➕ Insert" />
          <Tab label="🎨 Design" />
          <Tab label="📐 Layout" />
        </Tabs>
      </Box>

      {/* Modern Toolbar */}
      {currentTab === 1 && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e0e0e0', 
          p: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            {/* Quick Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<UndoIcon />} 
                onClick={() => handleFormatting('undo')}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  '&:hover': { borderColor: '#667eea', color: '#667eea' }
                }}
              >
                Undo
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<RedoIcon />} 
                onClick={() => handleFormatting('redo')}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  '&:hover': { borderColor: '#667eea', color: '#667eea' }
                }}
              >
                Redo
              </Button>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: '40px', bgcolor: '#e0e0e0' }} />
            
            {/* Font Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={selectedFont}
                  onChange={(e) => handleFontChange(e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea'
                    }
                  }}
                >
                  {fontOptions.map(font => (
                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>{font}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 70 }}>
                <Select
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea'
                    }
                  }}
                >
                  {fontSizes.map(size => (
                    <MenuItem key={size} value={size}>{size}pt</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: '40px', bgcolor: '#e0e0e0' }} />
            
            {/* Format Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButtonGroup size="small" sx={{ 
                '& .MuiToggleButton-root': {
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: '#667eea',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#5a6fd8'
                    }
                  }
                }
              }}>
                <ToggleButton value="bold" selected={isBold} onChange={() => handleFormatting('bold')}>
                  <BoldIcon />
                </ToggleButton>
                <ToggleButton value="italic" selected={isItalic} onChange={() => handleFormatting('italic')}>
                  <ItalicIcon />
                </ToggleButton>
                <ToggleButton value="underline" selected={isUnderline} onChange={() => handleFormatting('underline')}>
                  <UnderlineIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ height: '40px', bgcolor: '#e0e0e0' }} />
            
            {/* Alignment Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButtonGroup 
                size="small" 
                value={textAlign} 
                exclusive
                sx={{ 
                  '& .MuiToggleButton-root': {
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: '#667eea',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#5a6fd8'
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="left" onChange={() => handleFormatting('alignLeft')}>
                  <AlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center" onChange={() => handleFormatting('alignCenter')}>
                  <AlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right" onChange={() => handleFormatting('alignRight')}>
                  <AlignRightIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              
              <IconButton 
                onClick={() => handleFormatting('bulletList')} 
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  '&:hover': { borderColor: '#667eea', color: '#667eea' }
                }}
              >
                <BulletIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleFormatting('numberedList')} 
                sx={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  '&:hover': { borderColor: '#667eea', color: '#667eea' }
                }}
              >
                <NumberedIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
      
      {currentTab === 2 && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e0e0e0', 
          p: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              startIcon={<ImageIcon />} 
              onClick={insertImage} 
              variant="contained"
              sx={{ 
                bgcolor: '#667eea',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#5a6fd8' }
              }}
            >
              Insert Picture
            </Button>
            <Button 
              startIcon={<TableIcon />} 
              onClick={insertTable} 
              variant="contained"
              sx={{ 
                bgcolor: '#667eea',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#5a6fd8' }
              }}
            >
              Insert Table
            </Button>
          </Box>
        </Box>
      )}
      
      {(currentTab === 0 || currentTab === 3 || currentTab === 4) && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e0e0e0', 
          p: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              startIcon={<SaveIcon />} 
              onClick={handleSave} 
              variant="contained"
              sx={{ 
                bgcolor: '#667eea',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#5a6fd8' }
              }}
            >
              Save Document
            </Button>
            <Button 
              startIcon={<PrintIcon />} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#e0e0e0',
                '&:hover': { borderColor: '#667eea', color: '#667eea' }
              }}
            >
              Print
            </Button>
          </Box>
        </Box>
      )}

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', bgcolor: '#e5e5e5' }}>
        {/* Document Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: 3,
          overflow: 'auto'
        }}>
          {/* Document Paper */}
          <Paper 
            elevation={3}
            sx={{ 
              width: '8.5in', 
              minHeight: '11in', 
              p: '1in',
              bgcolor: 'white',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              mb: 2
            }}
          >
            {/* Editor */}
            <Box
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setDocumentContent(e.target.innerHTML)}
              sx={{
                minHeight: '9in',
                outline: 'none',
                fontFamily: selectedFont,
                fontSize: fontSize + 'pt',
                lineHeight: 1.6,
                color: textColor,
                textAlign: textAlign,
                cursor: 'text',
                '&:focus': {
                  outline: 'none'
                },
                '&:empty:before': {
                  content: '"Start typing your document here..."',
                  color: '#999',
                  fontStyle: 'italic',
                  pointerEvents: 'none'
                }
              }}
            />
          </Paper>
          
          {/* Status Bar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '8.5in',
            p: 1, 
            bgcolor: '#f8f9fa', 
            borderTop: '1px solid #dee2e6',
            fontSize: '11px'
          }}>
            <Typography variant="caption" sx={{ fontSize: '11px' }}>
              Page {pageCount} of {pageCount}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '11px' }}>
              Words: {wordCount}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '11px' }}>
              {zoomLevel}%
            </Typography>
          </Box>
        </Box>

        {/* Modern Sidebar */}
        <Box sx={{ 
          width: '320px', 
          bgcolor: 'white', 
          borderLeft: '1px solid #e0e0e0', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.05)'
        }}>
          {/* Current Task Card */}
          {currentTask && (
            <Box sx={{ 
              m: 2, 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  borderRadius: 2, 
                  p: 1, 
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CreateIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 700 }}>
                  Current Mission
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, fontSize: '14px' }}>
                {currentTask.title}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '13px', opacity: 0.9, mb: 2, lineHeight: 1.4 }}>
                {currentTask.instruction}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2, 
                px: 2, 
                py: 1,
                width: 'fit-content'
              }}>
                <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>
                  {currentTask.xpReward} XP Reward
                </Typography>
              </Box>
            </Box>
          )}

          {/* AI Writing Coach */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', m: 2, mt: 0 }}>
            <Box sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: '#f8f9ff',
              border: '2px solid #e3f2fd',
              mb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: '#667eea', 
                  borderRadius: 2, 
                  p: 1, 
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <AIIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 700, color: '#667eea' }}>
                  AI Writing Coach
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ 
                fontSize: '13px', 
                color: '#666', 
                mb: 2,
                lineHeight: 1.4
              }}>
                I'm here to help you become a better writer! Ask me anything about formatting, grammar, or creative ideas.
              </Typography>
              
              <Button
                startIcon={<AIIcon />}
                onClick={() => setShowAI(!showAI)}
                variant={showAI ? "contained" : "outlined"}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: showAI ? '#667eea' : 'transparent',
                  borderColor: '#667eea',
                  color: showAI ? 'white' : '#667eea',
                  '&:hover': { 
                    bgcolor: showAI ? '#5a6fd8' : '#f0f4ff',
                    borderColor: '#5a6fd8'
                  }
                }}
              >
                {showAI ? '💬 Chat Active' : '🚀 Start Chatting'}
              </Button>
            </Box>

            {showAI && (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'white',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                overflow: 'hidden'
              }}>
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#667eea', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    💬 Chat with AI Coach
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setShowAI(false)}
                    sx={{ color: 'white' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {/* Chat Messages */}
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  maxHeight: '300px', 
                  overflow: 'auto',
                  bgcolor: '#fafafa'
                }}>
                  {aiHistory.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <AIIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body2" sx={{ 
                        fontSize: '13px', 
                        color: '#999',
                        fontStyle: 'italic'
                      }}>
                        Start a conversation! Try asking:<br/>
                        "How do I make text bold?"<br/>
                        "Help me write about my pet"
                      </Typography>
                    </Box>
                  ) : (
                    aiHistory.map((msg, index) => (
                      <Box key={index} sx={{ 
                        mb: 2,
                        display: 'flex',
                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        <Box sx={{ 
                          maxWidth: '85%',
                          p: 2,
                          borderRadius: 3,
                          bgcolor: msg.type === 'user' ? '#667eea' : 'white',
                          color: msg.type === 'user' ? 'white' : '#333',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: msg.type === 'user' ? 'none' : '1px solid #e0e0e0'
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontSize: '13px',
                            lineHeight: 1.4,
                            fontWeight: msg.type === 'user' ? 500 : 400
                          }}>
                            {msg.message}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                  {aiLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <Typography variant="body2" sx={{ 
                          fontSize: '13px',
                          color: '#667eea',
                          fontStyle: 'italic'
                        }}>
                          🤔 Thinking...
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Chat Input */}
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'white',
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex', 
                  gap: 1 
                }}>
                  <TextField
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    placeholder="Type your question..."
                    size="small"
                    fullWidth
                    onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: '13px' },
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        '& fieldset': { borderColor: '#e0e0e0' },
                        '&:hover fieldset': { borderColor: '#667eea' },
                        '&.Mui-focused fieldset': { borderColor: '#667eea' }
                      }
                    }}
                  />
                  <IconButton 
                    onClick={handleAIMessage} 
                    disabled={aiLoading || !aiMessage.trim()}
                    sx={{ 
                      bgcolor: aiLoading || !aiMessage.trim() ? '#f5f5f5' : '#667eea',
                      color: aiLoading || !aiMessage.trim() ? '#ccc' : 'white',
                      borderRadius: 2,
                      '&:hover': { 
                        bgcolor: aiLoading || !aiMessage.trim() ? '#f5f5f5' : '#5a6fd8' 
                      }
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Document</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Document Name"
            fullWidth
            variant="outlined"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            setShowSaveDialog(false);
            handleDownload();
          }} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Celebration Snackbar */}
      <Snackbar
        open={showCelebration}
        autoHideDuration={4000}
        onClose={() => setShowCelebration(false)}
        message={celebrationMessage}
      />
    </Box>
  );
};

export default WordProcessing; 