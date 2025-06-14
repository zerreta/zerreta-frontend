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
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Functions as AlgebraIcon,
  ShowChart as CalculusIcon
} from '@mui/icons-material';
import highSchoolImage from '../assets/highschool.png';

const HighSchoolMathStats = () => {
  const navigate = useNavigate();

  const mathCategories = [
    {
      title: 'Algebra & Functions',
      icon: <AlgebraIcon />,
      color: '#9c27b0',
      simulations: [
        {
          id: 'graphing-quadratics',
          name: 'Graphing Quadratics',
          description: 'Explore quadratic functions and their graphs.',
          url: 'https://phet.colorado.edu/sims/html/graphing-quadratics/latest/graphing-quadratics_en.html',
          concepts: ['Quadratic Functions', 'Parabolas', 'Graphing'],
          gradeLevel: '8-9',
          duration: '30-35 minutes'
        },
        {
          id: 'curve-fitting',
          name: 'Curve Fitting',
          description: 'Fit curves to data and understand mathematical relationships.',
          url: 'https://phet.colorado.edu/sims/html/curve-fitting/latest/curve-fitting_en.html',
          concepts: ['Curve Fitting', 'Data Analysis', 'Mathematical Models'],
          gradeLevel: '8-9',
          duration: '30-35 minutes'
        },
        {
          id: 'least-squares-regression',
          name: 'Least-Squares Regression',
          description: 'Learn about regression analysis and line of best fit.',
          url: 'https://phet.colorado.edu/sims/html/least-squares-regression/latest/least-squares-regression_en.html',
          concepts: ['Regression', 'Line of Best Fit', 'Statistical Analysis'],
          gradeLevel: '8-9',
          duration: '30-35 minutes'
        },
        {
          id: 'function-builder',
          name: 'Function Builder',
          description: 'Advanced function building and analysis.',
          url: 'https://phet.colorado.edu/sims/html/function-builder/latest/function-builder_en.html',
          concepts: ['Functions', 'Mathematical Relationships', 'Analysis'],
          gradeLevel: '8-9',
          duration: '25-30 minutes'
        },
        {
          id: 'equality-explorer',
          name: 'Equality Explorer',
          description: 'Advanced exploration of algebraic equality.',
          url: 'https://phet.colorado.edu/sims/html/equality-explorer/latest/equality-explorer_en.html',
          concepts: ['Algebraic Equality', 'Equation Solving', 'Balance'],
          gradeLevel: '8-9',
          duration: '25-30 minutes'
        },
        {
          id: 'area-model-algebra',
          name: 'Area Model Algebra',
          description: 'Use area models for algebraic concepts.',
          url: 'https://phet.colorado.edu/sims/html/area-model-algebra/latest/area-model-algebra_en.html',
          concepts: ['Algebraic Area Models', 'Factoring', 'Polynomials'],
          gradeLevel: '8-9',
          duration: '30-35 minutes'
        }
      ]
    },
    {
      title: 'Trigonometry & Calculus',
      icon: <CalculusIcon />,
      color: '#3f51b5',
      simulations: [
        {
          id: 'trig-tour',
          name: 'Trig Tour',
          description: 'Explore trigonometric functions and the unit circle.',
          url: 'https://phet.colorado.edu/sims/html/trig-tour/latest/trig-tour_en.html',
          concepts: ['Trigonometry', 'Unit Circle', 'Sine and Cosine'],
          gradeLevel: '8-9',
          duration: '30-35 minutes'
        },
        {
          id: 'calculus-grapher',
          name: 'Calculus Grapher',
          description: 'Introduction to calculus concepts through graphing.',
          url: 'https://phet.colorado.edu/sims/html/calculus-grapher/latest/calculus-grapher_en.html',
          concepts: ['Calculus', 'Derivatives', 'Graphing'],
          gradeLevel: '8-9',
          duration: '35-40 minutes'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/math-stats');
  };

  const handleSimulationClick = (simulationId) => {
    navigate(`/student-dashboard/math-stats/high/game/${simulationId}`);
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
            backgroundImage: `url(${highSchoolImage})`,
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
              High School Math Simulations
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
              Interactive PhET Math Simulations for Grades 8-9
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
              Grades 8-9 • {getTotalSimulations()} Interactive PhET Simulations • Advanced mathematics, preparing for college-level coursework
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${getTotalSimulations()} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#3f51b5',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 8-9" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#3f51b5',
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
            High School Level
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
            Grades 8-9 • {getTotalSimulations()} Interactive Simulations
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
      </Box>
    </Container>
  );
};

export default HighSchoolMathStats; 