import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Brush as BrushIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Palette as PaletteIcon,
  Create as CreateIcon,
  Save as SaveIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';

const MSPaint = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);

  const handleGoBack = () => {
    navigate('/student-dashboard/codezy');
  };

  const handleComplete = () => {
    setIsCompleted(true);
    // Here you could save progress to backend
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreenLoading(true);
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleFullscreenIframeLoad = () => {
    setIsFullscreenLoading(false);
  };

  const paintInstructions = [
    {
      title: "Getting Started",
      description: "Explore the paint interface and familiarize yourself with the tools",
      icon: <PaletteIcon />
    },
    {
      title: "Basic Drawing",
      description: "Use the brush tool to draw simple shapes and lines",
      icon: <BrushIcon />
    },
    {
      title: "Colors & Tools",
      description: "Try different colors and drawing tools like pencil, brush, and shapes",
      icon: <CreateIcon />
    },
    {
      title: "Save Your Work",
      description: "Learn to save your artwork when you're finished",
      icon: <SaveIcon />
    }
  ];

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
                  MS Paint Basics
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleGoBack}
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
                  Back to Codezy
                </Button>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                Learn digital art and basic drawing tools with MS Paint.
                Grade 3 • Computer Skills • Skill 2
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<BrushIcon />} 
                  label="Drawing Tools" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<PaletteIcon />} 
                  label="Color Palette" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<TimerIcon />} 
                  label="20 min lesson" 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <BrushIcon sx={{ 
                fontSize: '120px',
                opacity: 0.3,
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
              }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Instructions Dialog */}
      <Dialog 
        open={showInstructions} 
        onClose={() => setShowInstructions(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <BrushIcon />
          Welcome to MS Paint Basics!
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              You'll be using JS Paint, a web-based version of MS Paint. Follow the instructions below to complete this lesson.
            </Typography>
          </Alert>
          
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Learning Objectives:
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2 }}>
            {paintInstructions.map((instruction, index) => (
              <Card key={index} sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                  <Box sx={{ 
                    color: '#4CAF50',
                    backgroundColor: '#E8F5E9',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex'
                  }}>
                    {instruction.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {instruction.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {instruction.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={() => setShowInstructions(false)}
            sx={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              px: 4
            }}
          >
            Start Learning
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight={600} color="#1e293b" gutterBottom sx={{ mb: 1 }}>
          Digital Art Canvas
        </Typography>
        <Typography variant="body1" color="#64748b" sx={{ mb: 4 }}>
          Use the tools below to create your digital artwork
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 300px)' }}>
          {/* Sidebar with tips */}
          <Paper sx={{ width: 300, p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpIcon color="primary" />
              Quick Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                <strong>Brush Tool:</strong> Click and drag to draw freehand lines
              </Alert>
              
              <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                <strong>Color Palette:</strong> Click on colors at the bottom to change your drawing color
              </Alert>
              
              <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                <strong>Shapes:</strong> Use rectangle, circle, and line tools for geometric shapes
              </Alert>
              
              <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
                <strong>Undo:</strong> Press Ctrl+Z or use Edit menu to undo mistakes
              </Alert>
            </Box>
            
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowInstructions(true)}
                startIcon={<HelpIcon />}
                sx={{ mb: 2 }}
              >
                Show Instructions
              </Button>
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleComplete}
                disabled={isCompleted}
                startIcon={isCompleted ? <CheckCircleIcon /> : <StarIcon />}
                sx={{ 
                  background: isCompleted 
                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                    : 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)'
                }}
              >
                {isCompleted ? 'Completed!' : 'Mark as Complete'}
              </Button>
            </Box>
          </Paper>

          {/* Paint Canvas */}
          <Paper sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* Fullscreen Button - Above iframe */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mb: 2,
              px: 1
            }}>
              <Button
                onClick={toggleFullscreen}
                startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                variant="contained"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 1)',
                    transform: 'scale(1.02)'
                  },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Full screen'}
              </Button>
            </Box>
            
            <Box sx={{ 
              height: 'calc(100% - 60px)',
              border: '2px solid #4CAF50',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* Loading Spinner */}
              {isLoading && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  zIndex: 1
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ color: '#4CAF50', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Loading MS Paint...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <iframe
                src="https://jspaint.app/"
                title="MS Paint - Digital Art Canvas"
                onLoad={handleIframeLoad}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                loading="eager"
              />
            </Box>
            
            {/* Overlay for completion */}
            {isCompleted && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 1 }} />
                  <Typography variant="h6" fontWeight={600} color="#4CAF50">
                    Great Job!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You've completed the MS Paint basics lesson
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Fullscreen Header */}
          <Box
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.95)',
              color: 'white',
              px: 2,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 40
            }}
          >
            <Typography 
              variant="subtitle1" 
              fontWeight={500}
              sx={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '1rem'
              }}
            >
              MS Paint
            </Typography>
            <IconButton
              onClick={toggleFullscreen}
              size="small"
              sx={{
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              <FullscreenExitIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Fullscreen Canvas */}
          <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {/* Fullscreen Loading Spinner */}
            {isFullscreenLoading && (
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                zIndex: 1
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress sx={{ color: '#4CAF50', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Loading Fullscreen...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <iframe
              src="https://jspaint.app/"
              title="MS Paint - Fullscreen Canvas"
              onLoad={handleFullscreenIframeLoad}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                opacity: isFullscreenLoading ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
              allow="clipboard-read; clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              loading="eager"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MSPaint; 