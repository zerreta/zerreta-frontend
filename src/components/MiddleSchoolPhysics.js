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
  DirectionsRun as MotionIcon,
  GraphicEq as WavesIcon,
  ElectricBolt as ElectricityIcon,
  Whatshot as HeatIcon,
  Public as GravityIcon,
  Science as MiscIcon
} from '@mui/icons-material';
import middleSchoolImage from '../assets/middleschool.png';

const MiddleSchoolPhysics = () => {
  const navigate = useNavigate();

  const physicsCategories = [
    {
      title: 'Mechanics & Motion',
      icon: <MotionIcon />,
      color: '#2196f3',
      games: [
        {
          id: 'forces-and-motion',
          name: 'Forces and Motion',
          description: 'Explore how forces affect motion with detailed analysis and measurement tools.',
          concepts: ['Forces', 'Motion', 'Acceleration', 'Velocity', 'Net Force'],
          gradeLevel: '6-8',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/forces-and-motion',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=forces-and-motion'
        },
        {
          id: 'ramp-forces-and-motion',
          name: 'Ramp: Forces and Motion',
          description: 'Study forces on inclined planes and understand how ramps affect motion.',
          concepts: ['Inclined Planes', 'Forces', 'Motion', 'Normal Force', 'Friction'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/ramp-forces-and-motion',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=ramp-forces-and-motion'
        },
        {
          id: 'motion-in-2d',
          name: 'Motion in 2D',
          description: 'Explore two-dimensional motion with vectors and coordinate systems.',
          concepts: ['2D Motion', 'Vectors', 'Components', 'Projectiles', 'Coordinate Systems'],
          gradeLevel: '6-8',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/motion-2d',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/motion-2d/latest/motion-2d.html?simulation=motion-2d'
        },
        {
          id: 'lunar-lander',
          name: 'Lunar Lander',
          description: 'Pilot a lunar lander and learn about forces, gravity, and space exploration.',
          concepts: ['Gravity', 'Forces', 'Space', 'Thrust', 'Landing'],
          gradeLevel: '6-8',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/lunar-lander',
          iframeUrl: 'https://phet.colorado.edu/sims/html/lunar-lander/latest/lunar-lander_en.html'
        }
      ]
    },
    {
      title: 'Waves & Sound',
      icon: <WavesIcon />,
      color: '#9c27b0',
      games: [
        {
          id: 'wave-on-a-string',
          name: 'Wave on a String',
          description: 'Create and study waves on a string, exploring frequency, amplitude, and wave speed.',
          concepts: ['Wave Motion', 'Frequency', 'Amplitude', 'Wave Speed', 'Oscillations'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/wave-on-a-string',
          iframeUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html'
        },
        {
          id: 'wave-interference',
          name: 'Wave Interference',
          description: 'Explore what happens when waves meet and interfere with each other.',
          concepts: ['Wave Interference', 'Constructive Interference', 'Destructive Interference', 'Wave Patterns'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/wave-interference',
          iframeUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html'
        }
      ]
    },
    {
      title: 'Electricity & Magnetism',
      icon: <ElectricityIcon />,
      color: '#ff9800',
      games: [
        {
          id: 'ohms-law',
          name: 'Ohm\'s Law',
          description: 'Explore the relationship between voltage, current, and resistance in electrical circuits.',
          concepts: ['Ohm\'s Law', 'Voltage', 'Current', 'Resistance', 'Electrical Relationships'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/ohms-law',
          iframeUrl: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html'
        },
        {
          id: 'circuit-construction-kit-dc',
          name: 'Circuit Construction Kit: DC',
          description: 'Build and test DC electrical circuits with batteries, bulbs, and wires.',
          concepts: ['DC Circuits', 'Current', 'Voltage', 'Resistance', 'Circuit Components'],
          gradeLevel: '6-8',
          duration: '25-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc',
          iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html'
        },
        {
          id: 'circuit-construction-kit-dc-virtual-lab',
          name: 'Circuit Construction Kit: DC - Virtual Lab',
          description: 'Advanced circuit building with measurement tools and analysis capabilities.',
          concepts: ['Circuit Analysis', 'Measurements', 'Series Circuits', 'Parallel Circuits', 'Circuit Design'],
          gradeLevel: '6-8',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc-virtual-lab',
          iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html'
        },
        {
          id: 'battery-voltage',
          name: 'Battery Voltage',
          description: 'Understand how batteries work and what determines battery voltage.',
          concepts: ['Battery', 'Voltage', 'Chemical Energy', 'Electric Potential', 'Energy Conversion'],
          gradeLevel: '6-8',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/battery-voltage',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/battery-voltage/latest/battery-voltage.html?simulation=battery-voltage'
        }
      ]
    },
    {
      title: 'Thermodynamics & Heat',
      icon: <HeatIcon />,
      color: '#f44336',
      games: [
        {
          id: 'friction',
          name: 'Friction',
          description: 'Explore how friction affects motion and generates heat between surfaces.',
          concepts: ['Friction', 'Surface Texture', 'Heat Generation', 'Motion', 'Contact Forces'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/friction',
          iframeUrl: 'https://phet.colorado.edu/sims/html/friction/latest/friction_en.html'
        },
        {
          id: 'under-pressure',
          name: 'Under Pressure',
          description: 'Study pressure in fluids and understand how pressure varies with depth.',
          concepts: ['Pressure', 'Fluid Pressure', 'Depth', 'Atmospheric Pressure', 'Pascal\'s Principle'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/under-pressure',
          iframeUrl: 'https://phet.colorado.edu/sims/html/under-pressure/latest/under-pressure_en.html'
        }
      ]
    },
    {
      title: 'Gravity & Astronomy',
      icon: <GravityIcon />,
      color: '#673ab7',
      games: [
        {
          id: 'gravity-force-lab-basics',
          name: 'Gravity Force Lab: Basics',
          description: 'Explore gravitational forces between objects and understand Newton\'s law of gravitation.',
          concepts: ['Gravitational Force', 'Mass', 'Distance', 'Force Interaction', 'Newton\'s Law'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/gravity-force-lab-basics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-force-lab-basics/latest/gravity-force-lab-basics_en.html'
        },
        {
          id: 'gravity-and-orbits',
          name: 'Gravity and Orbits',
          description: 'Understand how gravity creates orbits and affects planetary motion.',
          concepts: ['Gravity', 'Orbits', 'Planets', 'Orbital Motion', 'Centripetal Force'],
          gradeLevel: '6-8',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/gravity-and-orbits',
          iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html'
        },
        {
          id: 'my-solar-system',
          name: 'My Solar System',
          description: 'Create and explore different solar system configurations and planetary motions.',
          concepts: ['Solar Systems', 'Planetary Motion', 'Gravity', 'Orbital Mechanics', 'Astronomy'],
          gradeLevel: '6-8',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/my-solar-system',
          iframeUrl: 'https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_en.html'
        }
      ]
    },
    {
      title: 'Miscellaneous Physics',
      icon: <MiscIcon />,
      color: '#4caf50',
      games: [
        {
          id: 'buoyancy',
          name: 'Buoyancy',
          description: 'Advanced exploration of buoyancy, density, and Archimedes\' principle.',
          concepts: ['Buoyancy', 'Density', 'Archimedes\' Principle', 'Displacement', 'Fluid Forces'],
          gradeLevel: '6-8',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/buoyancy',
          iframeUrl: 'https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_en.html'
        },
        {
          id: 'masses-and-springs',
          name: 'Masses and Springs',
          description: 'Study spring systems with detailed analysis of oscillation and energy.',
          concepts: ['Springs', 'Oscillation', 'Hooke\'s Law', 'Simple Harmonic Motion', 'Energy'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/masses-and-springs',
          iframeUrl: 'https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_en.html'
        },
        {
          id: 'hookes-law',
          name: 'Hooke\'s Law',
          description: 'Explore the relationship between force and displacement in springs.',
          concepts: ['Hooke\'s Law', 'Spring Constant', 'Force', 'Displacement', 'Elasticity'],
          gradeLevel: '6-8',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/hookes-law',
          iframeUrl: 'https://phet.colorado.edu/sims/html/hookes-law/latest/hookes-law_en.html'
        },
        {
          id: 'fluid-pressure-and-flow',
          name: 'Fluid Pressure and Flow',
          description: 'Study fluid dynamics, pressure, and flow in pipes and containers.',
          concepts: ['Fluid Dynamics', 'Pressure', 'Flow Rate', 'Bernoulli\'s Principle', 'Viscosity'],
          gradeLevel: '6-8',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/fluid-pressure-and-flow',
          iframeUrl: 'https://phet.colorado.edu/sims/html/fluid-pressure-and-flow/latest/fluid-pressure-and-flow_en.html'
        },
        {
          id: 'plate-tectonics',
          name: 'Plate Tectonics',
          description: 'Explore Earth\'s plate movements and understand geological processes.',
          concepts: ['Plate Tectonics', 'Earth Science', 'Geological Processes', 'Continental Drift', 'Earthquakes'],
          gradeLevel: '6-8',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/plate-tectonics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/plate-tectonics/latest/plate-tectonics_en.html'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/physics');
  };

  const handleGameClick = (gameId) => {
    navigate(`/student-dashboard/physics/middle/game/${gameId}`);
  };

  const totalGames = physicsCategories.reduce((total, category) => total + category.games.length, 0);

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
          Back to Physics
        </Button>
      </Box>
      
      {/* Cover Image Section with Blur on Hover */}
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
          }}
        />

        {/* Default Overlay with visible text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))',
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
              Middle School Physics Simulations
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
              Introduction to variables, energy, forces, and simple models
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
              Grades 6-8 • {totalGames} Interactive PhET Simulations • Advanced Concepts with Measurements
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${totalGames} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#9c27b0',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 6-8" 
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
            Middle School Physics
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
            Interactive Simulations
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
            Grades 6-8 • {totalGames} Interactive Simulations
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {physicsCategories.map((category, categoryIndex) => (
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
                  label={`${category.games.length} simulations`} 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    backgroundColor: `${category.color}20`,
                    color: category.color,
                    fontWeight: 600
                  }}
                />
              </Box>
              
              {/* Games Grid */}
              <Grid container spacing={3}>
                {category.games.map((game) => (
                  <Grid item xs={12} md={6} lg={4} key={game.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 3,
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 30px ${category.color}30`,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600} color="#333" sx={{ lineHeight: 1.3 }}>
                            {game.name}
                          </Typography>
                          <Chip 
                            label={game.gradeLevel} 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#fff3e0', 
                              color: '#e65100',
                              fontWeight: 500
                            }} 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.5 }}>
                          {game.description}
                        </Typography>
                        
                        <Box mb={2}>
                          <Typography variant="subtitle2" fontWeight={600} color="#333" mb={1}>
                            Key Concepts:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {game.concepts.slice(0, 3).map((concept, index) => (
                              <Chip
                                key={index}
                                label={concept}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            {game.concepts.length > 3 && (
                              <Chip
                                label={`+${game.concepts.length - 3} more`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', fontStyle: 'italic' }}
                              />
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={game.duration} 
                            size="small" 
                            sx={{ backgroundColor: '#f5f5f5', color: '#666' }}
                          />
                        </Box>
                        
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleGameClick(game.id)}
                          sx={{
                            backgroundColor: category.color,
                            color: '#fff',
                            fontWeight: 600,
                            borderRadius: 2,
                            py: 1.2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: category.color,
                              filter: 'brightness(0.9)',
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${category.color}40`,
                            }
                          }}
                        >
                          Explore Simulation
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
          Middle School Physics Learning Goals
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Build deeper understanding through quantitative analysis and scientific modeling
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <MotionIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Forces & Motion Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use mathematical tools to analyze forces and predict motion
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <ElectricityIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Circuit Design
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build and analyze electrical circuits using Ohm's law
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <WavesIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Wave Properties
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Investigate wave behavior and interference patterns
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MiddleSchoolPhysics; 