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
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Opacity as WaterIcon,
  LocalFireDepartment as ReactionsIcon,
  AutoAwesome as CrystalsIcon
} from '@mui/icons-material';
import elementaryImage from '../assets/elementaryschool.png';

const ElementaryChemistry = () => {
  const navigate = useNavigate();

  const chemistryGames = [
    {
      id: 'states-of-matter-basics',
      name: 'States of Matter: Basics',
      description: 'Explore the different states of matter by heating and cooling atoms or molecules.',
      concepts: ['Solids', 'Liquids', 'Gases', 'Temperature', 'Phase Changes'],
      gradeLevel: 'K-5',
      duration: '15-20 minutes',
      url: 'https://phet.colorado.edu/en/simulations/states-of-matter-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_en.html'
    },
    {
      id: 'ph-scale-basics',
      name: 'pH Scale: Basics',
      description: 'Test the pH of things like coffee, spit, and soap to determine whether they are acidic, basic or neutral.',
      concepts: ['Acids', 'Bases', 'pH Scale', 'Chemical Testing', 'Safe Experiments'],
      gradeLevel: 'K-5',
      duration: '20-25 minutes',
      url: 'https://phet.colorado.edu/en/simulations/ph-scale-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/ph-scale-basics/latest/ph-scale-basics_en.html'
    },
    {
      id: 'sugar-and-salt-solutions',
      name: 'Sugar and Salt Solutions',
      description: 'Observe what happens when you add sugar or salt to water and learn about solutions.',
      concepts: ['Solutions', 'Dissolving', 'Mixtures', 'Concentration', 'Molecular View'],
      gradeLevel: '3-5',
      duration: '20-30 minutes',
      url: 'https://phet.colorado.edu/en/simulations/sugar-and-salt-solutions',
      iframeUrl: 'https://phet.colorado.edu/sims/html/sugar-and-salt-solutions/latest/sugar-and-salt-solutions_en.html'
    },
    {
      id: 'concentration',
      name: 'Concentration',
      description: 'Watch your solution change color as you mix chemicals with water.',
      concepts: ['Concentration', 'Solutions', 'Color Changes', 'Mixing', 'Dilution'],
      gradeLevel: '2-5',
      duration: '15-20 minutes',
      url: 'https://phet.colorado.edu/en/simulations/concentration',
      iframeUrl: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html'
    },
    {
      id: 'build-a-molecule',
      name: 'Build a Molecule',
      description: 'Starting from atoms, see how many molecules you can build in this fun chemistry game.',
      concepts: ['Atoms', 'Molecules', 'Chemical Formulas', 'Bonds', 'Building'],
      gradeLevel: '3-5',
      duration: '25-30 minutes',
      url: 'https://phet.colorado.edu/en/simulations/build-a-molecule',
      iframeUrl: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_en.html'
    },
    {
      id: 'molarity',
      name: 'Molarity',
      description: 'When you add water to a solute, how does the concentration change?',
      concepts: ['Concentration', 'Solutions', 'Water', 'Mixing', 'Dilution'],
      gradeLevel: '4-5',
      duration: '20-25 minutes',
      url: 'https://phet.colorado.edu/en/simulations/molarity',
      iframeUrl: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_en.html'
    },
    {
      id: 'acid-base-solutions',
      name: 'Acid-Base Solutions',
      description: 'Test acids and bases with different solutions and see how they react.',
      concepts: ['Acids', 'Bases', 'Solutions', 'Chemical Reactions', 'Testing'],
      gradeLevel: '4-5',
      duration: '25-30 minutes',
      url: 'https://phet.colorado.edu/en/simulations/acid-base-solutions',
      iframeUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html'
    },
    {
      id: 'isotopes-and-atomic-mass',
      name: 'Isotopes and Atomic Mass',
      description: 'How do isotopes relate to the average atomic mass of an element?',
      concepts: ['Atoms', 'Isotopes', 'Atomic Mass', 'Elements', 'Nucleus'],
      gradeLevel: '4-5',
      duration: '20-25 minutes',
      url: 'https://phet.colorado.edu/en/simulations/isotopes-and-atomic-mass',
      iframeUrl: 'https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_en.html'
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/chemistry');
  };

  const handleGameClick = (gameId) => {
    navigate(`/student-dashboard/chemistry/elementary/game/${gameId}`);
  };

  const teachingResources = [
    {
      title: 'Safe Chemistry Experiments',
      icon: <ScienceIcon />,
      content: [
        'Kitchen Chemistry: Safe reactions using household items',
        'Color-changing reactions with safe indicators',
        'Crystal growing projects for understanding states of matter',
        'pH testing using natural indicators like red cabbage'
      ]
    },
    {
      title: 'Understanding Solutions',
      icon: <WaterIcon />,
      content: [
        'Dissolving sugar and salt in water demonstrations',
        'Making different concentrations of colored solutions',
        'Comparing how different substances dissolve',
        'Creating layers with different density solutions'
      ]
    },
    {
      title: 'Chemical Reactions',
      icon: <ReactionsIcon />,
      content: [
        'Baking soda and vinegar reactions',
        'Milk and food coloring experiments',
        'Elephant toothpaste demonstrations (teacher-led)',
        'Observing physical vs chemical changes'
      ]
    },
    {
      title: 'Building Models',
      icon: <CrystalsIcon />,
      content: [
        'Using play dough to model atoms and molecules',
        'Building simple molecular structures',
        'Creating crystal models with marshmallows and toothpicks',
        'Demonstrating molecular motion with students as atoms'
      ]
    }
  ];

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
          Back to Chemistry
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
              Elementary Chemistry Games
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
              Discover the world of chemistry through safe, interactive simulations
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
              Grades K-5 • Safe Chemistry Exploration • {chemistryGames.length} Interactive Games
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${chemistryGames.length} Games`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#4caf50',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades K-5" 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#4caf50',
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
            Elementary Chemistry
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
            Interactive Games
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
            Grades K-5 • {chemistryGames.length} Safe Interactive Games
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Games Section */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h4" fontWeight={600} color="#333" mb={3}>
            Interactive Chemistry Simulations
          </Typography>
          <Grid container spacing={3}>
            {chemistryGames.map((game) => (
              <Grid item xs={12} md={6} key={game.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(76, 175, 80, 0.2)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} color="#333">
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
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
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
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        fontWeight: 600,
                        borderRadius: 2,
                        py: 1.2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#388e3c',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                        }
                      }}
                    >
                      Play Chemistry Game
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Teaching Resources Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant="h5" fontWeight={600} color="#333" mb={3}>
              Teaching Resources
            </Typography>
            {teachingResources.map((resource, index) => (
              <Accordion 
                key={index}
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&:before': { display: 'none' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(76, 175, 80, 0.15)',
                    '& .MuiAccordionSummary-root': {
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    }
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2
                    }
                  }}
                >
                  <Box sx={{ color: '#4caf50' }}>
                    {resource.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {resource.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {resource.content.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        component="li"
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, lineHeight: 1.6 }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ElementaryChemistry; 