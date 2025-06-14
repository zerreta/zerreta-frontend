import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { EmojiEvents as LeaderboardIcon } from '@mui/icons-material';

const NEETLeaderboard = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        borderRadius: 4
      }}>
        <LeaderboardIcon sx={{ fontSize: 80, color: '#e91e63', mb: 3 }} />
        <Typography variant="h3" fontWeight={700} color="#c2185b" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          National rankings coming soon...
        </Typography>
      </Paper>
    </Container>
  );
};

export default NEETLeaderboard; 