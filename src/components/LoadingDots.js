import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

// Define the bounce animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
`;

const LoadingDots = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, py: 2 }}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 10,
            height: 10,
            backgroundColor: '#7445f8',
            borderRadius: '50%',
            animation: `${bounce} 1.4s infinite ease-in-out both`,
            animationDelay: `${index * 0.16}s`
          }}
        />
      ))}
    </Box>
  );
};

export default LoadingDots; 