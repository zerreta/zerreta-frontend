import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Tabs,
  Tab,
  useTheme,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  PlayCircleOutline as PlayIcon,
  Bookmarks as BookmarksIcon,
  Science as ScienceIcon,
  ScienceOutlined as ChemistryIcon,
  Biotech as BiotechIcon,
  Pets as PetsIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '&:before': {
    display: 'none',
  },
}));

const TopicNumber = styled(Typography)(({ theme }) => ({
  color: '#7445f8',
  fontWeight: 'bold',
  marginRight: theme.spacing(1),
}));

const TopicTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const SubTopic = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
}));

const physicsTopics = [
  {
    number: "1",
    title: "Physical World, Units, and Measurements",
    topics: [
      "Units of Physical Quantities",
      "Dimensions of Physical Quantities",
      "Errors in Measurements"
    ]
  },
  {
    number: "2",
    title: "Motion in a Straight Line",
    topics: [
      "Distance, Displacement & Uniform Motion",
      "Non-uniform Motion",
      "Relative Velocity",
      "Motion Under Gravity"
    ]
  },
  {
    number: "3",
    title: "Motion in a Plane",
    topics: [
      "Vectors",
      "Motion in a Plane with Constant Acceleration",
      "Projectile Motion",
      "Relative Velocity in Two Dimensions & Uniform Circular Motion"
    ]
  },
  {
    number: "4",
    title: "Laws of Motion",
    topics: [
      "Newton's First, Second & Third Laws of Motion",
      "Motion of Connected Bodies, Pulley & Equilibrium of Forces",
      "Friction",
      "Circular Motion, Banking of Roads"
    ]
  },
  {
    number: "5",
    title: "Work, Energy, and Power",
    topics: [
      "Work",
      "Energy",
      "Power",
      "Collisions"
    ]
  },
  {
    number: "6",
    title: "System of Particles and Rotational Motion",
    topics: [
      "Centre of Mass, Centre of Gravity & Principle of Moments",
      "Angular Displacement, Velocity, and Acceleration",
      "Torque, Couple, and Angular Momentum",
      "Moment of Inertia, Rotational Kinetic Energy, and Power",
      "Rolling Motion"
    ]
  },
  {
    number: "7",
    title: "Gravitation",
    topics: [
      "Kepler's Laws of Planetary Motion",
      "Newton's Universal Law of Gravitation",
      "Acceleration due to Gravity",
      "Gravitational Field, Potential, and Energy",
      "Motion of Satellites, Escape Speed, and Orbital Velocity"
    ]
  },
  {
    number: "8",
    title: "Mechanical Properties of Solids",
    topics: [
      "Hooke's Law & Young's Modulus of Elasticity",
      "Bulk and Rigidity Modulus & Work Done in Stretching a Wire"
    ]
  },
  {
    number: "9",
    title: "Mechanical Properties of Fluids",
    topics: [
      "Pressure, Density, Pascal's Law & Archimedes' Principle",
      "Fluid Flow, Reynolds Number & Bernoulli's Principle",
      "Viscosity & Terminal Velocity",
      "Surface Tension, Surface Energy & Capillarity"
    ]
  },
  {
    number: "10",
    title: "Thermal Properties of Matter",
    topics: [
      "Thermometry & Thermal Expansion",
      "Colorimetry & Heat Transfer",
      "Newton's Law of Cooling"
    ]
  },
  {
    number: "11",
    title: "Thermodynamics",
    topics: [
      "First Law of Thermodynamics",
      "Specific Heat Capacity & Thermodynamic Processes",
      "Carnot Engine, Refrigerator & Second Law of Thermodynamics"
    ]
  },
  {
    number: "12",
    title: "Kinetic Theory",
    topics: [
      "Kinetic Theory of an Ideal Gas & Gas Laws",
      "Speed of Gas, Pressure & Kinetic Energy",
      "Degree of Freedom, Specific Heat Capacity & Mean Free Path"
    ]
  },
  {
    number: "13",
    title: "Oscillations",
    topics: [
      "Displacement, Phase, Velocity & Acceleration of SHM",
      "Energy in Simple Harmonic Motion",
      "Time Period, Frequency, Simple Pendulum & Spring Pendulum",
      "Damped SHM, Forced Oscillations & Resonance"
    ]
  },
  {
    number: "14",
    title: "Waves",
    topics: [
      "Basics of Mechanical Waves, Progressive & Stationary Waves",
      "Vibration of String & Organ Pipe",
      "Beats, Interference & Superposition of Waves",
      "Musical Sound & Doppler's Effect"
    ]
  },
  {
    number: "15",
    title: "Electric Charges and Fields",
    topics: [
      "Charges & Coulomb's Law",
      "Electric Field, Electric Field Lines & Dipole",
      "Electric Flux & Gauss's Law"
    ]
  },
  {
    number: "16",
    title: "Electrostatic Potential and Capacitance",
    topics: [
      "Electrostatic Potential & Equipotential Surfaces",
      "Electrostatic Potential Energy & Work Done in Carrying a Charge",
      "Capacitors, Capacitance, Grouping of Capacitors & Energy Stored in a Capacitor"
    ]
  },
  {
    number: "17",
    title: "Current Electricity",
    topics: [
      "Electric Current, Drift of Electrons, Ohm's Law, Resistance & Resistivity",
      "Combination of Resistors",
      "Kirchhoff's Laws, Cells, Thermo emf & Electrolysis",
      "Heating Effects of Current",
      "Wheatstone Bridge & Different Measuring Instruments"
    ]
  },
  {
    number: "18",
    title: "Moving Charges and Magnetism",
    topics: [
      "Motion of Charged Particles in Magnetic Field & Moment",
      "Magnetic Field, Biot-Savart's Law & Ampere's Circuital Law",
      "Force & Torque on a Current Carrying Conductor",
      "Galvanometer and Its Conversion into Ammeter & Voltmeter"
    ]
  },
  {
    number: "19",
    title: "Magnetism and Matter",
    topics: [
      "Magnetism, Gauss's Law, Magnetic Moment & Properties of Magnet",
      "The Earth's Magnetism, Magnetic Properties of Materials"
    ]
  },
  {
    number: "20",
    title: "Electromagnetic Induction",
    topics: [
      "Magnetic Flux, Faraday's & Lenz's Law",
      "Motional and Static EMI & Applications of EMI"
    ]
  },
  {
    number: "21",
    title: "Alternating Current",
    topics: [
      "Alternating Current, Voltage & Power",
      "AC Circuit, LCR Circuit, Quality & Power Factor",
      "Transformers & LC Oscillations"
    ]
  },
  {
    number: "22",
    title: "Electromagnetic Waves",
    topics: [
      "Electromagnetic Waves, Conduction & Displacement Current"
    ]
  },
  {
    number: "23",
    title: "Ray Optics and Optical Instruments",
    topics: [
      "Plane Mirror, Spherical Mirror & Reflection of Light",
      "Refraction of Light at Plane Surface & Total Internal Reflection",
      "Refraction at Curved Surface, Lenses & Power of Lens",
      "Prism & Dispersion of Light",
      "Optical Instruments"
    ]
  },
  {
    number: "24",
    title: "Wave Optics",
    topics: [
      "Wavefront, Interference of Light, Coherent & Incoherent Sources",
      "Young's Double Slit Experiment",
      "Diffraction, Polarization of Light & Resolving Power"
    ]
  },
  {
    number: "25",
    title: "Dual Nature of Radiation and Matter",
    topics: [
      "Matter Waves, Cathode & Positive Rays",
      "Electron Emission, Photoelectric Effect & X-ray"
    ]
  },
  {
    number: "26",
    title: "Atoms",
    topics: [
      "Atomic Structure, Rutherford's Nuclear Model of Atom",
      "Bohr Model & The Spectra of the Hydrogen Atom"
    ]
  },
  {
    number: "27",
    title: "Nuclei",
    topics: [
      "Composition and Size of the Nucleus",
      "Mass-Energy & Nuclear Reactions",
      "Radioactivity"
    ]
  },
  {
    number: "28",
    title: "Semiconductor Electronics: Materials, Devices, and Simple Circuits",
    topics: [
      "Solids, Semiconductors, and P-N Junction Diode",
      "Junction Transistor",
      "Digital Electronics and Logic Gates"
    ]
  }
];

