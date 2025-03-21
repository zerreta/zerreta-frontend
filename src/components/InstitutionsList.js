import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import axiosInstance from './axios-config';

function InstitutionsList() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newInstitution, setNewInstitution] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get all students to extract institutions
      const response = await axiosInstance.get('/admin/students');
      const students = response.data;
      
      // Extract unique institutions from students
      const uniqueInstitutions = Array.from(
        new Set(students.map(student => student.institution || 'Default Institution'))
      );
      
      // Store in localStorage for persistence
      localStorage.setItem('institutions', JSON.stringify(uniqueInstitutions));
      
      setInstitutions(uniqueInstitutions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Try to load from localStorage if API fails
      const savedInstitutions = localStorage.getItem('institutions');
      if (savedInstitutions) {
        setInstitutions(JSON.parse(savedInstitutions));
      } else {
        // If nothing in localStorage, provide a default
        setInstitutions(['Default Institution']);
        localStorage.setItem('institutions', JSON.stringify(['Default Institution']));
      }
      
      setError('Failed to fetch data from server. Using local data.');
      setLoading(false);
    }
  };
  
  const handleAddInstitution = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewInstitution('');
  };
  
  const handleSaveInstitution = () => {
    if (!newInstitution.trim()) {
      return;
    }
    
    // Add new institution to the list
    const updatedInstitutions = [...institutions, newInstitution.trim()];
    
    // Save to localStorage
    localStorage.setItem('institutions', JSON.stringify(updatedInstitutions));
    
    // Update state
    setInstitutions(updatedInstitutions);
    
    // Close dialog
    handleCloseDialog();
  };

  const handleInstitutionClick = (institution) => {
    // Store current institution in localStorage for reference
    localStorage.setItem('currentInstitution', institution);
    navigate(`/admin/institutions/${encodeURIComponent(institution)}`);
  };

  const filteredInstitutions = institutions.filter(institution =>
    institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Institutions
      </Typography>

      {error && <Alert severity="info" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <TextField
            variant="outlined"
            placeholder="Search institutions..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <IconButton size="small" sx={{ mr: 0.5 }}>
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddInstitution}
        >
          Add Institution
        </Button>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredInstitutions.length > 0 ? (
        <Grid container spacing={3}>
          {filteredInstitutions.map((institution, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleInstitutionClick(institution)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {institution}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No institutions found.</Alert>
      )}
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Institution</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Institution Name"
            fullWidth
            value={newInstitution}
            onChange={(e) => setNewInstitution(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveInstitution} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InstitutionsList; 