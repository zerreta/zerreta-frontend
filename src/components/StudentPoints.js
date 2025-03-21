import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import axiosInstance from './axios-config';

const StudentPoints = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching students for N.POINTS calculation...');
        // First, get all students
        const response = await axiosInstance.get('/admin/students');
        
        // Process the student data to calculate N.POINTS
        const processedStudents = response.data.map(student => {
          // Calculate total levels cleared across all subjects
          let totalLevelsCleared = 0;
          
          if (student.subjects) {
            const { physics, chemistry, botany, zoology } = student.subjects;
            
            // Convert level strings to numbers and subtract 1 (since level 1 means 0 levels cleared)
            const physicsLevel = parseInt(physics.level || '1') - 1;
            const chemistryLevel = parseInt(chemistry.level || '1') - 1;
            const botanyLevel = parseInt(botany.level || '1') - 1;
            const zoologyLevel = parseInt(zoology.level || '1') - 1;
            
            // Sum up the levels cleared (ensure they're not negative)
            totalLevelsCleared = 
              Math.max(0, physicsLevel) + 
              Math.max(0, chemistryLevel) + 
              Math.max(0, botanyLevel) + 
              Math.max(0, zoologyLevel);
          }
          
          // Calculate N.POINTS (25 points per level cleared)
          const nPoints = totalLevelsCleared * 25;
          
          return {
            ...student,
            levelsCleared: totalLevelsCleared,
            nPoints
          };
        });
        
        // Sort students by N.POINTS in descending order
        processedStudents.sort((a, b) => b.nPoints - a.nPoints);
        
        console.log(`Processed ${processedStudents.length} students with N.POINTS`);
        setStudents(processedStudents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Student N.POINTS
      </Typography>

      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            About N.POINTS
          </Typography>
          <Typography variant="body1">
            N.POINTS are awarded to students based on their progress through levels. Each level completed earns the student 25 N.POINTS.
            These points help track student progress and can be used for recognition and rewards.
          </Typography>
        </CardContent>
      </Card>

      <TextField
        fullWidth
        sx={{ mb: 3 }}
        placeholder="Search students by name or ID"
        variant="outlined"
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Levels Cleared</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>N.POINTS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student._id} hover>
                  <TableCell>
                    {index < 3 ? (
                      <Chip
                        icon={<TrophyIcon />}
                        label={index + 1}
                        sx={{
                          backgroundColor: 
                            index === 0 ? '#FFD700' : 
                            index === 1 ? '#C0C0C0' : 
                            '#CD7F32',
                          color: index === 0 ? '#000' : '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                    ) : (
                      index + 1
                    )}
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.levelsCleared}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" color="primary">
                      {student.nPoints}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No students found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StudentPoints; 