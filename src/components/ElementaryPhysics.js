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
  Science as MiscIcon
} from '@mui/icons-material';
import elementaryImage from '../assets/elementaryschool.png';

const ElementaryPhysics = () => {
  const navigate = useNavigate();

  const physicsCategories = [
    {
      title: 'Mechanics & Motion',
      icon: <MotionIcon />,
      color: '#2196f3',
      games: [
        {
          id: 'the-moving-man',
          name: 'The Moving Man',
          description: 'Explore position, velocity, and acceleration by moving a character around.',
          concepts: ['Position', 'Velocity', 'Acceleration', '1D Motion', 'Graphs'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/moving-man',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/moving-man/latest/moving-man.html?simulation=moving-man'
        },
        {
          id: 'ladybug-motion-2d',
          name: 'Ladybug Motion 2D',
          description: 'Learn about motion in two dimensions by controlling a ladybug\'s movement.',
          concepts: ['2D Motion', 'Velocity', 'Acceleration', 'Position', 'Vectors'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/ladybug-motion-2d',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/ladybug-motion-2d/latest/ladybug-motion-2d.html?simulation=ladybug-motion-2d'
        },
        {
          id: 'forces-and-motion-basics',
          name: 'Forces and Motion: Basics',
          description: 'Understand how forces affect the motion of objects in everyday situations.',
          concepts: ['Forces', 'Motion', 'Push and Pull', 'Newton\'s Laws', 'Acceleration'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html'
        },
        {
          id: 'john-travoltage',
          name: 'John Travoltage',
          description: 'Learn about static electricity by making sparks fly in this fun simulation.',
          concepts: ['Static Electricity', 'Electric Charge', 'Sparks', 'Conductors'],
          gradeLevel: '3-5',
          duration: '10-20 minutes',
          url: 'https://phet.colorado.edu/en/simulations/john-travoltage',
          iframeUrl: 'https://phet.colorado.edu/sims/html/john-travoltage/latest/john-travoltage_en.html'
        }
      ]
    },
    {
      title: 'Waves & Sound',
      icon: <WavesIcon />,
      color: '#9c27b0',
      games: [
        {
          id: 'sound-waves',
          name: 'Sound Waves',
          description: 'Explore how sound waves travel and what affects their properties.',
          concepts: ['Sound Waves', 'Frequency', 'Amplitude', 'Vibrations', 'Audio'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/sound',
          iframeUrl: 'https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_en.html'
        },
        {
          id: 'waves-intro',
          name: 'Waves Intro',
          description: 'Learn about wave properties, frequency, and amplitude through interactive exploration.',
          concepts: ['Wave Motion', 'Frequency', 'Amplitude', 'Wave Properties'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/waves-intro',
          iframeUrl: 'https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_en.html'
        }
      ]
    },
    {
      title: 'Electricity & Magnetism',
      icon: <ElectricityIcon />,
      color: '#ff9800',
      games: [
        {
          id: 'magnets-and-electromagnets',
          name: 'Magnets and Electromagnets',
          description: 'Discover how magnets work and explore the connection between electricity and magnetism.',
          concepts: ['Magnets', 'Electromagnets', 'Magnetic Fields', 'Electric Current', 'Poles'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/magnets-and-electromagnets',
          iframeUrl: 'https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html'
        },
        {
          id: 'magnet-and-compass',
          name: 'Magnet and Compass',
          description: 'Learn how compasses work and explore Earth\'s magnetic field.',
          concepts: ['Compass', 'Magnetic Field', 'Earth\'s Magnetism', 'Navigation', 'Magnetic Poles'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/magnet-and-compass',
          iframeUrl: 'https://phet.colorado.edu/sims/html/magnet-and-compass/latest/magnet-and-compass_en.html'
        },
        {
          id: 'balloons-and-static-electricity',
          name: 'Balloons and Static Electricity',
          description: 'Explore static electricity by rubbing balloons and watching charges move.',
          concepts: ['Static Electricity', 'Electric Charge', 'Attraction', 'Repulsion'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/balloons-and-static-electricity',
          iframeUrl: 'https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_en.html'
        },
        {
          id: 'electric-field-hockey',
          name: 'Electric Field Hockey',
          description: 'Score goals using electric fields and learn about electric forces.',
          concepts: ['Electric Fields', 'Electric Forces', 'Positive and Negative Charges', 'Field Lines'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/electric-field-hockey',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/electric-hockey/latest/electric-hockey.html?simulation=electric-hockey'
        }
      ]
    },
    {
      title: 'Thermodynamics & Heat',
      icon: <HeatIcon />,
      color: '#f44336',
      games: [
        {
          id: 'energy-skate-park-basics',
          name: 'Energy Skate Park: Basics',
          description: 'Learn about energy conservation as a skater moves on different tracks.',
          concepts: ['Kinetic Energy', 'Potential Energy', 'Energy Conservation', 'Motion'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/energy-skate-park-basics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html'
        },
        {
          id: 'energy-forms-and-changes',
          name: 'Energy Forms and Changes',
          description: 'Understand different forms of energy and how energy transforms from one type to another.',
          concepts: ['Kinetic Energy', 'Potential Energy', 'Heat Energy', 'Energy Transfer'],
          gradeLevel: '3-5',
          duration: '20-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/energy-forms-and-changes',
          iframeUrl: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html'
        }
      ]
    },
    {
      title: 'Miscellaneous Physics',
      icon: <MiscIcon />,
      color: '#4caf50',
      games: [
        {
          id: 'buoyancy-basics',
          name: 'Buoyancy: Basics',
          description: 'Explore why some objects float and others sink by investigating buoyancy.',
          concepts: ['Buoyancy', 'Density', 'Floating', 'Sinking', 'Displacement'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/buoyancy-basics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/buoyancy-basics/latest/buoyancy-basics_en.html'
        },
        {
          id: 'masses-and-springs-basics',
          name: 'Masses and Springs: Basics',
          description: 'Study springs, elasticity, and oscillation with different masses.',
          concepts: ['Springs', 'Elasticity', 'Oscillation', 'Mass and Motion'],
          gradeLevel: '3-5',
          duration: '15-25 minutes',
          url: 'https://phet.colorado.edu/en/simulations/masses-and-springs-basics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/masses-and-springs-basics/latest/masses-and-springs-basics_en.html'
        },
        {
          id: 'balloons-and-buoyancy',
          name: 'Balloons & Buoyancy',
          description: 'Understand how hot air balloons work and explore buoyancy in different fluids.',
          concepts: ['Buoyancy', 'Hot Air Balloons', 'Density', 'Temperature', 'Gases'],
          gradeLevel: '3-5',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/balloons-and-buoyancy',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/ideal-gas/latest/ideal-gas.html?simulation=balloons-and-buoyancy'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/physics');
  };

  const handleGameClick = (gameId) => {
    navigate(`/student-dashboard/physics/elementary/game/${gameId}`);
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
            backgroundImage: `url(${elementaryImage})`,
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
              Elementary Physics Simulations
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
              Basic concepts, visual learning, and intuitive understanding
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
              Grades 3-5 • {totalGames} Interactive PhET Simulations • Organized by Physics Topics
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${totalGames} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2196f3',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 3-5" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2196f3',
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
            Elementary Physics
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
            Grades 3-5 • {totalGames} Interactive Simulations
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
                              backgroundColor: '#e8f5e9', 
                              color: '#2e7d32',
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
                          Play Simulation
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
          Elementary Physics Learning Goals
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={3}>
            <Box>
              <MotionIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Motion & Forces
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand how things move and what makes them speed up or slow down
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <WavesIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Waves & Sound
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore how sound travels and learn about wave properties
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <ElectricityIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Electricity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover static electricity and basic electric forces
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <HeatIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Energy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn about different forms of energy and how they change
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ElementaryPhysics; 