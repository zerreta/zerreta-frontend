import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Lightbulb as AIHelpIcon } from '@mui/icons-material';

const NEETAIHelp = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #fffde7 0%, #fff176 100%)',
        borderRadius: 4
      }}>
        <AIHelpIcon sx={{ fontSize: 80, color: '#ffeb3b', mb: 3 }} />
        <Typography variant="h3" fontWeight={700} color="#f9a825" gutterBottom>
          AI Help
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Advanced AI tutor coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default NEETAIHelp; 