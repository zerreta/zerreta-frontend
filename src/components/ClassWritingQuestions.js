import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Paper,
  Grid,
  Chip,
  Avatar,
  Fade,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Shuffle as ShuffleIcon,
  Create as WriteIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon
} from '@mui/icons-material';

const ClassWritingQuestions = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleGoBack = () => {
    navigate('/speaky/writing');
  };

  const classData = {
    3: {
      title: 'Class 3 Writing',
      subtitle: 'Basic Writing Skills',
      description: 'Master fundamental writing skills with simple sentences and basic paragraph structure.',
      color: '#4CAF50',
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
      bgColor: '#E8F5E9',
      textColor: '#2E7D32',
      questions: [
        'Write 5 sentences about your favourite fruit.',
        'Look at the picture and write 3 sentences about it.',
        'Fill in the blanks with a, an, the.',
        'Write 3 naming words (nouns) you see at home.',
        'Make 5 simple sentences using is/am/are.',
        'Describe your pet or a friend\'s pet in 5 lines.',
        'Write 3 things under your table, 3 things on your table.',
        'Write a short paragraph: "My School Bag" (5 lines).'
      ]
    },
    4: {
      title: 'Class 4 Writing',
      subtitle: 'Descriptive Writing',
      description: 'Develop descriptive writing skills and learn to create engaging paragraphs.',
      color: '#2196F3',
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
      bgColor: '#E3F2FD',
      textColor: '#1565C0',
      questions: [
        'Write a descriptive paragraph about your favorite place.',
        'Describe a character from your favorite story.',
        'Write about a memorable day in your life.',
        'Create a dialogue between two friends.',
        'Describe the weather today using adjectives.',
        'Write instructions for making a sandwich.',
        'Describe your dream house in detail.',
        'Write about your favorite festival.',
        'Create a story with a beginning, middle, and end.',
        'Describe an animal without naming it.'
      ]
    },
    5: {
      title: 'Class 5 Writing',
      subtitle: 'Creative Expression',
      description: 'Explore creative writing techniques and improve storytelling abilities.',
      color: '#9C27B0',
      bgGradient: 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)',
      bgColor: '#F3E5F5',
      textColor: '#7B1FA2',
      questions: [
        'Write a creative story about time travel.',
        'Create a poem about nature.',
        'Write a letter to your future self.',
        'Describe a magical world you would like to visit.',
        'Write a news report about an imaginary event.',
        'Create a character and write their adventure.',
        'Write a persuasive essay about your favorite hobby.',
        'Describe a day in the life of your pet.',
        'Write a short play with dialogue.',
        'Create a story that teaches a moral lesson.',
        'Write about solving a mystery.',
        'Describe your ideal vacation.'
      ]
    },
    6: {
      title: 'Class 6 Writing',
      subtitle: 'Structured Writing',
      description: 'Learn structured writing formats including essays and formal letters.',
      color: '#FF9800',
      bgGradient: 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)',
      bgColor: '#FFF3E0',
      textColor: '#F57C00',
      questions: [
        'Write a formal letter to the principal.',
        'Create a five-paragraph essay about friendship.',
        'Write a book review of your favorite story.',
        'Compose a speech about environmental protection.',
        'Write a biography of a famous person.',
        'Create an argumentative essay about school uniforms.',
        'Write a report on a science experiment.',
        'Compose a diary entry from a historical figure.',
        'Write instructions for a complex task.',
        'Create a newspaper editorial.',
        'Write a compare and contrast essay.',
        'Compose a formal invitation.',
        'Write a summary of a movie or book.',
        'Create a proposal for a school event.',
        'Write a research-based informative essay.'
      ]
    },
    7: {
      title: 'Class 7 Writing',
      subtitle: 'Advanced Composition',
      description: 'Master advanced composition techniques and analytical writing skills.',
      color: '#607D8B',
      bgGradient: 'linear-gradient(135deg, #607D8B 0%, #455a64 100%)',
      bgColor: '#ECEFF1',
      textColor: '#455A64',
      questions: [
        'Write an analytical essay about a social issue.',
        'Create a detailed character analysis.',
        'Write a research paper on climate change.',
        'Compose a critical review of a literary work.',
        'Write a persuasive speech about technology.',
        'Create an expository essay about cultural diversity.',
        'Write a cause and effect essay.',
        'Compose a reflection on personal growth.',
        'Write a technical manual or guide.',
        'Create a position paper on education.',
        'Write an interview script with a celebrity.',
        'Compose a detailed travel guide.',
        'Write a comparative analysis of two texts.',
        'Create a business proposal.',
        'Write a philosophical essay on happiness.',
        'Compose a historical narrative.',
        'Write a scientific explanation.',
        'Create a debate argument.'
      ]
    },
    8: {
      title: 'Class 8 Writing',
      subtitle: 'Professional Writing',
      description: 'Develop professional writing skills for academic and formal contexts.',
      color: '#795548',
      bgGradient: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
      bgColor: '#EFEBE9',
      textColor: '#5D4037',
      questions: [
        'Write a comprehensive research essay.',
        'Create a professional business letter.',
        'Write a college admission essay.',
        'Compose a grant proposal.',
        'Write a detailed project report.',
        'Create a professional resume and cover letter.',
        'Write an academic research paper.',
        'Compose a policy recommendation.',
        'Write a comprehensive literature review.',
        'Create a technical documentation.',
        'Write a professional presentation script.',
        'Compose a detailed case study.',
        'Write an executive summary.',
        'Create a marketing proposal.',
        'Write a scholarly article.',
        'Compose a legal brief.',
        'Write a comprehensive analysis.',
        'Create a strategic plan.',
        'Write a professional blog post.',
        'Compose a research methodology.'
      ]
    }
  };

  const currentClass = classData[classId];

  if (!currentClass) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" color="error" gutterBottom>Class not found</Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
            Back to Writing Classes
          </Button>
        </Card>
      </Box>
    );
  }

  const handleChooseOne = () => {
    const randomIndex = Math.floor(Math.random() * currentClass.questions.length);
    const randomQuestion = currentClass.questions[randomIndex];
    setSelectedQuestion({
      question: randomQuestion,
      index: randomIndex + 1
    });
  };

  const handleSelectQuestion = (question, index) => {
    setSelectedQuestion({
      question: question,
      index: index + 1
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: currentClass.bgGradient,
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            mb: 3 
          }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" fontWeight={700} sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 1
              }}>
                {currentClass.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                {currentClass.subtitle}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {currentClass.description}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 2,
                px: 3,
                alignSelf: { xs: 'flex-start', sm: 'center' }
              }}
            >
              Back to Writing Classes
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {currentClass.questions.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Questions
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  {classId}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Class Level
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  <WriteIcon sx={{ fontSize: '2rem' }} />
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Writing Focus
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2
              }}>
                <Typography variant="h4" fontWeight={700} color="white">
                  <TimerIcon sx={{ fontSize: '2rem' }} />
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Practice Mode
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Random Question Selector */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: `2px solid ${currentClass.color}15`,
              height: 'fit-content'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar sx={{ 
                  backgroundColor: currentClass.color,
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2
                }}>
                  <ShuffleIcon sx={{ fontSize: 32 }} />
                </Avatar>
                
                <Typography variant="h5" fontWeight={600} color="#1e293b" gutterBottom>
                  Random Question
                </Typography>
                
                <Typography variant="body2" color="#64748b" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Get a random writing question to practice your skills
                </Typography>
                
                <Button 
                  variant="contained"
                  size="large"
                  startIcon={<ShuffleIcon />}
                  onClick={handleChooseOne}
                  fullWidth
                  sx={{
                    backgroundColor: currentClass.color,
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: `0 4px 20px ${currentClass.color}40`,
                    '&:hover': {
                      backgroundColor: currentClass.textColor,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 25px ${currentClass.color}50`,
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Choose Random Question
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Selected Question Display */}
          <Grid item xs={12} md={8}>
            {selectedQuestion ? (
              <Fade in={Boolean(selectedQuestion)}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: `0 8px 32px ${currentClass.color}25`,
                  border: `2px solid ${currentClass.color}`,
                  overflow: 'hidden'
                }}>
                  {/* Gradient Header */}
                  <Box sx={{
                    background: currentClass.bgGradient,
                    color: 'white',
                    p: 3
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <QuestionIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          Question {selectedQuestion.index}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {currentClass.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 3, 
                      lineHeight: 1.6,
                      color: '#1e293b',
                      fontSize: '1.25rem'
                    }}>
                      {selectedQuestion.question}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ 
                      backgroundColor: `${currentClass.color}08`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      border: `1px solid ${currentClass.color}20`
                    }}>
                      <WriteIcon sx={{ 
                        fontSize: 32, 
                        color: currentClass.color,
                        mb: 1
                      }} />
                      <Typography variant="body1" color={currentClass.textColor} fontWeight={600}>
                        Write your answer on paper or digitally
                      </Typography>
                      <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
                        Take your time to craft a thoughtful response
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ) : (
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '2px dashed #e5e7eb',
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <AssignmentIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
                  <Typography variant="h6" color="#64748b" gutterBottom>
                    No Question Selected
                  </Typography>
                  <Typography variant="body2" color="#9ca3af">
                    Choose a random question or select one from the list below
                  </Typography>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* All Questions List */}
        <Card sx={{ 
          mt: 6,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${currentClass.color}20`
        }}>
          <Box sx={{
            background: `linear-gradient(135deg, ${currentClass.color}10 0%, ${currentClass.color}05 100%)`,
            p: 3,
            borderBottom: `1px solid ${currentClass.color}20`
          }}>
            <Typography variant="h5" fontWeight={600} color="#1e293b">
              All Writing Questions
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mt: 1 }}>
              Browse and select from all available questions for {currentClass.title}
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 0 }}>
            <Grid container>
              {currentClass.questions.map((question, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{ 
                      p: 3,
                      borderBottom: index < currentClass.questions.length - 1 ? '1px solid #f1f5f9' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: `${currentClass.color}05`,
                        transform: 'translateX(8px)',
                      },
                      backgroundColor: selectedQuestion?.index === index + 1 ? `${currentClass.color}08` : 'transparent',
                      borderLeft: selectedQuestion?.index === index + 1 ? `4px solid ${currentClass.color}` : '4px solid transparent'
                    }}
                    onClick={() => handleSelectQuestion(question, index)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar sx={{ 
                        backgroundColor: selectedQuestion?.index === index + 1 ? currentClass.color : '#f8fafc',
                        color: selectedQuestion?.index === index + 1 ? 'white' : '#64748b',
                        width: 40,
                        height: 40,
                        fontWeight: 600
                      }}>
                        {selectedQuestion?.index === index + 1 ? (
                          <CheckCircleIcon sx={{ fontSize: 20 }} />
                        ) : (
                          index + 1
                        )}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ 
                          lineHeight: 1.6,
                          color: '#1e293b',
                          fontWeight: selectedQuestion?.index === index + 1 ? 600 : 400
                        }}>
                          {question}
                        </Typography>
                      </Box>

                      {selectedQuestion?.index === index + 1 && (
                        <Chip 
                          label="Selected"
                          size="small"
                          sx={{ 
                            backgroundColor: currentClass.color,
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ClassWritingQuestions; 