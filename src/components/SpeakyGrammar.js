import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Button, Box } from '@mui/material';

const SpeakyGrammar = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard/speaky');
  };

  // Add console log to debug
  console.log('SpeakyGrammar component is rendering...');

  const grammarLevels = [
    {
      id: 1,
      title: 'Beginner Grammar',
      subtitle: '(Topics 0–10)',
      icon: '🌱',
      bgColor: 'rgb(222, 231, 255)',
      description: 'Learn the fundamentals of English grammar',
      path: '/speaky/grammar/beginner',
      module: 'beginner'
    },
    {
      id: 2,
      title: 'Basic Grammar',
      subtitle: '(Topics 11–20)',
      icon: '🚶‍♂️',
      bgColor: 'rgb(255, 234, 222)',
      description: 'Build upon basic grammar structures',
      path: '/speaky/grammar/basic',
      module: 'basic'
    },
    {
      id: 3,
      title: 'Intermediate Grammar',
      subtitle: '(Topics 21–35)',
      icon: '🧭',
      bgColor: 'rgb(255, 214, 214)',
      description: 'Master intermediate grammar concepts',
      path: '/speaky/grammar/intermediate',
      module: 'intermediate'
    },
    {
      id: 4,
      title: 'Advanced Grammar',
      subtitle: '(Topics 36–50)',
      icon: '🧠',
      bgColor: 'rgb(214, 255, 214)',
      description: 'Perfect advanced grammar structures',
      path: '/speaky/grammar/advanced',
      module: 'advanced'
    }
  ];

  const handleLevelClick = (path) => {
    navigate(path);
  };

  const handleStartTest = (module, topicNumber = null) => {
    navigate('/grammar-test', {
      state: {
        module: module,
        topicNumber: topicNumber
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            '&:hover': {
              borderColor: '#5c33d4',
              backgroundColor: 'rgba(116, 69, 248, 0.04)',
            }
          }}
        >
          Back to Modules
        </Button>
      </Box>
      
      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            📝 Grammar Module
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Master English grammar with our comprehensive curriculum from beginner to advanced level
          </p>
        </div>
        
        {/* Grammar Level Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          {grammarLevels.map(level => (
            <div
              key={level.id}
              style={{ 
                backgroundColor: level.bgColor, 
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: 'none',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ 
                position: 'relative', 
                zIndex: '2'
              }}>
                <div style={{ 
                  color: 'rgb(226, 166, 59)', 
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    backgroundColor: 'rgb(226, 166, 59)', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '5px'
                  }}></span>
                  <span>Available</span>
                </div>
                <h3 style={{ 
                  margin: '0 0 5px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {level.title}
                </h3>
                <p style={{ 
                  margin: '0 0 10px 0',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  {level.subtitle}
                </p>
                <p style={{ 
                  margin: '0 0 20px 0',
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {level.description}
                </p>
                
                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  flexDirection: 'column'
                }}>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTest(level.module);
                    }}
                    sx={{
                      backgroundColor: '#7445f8',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#5c33d4',
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    🚀 Start Test
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelClick(level.path);
                    }}
                    sx={{
                      borderColor: '#7445f8',
                      color: '#7445f8',
                      '&:hover': {
                        borderColor: '#5c33d4',
                        backgroundColor: 'rgba(116, 69, 248, 0.04)',
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    📚 Learn Topics
                  </Button>
                </div>
              </div>
              <div style={{ 
                fontSize: '60px', 
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                lineHeight: '1',
                opacity: '0.7',
                pointerEvents: 'none'
              }}>
                {level.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakyGrammar; 