import React, { useState, useRef, useCallback } from 'react';
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
  Card,
  CardContent,
  Divider,
  Alert,
  Tooltip,
  LinearProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  CreateNewFolder as CreateFolderIcon,
  NoteAdd as CreateFileIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Undo as UndoIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Description as TxtIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  Code as CodeIcon,
  Archive as ZipIcon,
  Edit as RenameIcon,
  Book as LibraryIcon,
  FolderOpen as FolderOpenIcon,
  SwapHoriz as MoveIcon,
  Folder as OrganizeIcon,
  Delete as CleanIcon,
  Help as QuizIcon
} from '@mui/icons-material';

const FileManagerSimulation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Core state
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [fileSystem, setFileSystem] = useState({
    'Home': {
      type: 'folder',
      children: {
        'Documents': { type: 'folder', children: {} },
        'Pictures': { type: 'folder', children: {} },
        'Music': { type: 'folder', children: {} },
        'Videos': { type: 'folder', children: {} },
        'Welcome.txt': { 
          type: 'file', 
          content: 'Welcome to File Manager! This is your first text file.',
          size: '1.2 KB',
          modified: new Date().toLocaleDateString()
        }
      }
    }
  });
  
  // UI state
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [propertiesItem, setPropertiesItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [deletedItems, setDeletedItems] = useState([]);
  
  // Progress tracking
  const [progress, setProgress] = useState({
    filesCreated: 0,
    foldersCreated: 0,
    filesDeleted: 0,
    filesRenamed: 0,
    filesMoved: 0,
    totalOperations: 0
  });

  // Lesson system
  const [currentLesson, setCurrentLesson] = useState(1);
  const [currentTopic, setCurrentTopic] = useState(1);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('');
  const [showMascot, setShowMascot] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mode, setMode] = useState('lesson'); // 'lesson' or 'practice'

  const lessons = [
    {
      id: 1,
      title: "Get to Know Files!",
      color: "#2196F3",
      badge: "File Starter",
      badgeIcon: "",
      goal: "Understand what files are and how to create & rename them.",
      topics: [
        {
          id: 1,
          title: "Create Your First File",
          task: "Click 'New File' → Name it 'MyFile'",
          tip: "Think of a file like your school notebook!",
          icon: <CreateFileIcon />,
          checkCondition: (fs) => fs.Home?.children?.MyFile || fs.Home?.children?.['MyFile.txt']
        },
        {
          id: 2,
          title: "Rename a File",
          task: "Rename MyFile → MyNote",
          feedback: "Nice rename! Now it's clearer.",
          icon: <RenameIcon />,
          checkCondition: (fs) => fs.Home?.children?.MyNote || fs.Home?.children?.['MyNote.txt']
        },
        {
          id: 3,
          title: "Create 3 Purpose-Based Files",
          task: "Create: Note1 (writing), Drawing1 (drawing), Homework1 (homework)",
          tip: "Choose different file types and add content!",
          icon: <LibraryIcon />,
          checkCondition: (fs) => {
            const files = fs.Home?.children || {};
            const hasNote = Object.keys(files).some(name => name.toLowerCase().includes('note1'));
            const hasDrawing = Object.keys(files).some(name => name.toLowerCase().includes('drawing1'));
            const hasHomework = Object.keys(files).some(name => name.toLowerCase().includes('homework1'));
            return hasNote && hasDrawing && hasHomework;
          }
        }
      ]
    },
    {
      id: 2,
      title: "Organize Like a Pro!",
      color: "#FF9800",
      badge: "Folder Organizer",
      badgeIcon: "",
      goal: "Learn to use folders to organize and move files.",
      topics: [
        {
          id: 1,
          title: "Create Folders",
          task: "Make a folder called 'Subjects', then inside create: English, Math, Art",
          tip: "Folders help keep your files organized!",
          icon: <CreateFolderIcon />,
          checkCondition: (fs) => {
            const subjects = fs.Home?.children?.Subjects;
            if (!subjects || subjects.type !== 'folder') return false;
            const subFolders = subjects.children || {};
            return subFolders.English && subFolders.Math && subFolders.Art;
          }
        },
        {
          id: 2,
          title: "Move Files into Folders",
          task: "Drag files into correct folders: Note1→English, Homework1→Math, Drawing1→Art",
          tip: "Drag and drop to organize!",
          icon: <MoveIcon />,
          checkCondition: (fs) => {
            const subjects = fs.Home?.children?.Subjects?.children || {};
            const english = subjects.English?.children || {};
            const math = subjects.Math?.children || {};
            const art = subjects.Art?.children || {};
            
            const hasNoteInEnglish = Object.keys(english).some(name => name.toLowerCase().includes('note'));
            const hasHomeworkInMath = Object.keys(math).some(name => name.toLowerCase().includes('homework'));
            const hasDrawingInArt = Object.keys(art).some(name => name.toLowerCase().includes('drawing'));
            
            return hasNoteInEnglish && hasHomeworkInMath && hasDrawingInArt;
          }
        },
        {
          id: 3,
          title: "Add New Files and Sort",
          task: "Create Essay.txt, Sketch.png, Algebra.docx and move to right folders",
          tip: "Match file types to subjects!",
          icon: <OrganizeIcon />,
          checkCondition: (fs) => {
            const subjects = fs.Home?.children?.Subjects?.children || {};
            const english = subjects.English?.children || {};
            const math = subjects.Math?.children || {};
            const art = subjects.Art?.children || {};
            
            const hasEssay = Object.keys(english).some(name => name.toLowerCase().includes('essay'));
            const hasAlgebra = Object.keys(math).some(name => name.toLowerCase().includes('algebra'));
            const hasSketch = Object.keys(art).some(name => name.toLowerCase().includes('sketch'));
            
            return hasEssay && hasAlgebra && hasSketch;
          }
        }
      ]
    },
    {
      id: 3,
      title: "Smart File Manager!",
      color: "#F44336",
      badge: "File Master",
      badgeIcon: "",
      goal: "Learn to search, clean, and understand file types.",
      topics: [
        {
          id: 1,
          title: "Search Challenge",
          task: "Use Search Bar to find: Essay.txt, Drawing1",
          tip: "Type in the search box to find files quickly!",
          icon: <SearchIcon />,
          checkCondition: (fs, searchTerm) => {
            if (!searchTerm || searchTerm.length === 0) return false;
            const term = searchTerm.toLowerCase();
            return term.includes('essay') || term.includes('drawing');
          }
        },
        {
          id: 2,
          title: "Clean-Up Day",
          task: "Delete any test or unwanted files",
          tip: "Keep your workspace clean!",
          icon: <CleanIcon />,
          checkCondition: () => true // Will be checked when files are deleted
        },
        {
          id: 3,
          title: "File Type Match-Up",
          task: "Identify file types: .txt (writing), .png (drawings), .docx (homework)",
          tip: "File extensions tell us what type of file it is!",
          icon: <QuizIcon />,
          checkCondition: () => true // Interactive quiz completion
        }
      ]
    }
  ];

  // Helper functions
  const getCurrentFolder = () => {
    let current = fileSystem;
    for (const path of currentPath) {
      current = current[path];
      if (current.children) current = current.children;
    }
    return current;
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt': case 'doc': case 'docx': return <TxtIcon />;
      case 'jpg': case 'jpeg': case 'png': case 'gif': return <ImageIcon />;
      case 'pdf': return <PdfIcon />;
      case 'mp4': case 'avi': case 'mov': return <VideoIcon />;
      case 'mp3': case 'wav': case 'flac': return <AudioIcon />;
      case 'js': case 'html': case 'css': case 'py': return <CodeIcon />;
      case 'zip': case 'rar': case '7z': return <ZipIcon />;
      default: return <FileIcon />;
    }
  };

  const updateProgress = (operation) => {
    setProgress(prev => ({
      ...prev,
      [operation]: prev[operation] + 1,
      totalOperations: prev.totalOperations + 1
    }));
  };

  // Task checking system
  const checkTaskCompletion = () => {
    const currentLessonData = lessons.find(l => l.id === currentLesson);
    if (!currentLessonData) return;

    const currentTopicData = currentLessonData.topics.find(t => t.id === currentTopic);
    if (!currentTopicData) return;

    const taskId = `${currentLesson}-${currentTopic}`;
    
    if (!completedTasks.includes(taskId) && currentTopicData.checkCondition(fileSystem)) {
      setCompletedTasks(prev => [...prev, taskId]);
      
      // Show mascot feedback
      const feedback = currentTopicData.feedback || "Great job! Task completed!";
      showMascotFeedback(feedback);
      
      // Check if lesson is complete
      const allTopicsCompleted = currentLessonData.topics.every(topic => 
        completedTasks.includes(`${currentLesson}-${topic.id}`) || 
        topic.checkCondition(fileSystem)
      );
      
      if (allTopicsCompleted && !earnedBadges.includes(currentLesson)) {
        setEarnedBadges(prev => [...prev, currentLesson]);
        showMascotFeedback(`🎉 Congratulations! You earned the "${currentLessonData.badge}" badge! ${currentLessonData.badgeIcon}`);
      }
    }
  };

  const showMascotFeedback = (message) => {
    setMascotMessage(message);
    setShowMascot(true);
    setTimeout(() => setShowMascot(false), 4000);
  };

  const getCurrentTask = () => {
    const currentLessonData = lessons.find(l => l.id === currentLesson);
    if (!currentLessonData) return null;
    
    const currentTopicData = currentLessonData.topics.find(t => t.id === currentTopic);
    return currentTopicData;
  };

  const nextTask = () => {
    const currentLessonData = lessons.find(l => l.id === currentLesson);
    if (!currentLessonData) return;
    
    // Only navigate within the current lesson's topics
    if (currentTopic < currentLessonData.topics.length) {
      setCurrentTopic(currentTopic + 1);
    }
    // Don't automatically move to next lesson - user must choose from welcome screen
  };

  const previousTask = () => {
    // Only navigate within the current lesson's topics
    if (currentTopic > 1) {
      setCurrentTopic(currentTopic - 1);
    }
    // Don't automatically move to previous lesson - user must choose from welcome screen
  };

  // File operations
  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    const newFileSystem = { ...fileSystem };
    let current = newFileSystem;
    
    for (const path of currentPath) {
      current = current[path];
      if (current.children) current = current.children;
    }
    
    if (createType === 'folder') {
      current[newItemName] = { type: 'folder', children: {} };
      updateProgress('foldersCreated');
    } else {
      const fileExt = newItemName.includes('.') ? newItemName : `${newItemName}.txt`;
      current[fileExt] = {
        type: 'file',
        content: createType === 'file' ? 'This is a new file.' : '',
        size: '0.1 KB',
        modified: new Date().toLocaleDateString()
      };
      updateProgress('filesCreated');
    }
    
    setFileSystem(newFileSystem);
    setShowCreateDialog(false);
    setNewItemName('');
    
    // Check task completion after state update
    setTimeout(() => checkTaskCompletion(), 100);
  };

  const handleDeleteItem = (itemName) => {
    const newFileSystem = { ...fileSystem };
    let current = newFileSystem;
    
    for (const path of currentPath) {
      current = current[path];
      if (current.children) current = current.children;
    }
    
    const deletedItem = { ...current[itemName], name: itemName, path: [...currentPath] };
    setDeletedItems(prev => [...prev, deletedItem]);
    delete current[itemName];
    
    setFileSystem(newFileSystem);
    setSelectedItems([]);
    updateProgress('filesDeleted');
    
    // Check clean-up task completion
    if (currentLesson === 3 && currentTopic === 2) {
      const taskId = `${currentLesson}-${currentTopic}`;
      if (!completedTasks.includes(taskId)) {
        setCompletedTasks(prev => [...prev, taskId]);
        showMascotFeedback("🗑️ Nice clean-up! Your workspace looks better!");
      }
    }
  };

  const handleRenameItem = (oldName, newName) => {
    if (!newName.trim() || oldName === newName) return;
    
    const newFileSystem = { ...fileSystem };
    let current = newFileSystem;
    
    for (const path of currentPath) {
      current = current[path];
      if (current.children) current = current.children;
    }
    
    current[newName] = current[oldName];
    delete current[oldName];
    
    setFileSystem(newFileSystem);
    updateProgress('filesRenamed');
    
    // Check task completion after state update
    setTimeout(() => checkTaskCompletion(), 100);
  };

  const handleMoveItem = (itemName, targetPath) => {
    const newFileSystem = { ...fileSystem };
    
    // Get source item
    let sourceFolder = newFileSystem;
    for (const path of currentPath) {
      sourceFolder = sourceFolder[path];
      if (sourceFolder.children) sourceFolder = sourceFolder.children;
    }
    const item = sourceFolder[itemName];
    
    // Get target folder
    let targetFolder = newFileSystem;
    for (const path of targetPath) {
      targetFolder = targetFolder[path];
      if (targetFolder.children) targetFolder = targetFolder.children;
    }
    
    // Move item
    targetFolder[itemName] = item;
    delete sourceFolder[itemName];
    
    setFileSystem(newFileSystem);
    updateProgress('filesMoved');
    
    // Check task completion after state update
    setTimeout(() => checkTaskCompletion(), 100);
  };

  const handleUndoDelete = () => {
    if (deletedItems.length === 0) return;
    
    const lastDeleted = deletedItems[deletedItems.length - 1];
    const newFileSystem = { ...fileSystem };
    let current = newFileSystem;
    
    for (const path of lastDeleted.path) {
      current = current[path];
      if (current.children) current = current.children;
    }
    
    current[lastDeleted.name] = { ...lastDeleted };
    delete current[lastDeleted.name].name;
    delete current[lastDeleted.name].path;
    
    setFileSystem(newFileSystem);
    setDeletedItems(prev => prev.slice(0, -1));
  };

  // Event handlers
  const handleContextMenu = (event, itemName) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      itemName
    });
  };

  const handleItemClick = (itemName, item) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, itemName]);
    } else {
      setPreviewFile({ name: itemName, ...item });
      setShowPreview(true);
    }
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleDragStart = (itemName) => {
    setDraggedItem(itemName);
  };

  const handleDragOver = (event, itemName, item) => {
    event.preventDefault();
    if (item.type === 'folder' && itemName !== draggedItem) {
      setDropTarget(itemName);
    }
  };

  const handleDrop = (event, targetName, targetItem) => {
    event.preventDefault();
    if (targetItem.type === 'folder' && draggedItem && targetName !== draggedItem) {
      handleMoveItem(draggedItem, [...currentPath, targetName]);
    }
    setDraggedItem(null);
    setDropTarget(null);
  };

  // Filter items based on search
  const currentFolder = getCurrentFolder();
  const filteredItems = Object.entries(currentFolder).filter(([name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate lesson progress
  const currentLessonData = lessons.find(l => l.id === currentLesson);
  const currentTaskData = getCurrentTask();
  
  // Calculate progress for current lesson only
  const currentLessonTasks = currentLessonData?.topics || [];
  const completedCurrentLessonTasks = currentLessonTasks.filter(topic => 
    completedTasks.includes(`${currentLesson}-${topic.id}`)
  ).length;

  const handleGoBack = () => {
    navigate('/student-dashboard/codezy');
  };

  const startLesson = (lessonId) => {
    setCurrentLesson(lessonId);
    setCurrentTopic(1);
    setMode('lesson');
    setShowWelcome(false);
  };

  const startPractice = (lessonId) => {
    setCurrentLesson(lessonId);
    setCurrentTopic(1);
    setMode('practice');
    setShowWelcome(false);
  };

  const backToWelcome = () => {
    setShowWelcome(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 2 
              }}>
                <Typography variant="h3" fontWeight={700} sx={{ 
                  flexGrow: 1,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  File Manager
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={showWelcome ? handleGoBack : backToWelcome}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    alignSelf: { xs: 'flex-start', sm: 'center' }
                  }}
                >
                  {showWelcome ? 'Back to Codezy' : 'Back to Lessons'}
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                Learn to organize files and folders like a computer expert!
                Grade 3 • Computer Skills • Skill 3
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<FolderIcon />} 
                  label="Create Folders" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<FileIcon />} 
                  label="Manage Files" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<StarIcon />} 
                  label="Interactive Learning" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <FolderIcon sx={{ 
                fontSize: '120px',
                opacity: 0.3,
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
              }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Welcome Screen */}
      {showWelcome && (
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" textAlign="center" sx={{ mb: 2, fontWeight: 600 }}>
            Choose Your Learning Path
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Select a lesson to learn step-by-step, or practice freely!
          </Typography>

          <Grid container spacing={4}>
            {lessons.map((lesson) => (
              <Grid item xs={12} md={4} key={lesson.id}>
                <Card sx={{ 
                  height: '100%',
                  border: `3px solid ${lesson.color}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px rgba(0,0,0,0.15)`
                  }
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    {/* Lesson Header */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        {lesson.badgeIcon}
                      </Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ color: lesson.color, mb: 1 }}>
                        Lesson {lesson.id}
                      </Typography>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        {lesson.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {lesson.goal}
                      </Typography>
                    </Box>

                    {/* Topics Preview */}
                    <Box sx={{ mb: 4 }}>
                      {lesson.topics.map((topic) => (
                        <Box key={topic.id} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 1,
                          p: 1,
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>{topic.icon}</Typography>
                          <Typography variant="body2" sx={{ textAlign: 'left' }}>
                            {topic.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => startLesson(lesson.id)}
                        sx={{
                          backgroundColor: lesson.color,
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: lesson.color,
                            filter: 'brightness(0.9)'
                          }
                        }}
                      >
                        Start Lesson {lesson.id}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => startPractice(lesson.id)}
                        sx={{
                          borderColor: lesson.color,
                          color: lesson.color,
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            borderColor: lesson.color,
                            backgroundColor: `${lesson.color}15`
                          }
                        }}
                      >
                        Practice Mode
                      </Button>
                    </Box>

                    {/* Badge Preview */}
                    {earnedBadges.includes(lesson.id) && (
                      <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        backgroundColor: `${lesson.color}20`,
                        borderRadius: 2,
                        border: `1px solid ${lesson.color}40`
                      }}>
                        <Typography variant="body2" fontWeight={600} sx={{ color: lesson.color }}>
                          ✅ Badge Earned: {lesson.badge}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Overall Progress */}
          {earnedBadges.length > 0 && (
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                🏆 Your Achievements
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {earnedBadges.map(lessonId => {
                  const lesson = lessons.find(l => l.id === lessonId);
                  return (
                    <Chip
                      key={lessonId}
                      label={`${lesson?.badgeIcon} ${lesson?.badge}`}
                      sx={{ 
                        backgroundColor: lesson?.color,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        py: 2,
                        px: 1
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </Container>
      )}

      {/* Main Content */}
      {!showWelcome && (
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          {/* Progress Sidebar */}
          <Grid item xs={12} md={3}>
            {/* Current Lesson */}
            <Paper sx={{ p: 3, mb: 3, border: `2px solid ${currentLessonData?.color}` }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: currentLessonData?.color 
              }}>
                <Box sx={{ fontSize: '1.5rem' }}>{currentLessonData?.badgeIcon}</Box>
                Lesson {currentLesson}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {currentLessonData?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentLessonData?.goal}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Current Task */}
              {currentTaskData && (
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  mb: 2
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 1,
                    fontWeight: 600
                  }}>
                    <Box sx={{ fontSize: '1.2rem' }}>{currentTaskData.icon}</Box>
                    Topic {currentTopic}: {currentTaskData.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Task:</strong> {currentTaskData.task}
                  </Typography>
                  {currentTaskData.tip && (
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      p: 1,
                      borderRadius: 1,
                      border: '1px solid rgba(255, 193, 7, 0.3)'
                    }}>
                      💡 Tip: {currentTaskData.tip}
                    </Typography>
                  )}
                  
                  {completedTasks.includes(`${currentLesson}-${currentTopic}`) && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mt: 1,
                      color: '#4CAF50'
                    }}>
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={600}>
                        Completed!
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Navigation */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  onClick={previousTask}
                  disabled={currentTopic === 1}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  onClick={nextTask}
                  disabled={currentTopic === currentLessonData?.topics.length}
                  variant="outlined"
                >
                  Next
                </Button>
              </Box>
              
              {/* Back to Lessons */}
              <Box sx={{ mb: 2 }}>
                <Button
                  size="small"
                  onClick={backToWelcome}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                >
                  Back to Lessons
                </Button>
              </Box>
              
              {/* Progress */}
              <LinearProgress 
                variant="determinate" 
                value={(completedCurrentLessonTasks / currentLessonTasks.length) * 100} 
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary">
                {completedCurrentLessonTasks}/{currentLessonTasks.length} tasks completed
              </Typography>
            </Paper>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon color="primary" />
                  Your Badges
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {earnedBadges.map(lessonId => {
                    const lesson = lessons.find(l => l.id === lessonId);
                    return (
                      <Chip
                        key={lessonId}
                        label={`${lesson?.badgeIcon} ${lesson?.badge}`}
                        sx={{ 
                          backgroundColor: lesson?.color,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    );
                  })}
                </Box>
              </Paper>
            )}

            {/* Quick Actions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  startIcon={<CreateFolderIcon />}
                  onClick={() => {
                    setCreateType('folder');
                    setShowCreateDialog(true);
                  }}
                  variant="outlined"
                  fullWidth
                >
                  New Folder
                </Button>
                <Button
                  startIcon={<CreateFileIcon />}
                  onClick={() => {
                    setCreateType('file');
                    setShowCreateDialog(true);
                  }}
                  variant="outlined"
                  fullWidth
                >
                  New File
                </Button>
                {currentLesson === 3 && currentTopic === 3 && (
                  <Button
                    startIcon={<InfoIcon />}
                    onClick={() => setShowTaskDialog(true)}
                    variant="outlined"
                    fullWidth
                    color="info"
                  >
                    File Type Quiz
                  </Button>
                )}
                {deletedItems.length > 0 && (
                  <Button
                    startIcon={<UndoIcon />}
                    onClick={handleUndoDelete}
                    variant="outlined"
                    fullWidth
                    color="warning"
                  >
                    Undo Delete
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* File Explorer */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
              {/* Toolbar */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {/* Breadcrumbs */}
                  <Breadcrumbs sx={{ flex: 1 }}>
                    {currentPath.map((path, index) => (
                      <Link
                        key={index}
                        component="button"
                        variant="body2"
                        onClick={() => handleBreadcrumbClick(index)}
                        sx={{ 
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {index === 0 ? <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} /> : null}
                        {path}
                      </Link>
                    ))}
                  </Breadcrumbs>
                  
                  {/* Search */}
                  <TextField
                    size="small"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      // Check search task completion
                      if (e.target.value.length > 0 && currentLesson === 3 && currentTopic === 1) {
                        const taskId = `${currentLesson}-${currentTopic}`;
                        if (!completedTasks.includes(taskId)) {
                          const currentTopicData = currentLessonData.topics.find(t => t.id === currentTopic);
                          if (currentTopicData && currentTopicData.checkCondition(fileSystem, e.target.value)) {
                            setCompletedTasks(prev => [...prev, taskId]);
                            showMascotFeedback("✨ Great searching! You found the files!");
                          }
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{ width: 250 }}
                  />
                </Box>
              </Box>

              {/* File Grid */}
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                <Grid container spacing={2}>
                  {filteredItems.map(([name, item]) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={name}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          border: selectedItems.includes(name) ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                          backgroundColor: dropTarget === name ? '#e8f5e9' : 'white',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                        draggable
                        onDragStart={() => handleDragStart(name)}
                        onDragOver={(e) => handleDragOver(e, name, item)}
                        onDrop={(e) => handleDrop(e, name, item)}
                        onContextMenu={(e) => handleContextMenu(e, name)}
                        onClick={() => handleItemClick(name, item)}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Box sx={{ 
                            fontSize: 48, 
                            color: item.type === 'folder' ? '#4CAF50' : '#2196F3',
                            mb: 1
                          }}>
                            {item.type === 'folder' ? <FolderIcon fontSize="inherit" /> : getFileIcon(name)}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              wordBreak: 'break-word',
                              fontSize: '0.75rem',
                              lineHeight: 1.2
                            }}
                          >
                            {name}
                          </Typography>
                          {item.type === 'file' && (
                            <Typography variant="caption" color="text.secondary">
                              {item.size}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {filteredItems.length === 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '50%',
                    color: 'text.secondary'
                  }}>
                    <FolderIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6">
                      {searchQuery ? 'No files found' : 'This folder is empty'}
                    </Typography>
                    <Typography variant="body2">
                      {searchQuery ? 'Try a different search term' : 'Create your first file or folder!'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      )}

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          const newName = prompt('Enter new name:', contextMenu.itemName);
          if (newName) handleRenameItem(contextMenu.itemName, newName);
          setContextMenu(null);
        }}>
          <EditIcon sx={{ mr: 1 }} /> Rename
        </MenuItem>
        <MenuItem onClick={() => {
          setPropertiesItem(contextMenu.itemName);
          setShowProperties(true);
          setContextMenu(null);
        }}>
          <InfoIcon sx={{ mr: 1 }} /> Properties
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteItem(contextMenu.itemName);
          setContextMenu(null);
        }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogTitle>
          Create New {createType === 'folder' ? 'Folder' : 'File'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={`${createType === 'folder' ? 'Folder' : 'File'} Name`}
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateItem} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{previewFile?.name}</DialogTitle>
        <DialogContent>
          {previewFile?.name?.endsWith('.txt') ? (
            <TextField
              multiline
              rows={10}
              fullWidth
              value={previewFile.content}
              onChange={(e) => {
                const newFileSystem = { ...fileSystem };
                let current = newFileSystem;
                for (const path of currentPath) {
                  current = current[path];
                  if (current.children) current = current.children;
                }
                current[previewFile.name].content = e.target.value;
                setFileSystem(newFileSystem);
                setPreviewFile({ ...previewFile, content: e.target.value });
              }}
            />
          ) : (
            <Typography>{previewFile?.content || 'File preview not available'}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Properties Dialog */}
      <Dialog open={showProperties} onClose={() => setShowProperties(false)}>
        <DialogTitle>Properties</DialogTitle>
        <DialogContent>
          {propertiesItem && (
            <Box>
              <Typography><strong>Name:</strong> {propertiesItem}</Typography>
              <Typography><strong>Type:</strong> {getCurrentFolder()[propertiesItem]?.type}</Typography>
              {getCurrentFolder()[propertiesItem]?.size && (
                <Typography><strong>Size:</strong> {getCurrentFolder()[propertiesItem].size}</Typography>
              )}
              {getCurrentFolder()[propertiesItem]?.modified && (
                <Typography><strong>Modified:</strong> {getCurrentFolder()[propertiesItem].modified}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProperties(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Mascot Feedback */}
      {showMascot && (
        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          maxWidth: 300,
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <Alert 
            severity="success" 
            sx={{ 
              fontSize: '1rem',
              '& .MuiAlert-message': {
                fontWeight: 500
              }
            }}
            onClose={() => setShowMascot(false)}
          >
            {mascotMessage}
          </Alert>
        </Box>
      )}

      {/* File Type Quiz Dialog */}
      <Dialog 
        open={currentLesson === 3 && currentTopic === 3 && showTaskDialog} 
        onClose={() => setShowTaskDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          🎮 File Type Match-Up!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Match each file extension with its purpose:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TxtIcon />
                  <Typography>.txt</Typography>
                </Box>
                <Typography>📝 For writing and notes</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon />
                  <Typography>.png</Typography>
                </Box>
                <Typography>🎨 For drawings and pictures</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                mb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TxtIcon />
                  <Typography>.docx</Typography>
                </Box>
                <Typography>🏫 For homework and documents</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
            💡 The file extension (letters after the dot) tells us what type of file it is!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowTaskDialog(false);
              const taskId = `${currentLesson}-${currentTopic}`;
              if (!completedTasks.includes(taskId)) {
                setCompletedTasks(prev => [...prev, taskId]);
                showMascotFeedback("🎉 Great job! You've learned about file types!");
                setTimeout(() => checkTaskCompletion(), 100);
              }
            }}
            variant="contained"
            fullWidth
          >
            I Understand! 🎯
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
};

export default FileManagerSimulation; 