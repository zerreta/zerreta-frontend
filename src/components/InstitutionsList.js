import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axiosInstance from './axios-config';

function InstitutionsList() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [studentsCount, setStudentsCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInstitutions();
    fetchStudentCounts();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/institutions');
      setInstitutions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Failed to fetch institutions: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const fetchStudentCounts = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      
      // Create a count of students per institution
      const counts = {};
      response.data.forEach(student => {
        const institution = student.institution || 'Default Institution';
        counts[institution] = (counts[institution] || 0) + 1;
      });
      
      setStudentsCount(counts);
    } catch (err) {
      console.error('Error fetching student counts:', err);
    }
  };

  const handleInstitutionClick = (institution) => {
    navigate(`/admin/institutions/${encodeURIComponent(institution)}`);
  };

  const filteredInstitutions = institutions.filter(institution => 
    institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Institutions
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        placeholder="Search institutions..."
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredInstitutions.length === 0 ? (
            <Alert severity="info">No institutions found.</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredInstitutions.map((institution, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardActionArea onClick={() => handleInstitutionClick(institution)}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <SchoolIcon sx={{ fontSize: 40, color: '#7445f8', mr: 2 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {institution}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          Students: {studentsCount[institution] || 0}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}

export default InstitutionsList; 