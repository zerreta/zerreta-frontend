import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PhETCredits = () => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate('/phet-license');
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
        This activity uses the all simulation created by PhET Interactive Simulations at the University of Colorado Boulder.
        © 2002–2025 University of Colorado. Used with permission.{' '}
        <Link
          component="button"
          variant="body2"
          onClick={handleLearnMoreClick}
          sx={{
            color: '#1976d2',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.875rem',
            border: 'none',
            background: 'none',
            p: 0
          }}
        >
          learn more
        </Link>
      </Typography>
    </Box>
  );
};

export default PhETCredits; 