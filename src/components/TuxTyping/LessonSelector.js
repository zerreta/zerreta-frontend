import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Container,
  Avatar,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const LessonSelector = ({ lessons, theme, onSelectLesson, onBack }) => {
  const getCategoryInfo = (key, currentGrade) => {
    if (currentGrade === 3) {
      switch(key) {
        case 'fundamentals': return { icon: HomeIcon, title: '🌟 Learning Home Keys', color: '#FF69B4' };
        case 'stories': return { icon: BookIcon, title: '📚 Fun Story Time', color: '#9370DB' };
        default: return { icon: HomeIcon, title: key, color: '#FF69B4' };
      }
    } else {
      switch(key) {
        case 'fundamentals': return { icon: KeyboardIcon, title: '⚡ Keyboard Mastery', color: '#4ECDC4' };
        case 'advanced': return { icon: RocketLaunchIcon, title: '🚀 Advanced Challenges', color: '#26C0B4' };
        default: return { icon: KeyboardIcon, title: key, color: '#4ECDC4' };
      }
    }
  };

  const currentGrade = parseInt(window.location.pathname.split('/')[3]) || 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ 
          m: 0,
          mb: 4, 
          p: 4, 
          borderRadius: 0, 
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 100%)`, 
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                  fontSize: '2.5rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  {theme.mascot}
                </Box>
              </motion.div>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ 
                  fontFamily: 'Comic Sans MS, cursive',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  mb: 1
                }}>
                  🎯 Tux Typing Adventures
                </Typography>
                <Typography variant="h5" sx={{ 
                  opacity: 0.9, 
                  fontFamily: 'Comic Sans MS, cursive'
                }}>
                  {theme.name}
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: '16px',
                fontWeight: 'bold',
                px: 3,
                py: 2,
                borderRadius: 3,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              Back to Curriculum
            </Button>
          </Box>
        </Paper>

        {/* Lessons Grid */}
        <Box sx={{ px: 3, py: 2 }}>
          {Object.entries(lessons).map(([categoryKey, categoryLessons]) => {
            const categoryInfo = getCategoryInfo(categoryKey, currentGrade);
            
            return (
              <Box key={categoryKey} sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ 
                  mb: 4, 
                  color: categoryInfo.color, 
                  textAlign: 'center',
                  fontFamily: 'Comic Sans MS, cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <categoryInfo.icon sx={{ fontSize: 36, mr: 2 }} />
                  {categoryInfo.title}
                </Typography>
                
                <Grid container spacing={3}>
                  {categoryLessons.map((lesson, index) => (
                    <Grid item xs={12} md={6} lg={4} key={lesson.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <Paper
                          sx={{
                            p: 4,
                            borderRadius: 4,
                            background: lesson.bgColor ? 
                              `linear-gradient(135deg, ${lesson.bgColor} 0%, #ffffff 100%)` :
                              `linear-gradient(135deg, ${categoryInfo.color}15 0%, #ffffff 100%)`,
                            border: `3px solid ${lesson.color || categoryInfo.color}60`,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            transition: 'all 0.3s ease-out',
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              boxShadow: `0 12px 40px ${lesson.color || categoryInfo.color}40`,
                              transform: 'translateY(-8px) scale(1.02)',
                              border: `3px solid ${lesson.color || categoryInfo.color}`,
                            }
                          }}
                          onClick={() => onSelectLesson(lesson)}
                        >
                          {lesson.animal && (
                            <Box sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              fontSize: '2rem',
                              opacity: 0.3
                            }}>
                              {lesson.animal}
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: (lesson.color || categoryInfo.color) + '20',
                              mr: 2,
                              width: 56,
                              height: 56,
                              border: `3px solid ${lesson.color || categoryInfo.color}60`
                            }}>
                              <lesson.icon sx={{ 
                                fontSize: 32,
                                color: lesson.color || categoryInfo.color
                              }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h5" fontWeight="bold" sx={{ 
                                color: lesson.color || categoryInfo.color, 
                                fontFamily: 'Comic Sans MS, cursive',
                                mb: 1
                              }}>
                                {lesson.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip 
                                  label={lesson.level}
                                  sx={{ 
                                    bgcolor: (lesson.color || categoryInfo.color) + '20',
                                    color: lesson.color || categoryInfo.color,
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    fontFamily: 'Comic Sans MS, cursive',
                                    border: `2px solid ${lesson.color || categoryInfo.color}40`
                                  }}
                                />
                                {lesson.theme && (
                                  <Chip 
                                    label={`${lesson.animal} ${lesson.theme}`}
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'rgba(255, 255, 255, 0.7)',
                                      color: lesson.color || categoryInfo.color,
                                      fontWeight: 'bold',
                                      fontSize: '10px',
                                      fontFamily: 'Comic Sans MS, cursive'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: lesson.color || categoryInfo.color, 
                              mb: 3,
                              lineHeight: 1.6,
                              flex: 1,
                              fontFamily: 'Comic Sans MS, cursive'
                            }}
                          >
                            {lesson.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SpeedIcon sx={{ fontSize: 16, mr: 0.5, color: '#667eea' }} />
                              <Typography variant="body2" color="#6b7280">
                                Target: {lesson.targetWPM} WPM
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimerIcon sx={{ fontSize: 16, mr: 0.5, color: '#f59e0b' }} />
                              <Typography variant="body2" color="#6b7280">
                                {Math.floor(lesson.timeLimit / 60)}:{(lesson.timeLimit % 60).toString().padStart(2, '0')}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ 
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            mb: 2
                          }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'Monaco, Consolas, monospace',
                                fontSize: '0.85rem',
                                color: '#374151',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              "{lesson.text.substring(0, 60)}{lesson.text.length > 60 ? '...' : ''}"
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            fullWidth
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontFamily: 'Comic Sans MS, cursive',
                              fontWeight: 600,
                              fontSize: '16px',
                              py: 1.5,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                              }
                            }}
                          >
                            🚀 Start Lesson
                          </Button>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Box>
      </Container>
    </motion.div>
  );
};

export default LessonSelector; 