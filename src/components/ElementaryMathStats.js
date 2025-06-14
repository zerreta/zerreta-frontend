import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Calculate as MathIcon,
  Functions as AlgebraIcon,
  BarChart as StatsIcon,
  PieChart as GeometryIcon,
  Functions
} from '@mui/icons-material';
import elementaryImage from '../assets/elementaryschool.png';

const ElementaryMathStats = () => {
  const navigate = useNavigate();

  const mathCategories = [
    {
      title: 'Number Sense & Operations',
      icon: <MathIcon />,
      color: '#4caf50',
      simulations: [
        {
          id: 'arithmetic',
          name: 'Arithmetic',
          description: 'Practice basic arithmetic operations with visual representations.',
          url: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_en.html',
          concepts: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'number-line-distance',
          name: 'Number Line: Distance',
          description: 'Explore distance on a number line and understand numerical relationships.',
          url: 'https://phet.colorado.edu/sims/html/number-line-distance/latest/number-line-distance_en.html',
          concepts: ['Number Line', 'Distance', 'Position'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'number-line-integers',
          name: 'Number Line: Integers',
          description: 'Learn about positive and negative integers on a number line.',
          url: 'https://phet.colorado.edu/sims/html/number-line-integers/latest/number-line-integers_en.html',
          concepts: ['Integers', 'Positive Numbers', 'Negative Numbers'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'number-line-operations',
          name: 'Number Line: Operations',
          description: 'Perform mathematical operations using number line representations.',
          url: 'https://phet.colorado.edu/sims/html/number-line-operations/latest/number-line-operations_en.html',
          concepts: ['Operations', 'Addition', 'Subtraction', 'Number Line'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'number-play',
          name: 'Number Play',
          description: 'Explore numbers through play-based activities and counting.',
          url: 'https://phet.colorado.edu/sims/html/number-play/latest/number-play_en.html',
          concepts: ['Counting', 'Number Recognition', 'Quantity'],
          gradeLevel: '3-5',
          duration: '10-15 minutes'
        },
        {
          id: 'number-compare',
          name: 'Number Compare',
          description: 'Compare numbers and understand greater than, less than relationships.',
          url: 'https://phet.colorado.edu/sims/html/number-compare/latest/number-compare_en.html',
          concepts: ['Comparison', 'Greater Than', 'Less Than', 'Equal'],
          gradeLevel: '3-5',
          duration: '10-15 minutes'
        },
        {
          id: 'fractions-intro',
          name: 'Fractions: Intro',
          description: 'Introduction to fractions with visual representations and basic concepts.',
          url: 'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html',
          concepts: ['Fractions', 'Parts of Whole', 'Visual Fractions'],
          gradeLevel: '3-5',
          duration: '20-25 minutes'
        },
        {
          id: 'fractions-mixed-numbers',
          name: 'Fractions: Mixed Numbers',
          description: 'Explore mixed numbers and improper fractions.',
          url: 'https://phet.colorado.edu/sims/html/fractions-mixed-numbers/latest/fractions-mixed-numbers_en.html',
          concepts: ['Mixed Numbers', 'Improper Fractions', 'Conversion'],
          gradeLevel: '3-5',
          duration: '20-25 minutes'
        },
        {
          id: 'build-a-fraction',
          name: 'Build a Fraction',
          description: 'Build fractions using different representations and models.',
          url: 'https://phet.colorado.edu/sims/html/build-a-fraction/latest/build-a-fraction_en.html',
          concepts: ['Fraction Building', 'Models', 'Representation'],
          gradeLevel: '3-5',
          duration: '20-25 minutes'
        },
        {
          id: 'fraction-matcher',
          name: 'Fraction Matcher',
          description: 'Match equivalent fractions in this interactive game.',
          url: 'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_en.html',
          concepts: ['Equivalent Fractions', 'Matching', 'Comparison'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'fractions-equality',
          name: 'Fractions: Equality',
          description: 'Understand when fractions are equal using visual models.',
          url: 'https://phet.colorado.edu/sims/html/fractions-equality/latest/fractions-equality_en.html',
          concepts: ['Fraction Equality', 'Equivalent Fractions', 'Visual Models'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        },
        {
          id: 'make-a-ten',
          name: 'Make a Ten',
          description: 'Build number sense by making groups of ten.',
          url: 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_en.html',
          concepts: ['Base 10', 'Addition', 'Number Bonds', 'Place Value'],
          gradeLevel: '3-5',
          duration: '15-20 minutes'
        }
      ]
    },
    {
      title: 'Geometry',
      icon: <GeometryIcon />,
      color: '#ff9800',
      simulations: [
        {
          id: 'area-builder',
          name: 'Area Builder',
          description: 'Build shapes and explore area concepts with hands-on activities.',
          url: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_en.html',
          concepts: ['Area', 'Shapes', 'Building', 'Measurement'],
          gradeLevel: '3-5',
          duration: '20-25 minutes'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/math-stats');
  };

  const handleSimulationClick = (simulationId) => {
    navigate(`/student-dashboard/math-stats/elementary/game/${simulationId}`);
  };

  const getTotalSimulations = () => {
    return mathCategories.reduce((total, category) => total + category.simulations.length, 0);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#7445f8',
              backgroundColor: '#7445f8',
              color: '#fff',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(116, 69, 248, 0.3)',
            }
          }}
        >
          Back to Math & Statistics
        </Button>
      </Box>
      
      {/* Cover Image Section with Hover Effect */}
      <Box 
        sx={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          mb: 4,
          height: '300px',
          cursor: 'pointer',
          '&:hover': {
            '& .hover-overlay': {
              opacity: 1,
              backdropFilter: 'blur(8px)'
            },
            '& .image-background': {
              filter: 'blur(3px)',
              transform: 'scale(1.05)'
            }
          }
        }}
      >
        {/* Background Image */}
        <Box
          className="image-background"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${elementaryImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'all 0.4s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {/* Default Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Box>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                marginBottom: 2 
              }}
            >
              Elementary Math Simulations
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                margin: '0 auto',
                fontWeight: 'normal',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                mb: 1
              }}
            >
              Interactive PhET Math Simulations for Grades 3-5
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#fff',
                margin: '0 auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                mb: 3
              }}
            >
              Grades 3-5 • {getTotalSimulations()} Interactive PhET Simulations • Basic concepts, visual learning, and hands-on exploration
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${getTotalSimulations()} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#7445f8',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 3-5" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#7445f8',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* Hover overlay for enhanced text display */}
        <Box
          className="hover-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'all 0.4s ease-in-out',
            backdropFilter: 'blur(0px)',
            padding: 3
          }}
        >
          <Typography 
            variant="h2" 
            component="div"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
              mb: 2,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out'
            }}
          >
            Elementary Level
          </Typography>
          
          <Typography 
            variant="h4" 
            component="div"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              lineHeight: 1.4,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out 0.1s',
              mb: 2
            }}
          >
            Math & Statistics Simulations
          </Typography>

          <Typography 
            variant="h6" 
            component="div"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              lineHeight: 1.4,
              transform: 'translateY(20px)',
              transition: 'transform 0.4s ease-in-out 0.2s'
            }}
          >
            Grades 3-5 • {getTotalSimulations()} Interactive Simulations
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {mathCategories.map((category, categoryIndex) => (
          <Grid item xs={12} key={categoryIndex}>
            <Box sx={{ mb: 4 }}>
              {/* Category Header */}
              <Box 
                sx={{ 
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)`,
                  border: `2px solid ${category.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box sx={{ color: category.color, display: 'flex', alignItems: 'center' }}>
                  {category.icon}
                </Box>
                <Typography variant="h5" fontWeight={600} color="#333">
                  {category.title}
                </Typography>
                <Chip 
                  label={`${category.simulations.length} simulations`} 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    fontWeight: 600
                  }}
                />
              </Box>
              
              {/* Simulations Grid */}
              <Grid container spacing={3}>
                {category.simulations.map((simulation, simIndex) => (
                  <Grid item xs={12} md={6} lg={4} key={simIndex}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" fontWeight={600} color="#333" gutterBottom>
                            {simulation.name}
                          </Typography>
                          <Chip
                            label={simulation.gradeLevel}
                            size="small"
                            sx={{
                              backgroundColor: `${category.color}15`,
                              color: category.color,
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {simulation.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {simulation.concepts.slice(0, 3).map((concept, conceptIndex) => (
                            <Chip
                              key={conceptIndex}
                              label={concept}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem',
                                borderColor: category.color,
                                color: category.color
                              }}
                            />
                          ))}
                          {simulation.concepts.length > 3 && (
                            <Chip
                              label={`+${simulation.concepts.length - 3} more`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem',
                                borderColor: category.color,
                                color: category.color,
                                fontStyle: 'italic'
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          Duration: {simulation.duration}
                        </Typography>
                        <Button 
                          variant="contained"
                          fullWidth
                          onClick={() => handleSimulationClick(simulation.id)}
                          sx={{
                            backgroundColor: category.color,
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1,
                            mt: 'auto',
                            '&:hover': {
                              backgroundColor: category.color,
                              filter: 'brightness(0.9)',
                              transform: 'translateY(-1px)',
                            }
                          }}
                        >
                          Launch Simulation
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box mt={6} p={4} sx={{ backgroundColor: '#f8f9fa', borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
          About PhET Math Simulations
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          These interactive simulations are provided by the PhET Interactive Simulations project at the University of Colorado Boulder. 
          They are designed to help students visualize and understand mathematical concepts through hands-on exploration.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Link 
            href="https://phet.colorado.edu/" 
            target="_blank" 
            sx={{ 
              color: '#7445f8', 
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Visit PhET Interactive Simulations →
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ElementaryMathStats;