import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import axios from 'axios';

// Emotion detection constants
const EMOTIONS = ['happy', 'sad', 'angry', 'surprised', 'confused', 'neutral', 'focused'];
const SAMPLE_INTERVAL = 30000; // Sample emotion every 30 seconds

function EmotionTracker({ isActive = false, onEmotionDetected }) {
  const [permission, setPermission] = useState(false);
  const [emotionData, setEmotionData] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  // Request camera permissions
  const requestCameraPermission = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 320, height: 240 } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermission(true);
      setShowPermissionDialog(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please check your permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  // Close camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Simulate emotion detection (in real implementation, you would use a facial recognition API)
  const detectEmotion = () => {
    // In a real implementation, you would:
    // 1. Take a snapshot from the video stream
    // 2. Send it to an API for emotion analysis
    // 3. Get back the detected emotion
    
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Draw current video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Here you would normally:
      // 1. Convert the canvas to a blob/base64
      // 2. Send it to an emotion detection API
      
      // For now, simulate with random emotion (replace this with real API call)
      const emotions = EMOTIONS;
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const timestamp = new Date();
      const newEmotionData = {
        emotion: randomEmotion,
        timestamp: timestamp,
        timeString: timestamp.toLocaleTimeString()
      };
      
      setCurrentEmotion(randomEmotion);
      setEmotionData(prev => [...prev, newEmotionData]);
      
      // Send the detected emotion to parent component
      if (onEmotionDetected) {
        onEmotionDetected(newEmotionData);
      }
    }
  };

  // Start/stop emotion tracking when active state changes
  useEffect(() => {
    if (isActive && permission) {
      // Start emotion detection interval
      intervalRef.current = setInterval(detectEmotion, SAMPLE_INTERVAL);
      
      // Initial detection
      setTimeout(detectEmotion, 1000);
    } else {
      // Clear interval if not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, permission]);

  // Request permission dialog when component mounts
  useEffect(() => {
    if (!permission && isActive) {
      setShowPermissionDialog(true);
    }
    
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Box>
      {/* Hidden video element for webcam feed */}
      <Box sx={{ display: 'none' }}>
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={320}
          height={240}
        />
        <canvas 
          ref={canvasRef}
          width={320}
          height={240}
        />
      </Box>
      
      {/* Current emotion indicator (can be hidden or styled as needed) */}
      {permission && isActive && (
        <Paper 
          sx={{ 
            p: 2, 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: 'success.main',
              mr: 1,
              animation: 'pulse 2s infinite'
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            Emotion tracking active
          </Typography>
        </Paper>
      )}
      
      {/* Permission request dialog */}
      <Dialog
        open={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
      >
        <DialogTitle>Enable Emotion Tracking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            To personalize your learning experience, we can analyze your emotional state while studying.
          </Typography>
          <Typography variant="body1" paragraph>
            This helps identify when you're most focused or when you might be struggling with content.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your privacy is important. All processing happens locally on your device.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPermissionDialog(false)}>
            Not Now
          </Button>
          <Button 
            onClick={requestCameraPermission}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Allow Camera Access"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmotionTracker; 