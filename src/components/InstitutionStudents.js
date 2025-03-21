import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';

function InstitutionStudents() {
  const { institution } = useParams();
  const navigate = useNavigate();
  const decodedInstitution = decodeURIComponent(institution || localStorage.getItem('currentInstitution') || 'Default Institution');
  
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    username: '',
    password: '',
    institution: decodedInstitution,
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

  const subjects = ['physics', 'chemistry', 'botany', 'zoology'];
  const levels = ['1', '2', '3', '4', '5'];
  const stages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  useEffect(() => {
    fetchStudents();
  }, [decodedInstitution]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Get all students and filter client-side
      const response = await axiosInstance.get('/admin/students');
      const allStudentsData = response.data;
      setAllStudents(allStudentsData);
      
      // Filter for the current institution
      const filteredStudents = allStudentsData.filter(
        student => (student.institution || 'Default Institution') === decodedInstitution
      );
      
      setStudents(filteredStudents);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        studentId: student.studentId || '',
        name: student.name || '',
        username: student.username || '',
        password: student.password || '',
        institution: student.institution || decodedInstitution,
        subjects: student.subjects || {
          physics: { level: '1', stage: '1' },
          chemistry: { level: '1', stage: '1' },
          botany: { level: '1', stage: '1' },
          zoology: { level: '1', stage: '1' }
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
        username: '',
        password: '',
        institution: decodedInstitution,
        subjects: {
          physics: { level: '1', stage: '1' },
          chemistry: { level: '1', stage: '1' },
          botany: { level: '1', stage: '1' },
          zoology: { level: '1', stage: '1' }
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
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }

      if (!formData.studentId || !formData.name || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      let response;
      if (selectedStudent) {
        response = await axiosInstance.put(
          `/admin/students/${selectedStudent._id}`,
          formData
        );
      } else {
        response = await axiosInstance.post(
          '/admin/students',
          formData
        );
      }
      
      if (response && response.data) {
        // Immediately update local state to avoid refetching
        if (selectedStudent) {
          // Update the student in both arrays
          const updatedStudent = { ...selectedStudent, ...formData };
          setAllStudents(allStudents.map(s => s._id === selectedStudent._id ? updatedStudent : s));
          setStudents(students.map(s => s._id === selectedStudent._id ? updatedStudent : s));
        } else {
          // Add the new student to both arrays if it belongs to this institution
          const newStudent = response.data.student;
          setAllStudents([...allStudents, newStudent]);
          if (newStudent.institution === decodedInstitution) {
            setStudents([...students, newStudent]);
          }
        }
        
        // Also refresh the whole list
        fetchStudents();
        handleCloseDialog();
      } else {
        throw new Error('No response from server');
      }
    } catch (err) {
      console.error("Error saving student data:", err);
      setError('Failed to save student: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axiosInstance.delete(`/admin/students/${studentId}`);
        
        // Update local state
        setAllStudents(allStudents.filter(s => s._id !== studentId));
        setStudents(students.filter(s => s._id !== studentId));
      } catch (err) {
        console.error('Error deleting student:', err);
        setError('Failed to delete student: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const togglePasswordVisibility = (studentId) => {
    setShowPasswords({
      ...showPasswords,
      [studentId]: !showPasswords[studentId]
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          sx={{ mr: 1 }} 
          onClick={() => navigate('/admin/institutions')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link 
              underline="hover" 
              color="inherit" 
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/institutions')}
            >
              Institutions
            </Link>
            <Typography color="text.primary">{decodedInstitution}</Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {decodedInstitution} Students
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Student
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {students.length === 0 ? (
            <Alert severity="info">No students found for this institution.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Physics</TableCell>
                    <TableCell>Chemistry</TableCell>
                    <TableCell>Botany</TableCell>
                    <TableCell>Zoology</TableCell>
                    <TableCell>Actions</TableCell>
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
                          >
                            {showPasswords[student._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        Stage: {student.subjects?.physics?.stage || 1}, Level: {student.subjects?.physics?.level || 1}
                      </TableCell>
                      <TableCell>
                        Stage: {student.subjects?.chemistry?.stage || 1}, Level: {student.subjects?.chemistry?.level || 1}
                      </TableCell>
                      <TableCell>
                        Stage: {student.subjects?.botany?.stage || 1}, Level: {student.subjects?.botany?.level || 1}
                      </TableCell>
                      <TableCell>
                        Stage: {student.subjects?.zoology?.stage || 1}, Level: {student.subjects?.zoology?.level || 1}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenDialog(student)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(student._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
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
                  fullWidth
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Institution"
                  fullWidth
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  required
                />
              </Grid>
              
              {subjects.map(subject => (
                <Grid item xs={12} sm={6} key={subject}>
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
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>Additional Fields</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Field 1"
                  fullWidth
                  value={formData.column1}
                  onChange={(e) => setFormData({ ...formData, column1: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Field 2"
                  fullWidth
                  value={formData.column2}
                  onChange={(e) => setFormData({ ...formData, column2: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Field 3"
                  fullWidth
                  value={formData.column3}
                  onChange={(e) => setFormData({ ...formData, column3: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Field 4"
                  fullWidth
                  value={formData.column4}
                  onChange={(e) => setFormData({ ...formData, column4: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  label="Field 5"
                  fullWidth
                  value={formData.column5}
                  onChange={(e) => setFormData({ ...formData, column5: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InstitutionStudents; 