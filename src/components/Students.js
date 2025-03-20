import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import axiosInstance from './axios-config';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& .MuiTableCell-head': {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  
  // Add student dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ username: '', password: '' });
  const [addLoading, setAddLoading] = useState(false);
  
  // Edit password dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editStudent, setEditStudent] = useState({ id: '', username: '', newPassword: '' });
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete student dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState({ id: '', username: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching students with token:', token);
      
      // Make sure the token is properly formatted in the Authorization header
      const authHeader = `Bearer ${token}`;
      console.log('Authorization header:', authHeader);
      
      const response = await axios.get(`/admin/students`, {
        headers: { 
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Students API response:', response.data);
      setStudents(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.status === 401 || error.response.status === 403) {
          setError('Authentication error. Please log in again.');
        } else {
          setError(error.response.data?.message || 'Failed to fetch students');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response from server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError('Error setting up request: ' + error.message);
      }
      
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    setAddLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setAddLoading(false);
        return;
      }
      
      const authHeader = `Bearer ${token}`;
      
      await axios.post(`/admin/add-student`, 
        newStudent,
        {
          headers: { 
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage('Student added successfully!');
      setNewStudent({ username: '', password: '' });
      setError('');
      setShowSnackbar(true);
      setOpenAddDialog(false);
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.response?.data?.message || 'Failed to add student');
      setMessage('');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditPassword = async () => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setEditLoading(false);
        return;
      }
      
      const authHeader = `Bearer ${token}`;
      
      await axios.put(`/admin/update-student/${editStudent.id}`, 
        { password: editStudent.newPassword },
        {
          headers: { 
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMessage('Password updated successfully!');
      setEditStudent({ id: '', username: '', newPassword: '' });
      setError('');
      setShowSnackbar(true);
      setOpenEditDialog(false);
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Failed to update password');
      setMessage('');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setDeleteLoading(false);
        return;
      }
      
      const authHeader = `Bearer ${token}`;
      
      await axios.delete(`/admin/delete-student/${deleteStudent.id}`, {
        headers: { 
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      setMessage('Student deleted successfully!');
      setDeleteStudent({ id: '', username: '' });
      setError('');
      setShowSnackbar(true);
      setOpenDeleteDialog(false);
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error deleting student:', error);
      setError(error.response?.data?.message || 'Failed to delete student');
      setMessage('');
    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom component={motion.h4} variants={itemVariants}>
          Student Management
        </Typography>
        <Typography variant="body1" color="textSecondary" component={motion.p} variants={itemVariants}>
          Add, edit, and manage student accounts
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} component={motion.div} variants={itemVariants}>
          <StyledCard>
            <StyledCardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Student List
                </Typography>
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<RefreshIcon />} 
                    onClick={fetchStudents}
                    sx={{ mr: 2 }}
                  >
                    Refresh
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenAddDialog(true)}
                    sx={{ mr: 2 }}
                  >
                    Add Student
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('role');
                      window.location.href = '/';
                    }}
                  >
                    Re-Login
                  </Button>
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              ) : (
                <StyledTableContainer component={Paper}>
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No students found. Add a student to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>{student._id}</TableCell>
                            <TableCell>{student.username}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {showPassword[student._id] ? student.password : '••••••••'}
                                <IconButton 
                                  size="small" 
                                  onClick={() => togglePasswordVisibility(student._id)}
                                  sx={{ ml: 1 }}
                                >
                                  {showPassword[student._id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Change Password">
                                <IconButton 
                                  color="primary"
                                  onClick={() => {
                                    setEditStudent({ id: student._id, username: student.username, newPassword: '' });
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Student">
                                <IconButton 
                                  color="error"
                                  onClick={() => {
                                    setDeleteStudent({ id: student._id, username: student.username });
                                    setOpenDeleteDialog(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              )}
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Add Student Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the username and password for the new student account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={newStudent.username}
            onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newStudent.password}
            onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddStudent} 
            variant="contained"
            disabled={!newStudent.username || !newStudent.password || addLoading}
            startIcon={addLoading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {addLoading ? 'Adding...' : 'Add Student'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Password Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a new password for student: <strong>{editStudent.username}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={editStudent.newPassword}
            onChange={(e) => setEditStudent({...editStudent, newPassword: e.target.value})}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleEditPassword} 
            variant="contained"
            disabled={!editStudent.newPassword || editLoading}
            startIcon={editLoading ? <CircularProgress size={20} /> : <EditIcon />}
          >
            {editLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Student Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete student: <strong>{deleteStudent.username}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteStudent} 
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error || message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default Students; 