import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const NEETAnalyticsSummary = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        borderRadius: 4
      }}>
        <AssessmentIcon sx={{ fontSize: 80, color: '#9c27b0', mb: 3 }} />
        <Typography variant="h3" fontWeight={700} color="#7b1fa2" gutterBottom>
          Analytics Summary
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive performance overview coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default NEETAnalyticsSummary; 