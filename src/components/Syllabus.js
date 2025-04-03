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
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

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

const Syllabus = () => {
  const [selectedSubject, setSelectedSubject] = useState(0);
  const theme = useTheme();

  const handleSubjectChange = (event, newValue) => {
    setSelectedSubject(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={selectedSubject}
          onChange={handleSubjectChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Physics" />
          <Tab label="Chemistry" />
          <Tab label="Biology" />
        </Tabs>
      </Paper>

      {selectedSubject === 0 && (
        <Box>
          {physicsTopics.map((chapter, index) => (
            <StyledAccordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TopicNumber>{chapter.number}</TopicNumber>
                  <TopicTitle>{chapter.title}</TopicTitle>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {chapter.topics.map((topic, topicIndex) => (
                    <ListItem key={topicIndex}>
                      <SubTopic primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      )}

      {selectedSubject === 1 && (
        <Box>
          {chemistryTopics.map((chapter, index) => (
            <StyledAccordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TopicNumber>{chapter.number}</TopicNumber>
                  <TopicTitle>{chapter.title}</TopicTitle>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {chapter.topics.map((topic, topicIndex) => (
                    <ListItem key={topicIndex}>
                      <SubTopic primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      )}

      {selectedSubject === 2 && (
        <Box>
          {biologyTopics.map((chapter, index) => (
            <StyledAccordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TopicNumber>{chapter.number}</TopicNumber>
                  <TopicTitle>{chapter.title}</TopicTitle>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {chapter.topics.map((topic, topicIndex) => (
                    <ListItem key={topicIndex}>
                      <SubTopic primary={topic} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Syllabus; 