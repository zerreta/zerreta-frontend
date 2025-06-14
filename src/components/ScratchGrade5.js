import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  ArrowBack, 
  PlayArrow, 
  Save, 
  Share,
  FullscreenExit,
  Fullscreen
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ScratchGrade5 = () => {
  const navigate = useNavigate();
  const scratchContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);


  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Iframe will load automatically

    // Listen for back button messages from Scratch iframe
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'GO_BACK') {
        handleBack();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('message', handleMessage);
    };
  }, []);



  const handleBack = () => {
    navigate('/student-dashboard/codezy');
  };



  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* Loading Screen */}
      {isLoading && (
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              Loading Scratch
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mb: 3 }}>
              Setting up your coding environment...
            </Typography>
            <Box sx={{ width: '300px', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#888' }}>
              {progress}% Complete
            </Typography>
          </Box>
        </Box>
      )}

      {/* Scratch GUI Container */}
      <Box 
        sx={{ 
          height: '100vh',
          width: '100vw',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'white'
        }}
      >
        <iframe
          ref={scratchContainerRef}
          src={`${window.location.origin}/scratch-gui-develop/standalone.html`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title="Scratch Programming Environment"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => {
            console.log('Scratch GUI loaded successfully');
            setTimeout(() => {
              setIsLoading(false);
              setProgress(100);
            }, 1000);
          }}
          onError={() => {
            console.error('Error loading Scratch GUI');
            setIsLoading(false);
          }}
        />
      </Box>




    </Box>
  );
};

export default ScratchGrade5; 