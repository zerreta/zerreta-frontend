import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const subjects = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'botany', name: 'Botany' },
  { id: 'zoology', name: 'Zoology' },
];

const getStageName = (stageNumber) => {
  const stageNames = [
    'Foundation',
    'Basic Concepts',
    'Intermediate',
    'Advanced',
    'Complex Systems',
    'Problem Solving',
    'Analysis',
    'Synthesis',
    'Application',
    'Integration',
    'Mastery',
    'Expertise',
  ];
  return stageNames[stageNumber - 1] || `Stage ${stageNumber}`;
};

const getLevelName = (levelNumber) => {
  const levelNames = [
    'Introduction',
    'Understanding',
    'Practice',
    'Mastery',
  ];
  return levelNames[levelNumber - 1] || `Level ${levelNumber}`;
};

function StudentLevels() {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };

  const getStudentProgress = (student) => {
    // This would come from your backend in a real application
    // For now, we'll use mock data
    return {
      stage: 1,
      level: 1,
      progress: 100,
      isLocked: false,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Progress Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedSubject}
          onChange={handleSubjectChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {subjects.map((subject) => (
            <Tab
              key={subject.id}
              label={subject.name}
              value={subject.id}
            />
          ))}
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Current Stage</TableCell>
              <TableCell>Current Level</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const progress = getStudentProgress(student);
              return (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrophyIcon color="primary" />
                      {getStageName(progress.stage)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon color="primary" />
                      {getLevelName(progress.level)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" color="textSecondary">
                          {progress.progress}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          bgcolor: 'grey.200',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${progress.progress}%`,
                            height: '100%',
                            bgcolor: 'primary.main',
                            transition: 'width 0.3s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={progress.isLocked ? <LockIcon /> : <StarIcon />}
                      label={progress.isLocked ? 'Locked' : 'Active'}
                      color={progress.isLocked ? 'default' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StudentLevels; 