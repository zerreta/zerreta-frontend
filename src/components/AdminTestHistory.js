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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import axiosInstance from './axios-config';

function AdminTestHistory() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredTestHistory, setFilteredTestHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    studentId: '',
    subject: '',
    testMode: '',
    dateRange: 'all'
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [openTestDetailDialog, setOpenTestDetailDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchStudents(),
          fetchTestHistory()
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [testHistory, searchQuery, filters]);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/admin/students');
      setStudents(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students data');
      return [];
    }
  };

  const recalculateScoreIfNeeded = (test) => {
    if ((test.score === 0 || !test.score) && test.questions && test.questions.length > 0) {
      const correctCount = test.questions.filter(q => q.isCorrect).length;
      const totalQuestions = test.questions.length;
      if (correctCount > 0) {
        // Calculate percentage
        return Math.round((correctCount / totalQuestions) * 100);
      }
    }
    return test.score || 0;
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axiosInstance.get('/admin/test-history');
      console.log('Fetched test history data:', response.data);
      
      // Log the first record in detail to debug studentId structure
      if (response.data && response.data.length > 0) {
        console.log('First record details:', JSON.stringify(response.data[0], null, 2));
        console.log('Student info type:', typeof response.data[0].studentId);
        console.log('Student info fields:', response.data[0].studentId ? Object.keys(response.data[0].studentId) : 'No studentId');
      }
      
      setTestHistory(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching test history:', error);
      setError('Failed to fetch test history data');
      return [];
    }
  };

  const applyFilters = () => {
    let filtered = [...testHistory];

    // Apply student filter
    if (filters.studentId) {
      filtered = filtered.filter(test => 
        test.studentId && test.studentId._id === filters.studentId
      );
    }

    // Apply subject filter
    if (filters.subject) {
      filtered = filtered.filter(test => 
        test.subject.toLowerCase() === filters.subject.toLowerCase()
      );
    }

    // Apply test mode filter
    if (filters.testMode) {
      filtered = filtered.filter(test => 
        test.testMode === filters.testMode
      );
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      if (filters.dateRange === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (filters.dateRange === 'week') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
      } else if (filters.dateRange === 'month') {
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
      }
      
      filtered = filtered.filter(test => new Date(test.date) >= startDate);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        (test.studentId && test.studentId.name && test.studentId.name.toLowerCase().includes(query)) ||
        (test.studentId && test.studentId.username && test.studentId.username.toLowerCase().includes(query)) ||
        (test.subject && test.subject.toLowerCase().includes(query)) ||
        (test.topics && test.topics.some(topic => topic.toLowerCase().includes(query)))
      );
    }

    setFilteredTestHistory(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      studentId: '',
      subject: '',
      testMode: '',
      dateRange: 'all'
    });
    setSearchQuery('');
  };

  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        fetchStudents(),
        fetchTestHistory()
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
      setLoading(false);
    }
  };

  const viewTestDetails = async (testId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/test-history/${testId}`);
      
      // Add score validation/calculation
      const testData = response.data;
      
      // If score is 0 but there are correct answers, recalculate the score
      if ((testData.score === 0 || !testData.score) && testData.questions && testData.questions.length > 0) {
        const correctCount = testData.questions.filter(q => q.isCorrect).length;
        const totalQuestions = testData.questions.length;
        if (correctCount > 0) {
          // Calculate percentage
          const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
          console.log(`Recalculated score from ${testData.score} to ${calculatedScore}% based on ${correctCount}/${totalQuestions}`);
          testData.score = calculatedScore;
        }
      }
      
      setSelectedTest(testData);
      setOpenTestDetailDialog(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test details:', error);
      setError('Failed to fetch test details');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getSubjectDisplayName = (subject) => {
    const subjectMap = {
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'biology': 'Biology',
      'zoology': 'Zoology',
      'botany': 'Botany'
    };
    return subjectMap[subject.toLowerCase()] || subject;
  };

  const calculateAvgTimePerQuestion = (test) => {
    if (!test.questions || test.questions.length === 0) return 0;
    
    const totalTimeSpent = test.questions.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
    return totalTimeSpent / test.questions.length;
  };

  const exportTestHistory = () => {
    const dataToExport = filteredTestHistory.map(test => {
      return {
        'Student ID': test.studentId?.studentId || 'N/A',
        'Student Name': test.studentId?.name || 'N/A',
        'Username': test.studentId?.username || 'N/A',
        'Subject': getSubjectDisplayName(test.subject),
        'Test Mode': test.testMode,
        'Score': test.score,
        'Total Time (min)': test.totalTime,
        'Questions Count': test.questions?.length || 0,
        'Correct Answers': test.performanceMetrics?.correctAnswers || 0,
        'Incorrect Answers': test.performanceMetrics?.incorrectAnswers || 0,
        'Date': formatDate(test.date)
      };
    });

    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test_history_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Test History Database
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, subject..."
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Student</InputLabel>
            <Select
              name="studentId"
              value={filters.studentId}
              onChange={handleFilterChange}
              label="Student"
            >
              <MenuItem value="">All Students</MenuItem>
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name} ({student.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              label="Subject"
            >
              <MenuItem value="">All Subjects</MenuItem>
              <MenuItem value="physics">Physics</MenuItem>
              <MenuItem value="chemistry">Chemistry</MenuItem>
              <MenuItem value="biology">Biology</MenuItem>
              <MenuItem value="botany">Botany</MenuItem>
              <MenuItem value="zoology">Zoology</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Test Mode</InputLabel>
            <Select
              name="testMode"
              value={filters.testMode}
              onChange={handleFilterChange}
              label="Test Mode"
            >
              <MenuItem value="">All Modes</MenuItem>
              <MenuItem value="practice">Practice</MenuItem>
              <MenuItem value="assessment">Assessment</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              label="Date Range"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Tooltip title="Reset Filters">
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetFilters}
                startIcon={<FilterListIcon />}
              >
                Reset
              </Button>
            </Tooltip>
            
            <Tooltip title="Refresh Data">
              <Button
                variant="outlined"
                color="primary"
                onClick={refreshData}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Tooltip>
            
            <Tooltip title="Export to CSV">
              <Button
                variant="contained"
                color="success"
                onClick={exportTestHistory}
                startIcon={<DownloadIcon />}
                disabled={filteredTestHistory.length === 0}
              >
                Export
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            {filteredTestHistory.length} {filteredTestHistory.length === 1 ? 'record' : 'records'} found
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Test Mode</TableCell>
                <TableCell>Topic/Level</TableCell>
                <TableCell align="center">Questions</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Time (min)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={24} sx={{ m: 2 }} />
                    <Typography variant="body2">Loading test history...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredTestHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2">No test history records found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTestHistory.map((test) => (
                  <TableRow key={test._id} hover>
                    <TableCell>
                      {test.studentId && typeof test.studentId === 'object' ? (
                        <>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {test.studentId.name || 'Unknown'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {test.studentId.studentId || 'N/A'}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Unknown
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: N/A
                          </Typography>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(test.date)}
                    </TableCell>
                    <TableCell>
                      {getSubjectDisplayName(test.subject)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small"
                        label={test.testMode === 'practice' ? 'Practice' : 'Assessment'} 
                        color={test.testMode === 'practice' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {test.testMode === 'practice' ? (
                        <Tooltip title={`Topic: ${test.topicNumber || 'N/A'}`}>
                          <Chip 
                            size="small" 
                            label={`Topic ${test.topicNumber || 'N/A'}`}
                            color="info"
                            variant="outlined"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title={test.topics?.join(', ') || 'Multiple topics'}>
                          <Chip 
                            size="small" 
                            label={`Multiple (${test.topics?.length || 0})`}
                            color="warning"
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {test.questions?.length || 0}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: 
                            test.score >= 80 ? 'success.main' : 
                            test.score >= 60 ? 'info.main' : 
                            test.score >= 40 ? 'warning.main' : 'error.main'
                        }}
                      >
                        {recalculateScoreIfNeeded(test)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {test.totalTime}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => viewTestDetails(test._id)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Test Details Dialog */}
      <Dialog 
        open={openTestDetailDialog} 
        onClose={() => setOpenTestDetailDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Test Details
          {selectedTest && (
            <Typography variant="subtitle2" color="textSecondary">
              {selectedTest.studentId?.name} - {formatDate(selectedTest.date)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {!selectedTest ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Test Overview Section */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Test Overview</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Subject</Typography>
                          <Typography variant="body1">{getSubjectDisplayName(selectedTest.subject)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Test Mode</Typography>
                          <Typography variant="body1">
                            {selectedTest.testMode === 'practice' ? 'Practice' : 'Assessment'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            {selectedTest.testMode === 'practice' ? 'Topic' : 'Topics'}
                          </Typography>
                          <Typography variant="body1">
                            {selectedTest.testMode === 'practice' 
                              ? selectedTest.topicNumber || 'N/A'
                              : selectedTest.topics?.join(', ') || 'Multiple topics'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Date</Typography>
                          <Typography variant="body1">{formatDate(selectedTest.date)}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Performance Summary</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Score</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {selectedTest && recalculateScoreIfNeeded(selectedTest)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Time Spent</Typography>
                          <Typography variant="body1">{selectedTest.totalTime} minutes</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Correct Answers</Typography>
                          <Typography variant="body1">
                            {selectedTest.performanceMetrics?.correctAnswers || 
                             selectedTest.questions?.filter(q => q.isCorrect).length || 0}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">Incorrect Answers</Typography>
                          <Typography variant="body1">
                            {selectedTest.performanceMetrics?.incorrectAnswers || 
                             selectedTest.questions?.filter(q => !q.isCorrect).length || 0}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Questions List */}
              <Typography variant="h6" gutterBottom>Questions</Typography>
              
              {selectedTest.questions && selectedTest.questions.length > 0 ? (
                selectedTest.questions.map((question, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          Question {index + 1}
                        </Typography>
                        <Chip
                          size="small"
                          label={question.isCorrect ? 'Correct' : 'Incorrect'}
                          color={question.isCorrect ? 'success' : 'error'}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {question.text}
                      </Typography>
                      
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Selected: {question.selectedOption || 'None'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Correct: {question.correctOption}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Time Spent: {question.timeSpent} seconds
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="textSecondary">
                            Difficulty: {question.difficulty || 'medium'}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {question.explanation && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Explanation:
                          </Typography>
                          <Typography variant="body2" sx={{ pl: 1 }}>
                            {question.explanation}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No questions available for this test.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTestDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminTestHistory; 