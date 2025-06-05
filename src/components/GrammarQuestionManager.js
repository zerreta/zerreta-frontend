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

function GrammarQuestionManager() {
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
    module: '',
    topicNumber: ''
  });

  // Grammar modules and their topics
  const grammarModules = {
    beginner: Array.from({length: 11}, (_, i) => `${i}`),
    basic: Array.from({length: 10}, (_, i) => `${i + 11}`),
    intermediate: Array.from({length: 15}, (_, i) => `${i + 21}`),
    advanced: Array.from({length: 15}, (_, i) => `${i + 36}`)
  };

  // Grammar categories
  const grammarCategories = [
    'tenses', 'articles', 'prepositions', 'modal-verbs', 'conditionals', 
    'passive-voice', 'reported-speech', 'relative-clauses', 'conjunctions', 
    'phrasal-verbs', 'others'
  ];

  // Form state for adding/editing questions
  const [formData, setFormData] = useState({
    module: 'beginner',
    topicNumber: '0',
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    difficulty: 'medium',
    timeAllocation: '60',
    imageUrl: '',
    grammarRule: '',
    category: 'others'
  });

  // Reset form data function
  const resetFormData = () => {
    setFormData({
      module: 'beginner',
      topicNumber: '0',
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0,
      explanation: '',
      difficulty: 'medium',
      timeAllocation: '60',
      imageUrl: '',
      grammarRule: '',
      category: 'others'
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
      
      if (filters.module) queryParams.append('module', filters.module);
      if (filters.topicNumber) queryParams.append('topicNumber', filters.topicNumber);
      
      console.log('Fetching grammar questions with params:', queryParams.toString());
      const response = await axiosInstance.get(`/admin/grammar-questions?${queryParams.toString()}`);
      console.log('Grammar questions received:', response.data.length);
      
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching grammar questions:', err);
      setError('Failed to load grammar questions. Please try again.');
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
        module: question.module,
        topicNumber: question.topicNumber || '0',
        questionText: question.questionText,
        options: [...question.options],
        correctOption: question.correctOption,
        explanation: question.explanation || '',
        difficulty: question.difficulty || 'medium',
        timeAllocation: question.timeAllocation || '60',
        imageUrl: question.imageUrl || '',
        grammarRule: question.grammarRule || '',
        category: question.category || 'others'
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
        response = await axiosInstance.put(`/admin/grammar-questions/${currentQuestion._id}`, requestData);
        setSuccess('Grammar question updated successfully!');
      } else {
        // Create new question
        response = await axiosInstance.post('/admin/grammar-questions', requestData);
        setSuccess('Grammar question created successfully!');
      }
      
      console.log('Grammar question saved:', response.data);
      
      handleCloseDialog();
      fetchQuestions();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Error saving grammar question:', err);
      setError(err.response?.data?.message || 'Failed to save grammar question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this grammar question?')) {
      try {
        await axiosInstance.delete(`/admin/grammar-questions/${questionId}`);
        setSuccess('Grammar question deleted successfully!');
        fetchQuestions();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting grammar question:', err);
        setError('Failed to delete grammar question. Please try again.');
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
        if (!q.module || !q.moduleNumber || !q.question || !q.options || !q.correctOption) {
          throw new Error(`Question ${index + 1} is missing required fields: module, moduleNumber, question, options, or correctOption`);
        }

        // Find the index of the correct option
        const correctOptionIndex = q.options.findIndex(option => option === q.correctOption);
        if (correctOptionIndex === -1) {
          throw new Error(`Question ${index + 1}: correctOption "${q.correctOption}" not found in options array`);
        }

        // Map module to grammar module format
        let module = 'beginner'; // Default
        const moduleKey = q.module.toLowerCase();
        if (moduleKey.includes('beginner') || q.moduleNumber < 11) {
          module = 'beginner';
        } else if (moduleKey.includes('basic') || (q.moduleNumber >= 11 && q.moduleNumber < 21)) {
          module = 'basic';
        } else if (moduleKey.includes('intermediate') || (q.moduleNumber >= 21 && q.moduleNumber < 36)) {
          module = 'intermediate';
        } else if (moduleKey.includes('advanced') || q.moduleNumber >= 36) {
          module = 'advanced';
        }

        return {
          module: module,
          topicNumber: q.moduleNumber.toString(),
          questionText: q.question,
          options: [...q.options],
          correctOption: correctOptionIndex,
          explanation: q.explanation || '',
          difficulty: q.difficulty ? q.difficulty.toLowerCase() : 'medium',
          timeAllocation: q.timeAllocation ? parseInt(q.timeAllocation.replace(/\D/g, '')) : 60,
          grammarRule: q.grammarRule || '',
          category: 'others' // Default category
        };
      });

      // Validate converted questions
      for (let i = 0; i < convertedQuestions.length; i++) {
        const question = convertedQuestions[i];
        
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
          '/admin/grammar-questions/bulk',
          { questions: convertedQuestions },
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setSuccess(`${response.data.count} grammar questions uploaded successfully`);
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }

    setUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await axiosInstance.post('/admin/upload-image', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        imageUrl: response.data.filename
      }));

      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageUrl}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grammar Question Manager
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  name="module"
                  value={filters.module}
                  onChange={handleFilterChange}
                  label="Module"
                >
                  <MenuItem value="">All Modules</MenuItem>
                  <MenuItem value="beginner">Beginner (0-10)</MenuItem>
                  <MenuItem value="basic">Basic (11-20)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (21-35)</MenuItem>
                  <MenuItem value="advanced">Advanced (36-50)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Topic Number</InputLabel>
                <Select
                  name="topicNumber"
                  value={filters.topicNumber}
                  onChange={handleFilterChange}
                  label="Topic Number"
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {filters.module && grammarModules[filters.module]?.map(topic => (
                    <MenuItem key={topic} value={topic}>Topic {topic}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
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
                    <TableCell>Module</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question._id}>
                      <TableCell>
                        <Chip 
                          label={question.module} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{question.topicNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {question.questionText.substring(0, 100)}
                          {question.questionText.length > 100 && '...'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={question.category} 
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
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                        No grammar questions found. Click "Add Question" to create one.
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
              Bulk Upload Grammar Questions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload multiple grammar questions at once using JSON format or CSV file.
            </Typography>
            
            <Tabs value={bulkTabValue} onChange={handleBulkTabChange} sx={{ mb: 3 }}>
              <Tab label="Standard JSON" />
              <Tab label="Team JSON Format" />
              <Tab label="CSV Format" />
            </Tabs>
            
            {bulkTabValue === 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Standard JSON
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Paste JSON array of questions. Each question must include: module, topicNumber, questionText, options, correctOption, explanation, difficulty, timeAllocation.
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
                  Paste your team's JSON format. Each question should have: module, moduleNumber, question, options, correctOption, difficulty, timeAllocation, explanation.
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <strong>Example Format (// lines are comments and will be ignored):</strong>
                  <br />
                  {`// This is a comment line - will be ignored`}
                  <br />
                  {`[{`}
                  <br />
                  {`  // Grammar question example`}
                  <br />
                  {`  "module": "Sentence Structure",`}
                  <br />
                  {`  "moduleNumber": 6,`}
                  <br />
                  {`  "question": "What is missing in: '_ reads a book.'?",`}
                  <br />
                  {`  "options": ["Object", "Verb", "Subject", "Adverb"],`}
                  <br />
                  {`  "correctOption": "Subject",`}
                  <br />
                  {`  "difficulty": "Easy",`}
                  <br />
                  {`  "timeAllocation": "30 sec",`}
                  <br />
                  {`  "explanation": "The subject is missing."`}
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
            
            {bulkTabValue === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  CSV Format
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Upload a CSV file with grammar questions.
                </Typography>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => setCsvFile(e.target.files[0])}
                />
                <Button
                  variant="outlined"
                  startIcon={<FileUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload CSV
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
          {currentQuestion ? 'Edit Grammar Question' : 'Add New Grammar Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  name="module"
                  value={formData.module}
                  onChange={handleFormChange}
                  label="Module"
                >
                  <MenuItem value="beginner">Beginner (0-10)</MenuItem>
                  <MenuItem value="basic">Basic (11-20)</MenuItem>
                  <MenuItem value="intermediate">Intermediate (21-35)</MenuItem>
                  <MenuItem value="advanced">Advanced (36-50)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Topic Number</InputLabel>
                <Select
                  name="topicNumber"
                  value={formData.topicNumber}
                  onChange={handleFormChange}
                  label="Topic Number"
                >
                  {grammarModules[formData.module]?.map(topic => (
                    <MenuItem key={topic} value={topic}>Topic {topic}</MenuItem>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  label="Category"
                >
                  {grammarCategories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grammar Rule"
                name="grammarRule"
                value={formData.grammarRule}
                onChange={handleFormChange}
                placeholder="e.g., Present Perfect Tense"
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
                rows={3}
                placeholder="Explain why the answer is correct..."
              />
            </Grid>
            
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Question Image (Optional)
                </Typography>
                
                {formData.imageUrl ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                      image={getFullImageUrl(formData.imageUrl)}
                      alt="Question image"
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      ref={imageInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="outlined"
                      startIcon={uploadingImage ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveQuestion}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {loading ? 'Saving...' : 'Save Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GrammarQuestionManager; 