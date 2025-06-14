import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Card, 
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Brush as BrushIcon,
  Palette as PaletteIcon,
  TextFields as TextIcon,
  Save as SaveIcon,
  FolderOpen as OpenIcon,
  School as SchoolIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  VolumeUp as VolumeIcon,
  Home as HomeIcon,
  ArrowForward as NextIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Circle as CircleIcon,
  Rectangle as RectangleIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  padding: theme.spacing(3),
}));

const HeaderCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: 16,
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
}));

const LessonCard = styled(Card)(({ theme, completed, active }) => ({
  borderRadius: 16,
  background: completed 
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : active 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      : 'white',
  color: completed || active ? 'white' : theme.palette.text.primary,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  border: completed ? '2px solid #10b981' : active ? '2px solid #3b82f6' : '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: completed || active 
      ? '0 20px 40px rgba(0,0,0,0.2)' 
      : '0 20px 40px rgba(0,0,0,0.1)',
    borderColor: completed ? '#10b981' : active ? '#3b82f6' : '#e5e7eb'
  }
}));

const PaintCanvas = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: '70vh',
  border: 'none',
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  background: 'white',
  borderRadius: 12,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
}));

const lessonData = [
  {
    id: 1,
    title: "Interface Basics",
    subtitle: "Canvas, Tools & Colors",
    icon: <SchoolIcon />,
    color: "#3b82f6",
    description: "Explore the paint interface, learn about canvas, toolbox, and color palette.",
    tasks: ["Identify canvas area", "Locate toolbox", "Find color palette"],
    duration: "5 min",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Drawing Shapes",
    subtitle: "Basic Drawing Tools",
    icon: <CircleIcon />,
    color: "#10b981",
    description: "Master fundamental drawing tools including brush, line, rectangle, and circle.",
    tasks: ["Use brush tool", "Draw straight lines", "Create shapes"],
    duration: "8 min",
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Color & Fill",
    subtitle: "Working with Colors",
    icon: <PaletteIcon />,
    color: "#f59e0b",
    description: "Learn color selection and fill techniques to bring your artwork to life.",
    tasks: ["Select colors", "Use fill tool", "Color combinations"],
    duration: "6 min",
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Adding Text",
    subtitle: "Text Tool Mastery",
    icon: <TextIcon />,
    color: "#ef4444",
    description: "Add text elements to your artwork using the text tool effectively.",
    tasks: ["Insert text", "Format text", "Position text"],
    duration: "7 min",
    difficulty: "Intermediate"
  },
  {
    id: 5,
    title: "Save & Export",
    subtitle: "File Management",
    icon: <SaveIcon />,
    color: "#8b5cf6",
    description: "Learn proper file saving, naming conventions, and export options.",
    tasks: ["Save artwork", "Name files properly", "Export formats"],
    duration: "5 min",
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "File Operations",
    subtitle: "Open & Organize",
    icon: <OpenIcon />,
    color: "#06b6d4",
    description: "Master file opening, organizing, and managing your digital artwork collection.",
    tasks: ["Open saved files", "Organize folders", "Rename projects"],
    duration: "6 min",
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Creative Project",
    subtitle: "Complete Artwork",
    icon: <TrophyIcon />,
    color: "#dc2626",
    description: "Apply all learned skills to create a complete digital artwork masterpiece.",
    tasks: ["Plan artwork", "Use multiple tools", "Complete project"],
    duration: "15 min",
    difficulty: "Advanced"
  }
];

