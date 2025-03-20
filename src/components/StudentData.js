import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './axios-config';

function StudentData() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    age: '',
    grade: '',
    performance: '',
    username: '',
    password: '',
    subjects: {
      physics: { level: '', stage: '' },
      chemistry: { level: '', stage: '' },
      botany: { level: '', stage: '' },
      zoology: { level: '', stage: '' }
    },
    // Extra columns for future use
    column1: '',
    column2: '',
    column3: '',
    column4: '',
    column5: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        studentId: student.studentId || '',
        name: student.name,
        age: student.age || '',
        grade: student.grade || '',
        performance: student.performance || '',
        username: student.username || '',
        password: student.password || '',
        subjects: student.subjects || {
          physics: { level: '', stage: '' },
          chemistry: { level: '', stage: '' },
          botany: { level: '', stage: '' },
          zoology: { level: '', stage: '' }
        },
        column1: student.column1 || '',
        column2: student.column2 || '',
        column3: student.column3 || '',
        column4: student.column4 || '',
        column5: student.column5 || ''
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        studentId: '',
        name: '',
        age: '',
        grade: '',
        performance: '',
        username: '',
        password: '',
        subjects: {
          physics: { level: '', stage: '' },
          chemistry: { level: '', stage: '' },
          botany: { level: '', stage: '' },
          zoology: { level: '', stage: '' }
        },
        column1: '',
        column2: '',
        column3: '',
        column4: '',
        column5: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setFormData({
      studentId: '',
      name: '',
      age: '',
      grade: '',
      performance: '',
      username: '',
      password: '',
      subjects: {
        physics: { level: '', stage: '' },
        chemistry: { level: '', stage: '' },
        botany: { level: '', stage: '' },
        zoology: { level: '', stage: '' }
      },
      column1: '',
      column2: '',
      column3: '',
      column4: '',
      column5: ''
    });
  };

  const handleSubjectChange = (subject, field, value) => {
    setFormData({
      ...formData,
      subjects: {
        ...formData.subjects,
        [subject]: {
          ...formData.subjects[subject],
          [field]: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (selectedStudent) {
        await axios.put(
          `/admin/students/${selectedStudent._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/admin/students`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchStudents();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save student data');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/admin/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const togglePasswordVisibility = (studentId) => {
    setShowPasswords(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const subjects = ['physics', 'chemistry', 'botany', 'zoology'];
  const levels = ['1', '2', '3', '4'];
  const stages = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
          Student Data Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mr: 2 }}
          >
            Add New Student
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Performance</TableCell>
                {subjects.map(subject => (
                  <TableCell key={subject} colSpan={2}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </TableCell>
                ))}
                <TableCell>Column 1</TableCell>
                <TableCell>Column 2</TableCell>
                <TableCell>Column 3</TableCell>
                <TableCell>Column 4</TableCell>
                <TableCell>Column 5</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                {subjects.map(subject => (
                  <React.Fragment key={subject}>
                    <TableCell>Level</TableCell>
                    <TableCell>Stage</TableCell>
                  </React.Fragment>
                ))}
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.username}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {showPasswords[student._id] ? student.password : '••••••••'}
                      <IconButton
                        size="small"
                        onClick={() => togglePasswordVisibility(student._id)}
                        sx={{ ml: 1 }}
                      >
                        {showPasswords[student._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.performance}</TableCell>
                  {subjects.map(subject => (
                    <React.Fragment key={subject}>
                      <TableCell>{student.subjects?.[subject]?.level || '-'}</TableCell>
                      <TableCell>{student.subjects?.[subject]?.stage || '-'}</TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell>{student.column1 || '-'}</TableCell>
                  <TableCell>{student.column2 || '-'}</TableCell>
                  <TableCell>{student.column3 || '-'}</TableCell>
                  <TableCell>{student.column4 || '-'}</TableCell>
                  <TableCell>{student.column5 || '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(student)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(student._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStudent ? 'Edit Student Data' : 'Add New Student'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Student ID"
                  fullWidth
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Username"
                  fullWidth
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Age"
                  type="number"
                  fullWidth
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Grade"
                  fullWidth
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Performance"
                  fullWidth
                  value={formData.performance}
                  onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                  required
                />
              </Grid>
              {subjects.map(subject => (
                <Grid item xs={12} key={subject}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select
                          value={formData.subjects[subject].level}
                          label="Level"
                          onChange={(e) => handleSubjectChange(subject, 'level', e.target.value)}
                        >
                          {levels.map(level => (
                            <MenuItem key={level} value={level}>Level {level}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Stage</InputLabel>
                        <Select
                          value={formData.subjects[subject].stage}
                          label="Stage"
                          onChange={(e) => handleSubjectChange(subject, 'stage', e.target.value)}
                        >
                          {stages.map(stage => (
                            <MenuItem key={stage} value={stage}>Stage {stage}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Column 1"
                  fullWidth
                  value={formData.column1}
                  onChange={(e) => setFormData({ ...formData, column1: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Column 2"
                  fullWidth
                  value={formData.column2}
                  onChange={(e) => setFormData({ ...formData, column2: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Column 3"
                  fullWidth
                  value={formData.column3}
                  onChange={(e) => setFormData({ ...formData, column3: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Column 4"
                  fullWidth
                  value={formData.column4}
                  onChange={(e) => setFormData({ ...formData, column4: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Column 5"
                  fullWidth
                  value={formData.column5}
                  onChange={(e) => setFormData({ ...formData, column5: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedStudent ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default StudentData; 