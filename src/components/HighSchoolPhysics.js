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
  Psychology as QuantumIcon,
  Flare as FlareIcon,
  CameraAlt as OpticsIcon,
  Science as MiscIcon
} from '@mui/icons-material';
import highSchoolImage from '../assets/highschool.png';

const HighSchoolPhysics = () => {
  const navigate = useNavigate();

  const physicsCategories = [
    {
      title: 'Mechanics & Motion',
      icon: <MotionIcon />,
      color: '#2196f3',
      games: [
        {
          id: 'projectile-motion',
          name: 'Projectile Motion',
          description: 'Analyze projectile trajectories using advanced mathematical modeling and physics principles.',
          concepts: ['Projectile Motion', 'Trajectory', 'Gravity', 'Velocity', 'Angle'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/projectile-motion',
          iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html'
        },
        {
          id: 'projectile-sampling-distributions',
          name: 'Projectile Sampling Distributions',
          description: 'Apply statistical analysis to projectile motion data and understand measurement uncertainty.',
          concepts: ['Statistics', 'Data Analysis', 'Uncertainty', 'Distributions', 'Measurement'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/projectile-sampling-distributions',
          iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-sampling-distributions/latest/projectile-sampling-distributions_en.html'
        },
        {
          id: 'projectile-data-lab',
          name: 'Projectile Data Lab',
          description: 'Conduct laboratory-style experiments with projectile motion and analyze real data.',
          concepts: ['Lab Techniques', 'Data Collection', 'Analysis', 'Experimental Design', 'Variables'],
          gradeLevel: '9-12',
          duration: '40-60 minutes',
          url: 'https://phet.colorado.edu/en/simulations/projectile-data-lab',
          iframeUrl: 'https://phet.colorado.edu/sims/html/projectile-data-lab/latest/projectile-data-lab_en.html'
        },
        {
          id: 'the-ramp',
          name: 'The Ramp',
          description: 'Advanced study of forces on inclined planes with detailed mathematical analysis.',
          concepts: ['Inclined Planes', 'Force Components', 'Friction', 'Energy', 'Work'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/the-ramp',
          iframeUrl: 'https://phet.colorado.edu/sims/html/the-ramp/latest/the-ramp_en.html'
        },
        {
          id: 'torque',
          name: 'Torque',
          description: 'Explore rotational motion, torque, and angular momentum in complex systems.',
          concepts: ['Torque', 'Angular Momentum', 'Rotational Motion', 'Moment of Inertia', 'Equilibrium'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/torque',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/rotation/latest/rotation.html?simulation=torque'
        },
        {
          id: 'ladybug-revolution',
          name: 'Ladybug Revolution',
          description: 'Study circular motion, centripetal force, and rotational kinematics.',
          concepts: ['Circular Motion', 'Centripetal Force', 'Angular Velocity', 'Period', 'Frequency'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/ladybug-revolution',
          iframeUrl: 'https://phet.colorado.edu/sims/html/ladybug-revolution/latest/ladybug-revolution_en.html'
        }
      ]
    },
    {
      title: 'Waves & Sound',
      icon: <WavesIcon />,
      color: '#9c27b0',
      games: [
        {
          id: 'normal-modes',
          name: 'Normal Modes',
          description: 'Advanced study of wave modes, standing waves, and resonance phenomena.',
          concepts: ['Normal Modes', 'Standing Waves', 'Resonance', 'Harmonics', 'Oscillations'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/normal-modes',
          iframeUrl: 'https://phet.colorado.edu/sims/html/normal-modes/latest/normal-modes_en.html'
        },
        {
          id: 'fourier-making-waves',
          name: 'Fourier: Making Waves',
          description: 'Explore Fourier analysis and the mathematical decomposition of complex waves.',
          concepts: ['Fourier Analysis', 'Wave Superposition', 'Frequency Domain', 'Mathematical Modeling'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/fourier-making-waves',
          iframeUrl: 'https://phet.colorado.edu/sims/html/fourier-making-waves/latest/fourier-making-waves_en.html'
        },
        {
          id: 'resonance',
          name: 'Resonance',
          description: 'Study resonance phenomena in mechanical and acoustic systems.',
          concepts: ['Resonance', 'Natural Frequency', 'Damping', 'Forced Oscillations', 'Energy Transfer'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/resonance',
          iframeUrl: 'https://phet.colorado.edu/sims/html/resonance/latest/resonance_en.html'
        }
      ]
    },
    {
      title: 'Electricity & Magnetism',
      icon: <ElectricityIcon />,
      color: '#ff9800',
      games: [
        {
          id: 'faradays-electromagnetic-lab',
          name: 'Faraday\'s Electromagnetic Lab',
          description: 'Comprehensive exploration of electromagnetic phenomena and field interactions.',
          concepts: ['Electromagnetic Fields', 'Induction', 'Magnetic Fields', 'Electric Fields', 'Field Lines'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab',
          iframeUrl: 'https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html'
        },
        {
          id: 'faradays-law',
          name: 'Faraday\'s Law',
          description: 'Study electromagnetic induction and the relationship between changing magnetic fields and electric currents.',
          concepts: ['Faraday\'s Law', 'Electromagnetic Induction', 'Magnetic Flux', 'Induced EMF', 'Lenz\'s Law'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/faradays-law',
          iframeUrl: 'https://phet.colorado.edu/sims/html/faradays-law/latest/faradays-law_en.html'
        },
        {
          id: 'electric-field-of-dreams',
          name: 'Electric Field of Dreams',
          description: 'Advanced visualization and analysis of electric field patterns and potential.',
          concepts: ['Electric Fields', 'Electric Potential', 'Field Mapping', 'Equipotential Lines', 'Gauss\'s Law'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/electric-field-of-dreams',
          iframeUrl: 'https://phet.colorado.edu/sims/html/electric-field-of-dreams/latest/electric-field-of-dreams_en.html'
        },
        {
          id: 'charges-and-fields',
          name: 'Charges and Fields',
          description: 'Study the behavior of electric charges and the electric fields they create.',
          concepts: ['Electric Charges', 'Electric Fields', 'Field Lines', 'Force', 'Superposition'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/charges-and-fields',
          iframeUrl: 'https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html'
        },
        {
          id: 'coulombs-law',
          name: 'Coulomb\'s Law',
          description: 'Quantitative analysis of electrostatic forces using Coulomb\'s law.',
          concepts: ['Coulomb\'s Law', 'Electrostatic Force', 'Inverse Square Law', 'Point Charges', 'Electric Constant'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/coulombs-law',
          iframeUrl: 'https://phet.colorado.edu/sims/html/coulombs-law/latest/coulombs-law_en.html'
        },
        {
          id: 'resistance-in-a-wire',
          name: 'Resistance in a Wire',
          description: 'Explore the factors affecting electrical resistance in conductors.',
          concepts: ['Electrical Resistance', 'Resistivity', 'Wire Properties', 'Temperature Effects', 'Materials'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/resistance-in-a-wire',
          iframeUrl: 'https://phet.colorado.edu/sims/html/resistance-in-a-wire/latest/resistance-in-a-wire_en.html'
        },
        {
          id: 'battery-resistor-circuit',
          name: 'Battery-Resistor Circuit',
          description: 'Analyze simple circuits with batteries and resistors using Ohm\'s law.',
          concepts: ['Circuit Analysis', 'Ohm\'s Law', 'Voltage Drop', 'Current Flow', 'Power Dissipation'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/battery-resistor-circuit',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/battery-resistor-circuit/latest/battery-resistor-circuit.html?simulation=battery-resistor-circuit'
        },
        {
          id: 'circuit-construction-kit-ac',
          name: 'Circuit Construction Kit: AC',
          description: 'Build and analyze alternating current circuits with advanced components.',
          concepts: ['AC Circuits', 'Alternating Current', 'Impedance', 'Phase Relationships', 'Reactance'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac',
          iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac/latest/circuit-construction-kit-ac_en.html'
        },
        {
          id: 'circuit-construction-kit-ac-virtual-lab',
          name: 'Circuit Construction Kit: AC - Virtual Lab',
          description: 'Advanced AC circuit analysis with comprehensive measurement and analysis tools.',
          concepts: ['AC Circuit Analysis', 'Virtual Instruments', 'Oscilloscope', 'Frequency Response', 'Complex Impedance'],
          gradeLevel: '9-12',
          duration: '40-60 minutes',
          url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac-virtual-lab',
          iframeUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac-virtual-lab/latest/circuit-construction-kit-ac-virtual-lab_en.html'
        },
        {
          id: 'signal-circuit',
          name: 'Signal Circuit',
          description: 'Build circuits that send signals and learn about electrical communication.',
          concepts: ['Signal Processing', 'Electrical Communication', 'Circuit Design', 'Information Transfer', 'Electronic Systems'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/signal-circuit',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/signal-circuit/latest/signal-circuit.html?simulation=signal-circuit'
        },
        {
          id: 'conductivity',
          name: 'Conductivity',
          description: 'Explore electrical conductivity in different materials and understand the microscopic basis of conduction.',
          concepts: ['Electrical Conductivity', 'Material Properties', 'Electron Transport', 'Band Theory', 'Semiconductors'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/conductivity',
          iframeUrl: 'https://phet.colorado.edu/sims/html/conductivity/latest/conductivity_en.html'
        },
        {
          id: 'generator',
          name: 'Generator',
          description: 'Study electromagnetic generators and the conversion of mechanical energy to electrical energy.',
          concepts: ['Electromagnetic Generator', 'Energy Conversion', 'Rotating Coils', 'Magnetic Fields', 'AC Generation'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/generator',
          iframeUrl: 'https://phet.colorado.edu/sims/html/generator/latest/generator_en.html'
        }
      ]
    },
    {
      title: 'Quantum Physics',
      icon: <QuantumIcon />,
      color: '#673ab7',
      games: [
        {
          id: 'quantum-coin-toss',
          name: 'Quantum Coin Toss',
          description: 'Introduction to quantum probability and the fundamental differences from classical physics.',
          concepts: ['Quantum Probability', 'Superposition', 'Measurement', 'Quantum States', 'Uncertainty'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/quantum-coin-toss',
          iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-coin-toss/latest/quantum-coin-toss_en.html'
        },
        {
          id: 'quantum-measurement',
          name: 'Quantum Measurement',
          description: 'Explore the role of measurement in quantum mechanics and wave function collapse.',
          concepts: ['Quantum Measurement', 'Wave Function Collapse', 'Observer Effect', 'Probability', 'Quantum States'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/quantum-measurement',
          iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement_en.html'
        },
        {
          id: 'stern-gerlach-experiment',
          name: 'Stern-Gerlach Experiment',
          description: 'Study quantum spin and the historic experiment that revealed quantum angular momentum.',
          concepts: ['Quantum Spin', 'Magnetic Moments', 'Spatial Quantization', 'Beam Splitting', 'Angular Momentum'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/stern-gerlach',
          iframeUrl: 'https://phet.colorado.edu/sims/html/stern-gerlach/latest/stern-gerlach_en.html'
        },
        {
          id: 'quantum-tunneling-and-wave-packets',
          name: 'Quantum Tunneling and Wave Packets',
          description: 'Explore quantum tunneling phenomena and wave packet behavior.',
          concepts: ['Quantum Tunneling', 'Wave Packets', 'Potential Barriers', 'Probability Density', 'Wave Functions'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/quantum-tunneling',
          iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-tunneling/latest/quantum-tunneling_en.html'
        },
        {
          id: 'quantum-wave-interference',
          name: 'Quantum Wave Interference',
          description: 'Study wave-particle duality and quantum interference patterns.',
          concepts: ['Wave-Particle Duality', 'Quantum Interference', 'Double-Slit Experiment', 'Complementarity', 'Photons'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/quantum-wave-interference',
          iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-wave-interference/latest/quantum-wave-interference_en.html'
        },
        {
          id: 'quantum-bound-states',
          name: 'Quantum Bound States',
          description: 'Explore quantum bound states and energy level quantization.',
          concepts: ['Quantum Bound States', 'Energy Levels', 'Quantization', 'Wave Functions', 'Schrödinger Equation'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/quantum-bound-states',
          iframeUrl: 'https://phet.colorado.edu/sims/html/quantum-bound-states/latest/quantum-bound-states_en.html'
        },
        {
          id: 'optical-quantum-control',
          name: 'Optical Quantum Control',
          description: 'Advanced quantum control using optical techniques and laser manipulation.',
          concepts: ['Quantum Control', 'Optical Manipulation', 'Laser Physics', 'Quantum States', 'Coherent Control'],
          gradeLevel: '9-12',
          duration: '40-55 minutes',
          url: 'https://phet.colorado.edu/en/simulations/optical-quantum-control',
          iframeUrl: 'https://phet.colorado.edu/sims/html/optical-quantum-control/latest/optical-quantum-control_en.html'
        },
        {
          id: 'davisson-germer-electron-diffraction',
          name: 'Davisson-Germer: Electron Diffraction',
          description: 'Study the wave nature of electrons through the historic Davisson-Germer experiment.',
          concepts: ['Electron Diffraction', 'Wave-Particle Duality', 'De Broglie Wavelength', 'Crystal Diffraction', 'Quantum Mechanics'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/davisson-germer',
          iframeUrl: 'https://phet.colorado.edu/sims/html/davisson-germer/latest/davisson-germer_en.html'
        },
        {
          id: 'simplified-mri',
          name: 'Simplified MRI',
          description: 'Understand the quantum mechanical principles behind magnetic resonance imaging.',
          concepts: ['Magnetic Resonance', 'Nuclear Spins', 'MRI Physics', 'Medical Imaging', 'Quantum Applications'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/simplified-mri',
          iframeUrl: 'https://phet.colorado.edu/sims/html/simplified-mri/latest/simplified-mri_en.html'
        },
        {
          id: 'photoelectric-effect',
          name: 'Photoelectric Effect',
          description: 'Study the photoelectric effect and Einstein\'s explanation using quantum theory.',
          concepts: ['Photoelectric Effect', 'Photons', 'Work Function', 'Quantum Energy', 'Einstein\'s Theory'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/photoelectric',
          iframeUrl: 'https://phet.colorado.edu/sims/html/photoelectric/latest/photoelectric_en.html'
        },
        {
          id: 'models-of-the-hydrogen-atom',
          name: 'Models of the Hydrogen Atom',
          description: 'Explore different models of the hydrogen atom and understand atomic structure evolution.',
          concepts: ['Hydrogen Atom', 'Atomic Models', 'Bohr Model', 'Quantum Mechanics', 'Energy Levels'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/models-of-the-hydrogen-atom',
          iframeUrl: 'https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom_en.html'
        }
      ]
    },
    {
      title: 'Atomic & Nuclear Physics',
      icon: <FlareIcon />,
      color: '#e91e63',
      games: [
        {
          id: 'build-an-atom',
          name: 'Build an Atom',
          description: 'Construct atoms and understand atomic structure, isotopes, and the periodic table.',
          concepts: ['Atomic Structure', 'Protons', 'Neutrons', 'Electrons', 'Isotopes', 'Periodic Table'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/build-an-atom',
          iframeUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html'
        },
        {
          id: 'isotopes-and-atomic-mass',
          name: 'Isotopes and Atomic Mass',
          description: 'Explore isotopes and understand how atomic mass is determined.',
          concepts: ['Isotopes', 'Atomic Mass', 'Mass Number', 'Abundance', 'Nuclear Composition'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/isotopes-and-atomic-mass',
          iframeUrl: 'https://phet.colorado.edu/sims/html/isotopes-and-atomic-mass/latest/isotopes-and-atomic-mass_en.html'
        },
        {
          id: 'alpha-decay',
          name: 'Alpha Decay',
          description: 'Study alpha particle emission and nuclear decay processes.',
          concepts: ['Alpha Decay', 'Nuclear Decay', 'Alpha Particles', 'Half-Life', 'Nuclear Stability'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/alpha-decay',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/nuclear-physics/latest/nuclear-physics.html?simulation=alpha-decay'
        },
        {
          id: 'beta-decay',
          name: 'Beta Decay',
          description: 'Explore beta decay processes and the transformation of nuclear particles.',
          concepts: ['Beta Decay', 'Beta Particles', 'Nuclear Transformation', 'Weak Nuclear Force', 'Neutrinos'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/beta-decay',
          iframeUrl: 'https://phet.colorado.edu/sims/html/beta-decay/latest/beta-decay_en.html'
        },
        {
          id: 'nuclear-fission',
          name: 'Nuclear Fission',
          description: 'Study nuclear fission reactions and chain reaction processes.',
          concepts: ['Nuclear Fission', 'Chain Reactions', 'Critical Mass', 'Nuclear Energy', 'Uranium'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/nuclear-fission',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/nuclear-physics/latest/nuclear-physics.html?simulation=nuclear-fission'
        },
        {
          id: 'radioactive-dating-game',
          name: 'Radioactive Dating Game',
          description: 'Learn about radioactive dating techniques and their applications in science.',
          concepts: ['Radioactive Dating', 'Half-Life', 'Carbon Dating', 'Decay Curves', 'Geochronology'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/radioactive-dating-game',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/nuclear-physics/latest/nuclear-physics.html?simulation=radioactive-dating-game'
        },
        {
          id: 'rutherford-scattering',
          name: 'Rutherford Scattering',
          description: 'Recreate Rutherford\'s famous gold foil experiment and discover atomic structure.',
          concepts: ['Rutherford Scattering', 'Atomic Structure', 'Alpha Particles', 'Nuclear Model', 'Gold Foil Experiment'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/rutherford-scattering',
          iframeUrl: 'https://phet.colorado.edu/sims/html/rutherford-scattering/latest/rutherford-scattering_en.html'
        },
        {
          id: 'radiating-charge',
          name: 'Radiating Charge',
          description: 'Study electromagnetic radiation from accelerating charges and antenna theory.',
          concepts: ['Electromagnetic Radiation', 'Accelerating Charges', 'Antenna Theory', 'Radio Waves', 'Field Propagation'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/radiating-charge',
          iframeUrl: 'https://phet.colorado.edu/sims/html/radiating-charge/latest/radiating-charge_en.html'
        },
        {
          id: 'neon-lights-and-other-discharge-lamps',
          name: 'Neon Lights & Other Discharge Lamps',
          description: 'Explore gas discharge phenomena and understand how neon lights and other discharge lamps work.',
          concepts: ['Gas Discharge', 'Atomic Excitation', 'Light Emission', 'Plasma Physics', 'Spectroscopy'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/neon-lights',
          iframeUrl: 'https://phet.colorado.edu/sims/html/neon-lights/latest/neon-lights_en.html'
        }
      ]
    },
    {
      title: 'Optics',
      icon: <OpticsIcon />,
      color: '#00bcd4',
      games: [
        {
          id: 'geometric-optics',
          name: 'Geometric Optics',
          description: 'Advanced study of light ray behavior, lenses, and optical instruments.',
          concepts: ['Geometric Optics', 'Ray Tracing', 'Lenses', 'Mirrors', 'Image Formation', 'Optical Instruments'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/geometric-optics',
          iframeUrl: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html'
        },
        {
          id: 'bending-light',
          name: 'Bending Light',
          description: 'Study refraction, reflection, and total internal reflection in various media.',
          concepts: ['Refraction', 'Reflection', 'Total Internal Reflection', 'Snell\'s Law', 'Critical Angle'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/bending-light',
          iframeUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html'
        },
        {
          id: 'microwaves',
          name: 'Microwaves',
          description: 'Explore electromagnetic wave properties using microwave radiation.',
          concepts: ['Electromagnetic Waves', 'Microwaves', 'Wave Properties', 'Interference', 'Standing Waves'],
          gradeLevel: '9-12',
          duration: '25-35 minutes',
          url: 'https://phet.colorado.edu/en/simulations/microwaves',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/microwaves/latest/microwaves.html?simulation=microwaves'
        },
        {
          id: 'lasers',
          name: 'Lasers',
          description: 'Study laser operation, stimulated emission, and coherent light properties.',
          concepts: ['Lasers', 'Stimulated Emission', 'Coherent Light', 'Population Inversion', 'Optical Amplification'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/lasers',
          iframeUrl: 'https://phet.colorado.edu/sims/cheerpj/lasers/latest/lasers.html?simulation=lasers'
        },
        {
          id: 'color-vision',
          name: 'Color Vision',
          description: 'Advanced study of color perception, RGB color models, and human vision.',
          concepts: ['Color Vision', 'RGB Model', 'Human Vision', 'Color Perception', 'Photoreceptors'],
          gradeLevel: '9-12',
          duration: '20-30 minutes',
          url: 'https://phet.colorado.edu/en/simulations/color-vision',
          iframeUrl: 'https://phet.colorado.edu/sims/html/color-vision/latest/color-vision_en.html'
        }
      ]
    },
    {
      title: 'Thermodynamics & Heat',
      icon: <HeatIcon />,
      color: '#f44336',
      games: [
        {
          id: 'energy-skate-park',
          name: 'Energy Skate Park',
          description: 'Advanced energy analysis with friction, thermal energy, and conservation principles.',
          concepts: ['Energy Conservation', 'Kinetic Energy', 'Potential Energy', 'Thermal Energy', 'Friction'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/energy-skate-park',
          iframeUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_en.html'
        }
      ]
    },
    {
      title: 'Gravity & Astronomy',
      icon: <GravityIcon />,
      color: '#795548',
      games: [
        {
          id: 'gravity-force-lab',
          name: 'Gravity Force Lab',
          description: 'Advanced study of gravitational forces with quantitative analysis and Newton\'s law of gravitation.',
          concepts: ['Gravitational Force', 'Newton\'s Law of Gravitation', 'Inverse Square Law', 'Universal Constant'],
          gradeLevel: '9-12',
          duration: '30-40 minutes',
          url: 'https://phet.colorado.edu/en/simulations/gravity-force-lab',
          iframeUrl: 'https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_en.html'
        },
        {
          id: 'keplers-laws',
          name: 'Kepler\'s Laws',
          description: 'Study planetary motion and Kepler\'s three laws of orbital mechanics.',
          concepts: ['Kepler\'s Laws', 'Orbital Mechanics', 'Elliptical Orbits', 'Planetary Motion', 'Astronomy'],
          gradeLevel: '9-12',
          duration: '30-45 minutes',
          url: 'https://phet.colorado.edu/en/simulations/keplers-laws',
          iframeUrl: 'https://phet.colorado.edu/sims/html/keplers-laws/latest/keplers-laws_en.html'
        }
      ]
    },
    {
      title: 'Miscellaneous Physics',
      icon: <MiscIcon />,
      color: '#4caf50',
      games: [
        {
          id: 'optical-tweezers-and-applications',
          name: 'Optical Tweezers and Applications',
          description: 'Explore the use of optical tweezers in physics research and biological applications.',
          concepts: ['Optical Tweezers', 'Laser Applications', 'Microscopic Manipulation', 'Biophysics', 'Research Tools'],
          gradeLevel: '9-12',
          duration: '35-50 minutes',
          url: 'https://phet.colorado.edu/en/simulations/optical-tweezers',
          iframeUrl: 'https://phet.colorado.edu/sims/html/optical-tweezers/latest/optical-tweezers_en.html'
        }
      ]
    }
  ];

  const handleGoBack = () => {
    navigate('/student-dashboard/physics');
  };

  const handleGameClick = (gameId) => {
    navigate(`/student-dashboard/physics/high/game/${gameId}`);
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
            backgroundImage: `url(${highSchoolImage})`,
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
              High School Physics Simulations
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
              Quantitative analysis, mathematical modeling, and advanced topics
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
              Grades 9-12 • {totalGames} Interactive PhET Simulations • College Preparatory Level
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Chip 
                label={`${totalGames} Simulations`} 
                sx={{ 
                  background: 'rgba(255,255,255,0.9)',
                  color: '#3f51b5',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Chip 
                label="Grades 9-12" 
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
            High School Physics
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
            Advanced Simulations
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
            Grades 9-12 • {totalGames} Interactive Simulations
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
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${category.color}25`,
                        }
                      }}
                      onClick={() => handleGameClick(game.id)}
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
                              backgroundColor: '#1a237e', 
                              color: '#fff',
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
                          Analyze Simulation
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
          High School Physics Learning Goals
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Master advanced physics concepts through mathematical modeling and quantitative analysis
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={3}>
            <Box>
              <QuantumIcon sx={{ fontSize: 40, color: '#673ab7', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quantum Mechanics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the fundamental nature of matter and energy at atomic scales
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <ElectricityIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Electromagnetic Theory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Master Maxwell's equations and electromagnetic field theory
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <FlareIcon sx={{ fontSize: 40, color: '#e91e63', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Nuclear Physics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Understand atomic structure and nuclear processes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>
              <OpticsIcon sx={{ fontSize: 40, color: '#00bcd4', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Advanced Optics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Study wave optics, laser physics, and optical instruments
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HighSchoolPhysics; 