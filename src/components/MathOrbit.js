import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MathOrbit = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [showProblem, setShowProblem] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [planets, setPlanets] = useState([]);
  
  // Orbital simulation variables
  const centerX = 400;
  const centerY = 300;
  const time = useRef(0);

  // Initialize planets
  useEffect(() => {
    const initialPlanets = [
      { x: centerX + 100, y: centerY, radius: 15, color: '#ff6b6b', speed: 0.02, orbitRadius: 100, angle: 0, problem: null },
      { x: centerX + 150, y: centerY, radius: 12, color: '#4ecdc4', speed: 0.015, orbitRadius: 150, angle: Math.PI/3, problem: null },
      { x: centerX + 200, y: centerY, radius: 18, color: '#45b7d1', speed: 0.01, orbitRadius: 200, angle: Math.PI/2, problem: null },
      { x: centerX + 250, y: centerY, radius: 14, color: '#96ceb4', speed: 0.008, orbitRadius: 250, angle: Math.PI, problem: null },
      { x: centerX + 300, y: centerY, radius: 16, color: '#ffd93d', speed: 0.006, orbitRadius: 300, angle: 3*Math.PI/2, problem: null }
    ];
    setPlanets(initialPlanets);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!isPlaying) return;
      
      time.current += 1;
      
      // Update planet positions
      setPlanets(prevPlanets => 
        prevPlanets.map(planet => ({
          ...planet,
          angle: planet.angle + planet.speed,
          x: centerX + Math.cos(planet.angle + planet.speed) * planet.orbitRadius,
          y: centerY + Math.sin(planet.angle + planet.speed) * planet.orbitRadius
        }))
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw space background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }
    
    // Draw orbital paths
    planets.forEach(planet => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Draw sun (center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    sunGradient.addColorStop(0, '#ffd700');
    sunGradient.addColorStop(1, '#ff8c00');
    ctx.fillStyle = sunGradient;
    ctx.fill();
    
    // Draw planets
    planets.forEach((planet, index) => {
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();
      
      // Draw planet glow
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius + 5, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color + '40';
      ctx.fill();
      
      // Draw problem indicator if planet has a problem
      if (planet.problem) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', planet.x, planet.y + 4);
      }
    });
    
  }, [planets]);

  // Generate math problems
  const generateProblem = () => {
    const problemTypes = {
      easy: [
        { type: 'addition', range: [1, 50] },
        { type: 'subtraction', range: [1, 50] },
        { type: 'multiplication', range: [1, 12] }
      ],
      medium: [
        { type: 'addition', range: [50, 200] },
        { type: 'subtraction', range: [50, 200] },
        { type: 'multiplication', range: [10, 25] },
        { type: 'division', range: [10, 100] }
      ],
      hard: [
        { type: 'quadratic', range: [1, 10] },
        { type: 'algebra', range: [1, 20] },
        { type: 'geometry', range: [1, 15] }
      ]
    };

    const currentProblems = problemTypes[difficulty];
    const problemType = currentProblems[Math.floor(Math.random() * currentProblems.length)];
    
    let problem = {};
    
    switch (problemType.type) {
      case 'addition':
        const a1 = Math.floor(Math.random() * problemType.range[1]) + problemType.range[0];
        const b1 = Math.floor(Math.random() * problemType.range[1]) + problemType.range[0];
        problem = {
          question: `${a1} + ${b1} = ?`,
          answer: a1 + b1,
          type: 'addition'
        };
        break;
        
      case 'subtraction':
        const a2 = Math.floor(Math.random() * problemType.range[1]) + problemType.range[0];
        const b2 = Math.floor(Math.random() * a2) + 1;
        problem = {
          question: `${a2} - ${b2} = ?`,
          answer: a2 - b2,
          type: 'subtraction'
        };
        break;
        
      case 'multiplication':
        const a3 = Math.floor(Math.random() * problemType.range[1]) + problemType.range[0];
        const b3 = Math.floor(Math.random() * problemType.range[1]) + problemType.range[0];
        problem = {
          question: `${a3} × ${b3} = ?`,
          answer: a3 * b3,
          type: 'multiplication'
        };
        break;
        
      case 'division':
        const b4 = Math.floor(Math.random() * 12) + 2;
        const answer4 = Math.floor(Math.random() * 20) + 1;
        const a4 = b4 * answer4;
        problem = {
          question: `${a4} ÷ ${b4} = ?`,
          answer: answer4,
          type: 'division'
        };
        break;
        
      default:
        problem = {
          question: '5 + 3 = ?',
          answer: 8,
          type: 'addition'
        };
    }
    
    return problem;
  };

  const handleStartPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlanetClick = (planetIndex) => {
    if (!isPlaying) return;
    
    const problem = generateProblem();
    setCurrentProblem({ ...problem, planetIndex });
    setShowProblem(true);
    setAnswer('');
    setFeedback(null);
  };

  const handleAnswerSubmit = () => {
    const userAnswer = parseInt(answer);
    const correct = userAnswer === currentProblem.answer;
    
    if (correct) {
      setScore(score + 10);
      setProblemsCompleted(problemsCompleted + 1);
      setFeedback({ type: 'success', message: 'Correct! Well done!' });
      
      // Mark planet as completed
      setPlanets(prevPlanets => 
        prevPlanets.map((planet, index) => 
          index === currentProblem.planetIndex 
            ? { ...planet, problem: null, color: '#4caf50' }
            : planet
        )
      );
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. The answer is ${currentProblem.answer}` 
      });
    }
    
    setTimeout(() => {
      setShowProblem(false);
      setFeedback(null);
    }, 2000);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setScore(0);
    setProblemsCompleted(0);
    time.current = 0;
    
    // Reset planets
    const resetPlanets = planets.map((planet, index) => ({
      ...planet,
      angle: index * (Math.PI / 3),
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d'][index],
      problem: null
    }));
    setPlanets(resetPlanets);
  };

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/student-dashboard/extras')}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            '&:hover': {
              borderColor: '#5c33d4',
              backgroundColor: 'rgba(116, 69, 248, 0.04)',
            }
          }}
        >
          Back to Extras
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            icon={<SchoolIcon />} 
            label={`Score: ${score}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            icon={<TrendingUpIcon />} 
            label={`Completed: ${problemsCompleted}`} 
            color="secondary" 
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Title */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} color="#333" gutterBottom>
          <FunctionsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          MathOrbit
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore the solar system while solving math problems! Click on planets to unlock math challenges.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mission Control
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleStartPause}
                startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                sx={{
                  backgroundColor: isPlaying ? '#ff6b6b' : '#4caf50',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: isPlaying ? '#ff5252' : '#45a049',
                  }
                }}
              >
                {isPlaying ? 'Pause Orbit' : 'Start Orbit'}
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={handleReset}
                startIcon={<RefreshIcon />}
                sx={{ borderColor: '#7445f8', color: '#7445f8' }}
              >
                Reset Mission
              </Button>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Difficulty Level
            </Typography>
            <Box sx={{ mb: 3 }}>
              {['easy', 'medium', 'hard'].map((level) => (
                <Button
                  key={level}
                  size="small"
                  variant={difficulty === level ? 'contained' : 'outlined'}
                  onClick={() => setDifficulty(level)}
                  sx={{ 
                    mr: 1, 
                    mb: 1,
                    textTransform: 'capitalize',
                    backgroundColor: difficulty === level ? '#7445f8' : 'transparent'
                  }}
                >
                  {level}
                </Button>
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Progress
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(problemsCompleted % 10) * 10} 
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {problemsCompleted % 10}/10 problems in current level
            </Typography>
          </Paper>
        </Grid>

        {/* Orbital Simulation */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: '#000011' }}>
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              style={{ 
                width: '100%', 
                height: 'auto', 
                cursor: isPlaying ? 'pointer' : 'default',
                borderRadius: '12px'
              }}
              onClick={(e) => {
                if (!isPlaying) return;
                
                const rect = e.target.getBoundingClientRect();
                const scaleX = e.target.width / rect.width;
                const scaleY = e.target.height / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;
                
                // Check if clicked on a planet
                planets.forEach((planet, index) => {
                  const distance = Math.sqrt((x - planet.x) ** 2 + (y - planet.y) ** 2);
                  if (distance <= planet.radius + 10) {
                    handlePlanetClick(index);
                  }
                });
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Problem Dialog */}
      <Dialog open={showProblem} onClose={() => setShowProblem(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Math Challenge
        </DialogTitle>
        <DialogContent>
          {currentProblem && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
                {currentProblem.question}
              </Typography>
              
              <TextField
                fullWidth
                label="Your Answer"
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                sx={{ mb: 2 }}
                autoFocus
              />
              
              {feedback && (
                <Alert 
                  severity={feedback.type} 
                  icon={feedback.type === 'success' ? <CheckCircleIcon /> : <CancelIcon />}
                  sx={{ mb: 2 }}
                >
                  {feedback.message}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProblem(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAnswerSubmit} 
            variant="contained"
            disabled={!answer}
            sx={{ backgroundColor: '#7445f8' }}
          >
            Submit Answer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MathOrbit; 