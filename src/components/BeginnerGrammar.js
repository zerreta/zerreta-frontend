import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Button, Box } from '@mui/material';

const BeginnerGrammar = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/speaky/grammar');
  };

  const beginnerTopics = [
    '0. Alphabets & Phonics',
    '1. Words & Vocabulary',
    '2. Nouns',
    '3. Pronouns (I, you, he, she, it, we, they)',
    '4. Articles (a, an, the)',
    '5. Verbs – Basic Action Words',
    '6. Subject + Verb + Object (S + V + O) Structure',
    '7. Singular and Plural Nouns',
    '8. Helping Verbs (is, am, are, was, were)',
    '9. Adjectives (big, small, happy)',
    '10. Simple Present Tense'
  ];

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
          Back to Grammar Levels
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
            🌱 Beginner Grammar
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Master the fundamentals of English grammar with these essential topics
          </p>
        </div>
        
        {/* Topics Grid */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div 
            style={{
              backgroundColor: 'rgb(222, 231, 255)',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              borderBottom: '2px solid rgba(0,0,0,0.1)',
              paddingBottom: '10px'
            }}>
              Topics 0-10: Foundation Level
            </h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {beginnerTopics.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.8)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgb(116, 69, 248)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 style={{
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {topic}
                      </h3>
                      <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        Click to start learning this topic
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerGrammar; 