const AIPaintLearning = ({ onClose }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentTask(0);
    setShowInstructions(true);
  };

  const handleTaskComplete = () => {
    const newTask = currentTask + 1;
    setCurrentTask(newTask);
    
    if (newTask >= currentLesson.tasks.length) {
      // Lesson completed
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      setCurrentLesson(null);
      setCurrentTask(0);
    }
  };

  const renderLessonOverview = () => (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderCard elevation={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" fontWeight="bold">
              Digital Art Academy
            </Typography>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={onClose}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', 
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Back to Curriculum
            </Button>
          </Box>
          
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Master digital painting and design through 7 comprehensive lessons
          </Typography>

          <ProgressContainer sx={{ bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="white">
                Progress: {completedLessons.length} / {lessonData.length} Lessons
              </Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.8)">
                {Math.round((completedLessons.length / lessonData.length) * 100)}% Complete
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(completedLessons.length / lessonData.length) * 100}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #10b981, #059669)',
                  borderRadius: 4
                }
              }}
            />
          </ProgressContainer>
        </HeaderCard>

        <Grid container spacing={3}>
          {lessonData.map((lesson, index) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <LessonCard
                  completed={completedLessons.includes(lesson.id)}
                  active={false}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: completedLessons.includes(lesson.id) 
                          ? 'rgba(255,255,255,0.2)' 
                          : lesson.color + '20', 
                        mr: 2,
                        width: 50,
                        height: 50
                      }}>
                        {React.cloneElement(lesson.icon, {
                          style: { 
                            fontSize: 24, 
                            color: completedLessons.includes(lesson.id) ? 'white' : lesson.color 
                          }
                        })}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Lesson {lesson.id}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="600">
                          {lesson.title}
                        </Typography>
                      </Box>
                      {completedLessons.includes(lesson.id) && (
                        <CheckIcon sx={{ fontSize: 28, ml: 1 }} />
                      )}
                    </Box>
                    
                    <Typography variant="body2" sx={{ 
                      mb: 3, 
                      opacity: completedLessons.includes(lesson.id) ? 0.9 : 0.7,
                      lineHeight: 1.5
                    }}>
                      {lesson.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={lesson.difficulty}
                        size="small"
                        sx={{ 
                          bgcolor: completedLessons.includes(lesson.id) 
                            ? 'rgba(255,255,255,0.2)' 
                            : lesson.color + '15',
                          color: completedLessons.includes(lesson.id) 
                            ? 'white' 
                            : lesson.color,
                          fontWeight: 600
                        }}
                      />
                      <Chip 
                        label={lesson.duration}
                        size="small"
                        sx={{ 
                          bgcolor: completedLessons.includes(lesson.id) 
                            ? 'rgba(255,255,255,0.2)' 
                            : '#f1f5f9',
                          color: completedLessons.includes(lesson.id) 
                            ? 'white' 
                            : '#64748b',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={completedLessons.includes(lesson.id) ? "outlined" : "contained"}
                      startIcon={completedLessons.includes(lesson.id) ? <CheckIcon /> : <PlayIcon />}
                      sx={{
                        bgcolor: completedLessons.includes(lesson.id) 
                          ? 'transparent' 
                          : lesson.color,
                        color: completedLessons.includes(lesson.id) 
                          ? 'white' 
                          : 'white',
                        borderColor: completedLessons.includes(lesson.id) 
                          ? 'rgba(255,255,255,0.5)' 
                          : 'transparent',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: completedLessons.includes(lesson.id) 
                            ? 'rgba(255,255,255,0.1)' 
                            : lesson.color + 'dd'
                        }
                      }}
                    >
                      {completedLessons.includes(lesson.id) ? 'Review' : 'Start Lesson'}
                    </Button>
                  </CardActions>
                </LessonCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );

  const renderLessonContent = () => (
    <Container maxWidth="xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Lesson Header */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'white',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: currentLesson.color + '20', 
                mr: 2,
                width: 56,
                height: 56
              }}>
                {React.cloneElement(currentLesson.icon, {
                  style: { fontSize: 28, color: currentLesson.color }
                })}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  Lesson {currentLesson.id}: {currentLesson.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {currentLesson.subtitle} • {currentLesson.duration}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<BackIcon />}
                onClick={() => setCurrentLesson(null)}
              >
                Back to Lessons
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={() => setShowInstructions(true)}
                sx={{ borderColor: currentLesson.color, color: currentLesson.color }}
              >
                View Instructions
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Progress Stepper */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progress: Step {currentTask + 1} of {currentLesson.tasks.length}
            </Typography>
            <Stepper activeStep={currentTask} alternativeLabel>
              {currentLesson.tasks.map((task, index) => (
                <Step key={index}>
                  <StepLabel>{task}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {currentTask < currentLesson.tasks.length && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" color={currentLesson.color}>
                Current Task: {currentLesson.tasks[currentTask]}
              </Typography>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handleTaskComplete}
                sx={{ bgcolor: currentLesson.color }}
              >
                Mark Complete
              </Button>
            </Box>
          )}
        </Paper>

        {/* Paint Canvas */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Digital Paint Canvas
          </Typography>
          <PaintCanvas
            src="https://jspaint.app"
            title="Digital Paint Canvas"
          />
        </Paper>
      </motion.div>
    </Container>
  );

  return (
    <MainContainer>
      {currentLesson ? renderLessonContent() : renderLessonOverview()}

      {/* Instructions Dialog */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 4 }}>
          {currentLesson && (
            <>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {currentLesson.title} - Instructions
              </Typography>
              <Typography variant="body1" paragraph>
                {currentLesson.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Tasks to Complete:
              </Typography>
              <Box component="ol" sx={{ pl: 3 }}>
                {currentLesson.tasks.map((task, index) => (
                  <Typography component="li" key={index} variant="body1" sx={{ mb: 1 }}>
                    {task}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setShowInstructions(false)}
                  sx={{ bgcolor: currentLesson.color }}
                >
                  Let's Start!
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainContainer>
  );
};

export default AIPaintLearning; 