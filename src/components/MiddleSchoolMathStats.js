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
  BarChart as StatsIcon,
  PieChart as GeometryIcon,
  TrendingUp as ProbabilityIcon
} from '@mui/icons-material';
import middleSchoolImage from '../assets/middleschool.png';

const MiddleSchoolMathStats = () => {
  const navigate = useNavigate();

  const mathCategories = [
    {
      title: 'Algebra & Functions',
      icon: <AlgebraIcon />,
      color: '#9c27b0',
      simulations: [
        {
          id: 'graphing-lines',
          name: 'Graphing Lines',
          description: 'Explore linear equations and graphing on coordinate planes.',
          url: 'https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_en.html',
          concepts: ['Linear Equations', 'Graphing', 'Coordinate Plane'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        },
        {
          id: 'graphing-slope-intercept',
          name: 'Graphing Slope-Intercept',
          description: 'Understand slope-intercept form and linear relationships.',
          url: 'https://phet.colorado.edu/sims/html/graphing-slope-intercept/latest/graphing-slope-intercept_en.html',
          concepts: ['Slope', 'Y-intercept', 'Linear Functions'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        },
        {
          id: 'function-builder-basics',
          name: 'Function Builder: Basics',
          description: 'Build and understand functions through input-output relationships.',
          url: 'https://phet.colorado.edu/sims/html/function-builder-basics/latest/function-builder-basics_en.html',
          concepts: ['Functions', 'Input-Output', 'Mathematical Relationships'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        },
        {
          id: 'equality-explorer-basics',
          name: 'Equality Explorer: Basics',
          description: 'Explore algebraic equality and balance concepts.',
          url: 'https://phet.colorado.edu/sims/html/equality-explorer-basics/latest/equality-explorer-basics_en.html',
          concepts: ['Equality', 'Balance', 'Algebra Basics'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        },
        {
          id: 'equality-explorer-two-variables',
          name: 'Equality Explorer: Two Variables',
          description: 'Work with two-variable equations and systems.',
          url: 'https://phet.colorado.edu/sims/html/equality-explorer-two-variables/latest/equality-explorer-two-variables_en.html',
          concepts: ['Two Variables', 'Systems', 'Advanced Algebra'],
          gradeLevel: '6-8',
          duration: '25-30 minutes'
        },
        {
          id: 'expression-exchange',
          name: 'Expression Exchange',
          description: 'Work with algebraic expressions and equivalent forms.',
          url: 'https://phet.colorado.edu/sims/html/expression-exchange/latest/expression-exchange_en.html',
          concepts: ['Expressions', 'Equivalent Forms', 'Algebra'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        }
      ]
    },
    {
      title: 'Area Models',
      icon: <GeometryIcon />,
      color: '#4caf50',
      simulations: [
        {
          id: 'area-model-introduction',
          name: 'Area Model Introduction',
          description: 'Introduction to area models for multiplication.',
          url: 'https://phet.colorado.edu/sims/html/area-model-introduction/latest/area-model-introduction_en.html',
          concepts: ['Area Models', 'Multiplication', 'Visual Math'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        },
        {
          id: 'area-model-multiplication',
          name: 'Area Model Multiplication',
          description: 'Use area models to understand multiplication concepts.',
          url: 'https://phet.colorado.edu/sims/html/area-model-multiplication/latest/area-model-multiplication_en.html',
          concepts: ['Area Models', 'Multiplication', 'Factoring'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        },
        {
          id: 'area-model-decimals',
          name: 'Area Model Decimals',
          description: 'Apply area models to decimal multiplication.',
          url: 'https://phet.colorado.edu/sims/html/area-model-decimals/latest/area-model-decimals_en.html',
          concepts: ['Decimals', 'Area Models', 'Decimal Multiplication'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        }
      ]
    },
    {
      title: 'Ratios & Proportions',
      icon: <StatsIcon />,
      color: '#2196f3',
      simulations: [
        {
          id: 'ratio-and-proportion',
          name: 'Ratio and Proportion',
          description: 'Explore ratios and proportional relationships.',
          url: 'https://phet.colorado.edu/sims/html/ratio-and-proportion/latest/ratio-and-proportion_en.html',
          concepts: ['Ratios', 'Proportions', 'Relationships'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        },
        {
          id: 'proportion-playground',
          name: 'Proportion Playground',
          description: 'Play with proportions and scaling concepts.',
          url: 'https://phet.colorado.edu/sims/html/proportion-playground/latest/proportion-playground_en.html',
          concepts: ['Proportions', 'Scaling', 'Relationships'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        },
        {
          id: 'unit-rates',
          name: 'Unit Rates',
          description: 'Understand unit rates and their applications.',
          url: 'https://phet.colorado.edu/sims/html/unit-rates/latest/unit-rates_en.html',
          concepts: ['Unit Rates', 'Ratios', 'Applications'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        }
      ]
    },
    {
      title: 'Probability & Statistics',
      icon: <ProbabilityIcon />,
      color: '#ff5722',
      simulations: [
        {
          id: 'plinko-probability',
          name: 'Plinko Probability',
          description: 'Explore probability concepts using a Plinko board simulation.',
          url: 'https://phet.colorado.edu/sims/html/plinko-probability/latest/plinko-probability_en.html',
          concepts: ['Probability', 'Random Events', 'Distributions'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        },
        {
          id: 'mean-share-and-balance',
          name: 'Mean: Share and Balance',
          description: 'Understand mean as a balance point in data.',
          url: 'https://phet.colorado.edu/sims/html/mean-share-and-balance/latest/mean-share-and-balance_en.html',
          concepts: ['Mean', 'Average', 'Data Balance'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        },
        {
          id: 'center-and-variability',
          name: 'Center and Variability',
          description: 'Explore measures of center and variability in data.',
          url: 'https://phet.colorado.edu/sims/html/center-and-variability/latest/center-and-variability_en.html',
          concepts: ['Center', 'Variability', 'Data Analysis'],
          gradeLevel: '6-7',
          duration: '25-30 minutes'
        }
      ]
    },
    {
      title: 'Geometry',
      icon: <GeometryIcon />,
      color: '#795548',
      simulations: [
        {
          id: 'quadrilateral',
          name: 'Quadrilateral',
          description: 'Explore properties of quadrilaterals and their relationships.',
          url: 'https://phet.colorado.edu/sims/html/quadrilateral/latest/quadrilateral_en.html',
          concepts: ['Quadrilaterals', 'Properties', 'Geometry'],
          gradeLevel: '6-7',
          duration: '20-25 minutes'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/math-stats');
  };

  const handleSimulationClick = (simulationId) => {
    navigate(`/student-dashboard/math-stats/middle/game/${simulationId}`);
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
            backgroundImage: `url(${middleSchoolImage})`,
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
              Middle School Math Simulations
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
              Interactive PhET Math Simulations for Grades 6-7
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
              Grades 6-7 • {getTotalSimulations()} Interactive PhET Simulations • Algebraic thinking, statistical reasoning, and problem-solving
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${getTotalSimulations()} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#9c27b0',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 6-7" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#9c27b0',
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
            Middle School Level
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
            Grades 6-7 • {getTotalSimulations()} Interactive Simulations
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

export default MiddleSchoolMathStats; 