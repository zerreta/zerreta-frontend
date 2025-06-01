import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Alert,
  CircularProgress,
  IconButton,
  Toolbar,
  AppBar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';

const Vocabulary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  
  const knowordUrl = 'https://knoword.com/packs/original';

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  const handleOpenInNewTab = () => {
    window.open(knowordUrl, '_blank');
  };

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setIframeError(true);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal Header */}
      <AppBar position="static" sx={{ backgroundColor: '#7445f8', minHeight: 'auto' }}>
        <Toolbar sx={{ minHeight: '44px !important', py: 0.75 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ 
              mr: 0.5, 
              p: 0.25,
              minWidth: 'auto',
              width: 28,
              height: 28,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
          
          <Typography variant="body2" sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
            Vocabulary
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Info Bar */}
      {!isFullscreen && (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Explore Knoword's Original Vocabulary Packs:</strong> Interactive vocabulary learning with high-quality content covering diverse subjects and learning themes.
          </Typography>
        </Box>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          p: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading Knoword original packs...
          </Typography>
        </Box>
      )}

      {/* Iframe Container */}
      <Box sx={{ 
        flex: 1, 
        position: 'relative',
        backgroundColor: '#fff'
      }}>
        {iframeError ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            p: 4
          }}>
            <Alert severity="warning" sx={{ mb: 3, maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>
                Content Blocked
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Knoword.com may be blocking iframe access for security reasons. 
                You can still access the original vocabulary packs by opening them in a new tab.
              </Typography>
            </Alert>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<OpenInNewIcon />}
              onClick={handleOpenInNewTab}
              sx={{ 
                backgroundColor: '#7445f8',
                '&:hover': { backgroundColor: '#5c33d4' }
              }}
            >
              Open Knoword Original Packs
            </Button>
            
            <Button
              variant="text"
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <iframe
            key={iframeKey}
            src={knowordUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="Knoword Original Vocabulary Packs"
            allow="fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          />
        )}
      </Box>

      {/* Bottom Info Bar for Fullscreen */}
      {isFullscreen && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          color: 'white', 
          p: 1, 
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2">
            📚 Knoword Original Vocabulary Packs
          </Typography>
          <Box>
            <IconButton size="small" sx={{ color: 'white' }} onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }} onClick={toggleFullscreen}>
              <FullscreenExitIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Vocabulary; 