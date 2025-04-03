import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Divider,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  FileUpload as FileUploadIcon,
  Image as ImageIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';
import { physicsTopics, chemistryTopics, biologyTopics } from './SyllabusData';

function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [bulkQuestions, setBulkQuestions] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [filters, setFilters] = useState({
    subject: '',
    topicNumber: ''
  });

  // Get the topic arrays based on selected subject
  const getTopicsForSubject = (subject) => {
    switch(subject) {
      case 'physics':
        return physicsTopics;
      case 'chemistry':
        return chemistryTopics;
      case 'biology': 
        return biologyTopics;
      default:
        return [];
    }
  };

  // Form state for adding/editing questions
  const [formData, setFormData] = useState({
    subject: 'physics',
    topicNumber: '1',
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    difficulty: 'medium',
    timeAllocation: '60',
    imageUrl: ''
  });

  // Reset form data function
  const resetFormData = () => {
    setFormData({
      subject: 'physics',
      topicNumber: '1',
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0,
      explanation: '',
      difficulty: 'medium',
      timeAllocation: '60',
      imageUrl: ''
    });
    
    // Reset file input if it exists
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (filters.topicNumber) queryParams.append('topicNumber', filters.topicNumber);
      
      console.log('Fetching questions with params:', queryParams.toString());
      const response = await axiosInstance.get(`/admin/questions?${queryParams.toString()}`);
      console.log('Questions received:', response.data.length);
      
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenDialog = (question = null) => {
    if (question) {
      // Edit mode
      setFormData({
        subject: question.subject,
        topicNumber: question.topicNumber || '1',
        questionText: question.questionText,
        options: [...question.options],
        correctOption: question.correctOption,
        explanation: question.explanation || '',
        difficulty: question.difficulty || 'medium',
        timeAllocation: question.timeAllocation || '60',
        imageUrl: question.imageUrl || ''
      });
      setCurrentQuestion(question);
    } else {
      // Add mode
      setFormData({
        subject: 'physics',
        topicNumber: '1',
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        explanation: '',
        difficulty: 'medium',
        timeAllocation: '60',
        imageUrl: ''
      });
      setCurrentQuestion(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentQuestion(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSaveQuestion = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Validate form data
      if (!formData.subject || !formData.topicNumber || !formData.questionText) {
        setError('Please fill all required fields: Subject, Topic, and Question Text');
        setLoading(false);
        return;
      }
      
      if (formData.options.length < 2) {
        setError('Please add at least two options');
        setLoading(false);
        return;
      }
      
      if (formData.correctOption === null || formData.correctOption === undefined) {
        setError('Please select a correct option');
        setLoading(false);
        return;
      }

      console.log('Submitting question with image URL:', formData.imageUrl);
      
      // Create or update the question
      const response = currentQuestion
        ? await axiosInstance.put(
            `/admin/questions/${currentQuestion._id}`,
            formData,
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
        : await axiosInstance.post(
            '/admin/questions',
            formData,
            {
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
      console.log('Question saved response:', response.data);
      
      setSuccess(currentQuestion ? 'Question updated successfully' : 'Question created successfully');
      setOpenDialog(false);
      resetFormData();
      setLoading(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error saving question:", err);
      if (err.response) {
        setError(`Failed to save question: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to save question: No response from server. Please check your connection.');
      } else {
        setError(`Failed to save question: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      await axiosInstance.delete(
        `/admin/questions/${questionId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess('Question deleted successfully');
      setLoading(false);
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question:", err);
      if (err.response) {
        setError(`Failed to delete question: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to delete question: No response from server. Please check your connection.');
      } else {
        setError(`Failed to delete question: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Parse the JSON input
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(bulkQuestions);
        // First validate the original input format
        const originalQuestions = [...parsedQuestions];
        for (let i = 0; i < originalQuestions.length; i++) {
          const question = originalQuestions[i];
          
          // Validate correctOption in original input (1-4 format)
          if (typeof question.correctOption !== 'number' || question.correctOption < 1 || question.correctOption > 4) {
            setError(`Question ${i + 1}: correctOption must be a number between 1 and 4`);
            setLoading(false);
            return;
          }
        }
        
        // Then convert from 1-4 to 0-3 for backend
        parsedQuestions = parsedQuestions.map(q => ({
          ...q,
          correctOption: typeof q.correctOption === 'number' ? q.correctOption - 1 : q.correctOption
        }));
        
        console.log("Converted questions:", parsedQuestions);
      } catch (error) {
        setError(`Invalid JSON format: ${error.message}`);
        setLoading(false);
        return;
      }

      // Validate questions (now in 0-3 format)
      const requiredFields = ['subject', 'topicNumber', 'questionText', 'options', 'correctOption'];
      const validSubjects = ['physics', 'chemistry', 'biology'];
      
      for (let i = 0; i < parsedQuestions.length; i++) {
        const question = parsedQuestions[i];
        
        // Check required fields - use a check that won't treat 0 as missing
        const missingFields = requiredFields.filter(field => 
          question[field] === undefined || question[field] === null || 
          (field === 'correctOption' && typeof question[field] !== 'number')
        );
        if (missingFields.length > 0) {
          setError(`Question ${i + 1} is missing required fields: ${missingFields.join(', ')}`);
          setLoading(false);
          return;
        }
        
        // Validate subject
        if (!validSubjects.includes(question.subject.toLowerCase())) {
          setError(`Question ${i + 1}: Invalid subject. Must be one of: physics, chemistry, biology`);
          setLoading(false);
          return;
        }
        
        // Validate options array
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          setError(`Question ${i + 1}: Options must be an array with exactly 4 items`);
          setLoading(false);
          return;
        }
        
        // Validate correctOption is now in 0-3 range
        if (typeof question.correctOption !== 'number' || question.correctOption < 0 || question.correctOption > 3) {
          setError(`Question ${i + 1}: Internal error with option conversion. Please report this issue.`);
          setLoading(false);
          return;
        }
        
        // Convert timeAllocation to number if it exists
        if (question.timeAllocation) {
          question.timeAllocation = parseInt(question.timeAllocation, 10);
          if (isNaN(question.timeAllocation)) {
            setError(`Question ${i + 1}: timeAllocation must be a number`);
            setLoading(false);
            return;
          }
        }
      }

      // Upload questions
      try {
        const response = await axiosInstance.post(
          '/admin/questions/bulk',
          { questions: parsedQuestions },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setSuccess(`${response.data.count} questions uploaded successfully`);
        setBulkQuestions('');
        setLoading(false);
        fetchQuestions();
      } catch (err) {
        console.error("Detailed upload error:", err);
        console.error("Error response data:", err.response?.data);
        if (err.response) {
          setError(`Failed to upload questions: ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          setError('Failed to upload questions: No response from server. Please check your connection.');
        } else {
          setError(`Failed to upload questions: ${err.message}`);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Error uploading questions:", err);
      if (err.response) {
        setError(`Failed to upload questions: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to upload questions: No response from server. Please check your connection.');
      } else {
        setError(`Failed to upload questions: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setError('Please select a CSV file to upload');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Parse CSV file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Validate headers
        const requiredHeaders = ['subject', 'topicNumber', 'questionText', 'options', 'correctOption'];
        const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
        
        if (missingHeaders.length > 0) {
          setError(`CSV file is missing required headers: ${missingHeaders.join(', ')}`);
          setLoading(false);
          return;
        }
        
        // Parse questions
        const questions = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',').map(value => value.trim());
          if (values.length !== headers.length) {
            setError(`Line ${i + 1} has an incorrect number of values`);
            setLoading(false);
            return;
          }
          
          const question = {};
          headers.forEach((header, index) => {
            if (header === 'options') {
              // Parse options as array from pipe-separated values
              question[header] = values[index].split('|').map(opt => opt.trim());
            } else if (header === 'correctOption') {
              // Convert from string to number
              const optionNumber = parseInt(values[index]);
              // Convert from 1-4 to 0-3 for backend
              if (!isNaN(optionNumber) && optionNumber >= 1 && optionNumber <= 4) {
                question[header] = optionNumber - 1;
              } else {
                question[header] = -1; // This will trigger the validation error
              }
            } else if (header === 'timeAllocation') {
              // Parse timeAllocation as number if present
              if (values[index] && values[index].trim()) {
                question[header] = parseInt(values[index], 10);
              } else {
                question[header] = 60; // Default to 60 seconds if not specified
              }
            } else {
              question[header] = values[index];
            }
          });
          
          // Validate subject field
          if (question.subject && !['physics', 'chemistry', 'biology'].includes(question.subject.toLowerCase())) {
            setError(`Line ${i + 1}: Invalid subject. Must be one of: physics, chemistry, biology`);
            setLoading(false);
            return;
          }
          
          // Ensure the question has 4 options
          if (question.options && question.options.length !== 4) {
            setError(`Line ${i + 1}: Each question must have exactly 4 options separated by '|'`);
            setLoading(false);
            return;
          }
          
          // Ensure correctOption is valid (0-3)
          if (question.correctOption < 0 || question.correctOption > 3 || isNaN(question.correctOption)) {
            setError(`Line ${i + 1}: correctOption must be a number between 1 and 4`);
            setLoading(false);
            return;
          }
          
          questions.push(question);
        }
        
        // Upload questions
        const response = await axiosInstance.post(
          '/admin/questions/bulk',
          { questions },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setSuccess(`${response.data.count} questions uploaded successfully from CSV`);
        setCsvFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setLoading(false);
        fetchQuestions();
      };
      
      reader.onerror = () => {
        setError('Error reading CSV file');
        setLoading(false);
      };
      
      reader.readAsText(csvFile);
    } catch (err) {
      console.error("Error uploading CSV:", err);
      if (err.response) {
        setError(`Failed to upload CSV: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to upload CSV: No response from server. Please check your connection.');
      } else {
        setError(`Failed to upload CSV: ${err.message}`);
      }
      setLoading(false);
    }
  };

  // New function to handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setUploadingImage(false);
        return;
      }

      console.log('Uploading image:', file.name);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        '/admin/upload-image',
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Image upload response:', response.data);
      
      // Update form data with the image URL
      setFormData(prev => {
        console.log('Setting image URL in form data:', response.data.imageUrl);
        return {
          ...prev,
          imageUrl: response.data.imageUrl
        };
      });
      
      setUploadingImage(false);
      setSuccess('Image uploaded successfully');
    } catch (err) {
      console.error("Error uploading image:", err);
      if (err.response) {
        setError(`Failed to upload image: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to upload image: No response from server. Please check your connection.');
      } else {
        setError(`Failed to upload image: ${err.message}`);
      }
      setUploadingImage(false);
    }
  };

  // Function to remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Question Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="View Questions" />
          <Tab label="Bulk Upload" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Subject</InputLabel>
                <Select
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  label="Filter by Subject"
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  <MenuItem value="physics">Physics</MenuItem>
                  <MenuItem value="chemistry">Chemistry</MenuItem>
                  <MenuItem value="biology">Biology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Topic</InputLabel>
                <Select
                  name="topicNumber"
                  value={filters.topicNumber}
                  onChange={handleFilterChange}
                  label="Filter by Topic"
                  disabled={!filters.subject}
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {filters.subject && getTopicsForSubject(filters.subject).map((topic) => (
                    <MenuItem key={topic.number} value={topic.number}>
                      {topic.number}: {topic.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mr: 1 }}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : questions.length > 0 ? (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Time (sec)</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => {
                    // Find topic title from topic number
                    const topics = getTopicsForSubject(question.subject);
                    const topic = topics.find(t => t.number === question.topicNumber) || {};
                    
                    return (
                      <TableRow key={question._id}>
                        <TableCell>
                          <Chip 
                            label={question.subject.charAt(0).toUpperCase() + question.subject.slice(1)} 
                            color={
                              question.subject === 'physics' ? 'primary' :
                              question.subject === 'chemistry' ? 'secondary' :
                              'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={topic.title || ''}>
                            <Typography variant="body2">
                              {question.topicNumber || '—'}: {(topic.title || '').substring(0, 20)}{topic.title && topic.title.length > 20 ? '...' : ''}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={question.questionText}>
                            <Typography variant="body2" sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {question.questionText}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {question.imageUrl ? (
                            <Tooltip title="View Image">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => window.open(question.imageUrl, '_blank')}
                              >
                                <ImageIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">None</Typography>
                          )}
                        </TableCell>
                        <TableCell>{question.timeAllocation || '60'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={question.difficulty || 'medium'} 
                            size="small"
                            color={
                              question.difficulty === 'easy' ? 'success' :
                              question.difficulty === 'hard' ? 'error' :
                              'info'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenDialog(question)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDelete(question._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No questions found. Add a new question or adjust your filters.
              </Typography>
            </Paper>
          )}
        </>
      )}
      
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk Upload Questions
            </Typography>
            
            <Tabs value={0} sx={{ mb: 3 }}>
              <Tab label="JSON Format" />
              <Tab label="CSV Format" />
            </Tabs>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                JSON Format
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Paste JSON array of questions below. Each question must include: subject (physics, chemistry, biology), 
                topicNumber (based on the topic number in syllabus), questionText, options (array of 4 option strings), 
                correctOption (1-4 index of correct answer). Optional fields: explanation, difficulty (easy, medium, hard), 
                imageUrl, timeAllocation (seconds).
                <br />
                <strong>Note:</strong> Options are numbered 1-4 in the UI for clarity, but are stored as 0-3 in the database.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                placeholder={`[
  {
    "subject": "physics",
    "topicNumber": "1",
    "questionText": "What is the SI unit of force?",
    "options": ["Newton", "Joule", "Watt", "Pascal"],
    "correctOption": 1,
    "explanation": "Newton is the SI unit of force.",
    "difficulty": "easy",
    "timeAllocation": 60
  },
  {
    "subject": "chemistry",
    "topicNumber": "3",
    "questionText": "Which element has the symbol 'Na'?",
    "options": ["Nitrogen", "Sodium", "Nickel", "Neon"],
    "correctOption": 2,
    "explanation": "Sodium has the symbol 'Na' in the periodic table.",
    "difficulty": "medium"
  }
]`}
                value={bulkQuestions}
                onChange={(e) => setBulkQuestions(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleBulkUpload}
                disabled={loading || !bulkQuestions}
              >
                Upload JSON
              </Button>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                CSV Format
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Upload a CSV file with the following headers: subject, topicNumber, questionText, options, correctOption, explanation, difficulty, timeAllocation.
                Required fields: subject (physics, chemistry, biology), topicNumber, questionText, options, correctOption (1-4).
                <br />
                <strong>Note:</strong> Options are numbered 1-4 in the UI for clarity, but are stored as 0-3 in the database.
                <br />
                For options, use pipe (|) to separate the 4 options, e.g., "Option A|Option B|Option C|Option D"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<FileUploadIcon />}
                >
                  Select CSV File
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </Button>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {csvFile ? csvFile.name : 'No file selected'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleCsvUpload}
                disabled={loading || !csvFile}
              >
                Upload CSV
              </Button>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="textSecondary">
                CSV Template Format:
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                subject,topicNumber,questionText,options,correctOption,explanation,difficulty,timeAllocation
                physics,1,What is the SI unit of force?,Newton|Joule|Watt|Pascal,1,Newton is the SI unit of force.,easy,60
                chemistry,3,Which element has the symbol 'Na'?,Nitrogen|Sodium|Nickel|Neon,2,Sodium has the symbol 'Na' in the periodic table.,medium,60
                biology,8,Which organelle is known as the powerhouse of the cell?,Nucleus|Ribosome|Mitochondria|Golgi apparatus,3,Mitochondria are responsible for cellular respiration and energy production.,medium,45
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Question Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  label="Subject"
                >
                  <MenuItem value="physics">Physics</MenuItem>
                  <MenuItem value="chemistry">Chemistry</MenuItem>
                  <MenuItem value="biology">Biology</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Topic</InputLabel>
                <Select
                  name="topicNumber"
                  value={formData.topicNumber}
                  onChange={handleFormChange}
                  label="Topic"
                >
                  {getTopicsForSubject(formData.subject).map((topic) => (
                    <MenuItem key={topic.number} value={topic.number}>
                      {topic.number}: {topic.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Question Image (Optional)
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {formData.imageUrl ? (
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 2,
                        bgcolor: '#f9f9f9',
                        display: 'flex',
                        justifyContent: 'center',
                        maxHeight: '200px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={formData.imageUrl}
                        alt="Question Image"
                        style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{ mt: 1 }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploadingImage}
                    startIcon={uploadingImage ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    sx={{ mr: 2 }}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                    />
                  </Button>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Text"
                name="questionText"
                value={formData.questionText}
                onChange={handleFormChange}
                multiline
                rows={2}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Options
              </Typography>
              {formData.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  <FormControl sx={{ ml: 2, minWidth: 120 }}>
                    <Button
                      variant={formData.correctOption === index ? "contained" : "outlined"}
                      color={formData.correctOption === index ? "success" : "primary"}
                      onClick={() => setFormData({ ...formData, correctOption: index })}
                    >
                      {formData.correctOption === index ? `Correct (Option ${index + 1})` : `Set as Option ${index + 1}`}
                    </Button>
                  </FormControl>
                </Box>
              ))}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Explanation (Optional)"
                name="explanation"
                value={formData.explanation}
                onChange={handleFormChange}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  label="Difficulty"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time Allocation (seconds)"
                name="timeAllocation"
                type="number"
                value={formData.timeAllocation}
                onChange={handleFormChange}
                InputProps={{ inputProps: { min: 10 } }}
                required
                helperText="Time allowed for this question in seconds"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveQuestion} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuestionManager; 