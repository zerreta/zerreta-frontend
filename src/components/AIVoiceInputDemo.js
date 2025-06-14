import React, { useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import EnhancedAIVoiceInput from './EnhancedAIVoiceInput';

const AIVoiceInputDemo = () => {
  const [recordings, setRecordings] = useState([]);

  const handleStart = () => {
    console.log('Recording started');
  };

  const handleStop = (duration) => {
    console.log(`Recording stopped after ${duration} seconds`);
    setRecordings(prev => [...prev.slice(-4), { 
      duration, 
      timestamp: new Date(),
      id: Date.now()
    }]);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
        AI Voice Input Demo
      </Typography>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Interactive Voice Input
        </Typography>
        <EnhancedAIVoiceInput 
          onStart={handleStart}
          onStop={handleStop}
          visualizerBars={48}
        />
      </Paper>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          Demo Mode (Auto-playing)
        </Typography>
        <EnhancedAIVoiceInput 
          onStart={() => console.log('Demo recording started')}
          onStop={(duration) => console.log(`Demo recording: ${duration}s`)}
          demoMode={true}
          demoInterval={4000}
          visualizerBars={64}
        />
      </Paper>

      {recordings.length > 0 && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recording History
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {recordings.map((recording) => (
              <Chip
                key={recording.id}
                label={`${recording.duration}s - ${recording.timestamp.toLocaleTimeString()}`}
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Paper>
      )}

      <Box sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Features</Typography>
        <ul>
          <li><strong>Clean minimalist design</strong> - Inspired by modern AI interfaces</li>
          <li><strong>Real-time audio visualizer</strong> - 48 animated bars showing recording activity</li>
          <li><strong>Precise timing</strong> - Shows recording duration in MM:SS format</li>
          <li><strong>Demo mode</strong> - Auto-playing demonstration for showcasing</li>
          <li><strong>Responsive design</strong> - Works seamlessly on all screen sizes</li>
          <li><strong>MUI integration</strong> - Fully compatible with Material-UI theming</li>
          <li><strong>Smooth animations</strong> - CSS transitions and keyframe animations</li>
        </ul>
      </Box>
    </Box>
  );
};

export default AIVoiceInputDemo; 