const chemistryTopics = [
  {
    number: "1",
    title: "Some Basic Concepts of Chemistry",
    topics: [
      "Significant Figures, Laws of Chemical Combinations, and Mole Concept",
      "Percent Composition and Empirical Formula",
      "Stoichiometric Calculations"
    ]
  },
  {
    number: "2",
    title: "Structure of Atom",
    topics: [
      "Atomic Models and Dual Nature of Electromagnetic Radiation",
      "Bohr's Model for Hydrogen Atom (Emission and Absorption Spectra)",
      "Dual Behaviour of Matter and Heisenberg Uncertainty Principle",
      "Quantum Mechanical Model of Atom"
    ]
  },
  {
    number: "3",
    title: "Classification of Elements and Periodicity in Properties",
    topics: [
      "Modern Periodic Table",
      "Periodic Trends in Properties of Elements"
    ]
  },
  {
    number: "4",
    title: "Chemical Bonding and Molecular Structure",
    topics: [
      "Electrovalent, Covalent, and Co-ordinate Bonding",
      "Octet Rule, Resonance, and Hydrogen Bonding",
      "Dipole Moment and Bond Polarity",
      "VSEPR Theory and Hybridisation",
      "Valence Bond and Molecular Orbital Theory"
    ]
  },
  {
    number: "5",
    title: "States of Matter",
    topics: [
      "Gas Laws and Ideal Gas Equation",
      "Kinetic Theory of Gases and Molecular Speeds",
      "van der Waal's Equation and Liquefaction of Gases",
      "Liquid State"
    ]
  },
  {
    number: "6",
    title: "Thermodynamics",
    topics: [
      "First Law and Basic Fundamentals of Thermodynamics",
      "Laws of Thermochemistry",
      "Entropy and Second Law of Thermodynamics",
      "Spontaneity and Gibbs Free Energy"
    ]
  },
  {
    number: "7",
    title: "Equilibrium",
    topics: [
      "Law of Mass Action, Equilibrium Constant (Kc and Kp), and its Applications",
      "Relation between K, Q, and G; Factors Affecting Equilibrium",
      "Theories of Acids and Bases; Ionic Product of Water and pH Scale",
      "Ionization of Weak Acids and Bases; Relation between Ka and Kb",
      "Common Ion Effect, Salt Hydrolysis, Buffer Solutions, and Solubility Product"
    ]
  },
  {
    number: "8",
    title: "Redox Reactions",
    topics: [
      "Oxidation and Reduction Reactions",
      "Oxidation Number",
      "Disproportionation and Balancing of Redox Reactions",
      "Electrode Potential and Oxidizing/Reducing Agents"
    ]
  },
  {
    number: "9",
    title: "Hydrogen",
    topics: [
      "Preparation and Properties of Hydrogen",
      "Preparation and Properties of Water",
      "Preparation and Properties of Hydrogen Peroxide"
    ]
  },
  {
    number: "10",
    title: "The s-Block Elements",
    topics: [
      "Preparation and Properties of Alkali Metals and Their Compounds",
      "Some Important Compounds of Sodium",
      "Preparation and Properties of Alkaline Earth Metals and Their Compounds",
      "Some Important Compounds of Calcium"
    ]
  },
  {
    number: "11",
    title: "The p-Block Elements (Group 13 & 14)",
    topics: [
      "Boron Family",
      "Carbon Family"
    ]
  },
  {
    number: "12",
    title: "Organic Chemistry – Some Basic Principles and Techniques",
    topics: [
      "Classification and Nomenclature of Organic Compounds",
      "Isomerism in Organic Compounds",
      "Concept of Reaction Mechanism in Organic Compounds"
    ]
  },
  {
    number: "13",
    title: "Hydrocarbons",
    topics: [
      "Alkanes",
      "Alkenes",
      "Alkynes",
      "Aromatic Hydrocarbons"
    ]
  },
  {
    number: "14",
    title: "Environmental Chemistry",
    topics: [
      "Air Pollution",
      "Water and Soil Pollution"
    ]
  },
  {
    number: "15",
    title: "The Solid State",
    topics: [
      "Properties and Types of Solids",
      "Crystal Structure of Solids",
      "Cubic System and Bragg's Equation",
      "Imperfections in Solids"
    ]
  },
  {
    number: "16",
    title: "Solutions",
    topics: [
      "Solubility and Concentration of Solutions",
      "Vapour Pressure, Laws of Solutions, Ideal and Non-ideal Solutions",
      "Colligative Properties and Abnormal Molecular Masses"
    ]
  },
  {
    number: "17",
    title: "Electrochemistry",
    topics: [
      "Conductance and Conductivity",
      "Electrolysis and Types of Electrolysis",
      "Cells and Electrode Potential, Nernst Equation",
      "Commercial Cells and Corrosion"
    ]
  },
  {
    number: "18",
    title: "Chemical Kinetics",
    topics: [
      "Rate of Reaction, Rate Laws, and Rate Constant",
      "Order of Reaction and Half-Life Period",
      "Theories of Rate of Reaction"
    ]
  },
  {
    number: "19",
    title: "Surface Chemistry",
    topics: [
      "Adsorption",
      "Catalysis and Theories of Catalysis",
      "Colloids and Emulsions"
    ]
  },
  {
    number: "20",
    title: "General Principles and Processes of Isolation of Elements",
    topics: [
      "Occurrence of Metals",
      "Metallurgical Processes",
      "Purification and Uses of Metals"
    ]
  },
  {
    number: "21",
    title: "The p-Block Elements (Group 15, 16, 17, and 18)",
    topics: [
      "Nitrogen Family",
      "Oxygen Family",
      "Halogen Family",
      "Noble Gases"
    ]
  },
  {
    number: "22",
    title: "The d- and f-Block Elements",
    topics: [
      "Characteristics of d-Block Elements",
      "Compounds of Transition Metals",
      "Lanthanoids and Actinoids"
    ]
  },
  {
    number: "23",
    title: "Coordination Compounds",
    topics: [
      "Coordination Number, Nomenclature, and Isomerism of Coordination Compounds",
      "Magnetic Moment, Valence Bond Theory, and Crystal Field Theory",
      "Organometallic Compounds"
    ]
  },
  {
    number: "24",
    title: "Haloalkanes and Haloarenes",
    topics: [
      "Preparation and Properties of Haloalkanes",
      "Preparation and Properties of Haloarenes",
      "Some Important Polyhalogen Compounds"
    ]
  },
  {
    number: "25",
    title: "Alcohols, Phenols, and Ethers",
    topics: [
      "Preparation and Properties of Alcohols",
      "Preparation and Properties of Phenols",
      "Preparation and Properties of Ethers"
    ]
  },
  {
    number: "26",
    title: "Aldehydes, Ketones, and Carboxylic Acids",
    topics: [
      "Methods of Preparation of Carbonyl Compounds",
      "Properties of Carbonyl Compounds",
      "Preparation and Properties of Carboxylic Acids"
    ]
  },
  {
    number: "27",
    title: "Amines",
    topics: [
      "Aliphatic and Aromatic Amines",
      "Amides, Cyanides, and Isocyanides",
      "Nitrocompounds, Alkyl Nitrites, and Diazonium Salts"
    ]
  },
  {
    number: "28",
    title: "Biomolecules",
    topics: [
      "Carbohydrates and Lipids",
      "Amino Acids and Proteins",
      "Nucleic Acids and Enzymes",
      "Vitamins and Hormones"
    ]
  },
  {
    number: "29",
    title: "Polymers",
    topics: [
      "Classification of Polymers",
      "Preparation and Properties of Polymers"
    ]
  },
  {
    number: "30",
    title: "Chemistry in Everyday Life",
    topics: [
      "Chemicals in Food",
      "Cleansing Agents",
      "Medicines and Drugs"
    ]
  },
  {
    number: "31",
    title: "Nuclear Chemistry",
    topics: [
      "Nuclear Reactions and Radioactivity",
      "Nuclear Fission and Fusion",
      "Applications of Nuclear Chemistry"
    ]
  }
];

