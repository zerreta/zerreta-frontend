import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as EmojiEventsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [institutions, setInstitutions] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    username: '',
    password: '',
    institution: 'Default Institution',
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

  useEffect(() => {
    fetchStudents();
    fetchInstitutions();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching students from backend...');
      const response = await axiosInstance.get('/admin/students');
      
      console.log('Student data received:', response.data);
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await axiosInstance.get('/admin/institutions');
      setInstitutions(response.data);
    } catch (err) {
      console.error('Error fetching institutions:', err);
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
        institution: student.institution || 'Default Institution',
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
        institution: 'Default Institution',
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
    setFormData({
      studentId: '',
      name: '',
      username: '',
      password: '',
      institution: 'Default Institution',
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
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }

      // Ensure all required fields are filled
      if (!formData.studentId || !formData.name || !formData.username || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      // Ensure all subject fields have values (default to "1" if empty)
      const formattedData = {
        ...formData,
        subjects: {
          physics: {
            level: formData.subjects.physics.level || "1",
            stage: formData.subjects.physics.stage || "1"
          },
          chemistry: {
            level: formData.subjects.chemistry.level || "1",
            stage: formData.subjects.chemistry.stage || "1"
          },
          botany: {
            level: formData.subjects.botany.level || "1",
            stage: formData.subjects.botany.stage || "1"
          },
          zoology: {
            level: formData.subjects.zoology.level || "1",
            stage: formData.subjects.zoology.stage || "1"
          }
        }
      };

      console.log('Submitting data:', formattedData);

      let response;
      if (selectedStudent) {
        response = await axiosInstance.put(
          `/admin/students/${selectedStudent._id}`,
          formattedData,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Update response:', response.data);
      } else {
        response = await axiosInstance.post(
          '/admin/students',
          formattedData,
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        console.log('Create response:', response.data);
      }
      
      if (response && response.data) {
        fetchStudents();
        handleCloseDialog();
      } else {
        throw new Error('No response from server');
      }
    } catch (err) {
      console.error("Error saving student data:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setError(`Failed to save student data: ${err.response.data.message || err.response.statusText || 'Server error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Request error:", err.request);
        setError('Failed to save student data: No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setError(`Failed to save student data: ${err.message}`);
      }
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/admin/students/${studentId}`, {
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

  const stats = [
    { title: 'Total Students', value: students.length, icon: <GroupIcon /> },
    { title: 'Active Courses', value: '4', icon: <SchoolIcon /> },
    { title: 'Average Performance', value: '85%', icon: <AssessmentIcon /> },
    { title: 'Top Achievers', value: '12', icon: <EmojiEventsIcon /> }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary">
                Total Students
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={24} /> : students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary">
                Institutions
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={24} /> : institutions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 2, 
                      display: 'flex',
                      bgcolor: '#7445f8', 
                      color: 'white',
                      mr: 2
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" color="textSecondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h3" color="#7445f8" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Student Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            bgcolor: '#7445f8',
            '&:hover': {
              bgcolor: '#5c33d4',
            }
          }}
        >
          Add Student
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
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
                        {showPasswords[student._id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {student.subjects?.physics ? `L${student.subjects.physics.level}-S${student.subjects.physics.stage}` : 'Not Set'}
                  </TableCell>
                  <TableCell>
                    {student.subjects?.chemistry ? `L${student.subjects.chemistry.level}-S${student.subjects.chemistry.stage}` : 'Not Set'}
                  </TableCell>
                  <TableCell>
                    {student.subjects?.botany ? `L${student.subjects.botany.level}-S${student.subjects.botany.stage}` : 'Not Set'}
                  </TableCell>
                  <TableCell>
                    {student.subjects?.zoology ? `L${student.subjects.zoology.level}-S${student.subjects.zoology.stage}` : 'Not Set'}
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

      {/* Add/Edit Student Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStudent ? 'Edit Student' : 'Add New Student'}
        </DialogTitle>
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
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Subject Levels and Stages
                </Typography>
              </Grid>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={3} key={subject}>
                  <Typography variant="subtitle1" gutterBottom>
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Level</InputLabel>
                        <Select
                          value={formData.subjects[subject].level}
                          onChange={(e) => handleSubjectChange(subject, 'level', e.target.value)}
                          label="Level"
                        >
                          <MenuItem value="">None</MenuItem>
                          {levels.map((level) => (
                            <MenuItem key={level} value={level}>Level {level}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Stage</InputLabel>
                        <Select
                          value={formData.subjects[subject].stage}
                          onChange={(e) => handleSubjectChange(subject, 'stage', e.target.value)}
                          label="Stage"
                          disabled={!formData.subjects[subject].level}
                        >
                          <MenuItem value="">None</MenuItem>
                          {stages.map((stage) => (
                            <MenuItem key={stage} value={stage}>Stage {stage}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Additional Fields (Optional)
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Field 1"
                    name="column1"
                    value={formData.column1}
                    onChange={(e) => setFormData({ ...formData, column1: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Field 2"
                    name="column2"
                    value={formData.column2}
                    onChange={(e) => setFormData({ ...formData, column2: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Field 3"
                    name="column3"
                    value={formData.column3}
                    onChange={(e) => setFormData({ ...formData, column3: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Field 4"
                    name="column4"
                    value={formData.column4}
                    onChange={(e) => setFormData({ ...formData, column4: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Field 5"
                    name="column5"
                    value={formData.column5}
                    onChange={(e) => setFormData({ ...formData, column5: e.target.value })}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard; 