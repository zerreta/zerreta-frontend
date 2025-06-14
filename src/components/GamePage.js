import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Container,
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayCircleOutline as GameIcon,
  MenuBook as ExplanationIcon,
  Quiz as QuizIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  Timer as TimerIcon,
  School as GradeIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon
} from '@mui/icons-material';
// Import the sidebar context
import { useSidebar } from '../context/SidebarContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

// API Configuration
const ZERRETA_API_KEY = "AIzaSyB2vBt8DezWCC7FdryTDDQEHRV4wGqu6Qs";
const ZERRETA_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

const GamePage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const location = useLocation();
  const game = location.state?.game;
  
  // Detect if we're in math-stats or physics from the URL
  const isMathStats = location.pathname.includes('math-stats');
  const isPhysics = location.pathname.includes('physics');
  const level = location.pathname.includes('elementary') ? 'elementary' : 
                location.pathname.includes('middle') ? 'middle' : 'high';
  
  // Get the sidebar toggle function from context
  const { toggleMainSidebar } = useSidebar();

  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // AI Chat state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      text: isMathStats 
        ? `Hi! I'm here to help you understand this math simulation. Feel free to ask me any questions about the mathematical concepts, how to use the simulation, or anything else you'd like to know!`
        : `Hi! I'm here to help you understand this physics simulation. Feel free to ask me any questions about the concepts, how to use the simulation, or anything else you'd like to know!`,
      isAI: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // Drag-and-drop quiz state
  const [droppedAnswers, setDroppedAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [draggedAnswer, setDraggedAnswer] = useState(null);
  const [usedAnswers, setUsedAnswers] = useState([]);

  // Loading state
  const [showLoading, setShowLoading] = useState(true);

  // Text selection state
  const [selectedText, setSelectedText] = useState('');
  const [showAskAIButton, setShowAskAIButton] = useState(false);
  const [askAIButtonPosition, setAskAIButtonPosition] = useState({ x: 0, y: 0 });
  const explanationRef = useRef(null);
  const chatInputRef = useRef(null);
  const iframeRef = useRef(null);



  // Drag-and-drop quiz data for The Moving Man
  const dragDropQuiz = [
    { id: 1, question: "The position of the man tells us where he is on the __________.", answer: "number line / track" },
    { id: 2, question: "Velocity tells us how __________ and in what __________ the man moves.", answer: "fast, direction" },
    { id: 3, question: "Acceleration means the man is __________ or __________.", answer: "speeding up, slowing down" },
    { id: 4, question: "If velocity is 0, the man will __________.", answer: "not move / stay in place" },
    { id: 5, question: "If velocity is positive, the man moves to the __________.", answer: "right" },
    { id: 6, question: "If velocity is negative, the man moves to the __________.", answer: "left" },
    { id: 7, question: "A flat line in the velocity-time graph means the speed is __________.", answer: "constant" },
    { id: 8, question: "If acceleration is 0, velocity will remain __________.", answer: "the same / constant" },
    { id: 9, question: "A curved line in the position-time graph means the man is __________.", answer: "accelerating" },
    { id: 10, question: "The simulation shows 3 types of graphs: position-time, __________-time, and __________-time.", answer: "velocity, acceleration" }
  ];

  // All available answers for dragging
  const availableAnswers = [
    "number line / track", "fast, direction", "speeding up, slowing down", 
    "not move / stay in place", "right", "left", "constant", 
    "the same / constant", "accelerating", "velocity, acceleration"
  ];

  // Sample explanation content (will be replaced with actual data later)
  const explanationContent = `
# Understanding Magnets and Electromagnets

## Overview
This interactive simulation helps you explore the fascinating world of magnetism and electromagnetic fields. You'll discover how magnets work, what magnetic fields look like, and how electromagnets can be created and controlled.

## Key Concepts

### 1. Magnetic Fields
- **Definition**: The invisible force field around a magnet
- **Visualization**: Represented by field lines that show direction and strength
- **Properties**: Always form closed loops from north to south pole

### 2. Magnetic Poles
- **North Pole**: Where magnetic field lines emerge
- **South Pole**: Where magnetic field lines enter
- **Rule**: Like poles repel, opposite poles attract

### 3. Electromagnets
- **Creation**: Electric current flowing through a coil creates a magnetic field
- **Control**: Field strength can be adjusted by changing current
- **Applications**: Motors, generators, MRI machines

## How to Use the Simulation

1. **Explore the Magnet**: Click and drag to move the bar magnet around
2. **Show Field Lines**: Toggle the field line visualization to see the invisible field
3. **Add Compass**: Place compass needles to see field direction
4. **Create Electromagnet**: Use the battery and coil to make an electromagnet
5. **Experiment**: Try different configurations and observe the changes

## Real-World Applications

- **Electric Motors**: Convert electrical energy to mechanical energy
- **Generators**: Convert mechanical energy to electrical energy  
- **Magnetic Levitation**: Trains that float above tracks using magnetic fields
- **Medical Imaging**: MRI scanners use powerful electromagnets

## Safety Considerations

- Strong magnets can erase magnetic storage devices
- Keep magnets away from pacemakers and electronic devices
- Handle with care - powerful magnets can pinch fingers

## Further Exploration

Try these experiments:
- What happens when you reverse the current direction?
- How does the number of coil turns affect field strength?
- Can you make the electromagnet stronger than the permanent magnet?
`;

  // Math simulations data
  const mathSimulations = {
    elementary: {
      'arithmetic': {
        name: 'Arithmetic',
        url: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/arithmetic/latest/arithmetic_en.html',
        description: 'Practice basic arithmetic operations with visual representations.',
        concepts: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'number-line-distance': {
        name: 'Number Line: Distance',
        url: 'https://phet.colorado.edu/sims/html/number-line-distance/latest/number-line-distance_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/number-line-distance/latest/number-line-distance_en.html',
        description: 'Explore distance on a number line and understand numerical relationships.',
        concepts: ['Number Line', 'Distance', 'Position'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'number-line-integers': {
        name: 'Number Line: Integers',
        url: 'https://phet.colorado.edu/sims/html/number-line-integers/latest/number-line-integers_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/number-line-integers/latest/number-line-integers_en.html',
        description: 'Learn about positive and negative integers on a number line.',
        concepts: ['Integers', 'Positive Numbers', 'Negative Numbers'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'number-line-operations': {
        name: 'Number Line: Operations',
        url: 'https://phet.colorado.edu/sims/html/number-line-operations/latest/number-line-operations_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/number-line-operations/latest/number-line-operations_en.html',
        description: 'Perform mathematical operations using number line representations.',
        concepts: ['Operations', 'Addition', 'Subtraction', 'Number Line'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'number-play': {
        name: 'Number Play',
        url: 'https://phet.colorado.edu/sims/html/number-play/latest/number-play_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/number-play/latest/number-play_en.html',
        description: 'Explore numbers through play-based activities and counting.',
        concepts: ['Counting', 'Number Recognition', 'Quantity'],
        grade: '3-5',
        duration: '10-15 minutes'
      },
      'number-compare': {
        name: 'Number Compare',
        url: 'https://phet.colorado.edu/sims/html/number-compare/latest/number-compare_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/number-compare/latest/number-compare_en.html',
        description: 'Compare numbers and understand greater than, less than relationships.',
        concepts: ['Comparison', 'Greater Than', 'Less Than', 'Equal'],
        grade: '3-5',
        duration: '10-15 minutes'
      },
      'fractions-intro': {
        name: 'Fractions: Intro',
        url: 'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html',
        description: 'Introduction to fractions with visual representations and basic concepts.',
        concepts: ['Fractions', 'Parts of Whole', 'Visual Fractions'],
        grade: '3-5',
        duration: '20-25 minutes'
      },
      'fractions-mixed-numbers': {
        name: 'Fractions: Mixed Numbers',
        url: 'https://phet.colorado.edu/sims/html/fractions-mixed-numbers/latest/fractions-mixed-numbers_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/fractions-mixed-numbers/latest/fractions-mixed-numbers_en.html',
        description: 'Explore mixed numbers and improper fractions.',
        concepts: ['Mixed Numbers', 'Improper Fractions', 'Conversion'],
        grade: '3-5',
        duration: '20-25 minutes'
      },
      'build-a-fraction': {
        name: 'Build a Fraction',
        url: 'https://phet.colorado.edu/sims/html/build-a-fraction/latest/build-a-fraction_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/build-a-fraction/latest/build-a-fraction_en.html',
        description: 'Build fractions using different representations and models.',
        concepts: ['Fraction Building', 'Models', 'Representation'],
        grade: '3-5',
        duration: '20-25 minutes'
      },
      'fraction-matcher': {
        name: 'Fraction Matcher',
        url: 'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_en.html',
        description: 'Match equivalent fractions in this interactive game.',
        concepts: ['Equivalent Fractions', 'Matching', 'Comparison'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'fractions-equality': {
        name: 'Fractions: Equality',
        url: 'https://phet.colorado.edu/sims/html/fractions-equality/latest/fractions-equality_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/fractions-equality/latest/fractions-equality_en.html',
        description: 'Understand when fractions are equal using visual models.',
        concepts: ['Fraction Equality', 'Equivalent Fractions', 'Visual Models'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'make-a-ten': {
        name: 'Make a Ten',
        url: 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/make-a-ten/latest/make-a-ten_en.html',
        description: 'Build number sense by making groups of ten.',
        concepts: ['Base 10', 'Addition', 'Number Bonds', 'Place Value'],
        grade: '3-5',
        duration: '15-20 minutes'
      },
      'area-builder': {
        name: 'Area Builder',
        url: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_en.html',
        description: 'Build shapes and explore area concepts with hands-on activities.',
        concepts: ['Area', 'Shapes', 'Building', 'Measurement'],
        grade: '3-5',
        duration: '20-25 minutes'
      }
    },
    middle: {
      'graphing-lines': {
        name: 'Graphing Lines',
        url: 'https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_en.html',
        description: 'Explore linear equations and graphing on coordinate planes.',
        concepts: ['Linear Equations', 'Graphing', 'Coordinate Plane'],
        grade: '6-8',
        duration: '25-30 minutes'
      },
      'function-builder-basics': {
        name: 'Function Builder: Basics',
        url: 'https://phet.colorado.edu/sims/html/function-builder-basics/latest/function-builder-basics_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/function-builder-basics/latest/function-builder-basics_en.html',
        description: 'Build and understand functions through input-output relationships.',
        concepts: ['Functions', 'Input-Output', 'Mathematical Relationships'],
        grade: '6-8',
        duration: '20-25 minutes'
      },
      'ratio-and-proportion': {
        name: 'Ratio and Proportion',
        url: 'https://phet.colorado.edu/sims/html/ratio-and-proportion/latest/ratio-and-proportion_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/ratio-and-proportion/latest/ratio-and-proportion_en.html',
        description: 'Explore ratios and proportional relationships.',
        concepts: ['Ratios', 'Proportions', 'Relationships'],
        grade: '6-8',
        duration: '25-30 minutes'
      }
    },
    high: {
      'graphing-quadratics': {
        name: 'Graphing Quadratics',
        url: 'https://phet.colorado.edu/sims/html/graphing-quadratics/latest/graphing-quadratics_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/graphing-quadratics/latest/graphing-quadratics_en.html',
        description: 'Explore quadratic functions and their graphs.',
        concepts: ['Quadratic Functions', 'Parabolas', 'Graphing'],
        grade: '9-12',
        duration: '30-35 minutes'
      },
      'trig-tour': {
        name: 'Trig Tour',
        url: 'https://phet.colorado.edu/sims/html/trig-tour/latest/trig-tour_en.html',
        iframeUrl: 'https://phet.colorado.edu/sims/html/trig-tour/latest/trig-tour_en.html',
        description: 'Explore trigonometric functions and the unit circle.',
        concepts: ['Trigonometry', 'Unit Circle', 'Sine and Cosine'],
        grade: '9-12',
        duration: '30-35 minutes'
      }
    }
  };

  // Fallback game data if state is not available
  const physicsGames = [
    {
      name: 'Magnets and Electromagnets',
      url: 'https://phet.colorado.edu/en/simulations/magnets-and-electromagnets',
      iframeUrl: 'https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html',
      description: 'Explore magnetic fields and electromagnetic interactions through hands-on experiments.',
      concepts: ['Magnetic Fields', 'Electromagnets', 'Magnetic Force', 'North and South Poles'],
      grade: 'K-5',
      duration: '15-30 min'
    },
    {
      name: 'Magnet and Compass',
      url: 'https://phet.colorado.edu/en/simulations/magnet-and-compass',
      iframeUrl: 'https://phet.colorado.edu/sims/html/magnet-and-compass/latest/magnet-and-compass_en.html',
      description: 'Learn about magnetic fields and how compasses work with different magnets.',
      concepts: ['Compass Navigation', 'Magnetic Fields', 'Earth\'s Magnetism', 'Direction Finding'],
      grade: 'K-5',
      duration: '10-20 min'
    },
    {
      name: 'My Solar System',
      url: 'https://phet.colorado.edu/en/simulations/my-solar-system',
      iframeUrl: 'https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_en.html',
      description: 'Create and explore planetary systems, understanding gravity and orbital motion.',
      concepts: ['Gravity', 'Planetary Motion', 'Solar System', 'Orbits'],
      grade: 'K-5',
      duration: '20-40 min'
    },
    {
      name: 'Geometric Optics: Basics',
      url: 'https://phet.colorado.edu/en/simulations/geometric-optics-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html',
      description: 'Understand how light travels and how lenses and mirrors work.',
      concepts: ['Light Rays', 'Lenses', 'Mirrors', 'Image Formation'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Density',
      url: 'https://phet.colorado.edu/en/simulations/density',
      iframeUrl: 'https://phet.colorado.edu/sims/html/density/latest/density_en.html',
      description: 'Discover the relationship between mass, volume, and density with different materials.',
      concepts: ['Mass', 'Volume', 'Density', 'Materials', 'Floating and Sinking'],
      grade: 'K-5',
      duration: '15-30 min'
    },
    {
      name: 'Gravity Force Lab: Basics',
      url: 'https://phet.colorado.edu/en/simulations/gravity-force-lab-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-force-lab-basics/latest/gravity-force-lab-basics_en.html',
      description: 'Explore how gravity works between different objects and masses.',
      concepts: ['Gravitational Force', 'Mass', 'Distance', 'Force Interaction'],
      grade: 'K-5',
      duration: '10-20 min'
    },
    {
      name: 'Waves Intro',
      url: 'https://phet.colorado.edu/en/simulations/waves-intro',
      iframeUrl: 'https://phet.colorado.edu/sims/html/waves-intro/latest/waves-intro_en.html',
      description: 'Learn about wave properties, frequency, and amplitude through interactive exploration.',
      concepts: ['Wave Motion', 'Frequency', 'Amplitude', 'Wave Properties'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Sound Waves',
      url: 'https://phet.colorado.edu/en/simulations/sound-waves',
      iframeUrl: 'https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_en.html',
      description: 'Explore how sound waves travel through air and how they create the sounds we hear.',
      concepts: ['Sound Waves', 'Frequency', 'Amplitude', 'Air Pressure', 'Sound Transmission'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Gases Intro',
      url: 'https://phet.colorado.edu/en/simulations/gases-intro',
      iframeUrl: 'https://phet.colorado.edu/sims/html/gases-intro/latest/gases-intro_en.html',
      description: 'Explore gas behavior, pressure, and temperature relationships.',
      concepts: ['Gas Particles', 'Pressure', 'Temperature', 'Volume'],
      grade: 'K-5',
      duration: '15-30 min'
    },
    {
      name: 'Masses and Springs: Basics',
      url: 'https://phet.colorado.edu/en/simulations/masses-and-springs-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/masses-and-springs-basics/latest/masses-and-springs-basics_en.html',
      description: 'Study springs, elasticity, and oscillation with different masses.',
      concepts: ['Springs', 'Elasticity', 'Oscillation', 'Mass and Motion'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Energy Forms and Changes',
      url: 'https://phet.colorado.edu/en/simulations/energy-forms-and-changes',
      iframeUrl: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html',
      description: 'Understand different forms of energy and how energy transforms from one type to another.',
      concepts: ['Kinetic Energy', 'Potential Energy', 'Heat Energy', 'Energy Transfer'],
      grade: 'K-5',
      duration: '20-35 min'
    },
    {
      name: 'Wave Interference',
      url: 'https://phet.colorado.edu/en/simulations/wave-interference',
      iframeUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html',
      description: 'Explore what happens when waves meet and interfere with each other.',
      concepts: ['Wave Interference', 'Constructive Interference', 'Destructive Interference', 'Wave Patterns'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'Circuit Construction Kit: DC - Virtual Lab',
      url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc-virtual-lab',
      iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html',
      description: 'Build and test electrical circuits with batteries, bulbs, and wires.',
      concepts: ['Electric Circuits', 'Current', 'Voltage', 'Resistance', 'Circuit Components'],
      grade: 'K-5',
      duration: '25-40 min'
    },
    {
      name: 'Circuit Construction Kit: DC',
      url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc',
      iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html',
      description: 'Basic circuit construction with simple components and measurements.',
      concepts: ['Basic Circuits', 'Series Circuits', 'Parallel Circuits', 'Electric Current'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'Pendulum Lab',
      url: 'https://phet.colorado.edu/en/simulations/pendulum-lab',
      iframeUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html',
      description: 'Study pendulum motion, period, and the factors that affect oscillation.',
      concepts: ['Pendulum Motion', 'Period', 'Frequency', 'Gravity', 'Length Effect'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Projectile Motion',
      url: 'https://phet.colorado.edu/en/simulations/projectile-motion',
      iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html',
      description: 'Explore how projectiles move through the air and what affects their path.',
      concepts: ['Projectile Motion', 'Trajectory', 'Gravity', 'Velocity', 'Angle'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'States of Matter: Basics',
      url: 'https://phet.colorado.edu/en/simulations/states-of-matter-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_en.html',
      description: 'Explore the three states of matter and how temperature affects molecular motion.',
      concepts: ['Solid', 'Liquid', 'Gas', 'Temperature', 'Molecular Motion'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Gravity and Orbits',
      url: 'https://phet.colorado.edu/en/simulations/gravity-and-orbits',
      iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html',
      description: 'Understand how gravity creates orbits in space and affects planetary motion.',
      concepts: ['Gravity', 'Orbits', 'Planets', 'Space', 'Centripetal Force'],
      grade: 'K-5',
      duration: '20-35 min'
    },
    {
      name: 'Bending Light',
      url: 'https://phet.colorado.edu/en/simulations/bending-light',
      iframeUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html',
      description: 'See how light bends when it passes through different materials.',
      concepts: ['Light Refraction', 'Optical Materials', 'Light Rays', 'Prisms'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Energy Skate Park: Basics',
      url: 'https://phet.colorado.edu/en/simulations/energy-skate-park-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html',
      description: 'Learn about energy conservation as a skater moves on different tracks.',
      concepts: ['Kinetic Energy', 'Potential Energy', 'Energy Conservation', 'Motion'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'Color Vision',
      url: 'https://phet.colorado.edu/en/simulations/color-vision',
      iframeUrl: 'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_en.html',
      description: 'Explore how we see colors and what happens when light passes through filters.',
      concepts: ['Color', 'Light', 'Vision', 'RGB Colors', 'Filters'],
      grade: 'K-5',
      duration: '15-20 min'
    },
    {
      name: 'Balancing Act',
      url: 'https://phet.colorado.edu/en/simulations/balancing-act',
      iframeUrl: 'https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html',
      description: 'Learn about balance, torque, and how different weights affect a balance beam.',
      concepts: ['Balance', 'Torque', 'Lever', 'Weight', 'Distance'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Friction',
      url: 'https://phet.colorado.edu/en/simulations/friction',
      iframeUrl: 'https://phet.colorado.edu/sims/html/friction/latest/friction_en.html',
      description: 'Explore how friction affects motion and what happens when surfaces rub together.',
      concepts: ['Friction', 'Surface Texture', 'Heat', 'Motion', 'Contact Forces'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Forces and Motion: Basics',
      url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html',
      description: 'Understand how forces affect the motion of objects in everyday situations.',
      concepts: ['Forces', 'Motion', 'Push and Pull', 'Newton\'s Laws', 'Acceleration'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'John Travoltage',
      url: 'https://phet.colorado.edu/en/simulations/john-travoltage',
      iframeUrl: 'https://phet.colorado.edu/sims/html/john-travoltage/latest/john-travoltage_en.html',
      description: 'Learn about static electricity by making sparks fly in this fun simulation.',
      concepts: ['Static Electricity', 'Electric Charge', 'Sparks', 'Conductors'],
      grade: 'K-5',
      duration: '10-20 min'
    },
    {
      name: 'Balloons and Static Electricity',
      url: 'https://phet.colorado.edu/en/simulations/balloons-and-static-electricity',
      iframeUrl: 'https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_en.html',
      description: 'Explore static electricity by rubbing balloons and watching charges move.',
      concepts: ['Static Electricity', 'Electric Charge', 'Attraction', 'Repulsion'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Ladybug Motion 2D',
      url: 'https://phet.colorado.edu/en/simulations/ladybug-motion-2d',
      iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/ladybug-motion-2d/latest/ladybug-motion-2d.html?simulation=ladybug-motion-2d',
      description: 'Learn about motion in two dimensions by controlling a ladybug\'s movement.',
      concepts: ['2D Motion', 'Velocity', 'Acceleration', 'Position', 'Vectors'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'Lunar Lander',
      url: 'https://phet.colorado.edu/en/simulations/lunar-lander',
      iframeUrl: 'https://phet.colorado.edu/sims/html/lunar-lander/latest/lunar-lander_en.html',
      description: 'Pilot a lunar lander and learn about forces, gravity, and space exploration.',
      concepts: ['Gravity', 'Forces', 'Space', 'Thrust', 'Landing'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Signal Circuit',
      url: 'https://phet.colorado.edu/en/simulations/signal-circuit',
      iframeUrl: 'https://phet.colorado.edu/sims/html/signal-circuit/latest/signal-circuit_en.html',
      description: 'Build circuits that send signals and learn about electrical communication.',
      concepts: ['Circuits', 'Signals', 'Electrical Communication', 'Current', 'Switches'],
      grade: 'K-5',
      duration: '20-30 min'
    },
    {
      name: 'Electric Field Hockey',
      url: 'https://phet.colorado.edu/en/simulations/electric-field-hockey',
      iframeUrl: 'https://phet.colorado.edu/sims/html/electric-field-hockey/latest/electric-field-hockey_en.html',
      description: 'Score goals using electric fields and learn about electric forces.',
      concepts: ['Electric Fields', 'Electric Forces', 'Positive and Negative Charges', 'Field Lines'],
      grade: 'K-5',
      duration: '15-25 min'
    },
    {
      name: 'Maze Game',
      url: 'https://phet.colorado.edu/en/simulations/maze-game',
      iframeUrl: 'https://phet.colorado.edu/sims/html/maze-game/latest/maze-game_en.html',
      description: 'Navigate through mazes while learning about motion and problem-solving.',
      concepts: ['Motion', 'Problem Solving', 'Spatial Reasoning', 'Navigation'],
      grade: 'K-5',
      duration: '10-20 min'
    },
    {
      name: 'The Moving Man',
      url: 'https://phet.colorado.edu/en/simulations/moving-man',
      iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/moving-man/latest/moving-man.html?simulation=moving-man',
      description: 'Explore position, velocity, and acceleration by moving a character around.',
      concepts: ['Position', 'Velocity', 'Acceleration', '1D Motion', 'Graphs'],
      grade: 'K-5',
      duration: '20-30 min'
    }
  ];

  // Chemistry games for elementary level
  const chemistryGames = [
    {
      name: 'States of Matter: Basics',
      url: 'https://phet.colorado.edu/en/simulations/states-of-matter-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/states-of-matter-basics/latest/states-of-matter-basics_en.html',
      description: 'Explore the different states of matter by heating and cooling atoms or molecules.',
      concepts: ['Solids', 'Liquids', 'Gases', 'Temperature', 'Phase Changes'],
      grade: 'K-5',
      duration: '15-20 min'
    },
    {
      name: 'pH Scale: Basics',
      url: 'https://phet.colorado.edu/en/simulations/ph-scale-basics',
      iframeUrl: 'https://phet.colorado.edu/sims/html/ph-scale-basics/latest/ph-scale-basics_en.html',
      description: 'Test the pH of things like coffee, spit, and soap to determine whether they are acidic, basic or neutral.',
      concepts: ['Acids', 'Bases', 'pH Scale', 'Chemical Testing', 'Safe Experiments'],
      grade: 'K-5',
      duration: '20-25 min'
    },
    {
      name: 'Sugar and Salt Solutions',
      url: 'https://phet.colorado.edu/en/simulations/sugar-and-salt-solutions',
      iframeUrl: 'https://phet.colorado.edu/sims/html/sugar-and-salt-solutions/latest/sugar-and-salt-solutions_en.html',
      description: 'Observe what happens when you add sugar or salt to water and learn about solutions.',
      concepts: ['Solutions', 'Dissolving', 'Mixtures', 'Concentration', 'Molecular View'],
      grade: '3-5',
      duration: '20-30 min'
    },
    {
      name: 'Concentration',
      url: 'https://phet.colorado.edu/en/simulations/concentration',
      iframeUrl: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html',
      description: 'Watch your solution change color as you mix chemicals with water.',
      concepts: ['Concentration', 'Solutions', 'Color Changes', 'Mixing', 'Dilution'],
      grade: '2-5',
      duration: '15-20 min'
    },
    {
      name: 'Build a Molecule',
      url: 'https://phet.colorado.edu/en/simulations/build-a-molecule',
      iframeUrl: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_en.html',
      description: 'Starting from atoms, see how many molecules you can build in this fun chemistry game.',
      concepts: ['Atoms', 'Molecules', 'Chemical Formulas', 'Bonds', 'Building'],
      grade: '3-5',
      duration: '25-30 min'
    },
    {
      name: 'Molarity',
      url: 'https://phet.colorado.edu/en/simulations/molarity',
      iframeUrl: 'https://phet.colorado.edu/sims/html/molarity/latest/molarity_en.html',
      description: 'When you add water to a solute, how does the concentration change?',
      concepts: ['Concentration', 'Solutions', 'Water', 'Mixing', 'Dilution'],
      grade: '4-5',
      duration: '20-25 min'
    },
    {
      name: 'Acid-Base Solutions',
      url: 'https://phet.colorado.edu/en/simulations/acid-base-solutions',
      iframeUrl: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html',
      description: 'Test acids and bases with different solutions and see how they react.',
      concepts: ['Acids', 'Bases', 'Solutions', 'Chemical Reactions', 'Testing'],
      grade: '4-5',
      duration: '25-30 min'
    },
    {
      name: 'Isotopes and Atomic Mass',
      url: 'https://phet.colorado.edu/en/simulations/isotopes-and-atomic-mass',
      iframeUrl: 'https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_en.html',
      description: 'How do isotopes relate to the average atomic mass of an element?',
      concepts: ['Atoms', 'Isotopes', 'Atomic Mass', 'Elements', 'Nucleus'],
      grade: '4-5',
      duration: '20-25 min'
    }
  ];

  // Middle school physics games for grades 6-8
  const middleSchoolPhysicsGames = [
    {
      name: 'Forces and Motion',
      url: 'https://phet.colorado.edu/en/simulations/forces-and-motion',
      iframeUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion/latest/forces-and-motion_en.html',
      description: 'Explore how forces affect motion with detailed analysis and measurement tools.',
      concepts: ['Forces', 'Motion', 'Acceleration', 'Velocity', 'Net Force'],
      grade: '6-8',
      duration: '25-35 min'
    },
    {
      name: 'Ramp: Forces and Motion',
      url: 'https://phet.colorado.edu/en/simulations/ramp-forces-and-motion',
      iframeUrl: 'https://phet.colorado.edu/sims/html/ramp-forces-and-motion/latest/ramp-forces-and-motion_en.html',
      description: 'Study forces on inclined planes and understand how ramps affect motion.',
      concepts: ['Inclined Planes', 'Forces', 'Motion', 'Normal Force', 'Friction'],
      grade: '6-8',
      duration: '20-30 min'
    },
    {
      name: 'Motion in 2D',
      url: 'https://phet.colorado.edu/en/simulations/motion-2d',
      iframeUrl: 'https://phet.colorado.edu/sims/html/motion-2d/latest/motion-2d_en.html',
      description: 'Explore two-dimensional motion with vectors and coordinate systems.',
      concepts: ['2D Motion', 'Vectors', 'Components', 'Projectiles', 'Coordinate Systems'],
      grade: '6-8',
      duration: '25-35 min'
    },
    {
      name: 'Wave on a String',
      url: 'https://phet.colorado.edu/en/simulations/wave-on-a-string',
      iframeUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html',
      description: 'Create and study waves on a string, exploring frequency, amplitude, and wave speed.',
      concepts: ['Wave Motion', 'Frequency', 'Amplitude', 'Wave Speed', 'Oscillations'],
      grade: '6-8',
      duration: '20-30 min'
    },
    {
      name: 'Ohm\'s Law',
      url: 'https://phet.colorado.edu/en/simulations/ohms-law',
      iframeUrl: 'https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html',
      description: 'Explore the relationship between voltage, current, and resistance in electrical circuits.',
      concepts: ['Ohm\'s Law', 'Voltage', 'Current', 'Resistance', 'Electrical Relationships'],
      grade: '6-8',
      duration: '20-30 min'
    },
    {
      name: 'Circuit Construction Kit: DC',
      url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc',
      iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html',
      description: 'Build and test DC electrical circuits with batteries, bulbs, and wires.',
      concepts: ['DC Circuits', 'Current', 'Voltage', 'Resistance', 'Circuit Components'],
      grade: '6-8',
      duration: '25-40 min'
    },
    {
      name: 'Friction',
      url: 'https://phet.colorado.edu/en/simulations/friction',
      iframeUrl: 'https://phet.colorado.edu/sims/html/friction/latest/friction_en.html',
      description: 'Explore how friction affects motion and generates heat between surfaces.',
      concepts: ['Friction', 'Surface Texture', 'Heat Generation', 'Motion', 'Contact Forces'],
      grade: '6-8',
      duration: '20-30 min'
    },
    {
      name: 'Gravity and Orbits',
      url: 'https://phet.colorado.edu/en/simulations/gravity-and-orbits',
      iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html',
      description: 'Understand how gravity creates orbits and affects planetary motion.',
      concepts: ['Gravity', 'Orbits', 'Planets', 'Orbital Motion', 'Centripetal Force'],
      grade: '6-8',
      duration: '25-35 min'
    },
    {
      name: 'Buoyancy',
      url: 'https://phet.colorado.edu/en/simulations/buoyancy',
      iframeUrl: 'https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_en.html',
      description: 'Advanced exploration of buoyancy, density, and Archimedes\' principle.',
      concepts: ['Buoyancy', 'Density', 'Archimedes\' Principle', 'Displacement', 'Fluid Forces'],
      grade: '6-8',
      duration: '25-35 min'
    },
    {
      name: 'Hooke\'s Law',
      url: 'https://phet.colorado.edu/en/simulations/hookes-law',
      iframeUrl: 'https://phet.colorado.edu/sims/html/hookes-law/latest/hookes-law_en.html',
      description: 'Explore the relationship between force and displacement in springs.',
      concepts: ['Hooke\'s Law', 'Spring Constant', 'Force', 'Displacement', 'Elasticity'],
      grade: '6-8',
      duration: '15-25 min'
    }
  ];

  // High school physics games with comprehensive advanced simulations
  const highSchoolPhysicsGames = [
    // Mechanics & Motion
    { name: 'Projectile Motion', url: 'https://phet.colorado.edu/en/simulations/projectile-motion', iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html', description: 'Analyze projectile trajectories using advanced mathematical modeling and physics principles.', concepts: ['Projectile Motion', 'Trajectory', 'Gravity', 'Velocity', 'Angle'], grade: '9-12', duration: '30-45 min' },
    { name: 'Projectile Sampling Distributions', url: 'https://phet.colorado.edu/en/simulations/projectile-sampling-distributions', iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-sampling-distributions/latest/projectile-sampling-distributions_en.html', description: 'Apply statistical analysis to projectile motion data and understand measurement uncertainty.', concepts: ['Statistics', 'Data Analysis', 'Uncertainty', 'Distributions'], grade: '9-12', duration: '35-50 min' },
    { name: 'Projectile Data Lab', url: 'https://phet.colorado.edu/en/simulations/projectile-data-lab', iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-data-lab/latest/projectile-data-lab_en.html', description: 'Conduct laboratory-style experiments with projectile motion and analyze real data.', concepts: ['Lab Techniques', 'Data Collection', 'Analysis'], grade: '9-12', duration: '40-60 min' },
    { name: 'The Ramp', url: 'https://phet.colorado.edu/en/simulations/the-ramp', iframeUrl: 'https://phet.colorado.edu/sims/html/the-ramp/latest/the-ramp_en.html', description: 'Advanced study of forces on inclined planes with detailed mathematical analysis.', concepts: ['Inclined Planes', 'Force Components', 'Friction'], grade: '9-12', duration: '25-35 min' },
    { name: 'Torque', url: 'https://phet.colorado.edu/en/simulations/torque', iframeUrl: 'https://phet.colorado.edu/sims/html/torque/latest/torque_en.html', description: 'Explore rotational motion, torque, and angular momentum in complex systems.', concepts: ['Torque', 'Angular Momentum', 'Rotational Motion'], grade: '9-12', duration: '30-40 min' },
    { name: 'Ladybug Revolution', url: 'https://phet.colorado.edu/en/simulations/ladybug-revolution', iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/ladybug-revolution/latest/ladybug-revolution.html?simulation=ladybug-revolution', description: 'Study circular motion, centripetal force, and rotational kinematics.', concepts: ['Circular Motion', 'Centripetal Force', 'Angular Velocity'], grade: '9-12', duration: '25-35 min' },
    
    // Waves & Sound
    { name: 'Normal Modes', url: 'https://phet.colorado.edu/en/simulations/normal-modes', iframeUrl: 'https://phet.colorado.edu/sims/html/normal-modes/latest/normal-modes_en.html', description: 'Advanced study of wave modes, standing waves, and resonance phenomena.', concepts: ['Normal Modes', 'Standing Waves', 'Resonance'], grade: '9-12', duration: '30-45 min' },
    { name: 'Fourier: Making Waves', url: 'https://phet.colorado.edu/en/simulations/fourier-making-waves', iframeUrl: 'https://phet.colorado.edu/sims/html/fourier-making-waves/latest/fourier-making-waves_en.html', description: 'Explore Fourier analysis and the mathematical decomposition of complex waves.', concepts: ['Fourier Analysis', 'Wave Superposition', 'Frequency Domain'], grade: '9-12', duration: '35-50 min' },
    { name: 'Resonance', url: 'https://phet.colorado.edu/en/simulations/resonance', iframeUrl: 'https://phet.colorado.edu/sims/html/resonance/latest/resonance_en.html', description: 'Study resonance phenomena in mechanical and acoustic systems.', concepts: ['Resonance', 'Natural Frequency', 'Damping'], grade: '9-12', duration: '25-35 min' },
    
    // Electricity & Magnetism
    { name: 'Faraday\'s Electromagnetic Lab', url: 'https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab', iframeUrl: 'https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html', description: 'Comprehensive exploration of electromagnetic phenomena and field interactions.', concepts: ['Electromagnetic Fields', 'Induction', 'Magnetic Fields'], grade: '9-12', duration: '35-50 min' },
    { name: 'Faraday\'s Law', url: 'https://phet.colorado.edu/en/simulations/faradays-law', iframeUrl: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html', description: 'Study electromagnetic induction and the relationship between changing magnetic fields and electric currents.', concepts: ['Faraday\'s Law', 'Electromagnetic Induction', 'Magnetic Flux'], grade: '9-12', duration: '30-40 min' },
    { name: 'Charges and Fields', url: 'https://phet.colorado.edu/en/simulations/charges-and-fields', iframeUrl: 'https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html', description: 'Study the behavior of electric charges and the electric fields they create.', concepts: ['Electric Charges', 'Electric Fields', 'Field Lines'], grade: '9-12', duration: '25-35 min' },
    { name: 'Coulomb\'s Law', url: 'https://phet.colorado.edu/en/simulations/coulombs-law', iframeUrl: 'https://phet.colorado.edu/sims/html/coulombs-law/latest/coulombs-law_en.html', description: 'Quantitative analysis of electrostatic forces using Coulomb\'s law.', concepts: ['Coulomb\'s Law', 'Electrostatic Force', 'Inverse Square Law'], grade: '9-12', duration: '20-30 min' },
    { name: 'Circuit Construction Kit: AC', url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac', iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac/latest/circuit-construction-kit-ac_en.html', description: 'Build and analyze alternating current circuits with advanced components.', concepts: ['AC Circuits', 'Alternating Current', 'Impedance'], grade: '9-12', duration: '35-50 min' },
    
    // Quantum Physics  
    { name: 'Photoelectric Effect', url: 'https://phet.colorado.edu/en/simulations/photoelectric', iframeUrl: 'https://phet.colorado.edu/sims/html/photoelectric/latest/photoelectric_en.html', description: 'Study the photoelectric effect and Einstein\'s explanation using quantum theory.', concepts: ['Photoelectric Effect', 'Photons', 'Work Function'], grade: '9-12', duration: '25-35 min' },
    { name: 'Quantum Wave Interference', url: 'https://phet.colorado.edu/en/simulations/quantum-wave-interference', iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-wave-interference/latest/quantum-wave-interference_en.html', description: 'Study wave-particle duality and quantum interference patterns.', concepts: ['Wave-Particle Duality', 'Quantum Interference', 'Double-Slit Experiment'], grade: '9-12', duration: '30-45 min' },
    { name: 'Quantum Bound States', url: 'https://phet.colorado.edu/en/simulations/quantum-bound-states', iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-bound-states/latest/quantum-bound-states_en.html', description: 'Explore quantum bound states and energy level quantization.', concepts: ['Quantum Bound States', 'Energy Levels', 'Quantization'], grade: '9-12', duration: '35-50 min' },
    
    // Atomic & Nuclear Physics
    { name: 'Build an Atom', url: 'https://phet.colorado.edu/en/simulations/build-an-atom', iframeUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html', description: 'Construct atoms and understand atomic structure, isotopes, and the periodic table.', concepts: ['Atomic Structure', 'Protons', 'Neutrons', 'Electrons'], grade: '9-12', duration: '25-35 min' },
    { name: 'Alpha Decay', url: 'https://phet.colorado.edu/en/simulations/alpha-decay', iframeUrl: 'https://phet.colorado.edu/sims/html/alpha-decay/latest/alpha-decay_en.html', description: 'Study alpha particle emission and nuclear decay processes.', concepts: ['Alpha Decay', 'Nuclear Decay', 'Alpha Particles'], grade: '9-12', duration: '20-30 min' },
    { name: 'Nuclear Fission', url: 'https://phet.colorado.edu/en/simulations/nuclear-fission', iframeUrl: 'https://phet.colorado.edu/sims/html/nuclear-fission/latest/nuclear-fission_en.html', description: 'Study nuclear fission reactions and chain reaction processes.', concepts: ['Nuclear Fission', 'Chain Reactions', 'Critical Mass'], grade: '9-12', duration: '30-40 min' },
    
    // Optics
    { name: 'Geometric Optics', url: 'https://phet.colorado.edu/en/simulations/geometric-optics', iframeUrl: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html', description: 'Advanced study of light ray behavior, lenses, and optical instruments.', concepts: ['Geometric Optics', 'Ray Tracing', 'Lenses'], grade: '9-12', duration: '35-50 min' },
    { name: 'Bending Light', url: 'https://phet.colorado.edu/en/simulations/bending-light', iframeUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html', description: 'Study refraction, reflection, and total internal reflection in various media.', concepts: ['Refraction', 'Reflection', 'Total Internal Reflection'], grade: '9-12', duration: '25-35 min' },
    { name: 'Lasers', url: 'https://phet.colorado.edu/en/simulations/lasers', iframeUrl: 'https://phet.colorado.edu/sims/html/lasers/latest/lasers_en.html', description: 'Study laser operation, stimulated emission, and coherent light properties.', concepts: ['Lasers', 'Stimulated Emission', 'Coherent Light'], grade: '9-12', duration: '30-40 min' }
  ];

  // Determine game type and list based on the current path
  const isChemistryGame = location.pathname.includes('/chemistry/');
  const isMiddleSchoolPhysics = location.pathname.includes('/physics/middle/');
  const isHighSchoolPhysics = location.pathname.includes('/physics/high/');
  
  let gamesList;
  if (isChemistryGame) {
    gamesList = chemistryGames;
  } else if (isMiddleSchoolPhysics) {
    gamesList = middleSchoolPhysicsGames;
  } else if (isHighSchoolPhysics) {
    gamesList = highSchoolPhysicsGames;
  } else {
    gamesList = physicsGames;
  }
  
  // Find the current game
  let currentGame;
  if (game) {
    currentGame = game;
  } else if (isMathStats && mathSimulations[level] && mathSimulations[level][gameId]) {
    // Find game in math simulations
    currentGame = mathSimulations[level][gameId];
  } else {
    // Find game by ID in the appropriate games list
    currentGame = gamesList.find(g => {
      const gameIdFromName = g.name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      return gameIdFromName === gameId;
    }) || gamesList[0];
  }

  // Game-specific teaching resources
  const getGameResources = (gameName) => {
    // Math simulation resources
    const mathResources = {
      'Arithmetic': {
        beforePlaying: [
          'Review basic math operations students already know',
          'Ask students to predict what arithmetic means',
          'Discuss when we use math in everyday life'
        ],
        whilePlaying: [
          'Have students try different arithmetic problems',
          'Encourage them to use visual representations',
          'Ask them to explain their thinking process',
          'Try problems with different difficulty levels'
        ],
        afterPlaying: [
          'Discuss strategies they found helpful',
          'Connect visual models to abstract numbers',
          'Practice similar problems without the simulation'
        ],
        extensions: [
          'Create their own arithmetic problems',
          'Use manipulatives to model operations',
          'Apply arithmetic to real-world scenarios'
        ]
      },
      'Number Line: Distance': {
        beforePlaying: [
          'Show students a physical number line',
          'Ask what distance means between numbers',
          'Predict how to measure distance on a number line'
        ],
        whilePlaying: [
          'Have students explore different number pairs',
          'Ask them to find patterns in distances',
          'Try negative and positive numbers',
          'Compare distances between different pairs'
        ],
        afterPlaying: [
          'Discuss the distance formula they discovered',
          'Connect to movement and measurement in real life',
          'Practice calculating distances mentally'
        ],
        extensions: [
          'Create a human number line in the classroom',
          'Use rulers to measure actual distances',
          'Connect to coordinate geometry concepts'
        ]
      },
      'Fractions: Intro': {
        beforePlaying: [
          'Ask students what fractions they know',
          'Show real objects that can be divided into parts',
          'Discuss when we use fractions daily'
        ],
        whilePlaying: [
          'Have students create different fractions',
          'Compare fractions using visual models',
          'Try representing the same fraction in different ways',
          'Explore equivalent fractions'
        ],
        afterPlaying: [
          'Discuss what makes fractions equivalent',
          'Connect visual models to fraction notation',
          'Practice identifying fractions in real contexts'
        ],
        extensions: [
          'Use pizza, pie, or chocolate bar models',
          'Create fraction art projects',
          'Cook simple recipes using fractions'
        ]
      }
    };

    const resources = {
      'Magnets and Electromagnets': {
        beforePlaying: [
          'Ask students what they know about magnets',
          'Show real magnets and let students predict what will happen',
          'Discuss where we see magnets in everyday life'
        ],
        whilePlaying: [
          'Have students try moving the magnet around',
          'Ask them to observe the magnetic field lines',
          'Encourage experimenting with the compass',
          'Try changing the magnet strength'
        ],
        afterPlaying: [
          'Discuss what they observed about magnetic fields',
          'Connect to real-world examples (refrigerator magnets, compass navigation)',
          'Ask students to draw what they learned about magnetic fields'
        ],
        extensions: [
          'Build a simple compass using a magnetized needle',
          'Test household items to see which are magnetic',
          'Create magnetic field art using iron filings'
        ]
      },
      'My Solar System': {
        beforePlaying: [
          'Review the planets in our solar system',
          'Discuss what keeps planets in orbit',
          'Ask students to predict what happens if planets move faster or slower'
        ],
        whilePlaying: [
          'Start with preset solar system configurations',
          'Try changing planet masses and speeds',
          'Observe orbital patterns and paths',
          'Experiment with multiple planet systems'
        ],
        afterPlaying: [
          'Discuss why planets stay in orbit',
          'Compare different orbital shapes they created',
          'Connect to real space missions and satellites'
        ],
        extensions: [
          'Research real planet orbital periods',
          'Create a scale model of the solar system',
          'Learn about space exploration missions'
        ]
      }
    };

    // Return math resources if we're in math-stats, otherwise physics resources
    if (isMathStats) {
      return mathResources[gameName] || {
        beforePlaying: [
          'Introduce the mathematical concept being explored',
          'Ask students to make predictions about what they might discover',
          'Connect to real-world examples where they use this math'
        ],
        whilePlaying: [
          'Encourage students to try different problems or settings',
          'Have them observe patterns and relationships',
          'Ask "what if" questions to guide mathematical thinking',
          'Let students work together to solve problems'
        ],
        afterPlaying: [
          'Discuss key mathematical discoveries and patterns',
          'Connect simulation results to real-world math applications',
          'Have students explain their mathematical reasoning'
        ],
        extensions: [
          'Look for this math concept in everyday situations',
          'Try related problems with different numbers',
          'Create their own problems using the same concept'
        ]
      };
    }

    return resources[gameName] || {
      beforePlaying: [
        'Introduce the physics concept being explored',
        'Ask students to make predictions about what they might observe',
        'Connect to real-world examples they might know'
      ],
      whilePlaying: [
        'Encourage students to try different settings',
        'Have them observe changes when variables are adjusted',
        'Ask "what if" questions to guide exploration',
        'Let students work in pairs to discuss observations'
      ],
      afterPlaying: [
        'Discuss key observations and discoveries',
        'Connect simulation results to real-world phenomena',
        'Have students explain what they learned in their own words'
      ],
      extensions: [
        'Look for similar phenomena in everyday life',
        'Try related hands-on experiments if possible',
        'Research real-world applications of the concepts'
      ]
    };
  };

  const gameResources = getGameResources(currentGame.name);

  // Hide sidebar when entering game page and restore when leaving
  useEffect(() => {
    // Hide the main sidebar for immersive gaming experience
    toggleMainSidebar(false);
    
    // Cleanup - restore sidebar when component unmounts
    return () => {
      toggleMainSidebar(true);
    };
  }, [toggleMainSidebar]);

  useEffect(() => {
    // Scroll only within the AI chat container
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [chatHistory]);

  const handleGoBack = () => {
    if (isMathStats) {
      navigate(`/student-dashboard/math-stats/${level}`);
    } else if (isChemistryGame) {
      navigate('/student-dashboard/chemistry/elementary');
    } else if (isMiddleSchoolPhysics) {
      navigate('/student-dashboard/physics/middle');
    } else if (isHighSchoolPhysics) {
      navigate('/student-dashboard/physics/high');
    } else {
      navigate('/student-dashboard/physics/elementary');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatMessage,
      isAI: false,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setChatMessage('');
    setChatLoading(true);

    try {
      const contextMessage = isMathStats 
        ? `You are helping a student understand a math simulation about "${currentGame.name}". The key concepts are: ${currentGame.concepts.join(', ')}. Please provide educational, clear, and encouraging responses about these mathematical concepts. Here's the student's question: ${chatMessage}`
        : `You are helping a student understand a physics simulation about "${currentGame.name}". The key concepts are: ${currentGame.concepts.join(', ')}. Please provide educational, clear, and encouraging responses. Here's the student's question: ${chatMessage}`;

      const response = await axios.post(
        `${ZERRETA_API_URL}?key=${ZERRETA_API_KEY}`,
        {
          contents: [
            {
              role: "user", 
              parts: [{ text: contextMessage }]
            }
          ]
        }
      );

      const aiResponse = {
        id: Date.now(),
        text: response.data.candidates[0].content.parts[0].text,
        isAI: true,
        timestamp: new Date().toISOString()
      };

      setChatHistory([...updatedHistory, aiResponse]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorResponse = {
        id: Date.now(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        isAI: true,
        error: true,
        timestamp: new Date().toISOString()
      };
      setChatHistory([...updatedHistory, errorResponse]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    dragDropQuiz.forEach(question => {
      if (droppedAnswers[question.id] === question.answer) {
        correct++;
      }
    });
    setQuizScore(correct);
    setShowQuizResults(true);
  };

  const resetQuiz = () => {
    setDroppedAnswers({});
    setShowQuizResults(false);
    setQuizScore(0);
    setUsedAnswers([]);
    setDraggedAnswer(null);
  };

  // Simple text selection handler
  const handleTextSelection = useCallback(() => {
    console.log('🔥 handleTextSelection called');
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    console.log('📝 Selected text:', `"${selectedText}"`);
    console.log('📝 Text length:', selectedText.length);
    console.log('📝 Range count:', selection.rangeCount);
    
    if (selectedText && selectedText.length >= 3 && selection.rangeCount > 0) {
      try {
        const range = selection.getRangeAt(0);
        console.log('📍 Range found');
        
        // Check if selection is within explanation area
        const isInExplanation = explanationRef.current && explanationRef.current.contains(range.commonAncestorContainer);
        console.log('🎯 Is in explanation area:', isInExplanation);
        console.log('🎯 Explanation ref exists:', !!explanationRef.current);
        
        if (isInExplanation) {
          setSelectedText(selectedText);
          
          // Position button near the end of selection
          const rect = range.getBoundingClientRect();
          const buttonX = rect.right + 10;
          const buttonY = rect.bottom + window.scrollY + 10;
          
          console.log('📍 Button position:', { x: buttonX, y: buttonY });
          
          setAskAIButtonPosition({ x: buttonX, y: buttonY });
          setShowAskAIButton(true);
          
          console.log('✅ BUTTON SHOULD NOW BE VISIBLE!');
        } else {
          console.log('❌ Selection not in explanation area');
          setShowAskAIButton(false);
        }
      } catch (error) {
        console.log('❌ Error:', error);
        setShowAskAIButton(false);
      }
    } else {
      console.log('❌ Invalid selection - too short or no ranges');
      setShowAskAIButton(false);
    }
  }, []);

  // Handle asking AI about selected text
  const handleAskAIAboutSelection = useCallback(() => {
    console.log('🤖 Ask AI clicked with text:', selectedText);
    
    if (selectedText) {
      // Insert the selected text as the question in the AI chat
      const questionText = `${selectedText}`;
      setChatMessage(questionText);
      setShowAskAIButton(false);
      setSelectedText('');
      
      // Clear text selection only after using it
      setTimeout(() => {
        window.getSelection().removeAllRanges();
      }, 500);
      
      // Focus on chat input so teacher can modify or send the question
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
          // Place cursor at the end of the text
          const input = chatInputRef.current.querySelector('input');
          if (input) {
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }
      }, 100);
      

    }
  }, [selectedText]);

  // Drag-and-drop handlers
  const handleDragStart = (e, answer) => {
    setDraggedAnswer(answer);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, questionId) => {
    e.preventDefault();
    if (draggedAnswer) {
      // Remove answer from previous question if it was already used
      const newDroppedAnswers = { ...droppedAnswers };
      const previousQuestionId = Object.keys(newDroppedAnswers).find(
        key => newDroppedAnswers[key] === draggedAnswer
      );
      if (previousQuestionId) {
        delete newDroppedAnswers[previousQuestionId];
      }

      // Set answer for current question
      newDroppedAnswers[questionId] = draggedAnswer;
      setDroppedAnswers(newDroppedAnswers);
      
      // Update used answers
      const newUsedAnswers = Object.values(newDroppedAnswers);
      setUsedAnswers(newUsedAnswers);
      
      setDraggedAnswer(null);
    }
  };

  // Add event listeners for text selection
  useEffect(() => {
    const handleMouseUp = (e) => {
      console.log('🖱️ Mouse up event triggered, target:', e.target?.tagName);
      setTimeout(() => {
        console.log('⏰ Timeout triggered, calling handleTextSelection');
        handleTextSelection();
      }, 100);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    console.log('🔧 Text selection listeners set up');
    
    return () => {
      console.log('🧹 Cleaning up text selection listeners');
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleTextSelection]);

  // Loading timer - hide after 6 seconds to align with animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setShowLoading(false);
    }, 6000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Prevent automatic scrolling on page load
  useEffect(() => {
    // Scroll to top on component mount to prevent unwanted scrolling
    window.scrollTo(0, 0);
    
    // Prevent any automatic focus behaviors that might cause scrolling
    document.body.style.scrollBehavior = 'auto';
    
    return () => {
      document.body.style.scrollBehavior = '';
    };
  }, []);

  // Hide Ask AI button when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAskAIButton && 
          !event.target.closest('.ask-ai-button') && 
          !event.target.closest('[data-explanation-area]')) {
        setShowAskAIButton(false);
        setSelectedText('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAskAIButton]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderColor: '#7445f8',
            color: '#7445f8',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#7445f8',
              backgroundColor: '#7445f8',
              color: 'white',
            }
          }}
        >
          {isChemistryGame 
            ? 'Back to Elementary Chemistry' 
            : isMiddleSchoolPhysics 
            ? 'Back to Middle School Physics'
            : isHighSchoolPhysics 
            ? 'Back to High School Physics'
            : 'Back to Elementary Physics'
          }
        </Button>
      </Box>

      {/* Game Title Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ backgroundColor: '#e3f2fd', width: 56, height: 56 }}>
            <GameIcon sx={{ color: '#2196f3', fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600} color="#333">
              {currentGame.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentGame.description}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<GradeIcon />}
            label={currentGame.grade} 
            size="small" 
            sx={{ backgroundColor: '#e8f5e9', color: '#4caf50' }} 
          />
          <Chip 
            icon={<TimerIcon />}
            label={currentGame.duration} 
            size="small" 
            sx={{ backgroundColor: '#e3f2fd', color: '#2196f3' }} 
          />
          {currentGame.concepts.slice(0, 3).map((concept, index) => (
            <Chip
              key={index}
              label={concept}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Game Simulation - Full Width */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h5" fontWeight={600} color="#333" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🎮 Interactive Physics Simulation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Experiment with the simulation and use the tabs below to learn concepts or test your knowledge
          </Typography>
        </Box>
        <Box sx={{ 
          height: '600px', 
          width: '100%', 
          position: 'relative', 
          overflow: 'hidden',
          isolation: 'isolate' // Create new stacking context
        }}>
          <iframe
            ref={iframeRef}
            src={currentGame.iframeUrl}
            width="100%"
            height="100%"
            style={{ 
              border: 'none'
            }}
            title={currentGame.name}
            allowFullScreen
          />
          
          {/* Modern Zerreta Loading Overlay */}
          {showLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(20px) saturate(180%)',
                animation: 'fadeOut 0.8s ease-in-out 5.2s forwards',
                maxHeight: '600px',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 50%)',
                  animation: 'pulse 4s ease-in-out infinite'
                }
              }}
            >
              {/* Main Loading Container */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                                {/* Logo with Circular Loading */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Circular Loading Ring (Spinning) */}
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      position: 'absolute',
                      background: 'conic-gradient(from 0deg, #4facfe 0%, #00f2fe 25%, transparent 25%)',
                      animation: 'circularProgress 2s linear infinite',
                      zIndex: 1
                    }}
                  />
                  
                  {/* Static Inner Background */}
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                      position: 'absolute',
                      zIndex: 2
                    }}
                  />

                  {/* Static Logo Container */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 3,
                      boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {/* Zerreta Logo Image - Completely Static */}
                    <img
                      src="/zer-logo.png"
                      alt="Zerreta Logo"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        filter: 'brightness(1.2) contrast(1.1)'
                      }}
                    />
                  </Box>
                </Box>

                {/* Modern Brand Typography */}
                <Box sx={{ textAlign: 'center', maxWidth: '320px' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #4facfe 50%, #00f2fe 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                      letterSpacing: '0.02em',
                      mb: 1,
                      fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
                      animation: 'textShimmer 3s ease-in-out infinite'
                    }}
                  >
                    Zerreta learnings
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 400,
                      fontSize: '0.95rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontFamily: '"Inter", system-ui, sans-serif'
                    }}
                  >
                    Physics Learning Platform
                  </Typography>
                </Box>

                {/* Modern Loading Progress */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  {/* Progress Bar */}
                  <Box
                    sx={{
                      width: 200,
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #4facfe, #00f2fe)',
                        borderRadius: 2,
                        animation: 'progressFill 6s ease-in-out infinite',
                        boxShadow: '0 0 10px rgba(79, 172, 254, 0.5)'
                      }}
                    />
                  </Box>

                  {/* Loading Text */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      fontFamily: '"Inter", system-ui, sans-serif',
                      animation: 'loadingText 2s ease-in-out infinite'
                    }}
                  >
                    Initializing Physics Simulation...
                  </Typography>
                </Box>
              </Box>

              {/* Modern Floating Elements */}
              <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
                {/* Geometric Shapes */}
                {[...Array(6)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      width: Math.random() * 20 + 10 + 'px',
                      height: Math.random() * 20 + 10 + 'px',
                      background: `linear-gradient(45deg, rgba(79, 172, 254, ${Math.random() * 0.3 + 0.1}), rgba(0, 242, 254, ${Math.random() * 0.3 + 0.1}))`,
                      borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `modernFloat ${4 + Math.random() * 6}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 3}s`,
                      backdropFilter: 'blur(1px)'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Left Side - Educational Content (75%) */}
        <Grid item xs={12} lg={9}>
          <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 60,
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                }}
              >
                <Tab 
                  icon={<ExplanationIcon />} 
                  label="Explanation" 
                  iconPosition="start"
                  sx={{ flexDirection: 'row', gap: 1 }}
                />
                <Tab 
                  icon={<QuizIcon />} 
                  label="Quiz" 
                  iconPosition="start"
                  sx={{ flexDirection: 'row', gap: 1 }}
                />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ minHeight: '600px' }}>
              {/* Explanation Tab */}
              <TabPanel value={tabValue} index={0}>
                {/* Explanation Content */}
                <Box 
                  ref={explanationRef} 
                  data-explanation-area
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  sx={{ 
                    p: 3, 
                    position: 'relative', 
                    userSelect: 'text',
                    cursor: 'text',
                    '& *': {
                      userSelect: 'text !important',
                      cursor: 'text !important'
                    },
                    '&::selection': {
                      backgroundColor: '#ff6b6b60 !important',
                      color: '#000 !important'
                    },
                    '& *::selection': {
                      backgroundColor: '#ff6b6b60 !important',
                      color: '#000 !important'
                    },
                    // Make selection persist longer
                    '& .persistent-selection': {
                      backgroundColor: '#ff6b6b40',
                      color: '#000'
                    },
                    // Prevent text selection from being cleared by other events
                    '&:focus': {
                      outline: 'none'
                    }
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                          {children}
                        </Typography>
                      ),
                      h2: ({ children }) => (
                        <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                          {children}
                        </Typography>
                      ),
                      h3: ({ children }) => (
                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                          {children}
                        </Typography>
                      ),
                      p: ({ children }) => (
                        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                          {children}
                        </Typography>
                      ),
                      li: ({ children }) => (
                        <Typography variant="body1" component="li" sx={{ mb: 0.5 }}>
                          {children}
                        </Typography>
                      )
                    }}
                  >
                    {explanationContent}
                  </ReactMarkdown>
                </Box>
              </TabPanel>

              {/* Drag and Drop Quiz Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    🎯 Drag & Drop Quiz: The Moving Man
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Drag the correct answers from the box below and drop them into the blanks in each question.
                  </Typography>

                  {!showQuizResults ? (
                    <>
                      {/* Answer Bank */}
                      <Card sx={{ mb: 4, p: 3, backgroundColor: '#f8f9fa', border: '2px dashed #007bff' }}>
                        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: '#007bff', mb: 2 }}>
                          📦 Answer Bank - Drag from here:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {availableAnswers.map((answer, index) => (
                            <Box
                              key={index}
                              draggable
                              onDragStart={(e) => handleDragStart(e, answer)}
                              sx={{
                                p: 2,
                                backgroundColor: usedAnswers.includes(answer) ? '#e0e0e0' : '#007bff',
                                color: usedAnswers.includes(answer) ? '#666' : 'white',
                                borderRadius: 2,
                                cursor: usedAnswers.includes(answer) ? 'not-allowed' : 'grab',
                                userSelect: 'none',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                opacity: usedAnswers.includes(answer) ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: usedAnswers.includes(answer) ? 'none' : 'scale(1.05)',
                                  boxShadow: usedAnswers.includes(answer) ? 'none' : '0 4px 12px rgba(0, 123, 255, 0.3)'
                                },
                                '&:active': {
                                  cursor: 'grabbing'
                                }
                              }}
                            >
                              {answer}
                            </Box>
                          ))}
                        </Box>
                      </Card>

                      {/* Questions - Sort unanswered questions to top */}
                      {dragDropQuiz
                        .slice()
                        .sort((a, b) => {
                          const aAnswered = droppedAnswers[a.id] ? 1 : 0;
                          const bAnswered = droppedAnswers[b.id] ? 1 : 0;
                          return aAnswered - bAnswered; // Unanswered (0) come before answered (1)
                        })
                        .map((question, index) => {
                          const originalIndex = dragDropQuiz.findIndex(q => q.id === question.id);
                          const isAnswered = droppedAnswers[question.id];
                          return (
                            <Card 
                              key={question.id} 
                              sx={{ 
                                mb: 3, 
                                p: 3, 
                                '&:hover': { boxShadow: 3 },
                                opacity: isAnswered ? 0.7 : 1,
                                transition: 'all 0.5s ease',
                                border: isAnswered ? '2px solid #4caf50' : '1px solid #e0e0e0'
                              }}
                            >
                              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {isAnswered && <CheckIcon sx={{ color: '#4caf50', fontSize: 20 }} />}
                                  {originalIndex + 1}. {question.question.replace('__________', '')}
                                  {!isAnswered && (
                                    <Chip 
                                      label="Unanswered" 
                                      size="small" 
                                      color="warning" 
                                      sx={{ ml: 1, fontSize: '0.7rem' }}
                                    />
                                  )}
                                </Box>
                              </Typography>
                              
                              {/* Drop Zone */}
                              <Box
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, question.id)}
                                sx={{
                                  minHeight: '60px',
                                  p: 2,
                                  border: '2px dashed #ccc',
                                  borderRadius: 2,
                                  backgroundColor: droppedAnswers[question.id] ? '#e8f5e9' : '#fafafa',
                                  borderColor: droppedAnswers[question.id] ? '#4caf50' : '#ccc',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    borderColor: '#007bff',
                                    backgroundColor: '#f0f8ff'
                                  }
                                }}
                              >
                                {droppedAnswers[question.id] ? (
                                  <Typography variant="body1" fontWeight={600} sx={{ color: '#2e7d32' }}>
                                    ✓ {droppedAnswers[question.id]}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    Drop your answer here...
                                  </Typography>
                                )}
                              </Box>
                            </Card>
                          );
                        })}
                      
                      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                          variant="contained"
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(droppedAnswers).length !== dragDropQuiz.length}
                          sx={{ 
                            backgroundColor: '#007bff',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            '&:hover': { backgroundColor: '#0056b3' }
                          }}
                        >
                          🎯 Check Answers
                        </Button>
                        <Button 
                          variant="outlined" 
                          onClick={resetQuiz}
                          sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                        >
                          🔄 Reset Quiz
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        🎉 Quiz Results: {quizScore}/{dragDropQuiz.length} correct ({Math.round((quizScore/dragDropQuiz.length)*100)}%)
                      </Typography>
                      
                      {dragDropQuiz.map((question, index) => {
                        const userAnswer = droppedAnswers[question.id];
                        const isCorrect = userAnswer === question.answer;
                        
                        return (
                          <Card key={question.id} sx={{ 
                            mb: 2, 
                            p: 3, 
                            borderLeft: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                            backgroundColor: isCorrect ? '#f8fff8' : '#fff8f8'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              {isCorrect ? 
                                <CheckIcon sx={{ color: '#4caf50', fontSize: 24 }} /> : 
                                <WrongIcon sx={{ color: '#f44336', fontSize: 24 }} />
                              }
                              <Typography variant="subtitle1" fontWeight={600}>
                                Question {index + 1}: {question.question.replace('__________', '______')}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Your answer:</strong> <span style={{ color: isCorrect ? '#2e7d32' : '#d32f2f' }}>{userAnswer || 'No answer'}</span>
                            </Typography>
                            {!isCorrect && (
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Correct answer:</strong> <span style={{ color: '#2e7d32' }}>{question.answer}</span>
                              </Typography>
                            )}
                          </Card>
                        );
                      })}
                      
                      <Button 
                        variant="outlined" 
                        onClick={resetQuiz} 
                        sx={{ mt: 3, px: 4, py: 1.5, fontSize: '1rem' }}
                      >
                        🔄 Try Again
                      </Button>
                    </Box>
                  )}
                </Box>
              </TabPanel>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - AI Chat (25%) */}
        <Grid item xs={12} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 4, 
              height: '600px', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              position: 'relative'
            }}
          >
            {/* Decorative Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              zIndex: 0
            }} />

            {/* Chat Header */}
            <Box sx={{ 
              p: 3, 
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              position: 'relative',
              zIndex: 1
            }}>
              <Avatar sx={{ 
                background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
                width: 40,
                height: 40,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                <AIIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: 'white', fontSize: '1.1rem' }}>
                  AI Tutor
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem' }}>
                  Physics Learning Assistant
                </Typography>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'relative',
              zIndex: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
              },
            }}>
              {chatHistory.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.isAI ? 'flex-start' : 'flex-end',
                    mb: 1
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    maxWidth: '85%',
                    flexDirection: message.isAI ? 'row' : 'row-reverse'
                  }}>
                    {/* Avatar */}
                    <Avatar sx={{ 
                      width: 28, 
                      height: 28,
                      backgroundColor: message.isAI ? '#ff6b6b' : '#4CAF50',
                      fontSize: '0.7rem'
                    }}>
                      {message.isAI ? <AIIcon sx={{ fontSize: 16 }} /> : '👤'}
                    </Avatar>
                    
                    {/* Message Bubble */}
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        background: message.isAI 
                          ? 'rgba(255, 255, 255, 0.95)' 
                          : 'linear-gradient(135deg, #4CAF50, #45a049)',
                        color: message.isAI ? '#333' : 'white',
                        borderRadius: message.isAI ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        fontSize: '0.85rem',
                        backdropFilter: 'blur(10px)',
                        border: message.isAI ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        maxWidth: '100%',
                        wordBreak: 'break-word'
                      }}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <Typography variant="body2" sx={{ 
                              m: 0, 
                              lineHeight: 1.5,
                              fontSize: '0.85rem'
                            }}>
                              {children}
                            </Typography>
                          ),
                          strong: ({ children }) => (
                            <Typography component="span" sx={{ fontWeight: 700 }}>
                              {children}
                            </Typography>
                          )
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </Paper>
                  </Box>
                </Box>
              ))}
              
              {chatLoading && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  justifyContent: 'flex-start',
                  mb: 1
                }}>
                  <Avatar sx={{ 
                    width: 28, 
                    height: 28,
                    backgroundColor: '#ff6b6b'
                  }}>
                    <AIIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Paper sx={{
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '18px 18px 18px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CircularProgress size={16} sx={{ color: '#7445f8' }} />
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                      Thinking...
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              <div ref={chatEndRef} />
            </Box>

            {/* Chat Input */}
            <Box sx={{ 
              p: 2, 
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              zIndex: 1
            }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  ref={chatInputRef}
                  fullWidth
                  size="small"
                  placeholder="Ask me anything about physics..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChatMessage()}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '0.875rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      '& fieldset': {
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #4CAF50',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#333',
                      '&::placeholder': {
                        color: '#666',
                        opacity: 0.8
                      }
                    }
                  }}
                />
                <IconButton
                  onClick={handleSendChatMessage}
                  disabled={!chatMessage.trim() || chatLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    width: 42,
                    height: 42,
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049, #4CAF50)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Ask AI Button */}
      {showAskAIButton && (
        <Box
          className="ask-ai-button"
          sx={{
            position: 'fixed',
            left: askAIButtonPosition.x,
            top: askAIButtonPosition.y,
            zIndex: 10000,
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<AIIcon />}
            onClick={handleAskAIAboutSelection}
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
              color: 'white',
              borderRadius: 3,
              px: 2,
              py: 1,
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              textTransform: 'none',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '10px',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '8px solid #ff6b6b',
                filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.2))'
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #ff5252, #ff7043)',
                transform: 'translateY(-2px) scale(1.05)',
                boxShadow: '0 12px 30px rgba(255, 107, 107, 0.7)',
                '&:before': {
                  borderBottomColor: '#ff5252'
                }
              },
              transition: 'all 0.3s ease',
              animation: 'pulse 2s infinite'
            }}
          >
            Ask in AI
          </Button>
        </Box>
      )}

      {/* Add animation styles and selection persistence */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
          }
          50% {
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.8);
          }
          100% {
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
          }
        }
        
        .ask-ai-button {
          animation: fadeInScale 0.3s ease-in-out;
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        /* Force text selection to persist */
        [data-explanation-area] *::selection {
          background-color: rgba(255, 107, 107, 0.6) !important;
          color: #000 !important;
        }
        
        [data-explanation-area] ::selection {
          background-color: rgba(255, 107, 107, 0.6) !important;
          color: #000 !important;
        }
        
        /* Prevent selection from being cleared by click events */
        [data-explanation-area] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
        
        [data-explanation-area] * {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `}</style>



      {/* Modern CSS animations */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes modernSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes circularProgress {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes logoGlow {
          from { 
            filter: brightness(1.1) contrast(1.1) drop-shadow(0 0 5px rgba(79, 172, 254, 0.5)); 
          }
          to { 
            filter: brightness(1.3) contrast(1.2) drop-shadow(0 0 15px rgba(79, 172, 254, 0.8)); 
          }
        }
        
        @keyframes logoFloat {
          0%, 100% { 
            transform: translateY(0px); 
            box-shadow: 0 20px 40px rgba(79, 172, 254, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          50% { 
            transform: translateY(-3px); 
            box-shadow: 0 25px 50px rgba(79, 172, 254, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
        }
        
        @keyframes textShimmer {
          0%, 100% { 
            background-position: 0% 50%; 
            opacity: 1;
          }
          50% { 
            background-position: 100% 50%; 
            opacity: 0.8;
          }
        }
        
        @keyframes progressFill {
          0% { 
            width: 0%; 
            transform: translateX(0);
          }
          50% { 
            width: 70%; 
            transform: translateX(0);
          }
          100% { 
            width: 100%; 
            transform: translateX(0);
          }
        }
        
        @keyframes loadingText {
          0%, 100% { opacity: 0.8; transform: translateY(0px); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
        
        @keyframes modernFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-15px) translateX(10px) rotate(90deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-5px) translateX(-5px) rotate(180deg); 
            opacity: 0.4;
          }
          75% { 
            transform: translateY(-20px) translateX(-10px) rotate(270deg); 
            opacity: 0.7;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.3; 
            transform: scale(1.1);
          }
        }
        
        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
            transform: scale(0.95);
          }
        }
        
        @keyframes pulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes gradientRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
      `}</style>
    </Container>
  );
};

export default GamePage; 