const biologyTopics = [
  {
    number: "1",
    title: "The Living World",
    topics: [
      "Characteristics of Living Organisms",
      "Classification and Taxonomic Categories",
      "Taxonomical Aids"
    ]
  },
  {
    number: "2",
    title: "Biological Classification",
    topics: [
      "Five Kingdom Classification",
      "Monera",
      "Protista",
      "Fungi",
      "Viruses, Viroids, and Prions",
      "Lichens"
    ]
  },
  {
    number: "3",
    title: "Plant Kingdom",
    topics: [
      "Algae",
      "Bryophytes",
      "Pteridophytes",
      "Gymnosperms",
      "Angiosperms"
    ]
  },
  {
    number: "4",
    title: "Animal Kingdom",
    topics: [
      "Basis of Classification",
      "Porifera, Cnidaria, Platyhelminthes, Aschelminthes",
      "Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata, Chordata",
      "Cyclostomata, Chondrichthyes, Osteichthyes",
      "Amphibia, Reptilia, Aves, Mammalia"
    ]
  },
  {
    number: "5",
    title: "Morphology of Flowering Plants",
    topics: [
      "Root",
      "Stem",
      "Leaf",
      "Inflorescence and Flower",
      "Fruit and Seed",
      "Families: Fabaceae, Solanaceae, Liliaceae"
    ]
  },
  {
    number: "6",
    title: "Anatomy of Flowering Plants",
    topics: [
      "Meristematic and Simple Tissue",
      "Tissue System (Epidermal, Ground, Vascular) and Complex Tissue",
      "Dicot/Monocot (Root, Stem, Leaf)",
      "Secondary Growth"
    ]
  },
  {
    number: "7",
    title: "Structural Organisation in Animals",
    topics: [
      "Animal Tissues (Epithelial, Connective, Muscular, Neural)",
      "Cockroach, Earthworm, and Frog"
    ]
  },
  {
    number: "8",
    title: "Cell: The Unit of Life",
    topics: [
      "Prokaryotic Cells (Cell Envelope, Ribosomes, Inclusion Bodies)",
      "Eukaryotic Cells (Cell Organelles)"
    ]
  },
  {
    number: "9",
    title: "Biomolecules",
    topics: [
      "Essential Molecules of Biological Systems",
      "Proteins and Amino Acids",
      "Fats and Lipids",
      "Nucleic Acids and Nucleotides",
      "Enzymes and Cofactors",
      "Saccharides"
    ]
  },
  {
    number: "10",
    title: "Cell Cycle and Cell Division",
    topics: [
      "Phases of Cell Cycle (Interphase)",
      "M-phase and Cytokinesis",
      "Meiosis I and II"
    ]
  },
  {
    number: "11",
    title: "Transport in Plants",
    topics: [
      "Diffusion and Active Transport",
      "Water Potential and Osmosis",
      "Transport of Water in Plants",
      "Transpiration",
      "Phloem Transport"
    ]
  },
  {
    number: "12",
    title: "Mineral Nutrition",
    topics: [
      "Essential Mineral Elements",
      "Plant Diseases and Mineral Absorption",
      "Nitrogen Metabolism"
    ]
  },
  {
    number: "13",
    title: "Photosynthesis",
    topics: [
      "Photosynthetic Apparatus",
      "Light Reaction",
      "Calvin Cycle (C3), C4 Pathway, and Photorespiration"
    ]
  },
  {
    number: "14",
    title: "Respiration in Plants",
    topics: [
      "Aerobic Respiration",
      "Glycolysis and Fermentation",
      "Krebs Cycle, Electron Transport Chain, and Chemiosmosis",
      "Respiratory Quotient"
    ]
  },
  {
    number: "15",
    title: "Plant Growth and Development",
    topics: [
      "Growth, Differentiation, Dedifferentiation & Redifferentiation",
      "Plant Growth Regulators",
      "Photoperiodism and Vernalization"
    ]
  },
  {
    number: "16",
    title: "Digestion and Absorption",
    topics: [
      "Human Digestive System",
      "Digestion and Absorption of Food",
      "Disorders of the Digestive System"
    ]
  },
  {
    number: "17",
    title: "Breathing and Exchange of Gases",
    topics: [
      "Respiratory Organs and Mechanism of Breathing",
      "Exchange and Transport of Gases",
      "Disorders of the Respiratory System"
    ]
  },
  {
    number: "18",
    title: "Body Fluids and Circulation",
    topics: [
      "Blood and Lymph",
      "Circulatory Pathways and Double Circulation",
      "Regulation of Cardiac Activity",
      "Disorders of Circulatory System"
    ]
  },
  {
    number: "19",
    title: "Excretory Products and Their Elimination",
    topics: [
      "Excretory Products in Animals",
      "Human Excretory System"
    ]
  },
  {
    number: "20",
    title: "Locomotion and Movement",
    topics: [
      "Types of Movement",
      "Skeletal System and Joints",
      "Disorders of Muscular and Skeletal Systems"
    ]
  },
  {
    number: "21",
    title: "Neural Control and Coordination",
    topics: [
      "Neural System",
      "Reflex Action and Reflex Arc",
      "Sensory Reception and Processing"
    ]
  },
  {
    number: "22",
    title: "Chemical Coordination and Regulation",
    topics: [
      "Human Endocrine System",
      "Mechanism of Hormone Action"
    ]
  },
  {
    number: "23",
    title: "Reproduction in Organisms",
    topics: [
      "Asexual Reproduction",
      "Sexual Reproduction"
    ]
  },
  {
    number: "24",
    title: "Sexual Reproduction in Flowering Plants",
    topics: [
      "Flower and Pre-fertilization Events",
      "Double Fertilization",
      "Post-fertilization Events",
      "Apomixis and Polyembryony"
    ]
  },
  {
    number: "25",
    title: "Human Reproduction",
    topics: [
      "Male Reproductive System",
      "Female Reproductive System",
      "Gametogenesis and Menstrual Cycle",
      "Fertilization, Implantation, Pregnancy, Parturition, and Lactation"
    ]
  },
  {
    number: "26",
    title: "Reproductive Health",
    topics: [
      "Reproductive Health and Population Control",
      "Medical Termination of Pregnancy, STDs, and Infertility"
    ]
  },
  {
    number: "27",
    title: "Principles of Inheritance and Variation",
    topics: [
      "Mendel's Laws of Inheritance",
      "Inheritance of One Gene and Two Genes",
      "Linkage and Recombination",
      "Sex Determination",
      "Mutation and Genetic Disorders"
    ]
  },
  {
    number: "28",
    title: "Molecular Basis of Inheritance",
    topics: [
      "DNA and RNA",
      "Replication, Transcription, Genetic Code, and Translation",
      "Regulation of Gene Expression"
    ]
  },
  {
    number: "29",
    title: "Evolution",
    topics: [
      "Origin of Life",
      "Evidences and Mechanisms of Evolution",
      "Adaptive Radiation",
      "Hardy-Weinberg Principle",
      "Origin and Evolution of Man"
    ]
  },
  {
    number: "30",
    title: "Human Health and Disease",
    topics: [
      "Common Diseases in Humans",
      "Immunity",
      "AIDS and Cancer",
      "Drug and Alcohol Abuse"
    ]
  },
  {
    number: "31",
    title: "Strategies for Enhancement in Food Production",
    topics: [
      "Animal Husbandry",
      "Plant Breeding",
      "Single Cell Proteins and Tissue Culture"
    ]
  },
  {
    number: "32",
    title: "Microbes in Human Welfare",
    topics: [
      "Microbes in Household, Industry, and Sewage Treatment",
      "Microbes in Biogas Production, Biocontrol, and Biofertilizers"
    ]
  },
  {
    number: "33",
    title: "Biotechnology: Principles and Processes",
    topics: [
      "Principles of Biotechnology",
      "Tools and Techniques of Recombinant DNA Technology"
    ]
  },
  {
    number: "34",
    title: "Biotechnology and Its Applications",
    topics: [
      "Applications in Agriculture and Medicine"
    ]
  },
  {
    number: "35",
    title: "Organisms and Populations",
    topics: [
      "Organism & Its Environment",
      "Population Growth, Attributes, and Interactions"
    ]
  },
  {
    number: "36",
    title: "Ecosystem",
    topics: [
      "Ecosystem Structure and Function",
      "Energy Flow, Ecological Pyramids, and Succession",
      "Nutrient Cycling and Ecosystem Services"
    ]
  },
  {
    number: "37",
    title: "Biodiversity and Conservation",
    topics: [
      "Biodiversity and Its Patterns",
      "Loss and Conservation of Biodiversity"
    ]
  },
  {
    number: "38",
    title: "Environmental Issues",
    topics: [
      "Air, Water, and Solid Waste Pollution",
      "Agrochemicals and Radioactive Waste",
      "Greenhouse Effect, Global Warming, Ozone Depletion, and Deforestation"
    ]
  }
];

