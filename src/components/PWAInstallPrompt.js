import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Snackbar, 
  Alert, 
  Typography 
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already installed or dismissed
    const hasPrompted = localStorage.getItem('pwaPromptDismissed');
    
    // Event listener for beforeinstallprompt
    const handleBeforeInstallPrompt = (event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(event);
      
      // Only show if not previously dismissed
      if (!hasPrompted) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
      setShowPrompt(false);
    });
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  return (
    <Snackbar 
      open={showPrompt} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert 
        severity="info" 
        sx={{ 
          width: '100%', 
          bgcolor: '#7445f8', 
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Install Zerreta NEET for a better experience
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleInstallClick}
            startIcon={<GetAppIcon />}
            sx={{ 
              bgcolor: 'white', 
              color: '#7445f8',
              mt: { xs: 1, sm: 0 },
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Install
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt; 