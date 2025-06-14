import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Mic } from 'lucide-react';

const EnhancedAIVoiceInput = ({ 
  onStart, 
  onStop, 
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [startTime, setStartTime] = useState(null);

  // Timer effect
  useEffect(() => {
    let intervalId;
    if (isRecording && startTime) {
      intervalId = setInterval(() => {
        setTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(intervalId);
  }, [isRecording, startTime]);

  // Demo mode effect
  useEffect(() => {
    if (!isDemo) return;

    let timeoutId;
    const runAnimation = () => {
      setIsRecording(true);
      const demoStartTime = Date.now();
      setStartTime(demoStartTime);
      
      timeoutId = setTimeout(() => {
        setIsRecording(false);
        setStartTime(null);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (disabled) return;
    
    if (isDemo) {
      setIsDemo(false);
      setIsRecording(false);
      setStartTime(null);
      return;
    }

    if (!isRecording) {
      // Start recording
      const recordStartTime = Date.now();
      setStartTime(recordStartTime);
      setIsRecording(true);
      onStart?.();
    } else {
      // Stop recording
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setIsRecording(false);
      setStartTime(null);
      onStop?.(duration);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      py: 0.5,
      justifyContent: 'flex-start',
      maxWidth: '200px'
    }}>
      {/* Compact Button */}
      <Button
        onClick={handleClick}
        disabled={disabled}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          minWidth: 'unset',
          background: 'transparent',
          border: 'none',
          color: isRecording ? '#ff4757' : 'rgba(0,0,0,0.7)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)',
            transform: 'scale(1.05)'
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
          }
        }}
      >
        {isRecording ? (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '1px',
              backgroundColor: '#ff4757',
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
        ) : (
          <Mic size={16} color="rgba(0,0,0,0.7)" />
        )}
      </Button>

      {/* Minimal Info */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}>
        {/* Timer */}
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: isRecording ? '#ff4757' : 'rgba(0,0,0,0.5)',
            minWidth: '35px'
          }}
        >
          {formatTime(time)}
        </Typography>

        {/* Mini Visualizer */}
        <Box sx={{ 
          height: 6,
          width: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 0.5
        }}>
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 1.5,
                borderRadius: '0.5px',
                backgroundColor: isRecording 
                  ? '#ff4757' 
                  : 'rgba(0,0,0,0.1)',
                height: isRecording 
                  ? `${40 + Math.random() * 60}%`
                  : 1.5,
                transition: 'all 0.3s ease',
                animation: isRecording 
                  ? `pulse 1s ease-in-out infinite ${i * 0.15}s`
                  : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 }
                }
              }}
            />
          ))}
        </Box>

        {/* Status indicator */}
        {isRecording && (
          <Box sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#ff4757',
            animation: 'blink 1s ease-in-out infinite',
            '@keyframes blink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.3 }
            }
          }} />
        )}
      </Box>
    </Box>
  );
};

export default EnhancedAIVoiceInput; 