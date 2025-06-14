import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const PhETLicense = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            '&:hover': {
              borderColor: '#5c33d4',
              backgroundColor: 'rgba(116, 69, 248, 0.04)',
            }
          }}
        >
          Back
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
          PhET Interactive Simulations License
        </Typography>
        
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Attribution and Usage Rights
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          This activity uses simulations created by PhET Interactive Simulations at the University of Colorado Boulder.
          © 2002–2025 University of Colorado. Used with permission.
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Creative Commons Attribution License
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          PhET Interactive Simulations requires that all submitted content (lessons, activities, etc.) be available 
          under an Open Content license that allows others to use, distribute, and create derivative works based upon 
          that content. The Creative Commons Attribution License fulfills this requirement, while still allowing 
          authors to receive credit for their efforts.
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          I hereby allow PhET Interactive Simulations to distribute this content under the terms of the Creative 
          Commons Attribution License available at{' '}
          <a 
            href="http://creativecommons.org/licenses/by/4.0/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            http://creativecommons.org/licenses/by/4.0/
          </a>
          . I understand that in doing so I:
        </Typography>

        <Box component="ol" sx={{ pl: 3, mt: 2 }}>
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            <strong>retain my copyright in the work</strong> and
          </Typography>
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            <strong>warrant that I am the author or the owner or have permission to distribute the work in question</strong> and
          </Typography>
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            <strong>wish this work to be distributed under the terms of that license</strong> (including allowing modification of this work and requiring attribution) and
          </Typography>
          <Typography component="li" variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            <strong>agree that proper attribution of my work is any attribution that includes the authors' names, the title of the work, and the PhET Interactive Simulations' URL link to the work.</strong>
          </Typography>
        </Box>

        <Box sx={{ mt: 4, p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> All PhET simulations are freely available from the PhET website and are licensed under the Creative Commons Attribution License.
            For more information about PhET Interactive Simulations, visit{' '}
            <a 
              href="https://phet.colorado.edu" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              https://phet.colorado.edu
            </a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PhETLicense; 