function Resources() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Physics videos
  const physicsVideos = [
    {
      id: 1,
      title: "UNITS AND MEASUREMENTS",
      url: "https://youtu.be/iKirxmlGkRs?si=1kQBcwlGvgzcW7cl",
      embedId: "iKirxmlGkRs",
      thumbnail: `https://img.youtube.com/vi/iKirxmlGkRs/hqdefault.jpg`,
      topic: "Units and Measurements",
      duration: "1:45:27",
      channel: "Brainymedic NEET"
    },
    {
      id: 2,
      title: "MOTION IN A STRAIGHT LINE",
      url: "https://youtu.be/MaLum2A9WzA?si=aVsUHGxY8ffY2_Bw",
      embedId: "MaLum2A9WzA",
      thumbnail: `https://img.youtube.com/vi/MaLum2A9WzA/hqdefault.jpg`,
      topic: "Motion in a Straight Line",
      duration: "2:30:15",
      channel: "Brainymedic NEET"
    },
    {
      id: 3,
      title: "Motion in a Plane",
      url: "https://www.youtube.com/live/ZIn7NLjAC-w?si=dvSvHRN5JO_O_7Cl",
      embedId: "ZIn7NLjAC-w",
      thumbnail: `https://img.youtube.com/vi/ZIn7NLjAC-w/hqdefault.jpg`,
      topic: "Motion in a Plane",
      duration: "3:12:48",
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 4,
      title: "Laws Of Motion",
      url: "https://www.youtube.com/live/V6iS7gKlAFY?si=bBwVZ4VQEsA8RzI7",
      embedId: "V6iS7gKlAFY",
      thumbnail: `https://img.youtube.com/vi/V6iS7gKlAFY/hqdefault.jpg`,
      topic: "Laws of Motion",
      duration: "2:45:30",
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 5.1,
      title: "Work Energy and Power - Part 1",
      url: "https://www.youtube.com/live/JxBJJQj7N1M?si=C1azx_FHLUMQdpsS",
      embedId: "JxBJJQj7N1M",
      thumbnail: `https://img.youtube.com/vi/JxBJJQj7N1M/hqdefault.jpg`,
      topic: "Work Energy and Power",
      duration: "1:35:42",
      series: "Work Energy and Power",
      part: 1,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 5.2,
      title: "Work Energy and Power - Part 2",
      url: "https://www.youtube.com/live/jstXarUV1Zg?si=5YtLAZ8ZkG48IrRr",
      embedId: "jstXarUV1Zg",
      thumbnail: `https://img.youtube.com/vi/jstXarUV1Zg/hqdefault.jpg`,
      topic: "Work Energy and Power",
      duration: "1:42:18",
      series: "Work Energy and Power",
      part: 2,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 5.3,
      title: "Work Energy and Power - Part 3",
      url: "https://www.youtube.com/live/XDQ7SaCgVYA?si=CP2pCBFukOe-LyoH",
      embedId: "XDQ7SaCgVYA",
      thumbnail: `https://img.youtube.com/vi/XDQ7SaCgVYA/hqdefault.jpg`,
      topic: "Work Energy and Power",
      duration: "1:48:05",
      series: "Work Energy and Power",
      part: 3,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 5.4,
      title: "Work Energy and Power - Part 4",
      url: "https://www.youtube.com/live/2DP4uAI2bJ0?si=if66U1SGMCk0SASj",
      embedId: "2DP4uAI2bJ0",
      thumbnail: `https://img.youtube.com/vi/2DP4uAI2bJ0/hqdefault.jpg`,
      topic: "Work Energy and Power",
      duration: "1:55:22",
      series: "Work Energy and Power",
      part: 4,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 6,
      title: "System of particles & Rotational Motion",
      url: "https://youtu.be/25fVyZ0NMes?si=GV_obGr9QQtQsFQd",
      embedId: "25fVyZ0NMes",
      thumbnail: `https://img.youtube.com/vi/25fVyZ0NMes/hqdefault.jpg`,
      topic: "Rotational Motion",
      duration: "2:10:47",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 7.1,
      title: "Gravitation - Part 1",
      url: "https://www.youtube.com/live/JNWdOCPDKbM?si=iHuXnLQJYlZgPjsw",
      embedId: "JNWdOCPDKbM",
      thumbnail: `https://img.youtube.com/vi/JNWdOCPDKbM/hqdefault.jpg`,
      topic: "Gravitation",
      duration: "1:38:42",
      series: "Gravitation",
      part: 1,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 7.2,
      title: "Gravitation - Part 2",
      url: "https://www.youtube.com/live/Zi0D0r2n8v4?si=yCiv7oXB8tV7_V3o",
      embedId: "Zi0D0r2n8v4",
      thumbnail: `https://img.youtube.com/vi/Zi0D0r2n8v4/hqdefault.jpg`,
      topic: "Gravitation",
      duration: "1:45:18",
      series: "Gravitation",
      part: 2,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 8,
      title: "Mechanical Properties of Solids",
      url: "https://youtu.be/6AwxRFrC3QE?si=mAcuIhQJ74_0Vmt0",
      embedId: "6AwxRFrC3QE",
      thumbnail: `https://img.youtube.com/vi/6AwxRFrC3QE/hqdefault.jpg`,
      topic: "Mechanical Properties",
      duration: "2:28:33",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 9.1,
      title: "Properties of Fluid - Part 1",
      url: "https://www.youtube.com/live/9gDaGaAEeOA?si=JlOurGOhKp7ryxjE",
      embedId: "9gDaGaAEeOA",
      thumbnail: `https://img.youtube.com/vi/9gDaGaAEeOA/hqdefault.jpg`,
      topic: "Fluid Properties",
      duration: "1:47:29",
      series: "Properties of Fluid",
      part: 1,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 9.2,
      title: "Properties of Fluid - Part 2",
      url: "https://www.youtube.com/live/ug3D0Tw8uVI?si=3HGowfod8ZAjxY4E",
      embedId: "ug3D0Tw8uVI",
      thumbnail: `https://img.youtube.com/vi/ug3D0Tw8uVI/hqdefault.jpg`,
      topic: "Fluid Properties",
      duration: "1:51:53",
      series: "Properties of Fluid",
      part: 2,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 9.3,
      title: "Properties of Fluid - Part 3",
      url: "https://www.youtube.com/live/U0e6NPFfKIw?si=2Dustntd1YRS4UAk",
      embedId: "U0e6NPFfKIw",
      thumbnail: `https://img.youtube.com/vi/U0e6NPFfKIw/hqdefault.jpg`,
      topic: "Fluid Properties",
      duration: "1:58:04",
      series: "Properties of Fluid",
      part: 3,
      channel: "Vedantu NEET Vaathi"
    },
    {
      id: 10,
      title: "Thermal Properties of Matter",
      url: "https://youtu.be/n4Wp-KSwtBM",
      embedId: "n4Wp-KSwtBM",
      thumbnail: `https://img.youtube.com/vi/n4Wp-KSwtBM/hqdefault.jpg`,
      topic: "Thermal Properties",
      duration: "2:20:15",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 11,
      title: "Thermodynamics",
      url: "https://youtu.be/b-1VaGWgdlQ",
      embedId: "b-1VaGWgdlQ",
      thumbnail: `https://img.youtube.com/vi/b-1VaGWgdlQ/hqdefault.jpg`,
      topic: "Thermodynamics",
      duration: "2:31:08",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 12,
      title: "Kinetic Theory",
      url: "https://youtu.be/V5kzbt6TGtI",
      embedId: "V5kzbt6TGtI",
      thumbnail: `https://img.youtube.com/vi/V5kzbt6TGtI/hqdefault.jpg`,
      topic: "Kinetic Theory",
      duration: "1:52:39",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 13,
      title: "Oscillations",
      url: "https://youtu.be/OVarluRBBeM",
      embedId: "OVarluRBBeM",
      thumbnail: `https://img.youtube.com/vi/OVarluRBBeM/hqdefault.jpg`,
      topic: "Oscillations",
      duration: "2:45:19",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 14,
      title: "Waves",
      url: "https://youtu.be/db0tlXybDgg",
      embedId: "db0tlXybDgg",
      thumbnail: `https://img.youtube.com/vi/db0tlXybDgg/hqdefault.jpg`,
      topic: "Waves",
      duration: "2:32:41",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 15,
      title: "Electric Charges & Fields",
      url: "https://youtu.be/ZkVSmJ62DtU",
      embedId: "ZkVSmJ62DtU",
      thumbnail: `https://img.youtube.com/vi/ZkVSmJ62DtU/hqdefault.jpg`,
      topic: "Electric Charges",
      duration: "2:55:10",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 16,
      title: "Electrostatic Potential and Capacitance",
      url: "https://youtu.be/ljTjKmaspCk",
      embedId: "ljTjKmaspCk",
      thumbnail: `https://img.youtube.com/vi/ljTjKmaspCk/hqdefault.jpg`,
      topic: "Electrostatics",
      duration: "2:46:32",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 17,
      title: "Current Electricity",
      url: "https://youtu.be/cHABOVlvWQg",
      embedId: "cHABOVlvWQg",
      thumbnail: `https://img.youtube.com/vi/cHABOVlvWQg/hqdefault.jpg`,
      topic: "Current Electricity",
      duration: "2:58:47",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 18,
      title: "Moving Charges And Magnetism",
      url: "https://youtu.be/6LX7fH5a6Vk",
      embedId: "6LX7fH5a6Vk",
      thumbnail: `https://img.youtube.com/vi/6LX7fH5a6Vk/hqdefault.jpg`,
      topic: "Magnetism",
      duration: "2:38:55",
      channel: "Xylem NEET Tamil"
    },
    {
      id: 19,
      title: "Magnetism and Matter",
      url: "https://youtu.be/FTWfy-jvVGE",
      embedId: "FTWfy-jvVGE",
      thumbnail: `https://img.youtube.com/vi/FTWfy-jvVGE/hqdefault.jpg`,
      topic: "Magnetism",
      duration: "2:24:18",
      channel: "Xylem NEET Tamil"
    }
  ];

  // Chemistry videos
  const chemistryVideos = [
    {
      id: 101,
      title: "Basic Concepts of Chemistry",
      url: "https://youtu.be/XS6PiRxrYs4",
      embedId: "XS6PiRxrYs4",
      thumbnail: `https://img.youtube.com/vi/XS6PiRxrYs4/hqdefault.jpg`,
      topic: "Basic Concepts",
      duration: "2:15:30",
      channel: "NEET Chemistry"
    },
    {
      id: 102,
      title: "Structure of Atom",
      url: "https://youtu.be/lQJUmQ4Fy-s",
      embedId: "lQJUmQ4Fy-s",
      thumbnail: `https://img.youtube.com/vi/lQJUmQ4Fy-s/hqdefault.jpg`,
      topic: "Atomic Structure",
      duration: "1:45:10",
      channel: "NEET Chemistry"
    },
    {
      id: 103,
      title: "Periodic Table & Periodicity",
      url: "https://youtu.be/6B6gG1aU3Uk",
      embedId: "6B6gG1aU3Uk",
      thumbnail: `https://img.youtube.com/vi/6B6gG1aU3Uk/hqdefault.jpg`,
      topic: "Periodic Table",
      duration: "1:32:18",
      channel: "Unacademy NEET"
    },
    {
      id: 104,
      title: "Chemical Bonding",
      url: "https://youtu.be/rK18ULAsyeE",
      embedId: "rK18ULAsyeE",
      thumbnail: `https://img.youtube.com/vi/rK18ULAsyeE/hqdefault.jpg`,
      topic: "Chemical Bonding",
      duration: "2:05:24",
      channel: "Vedantu NEET"
    }
  ];

  // Botany videos
  const botanyVideos = [
    {
      id: 201,
      title: "The Living World",
      url: "https://youtu.be/cQO4xACHJ7w",
      embedId: "cQO4xACHJ7w",
      thumbnail: `https://img.youtube.com/vi/cQO4xACHJ7w/hqdefault.jpg`,
      topic: "Living World",
      duration: "1:30:45",
      channel: "NEET Botany"
    },
    {
      id: 202,
      title: "Biological Classification",
      url: "https://youtu.be/NoHC-3wnntA",
      embedId: "NoHC-3wnntA",
      thumbnail: `https://img.youtube.com/vi/NoHC-3wnntA/hqdefault.jpg`,
      topic: "Classification",
      duration: "2:05:20",
      channel: "NEET Botany"
    },
    {
      id: 203,
      title: "Plant Kingdom",
      url: "https://youtu.be/gZcrnUKSxus",
      embedId: "gZcrnUKSxus",
      thumbnail: `https://img.youtube.com/vi/gZcrnUKSxus/hqdefault.jpg`,
      topic: "Plant Kingdom",
      duration: "1:58:37",
      channel: "Vedantu NEET"
    },
    {
      id: 204,
      title: "Cell Structure and Functions",
      url: "https://youtu.be/_4BPcXq6qyc",
      embedId: "_4BPcXq6qyc",
      thumbnail: `https://img.youtube.com/vi/_4BPcXq6qyc/hqdefault.jpg`,
      topic: "Cell Biology",
      duration: "2:21:15",
      channel: "Unacademy NEET"
    }
  ];

  // Zoology videos
  const zoologyVideos = [
    {
      id: 301,
      title: "Animal Kingdom",
      url: "https://youtu.be/tV9wZRLiGdA",
      embedId: "tV9wZRLiGdA",
      thumbnail: `https://img.youtube.com/vi/tV9wZRLiGdA/hqdefault.jpg`,
      topic: "Animal Kingdom",
      duration: "2:25:40",
      channel: "NEET Zoology"
    },
    {
      id: 302,
      title: "Structural Organization in Animals",
      url: "https://youtu.be/l9YbcDnrh9A",
      embedId: "l9YbcDnrh9A",
      thumbnail: `https://img.youtube.com/vi/l9YbcDnrh9A/hqdefault.jpg`,
      topic: "Animal Structure",
      duration: "1:55:15",
      channel: "NEET Zoology"
    },
    {
      id: 303,
      title: "Human Physiology: Digestion & Absorption",
      url: "https://youtu.be/TJ_oBCpPCrQ",
      embedId: "TJ_oBCpPCrQ",
      thumbnail: `https://img.youtube.com/vi/TJ_oBCpPCrQ/hqdefault.jpg`,
      topic: "Human Physiology",
      duration: "2:10:32",
      channel: "Vedantu NEET"
    },
    {
      id: 304,
      title: "Neural Control and Coordination",
      url: "https://youtu.be/0iVWSmVN8j8",
      embedId: "0iVWSmVN8j8",
      thumbnail: `https://img.youtube.com/vi/0iVWSmVN8j8/hqdefault.jpg`,
      topic: "Neural Control",
      duration: "2:32:48",
      channel: "Unacademy NEET"
    }
  ];

  // Get videos based on active tab
  const getVideos = () => {
    switch (activeTab) {
      case 0:
        return physicsVideos;
      case 1:
        return chemistryVideos;
      case 2:
        return botanyVideos;
      case 3:
        return zoologyVideos;
      default:
        return physicsVideos;
    }
  };

  // Filter videos based on search query
  const filteredVideos = getVideos().filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.series && video.series.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group videos by series where applicable
  const groupedVideos = {};
  filteredVideos.forEach(video => {
    if (video.series) {
      if (!groupedVideos[video.series]) {
        groupedVideos[video.series] = [];
      }
      groupedVideos[video.series].push(video);
    }
  });

  // Sort series videos by part number
  Object.keys(groupedVideos).forEach(series => {
    groupedVideos[series].sort((a, b) => a.part - b.part);
  });

  // Get standalone videos (not part of a series)
  const standaloneVideos = filteredVideos.filter(video => !video.series);

  // Find all unique topics
  const topics = [...new Set(filteredVideos.map(video => video.topic))];

  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          <BookmarksIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Learning Resources
        </Typography>
        <TextField
          placeholder="Search videos..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="subject tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ScienceIcon />} 
            label="Physics" 
            iconPosition="start"
            sx={{ fontWeight: activeTab === 0 ? 'bold' : 'normal' }} 
          />
          <Tab 
            icon={<ChemistryIcon />} 
            label="Chemistry" 
            iconPosition="start"
            sx={{ fontWeight: activeTab === 1 ? 'bold' : 'normal' }} 
          />
          <Tab 
            icon={<BiotechIcon />} 
            label="Botany" 
            iconPosition="start"
            sx={{ fontWeight: activeTab === 2 ? 'bold' : 'normal' }} 
          />
          <Tab 
            icon={<PetsIcon />} 
            label="Zoology" 
            iconPosition="start"
            sx={{ fontWeight: activeTab === 3 ? 'bold' : 'normal' }} 
          />
        </Tabs>
      </Paper>

      {topics.length > 0 && (
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {topics.map(topic => (
            <Chip 
              key={topic}
              label={topic}
              onClick={() => setSearchQuery(topic)}
              color={searchQuery === topic ? "primary" : "default"}
              variant={searchQuery === topic ? "filled" : "outlined"}
              sx={{ m: 0.5 }}
            />
          ))}
          {searchQuery && (
            <Chip 
              label="Clear filters"
              onClick={() => setSearchQuery('')}
              color="secondary"
              variant="outlined"
              sx={{ m: 0.5 }}
            />
          )}
        </Box>
      )}

      {Object.keys(groupedVideos).length > 0 && (
        <Box sx={{ mb: 4 }}>
          {Object.keys(groupedVideos).map(series => (
            <Box key={series} sx={{ mb: 4 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                {series}
              </Typography>
              <Grid container spacing={3}>
                {groupedVideos[series].map(video => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
                    <Card 
                      elevation={3}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardActionArea onClick={() => handleVideoClick(video)}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={video.thumbnail}
                            alt={video.title}
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            right: 0, 
                            bgcolor: 'rgba(0,0,0,0.7)', 
                            color: 'white',
                            px: 1,
                            borderTopLeftRadius: 4
                          }}>
                            {video.duration}
                          </Box>
                          <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            opacity: 0.8
                          }}>
                            <PlayIcon sx={{ fontSize: 50, color: 'white' }} />
                          </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                            {video.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            {video.channel}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label={`Part ${video.part}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <Chip 
                              label={video.topic} 
                              size="small" 
                              variant="outlined" 
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {standaloneVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardActionArea onClick={() => handleVideoClick(video)}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    bgcolor: 'rgba(0,0,0,0.7)', 
                    color: 'white',
                    px: 1,
                    borderTopLeftRadius: 4
                  }}>
                    {video.duration}
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.8
                  }}>
                    <PlayIcon sx={{ fontSize: 50, color: 'white' }} />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                    {video.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {video.channel}
                  </Typography>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Chip 
                      label={video.topic} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredVideos.length === 0 && (
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 2
        }}>
          <Typography variant="h6" color="text.secondary" align="center">
            No videos found matching your search.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Try using different keywords or clear your search.
          </Typography>
        </Box>
      )}

      <Dialog
        open={Boolean(selectedVideo)}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={handleCloseVideo} color="primary">
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedVideo && (
            <>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 1,
                  mb: 2,
                  maxWidth: "100%",
                }}
              >
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  src={`https://www.youtube.com/embed/${selectedVideo.embedId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedVideo.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {selectedVideo.channel}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={selectedVideo.topic} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={selectedVideo.duration} 
                    variant="outlined"
                    size="small"
                    icon={<TimerIcon fontSize="small" />}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Watch this video to improve your understanding of {selectedVideo.topic} for NEET examination. 
                  This comprehensive lesson covers all important concepts required for the exam.
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Resources; 