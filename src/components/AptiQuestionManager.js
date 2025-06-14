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

function AptiQuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [bulkTabValue, setBulkTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [bulkQuestions, setBulkQuestions] = useState('');
  const [userFormatQuestions, setUserFormatQuestions] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    grade: '',
    difficulty: '',
    topic: ''
  });
  const [syllabus, setSyllabus] = useState({});
  const [availableTopics, setAvailableTopics] = useState([]);

  // Aptitude categories
  const categories = ['quantitative', 'logical', 'verbal'];
  
  // Grade levels
  const grades = ['11', '12'];
  
  // Difficulty levels
  const difficulties = ['easy', 'medium', 'hard'];

  // Form state for adding/editing questions
  const [formData, setFormData] = useState({
    category: 'quantitative',
    grade: '11',
    difficulty: 'easy',
    topic: '',
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    timeAllocation: '60',
    imageUrl: ''
  });

  // Reset form data function
  const resetFormData = () => {
    setFormData({
      category: 'quantitative',
      grade: '11',
      difficulty: 'easy',
      topic: '',
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0,
      explanation: '',
      timeAllocation: '60',
      imageUrl: ''
    });
    
    // Reset file input if it exists
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchSyllabus();
    fetchQuestions();
  }, [filters]);

  useEffect(() => {
    updateAvailableTopics();
  }, [formData.category, formData.grade, formData.difficulty, syllabus]);

  const fetchSyllabus = async () => {
    try {
      const response = await axiosInstance.get('/aptitude-syllabus');
      setSyllabus(response.data);
    } catch (err) {
      console.error('Error fetching syllabus:', err);
    }
  };

  const updateAvailableTopics = () => {
    if (syllabus && formData.category && formData.grade && formData.difficulty) {
      const topics = syllabus[formData.grade]?.[formData.category]?.[formData.difficulty] || [];
      setAvailableTopics(topics);
    } else {
      setAvailableTopics([]);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.grade) queryParams.append('grade', filters.grade);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.topic) queryParams.append('topic', filters.topic);
      
      console.log('Fetching aptitude questions with params:', queryParams.toString());
      const response = await axiosInstance.get(`/admin/aptitude-questions?${queryParams.toString()}`);
      console.log('Aptitude questions received:', response.data.length);
      
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching aptitude questions:', err);
      setError('Failed to load aptitude questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBulkTabChange = (event, newValue) => {
    setBulkTabValue(newValue);
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
        category: question.category,
        grade: question.grade,
        difficulty: question.difficulty,
        topic: question.topic || '',
        questionText: question.questionText,
        options: [...question.options],
        correctOption: question.correctOption,
        explanation: question.explanation || '',
        timeAllocation: question.timeAllocation || '60',
        imageUrl: question.imageUrl || ''
      });
      setCurrentQuestion(question);
    } else {
      // Add mode
      resetFormData();
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
      setError('');
      
      // Validate required fields
      if (!formData.questionText.trim()) {
        setError('Question text is required.');
        return;
      }
      
      if (formData.options.some(option => !option.trim())) {
        setError('All options must be filled.');
        return;
      }
      
      const requestData = {
        ...formData,
        timeAllocation: parseInt(formData.timeAllocation)
      };
      
      let response;
      if (currentQuestion) {
        // Update existing question
        response = await axiosInstance.put(`/admin/aptitude-questions/${currentQuestion._id}`, requestData);
        setSuccess('Aptitude question updated successfully!');
      } else {
        // Create new question
        response = await axiosInstance.post('/admin/aptitude-questions', requestData);
        setSuccess('Aptitude question created successfully!');
      }
      
      console.log('Aptitude question saved:', response.data);
      
      handleCloseDialog();
      fetchQuestions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error saving aptitude question:', err);
      setError(err.response?.data?.message || 'Failed to save aptitude question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this aptitude question?')) {
      try {
        await axiosInstance.delete(`/admin/aptitude-questions/${questionId}`);
        setSuccess('Aptitude question deleted successfully!');
        fetchQuestions();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting aptitude question:', err);
        setError('Failed to delete aptitude question. Please try again.');
      }
    }
  };

  const handleUserFormatUpload = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Parse the JSON input - first filter out comment lines that start with "//"
      let parsedQuestions;
      try {
        // Split into lines, filter out comment lines (starting with "//"), then rejoin
        const cleanedJsonText = userFormatQuestions
          .split('\n')
          .filter(line => !line.trim().startsWith('//'))
          .join('\n');
        
        console.log('Original JSON:', userFormatQuestions);
        console.log('Cleaned JSON (without comment lines):', cleanedJsonText);
        
        parsedQuestions = JSON.parse(cleanedJsonText);
      } catch (error) {
        setError(`Invalid JSON format: ${error.message}`);
        setLoading(false);
        return;
      }

      // Convert user format to our internal format
      const convertedQuestions = parsedQuestions.map((q, index) => {
        // Validate required fields in user format
        if (!q.category || !q.grade || !q.difficulty || !q.topic || !q.question || !q.options || !q.correctOption) {
          throw new Error(`Question ${index + 1} is missing required fields: category, grade, difficulty, topic, question, options, or correctOption`);
        }

        // Find the index of the correct option
        const correctOptionIndex = q.options.findIndex(option => option === q.correctOption);
        if (correctOptionIndex === -1) {
          throw new Error(`Question ${index + 1}: correctOption "${q.correctOption}" not found in options array`);
        }

        return {
          category: q.category.toLowerCase(),
          grade: q.grade.toString(),
          difficulty: q.difficulty.toLowerCase(),
          topic: q.topic,
          questionText: q.question,
          options: [...q.options],
          correctOption: correctOptionIndex,
          explanation: q.explanation || '',
          timeAllocation: q.timeAllocation ? parseInt(q.timeAllocation.replace(/\D/g, '')) : 60,
          imageUrl: q.imageUrl || ''
        };
      });

      // Validate converted questions
      for (let i = 0; i < convertedQuestions.length; i++) {
        const question = convertedQuestions[i];
        
        // Validate category
        if (!categories.includes(question.category)) {
          setError(`Question ${i + 1}: Invalid category. Must be one of: ${categories.join(', ')}`);
          setLoading(false);
          return;
        }
        
        // Validate grade
        if (!grades.includes(question.grade)) {
          setError(`Question ${i + 1}: Invalid grade. Must be one of: ${grades.join(', ')}`);
          setLoading(false);
          return;
        }
        
        // Validate difficulty
        if (!difficulties.includes(question.difficulty)) {
          setError(`Question ${i + 1}: Invalid difficulty. Must be one of: ${difficulties.join(', ')}`);
          setLoading(false);
          return;
        }
        
        // Validate options array
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          setError(`Question ${i + 1}: Options must be an array with exactly 4 items`);
          setLoading(false);
          return;
        }
        
        // Validate correctOption is in 0-3 range
        if (typeof question.correctOption !== 'number' || question.correctOption < 0 || question.correctOption > 3) {
          setError(`Question ${i + 1}: correctOption index is invalid`);
          setLoading(false);
          return;
        }
      }

      // Upload questions
      try {
        const response = await axiosInstance.post(
          '/admin/aptitude-questions/bulk',
          { questions: convertedQuestions },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setSuccess(`${response.data.count} aptitude questions uploaded successfully`);
        setUserFormatQuestions('');
        setLoading(false);
        fetchQuestions();
      } catch (err) {
        console.error("Detailed upload error:", err);
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
      setError(`Error processing questions: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Aptitude Question Manager
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Question List" />
          <Tab label="Bulk Upload" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="quantitative">Quantitative Aptitude</MenuItem>
                  <MenuItem value="logical">Logical Reasoning</MenuItem>
                  <MenuItem value="verbal">Verbal Ability</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={filters.grade}
                  onChange={handleFilterChange}
                  label="Grade"
                >
                  <MenuItem value="">All Grades</MenuItem>
                  <MenuItem value="11">Grade 11</MenuItem>
                  <MenuItem value="12">Grade 12</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={filters.difficulty}
                  onChange={handleFilterChange}
                  label="Difficulty"
                >
                  <MenuItem value="">All Difficulties</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  name="topic"
                  value={filters.topic}
                  onChange={handleFilterChange}
                  label="Topic"
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {syllabus && filters.category && filters.grade && filters.difficulty &&
                    syllabus[filters.grade]?.[filters.category]?.[filters.difficulty]?.map((topic) => (
                      <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ height: '56px' }}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>

          {/* Questions Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Time (sec)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell>
                        <Chip 
                          label={question.category.charAt(0).toUpperCase() + question.category.slice(1)} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`Grade ${question.grade}`} 
                          color="secondary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={question.difficulty} 
                          color={
                            question.difficulty === 'easy' ? 'success' :
                            question.difficulty === 'medium' ? 'warning' : 'error'
                          }
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 150, fontSize: '0.75rem' }}>
                          {question.topic || 'No topic'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 250 }}>
                          {question.questionText.substring(0, 80)}
                          {question.questionText.length > 80 && '...'}
                        </Typography>
                      </TableCell>
                      <TableCell>{question.timeAllocation}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleOpenDialog(question)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(question._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {questions.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                        No aptitude questions found. Click "Add Question" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bulk Upload Aptitude Questions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload multiple aptitude questions at once using JSON format.
            </Typography>
            
            <Tabs value={bulkTabValue} onChange={handleBulkTabChange} sx={{ mb: 3 }}>
              <Tab label="Standard JSON" />
              <Tab label="Team JSON Format" />
            </Tabs>
            
            {bulkTabValue === 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Standard JSON
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Paste JSON array of questions. Each question must include: category, grade, difficulty, questionText, options, correctOption, explanation, timeAllocation.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  placeholder="Paste your questions in JSON format here..."
                  value={bulkQuestions}
                  onChange={(e) => setBulkQuestions(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => {/* Handle standard bulk upload */}}
                  disabled={!bulkQuestions.trim()}
                >
                  Upload Standard JSON
                </Button>
              </Box>
            )}
            
            {bulkTabValue === 1 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Team JSON Format
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Paste your team's JSON format. Each question should have: category, grade, difficulty, question, options, correctOption, explanation, timeAllocation.
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <strong>Example Format (// lines are comments and will be ignored):</strong>
                  <br />
                  {`// This is a comment line - will be ignored`}
                  <br />
                  {`[{`}
                  <br />
                  {`  // Aptitude question example`}
                  <br />
                  {`  "category": "quantitative",`}
                  <br />
                  {`  "grade": "11",`}
                  <br />
                  {`  "difficulty": "easy",`}
                  <br />
                  {`  "topic": "Percentage",`}
                  <br />
                  {`  "question": "What is 15% of 200?",`}
                  <br />
                  {`  "options": ["25", "30", "35", "40"],`}
                  <br />
                  {`  "correctOption": "30",`}
                  <br />
                  {`  "explanation": "15% of 200 = (15/100) × 200 = 30",`}
                  <br />
                  {`  "timeAllocation": "60 sec"`}
                  <br />
                  {`}]`}
                  <br />
                  {`// Comment lines starting with "//" will be automatically filtered out`}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  placeholder="Paste your team's JSON format here... (Lines starting with // will be ignored as comments)"
                  value={userFormatQuestions}
                  onChange={(e) => setUserFormatQuestions(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleUserFormatUpload}
                  disabled={!userFormatQuestions.trim() || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                >
                  {loading ? 'Uploading...' : 'Upload Team JSON'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Question Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentQuestion ? 'Edit Aptitude Question' : 'Add New Aptitude Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  <MenuItem value="quantitative">Quantitative Aptitude</MenuItem>
                  <MenuItem value="logical">Logical Reasoning</MenuItem>
                  <MenuItem value="verbal">Verbal Ability</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select
                  name="grade"
                  value={formData.grade}
                  onChange={handleFormChange}
                  label="Grade"
                >
                  <MenuItem value="11">Grade 11</MenuItem>
                  <MenuItem value="12">Grade 12</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Topic</InputLabel>
                <Select
                  name="topic"
                  value={formData.topic}
                  onChange={handleFormChange}
                  label="Topic"
                  required
                >
                  <MenuItem value="">Select Topic</MenuItem>
                  {availableTopics.map((topic) => (
                    <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Text"
                name="questionText"
                value={formData.questionText}
                onChange={handleFormChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            {[0, 1, 2, 3].map((index) => (
              <Grid item xs={12} md={6} key={index}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={formData.options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Correct Option</InputLabel>
                <Select
                  name="correctOption"
                  value={formData.correctOption}
                  onChange={handleFormChange}
                  label="Correct Option"
                >
                  {formData.options.map((option, index) => (
                    <MenuItem key={index} value={index}>
                      Option {index + 1}: {option.substring(0, 30)}{option.length > 30 && '...'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time Allocation (seconds)"
                name="timeAllocation"
                type="number"
                value={formData.timeAllocation}
                onChange={handleFormChange}
                InputProps={{ inputProps: { min: 30, max: 300 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Explanation"
                name="explanation"
                value={formData.explanation}
                onChange={handleFormChange}
                multiline
                rows={2}
                placeholder="Explain the correct answer..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveQuestion}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AptiQuestionManager; 