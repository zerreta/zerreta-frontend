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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';

function StudentPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/student-pages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student pages');
      setLoading(false);
    }
  };

  const handleOpenDialog = (page = null) => {
    if (page) {
      setSelectedPage(page);
      setFormData({
        title: page.title,
        description: page.description,
        content: page.content
      });
    } else {
      setSelectedPage(null);
      setFormData({
        title: '',
        description: '',
        content: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPage(null);
    setFormData({
      title: '',
      description: '',
      content: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (selectedPage) {
        await axios.put(
          `http://localhost:5000/admin/student-pages/${selectedPage._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/admin/student-pages',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchPages();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save page');
    }
  };

  const handleDelete = async (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/admin/student-pages/${pageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPages();
      } catch (err) {
        setError('Failed to delete page');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
          Student Pages
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Page
        </Button>
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
        <Grid container spacing={3}>
          {pages.map((page) => (
            <Grid item xs={12} md={6} lg={4} key={page._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {page.title}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(page)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(page._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {page.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPage ? 'Edit Page' : 'Add New Page'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              multiline
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedPage ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default StudentPages; 