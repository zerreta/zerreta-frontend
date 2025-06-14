import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as MedicalIcon,
  Engineering as EngineeringIcon,
  Business as BusinessIcon,
  Gavel as LawIcon,
  Palette as ArtsIcon,
  Science as ScienceIcon,
  Computer as ITIcon,
  AccountBalance as GovernmentIcon,
  LocalHospital as HealthIcon,
  FlightTakeoff as AviationIcon,
  Security as DefenseIcon
} from '@mui/icons-material';

const CareerGuidance = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  // Comprehensive Career Data with 100x more details
  const careerPaths = {
    '10th': {
      streams: [
        {
          name: 'Science Stream (PCM/PCB)',
          subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
          eligibility: 'Min 60% in 10th',
          duration: '2 Years',
          futureOptions: ['Engineering (200+ branches)', 'Medical (50+ fields)', 'Pure Sciences (30+ specializations)', 'Research', 'Defense', 'Aviation']
        },
        {
          name: 'Commerce Stream',
          subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics (Optional)', 'English'],
          eligibility: 'Min 50% in 10th',
          duration: '2 Years',
          futureOptions: ['CA/CS/CMA', 'BBA/B.Com', 'Banking', 'Finance', 'Management', 'Entrepreneurship']
        },
        {
          name: 'Arts/Humanities',
          subjects: ['History', 'Geography', 'Political Science', 'Psychology', 'Literature', 'Philosophy'],
          eligibility: 'Min 45% in 10th',
          duration: '2 Years',
          futureOptions: ['BA', 'Law', 'Journalism', 'Social Work', 'Civil Services', 'Teaching']
        }
      ]
    },
    engineering: {
      branches: [
        {
          name: 'Computer Science & Engineering',
          specializations: ['AI/ML', 'Data Science', 'Cybersecurity', 'Web Development', 'Mobile App Dev', 'Blockchain', 'IoT', 'Cloud Computing'],
          entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE', 'COMEDK'],
          topColleges: ['IIT Delhi', 'IIT Bombay', 'IIT Kanpur', 'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad'],
          salaryRange: '₹3-50 LPA',
          jobRoles: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'Product Manager', 'Tech Lead', 'CTO'],
          companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Adobe', 'Uber'],
          skills: ['Programming (Python/Java/C++)', 'DSA', 'System Design', 'Database', 'Cloud', 'DevOps']
        },
        {
          name: 'Electrical & Electronics',
          specializations: ['Power Systems', 'Control Systems', 'Electronics', 'Telecommunications', 'Renewable Energy', 'Robotics'],
          entranceExams: ['JEE Main', 'JEE Advanced', 'GATE'],
          topColleges: ['IIT Madras', 'IIT Kharagpur', 'NIT Warangal', 'VJTI Mumbai', 'PSG Coimbatore'],
          salaryRange: '₹2.5-25 LPA',
          jobRoles: ['Electrical Engineer', 'Power Engineer', 'Control Engineer', 'Research Scientist'],
          companies: ['BHEL', 'NTPC', 'PowerGrid', 'Siemens', 'ABB', 'Schneider Electric'],
          skills: ['Circuit Design', 'Power Systems', 'MATLAB', 'AutoCAD', 'PLC Programming']
        },
        {
          name: 'Mechanical Engineering',
          specializations: ['Automotive', 'Aerospace', 'Manufacturing', 'Thermal', 'Design', 'Robotics', 'Mechatronics'],
          entranceExams: ['JEE Main', 'JEE Advanced'],
          topColleges: ['IIT Bombay', 'IIT Madras', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore'],
          salaryRange: '₹2-20 LPA',
          jobRoles: ['Design Engineer', 'Production Engineer', 'Quality Engineer', 'R&D Engineer'],
          companies: ['Tata Motors', 'Mahindra', 'Bajaj', 'L&T', 'Godrej', 'Bosch'],
          skills: ['CAD/CAM', 'SolidWorks', 'AutoCAD', 'Manufacturing', 'Thermodynamics']
        },
        {
          name: 'Civil Engineering',
          specializations: ['Structural', 'Transportation', 'Environmental', 'Geotechnical', 'Water Resources', 'Construction Management'],
          entranceExams: ['JEE Main', 'JEE Advanced'],
          topColleges: ['IIT Roorkee', 'IIT Madras', 'NIT Trichy', 'VJTI Mumbai', 'Thapar University'],
          salaryRange: '₹2-15 LPA',
          jobRoles: ['Site Engineer', 'Project Manager', 'Structural Engineer', 'Urban Planner'],
          companies: ['L&T', 'DLF', 'Godrej Properties', 'Shapoorji Pallonji', 'Punj Lloyd'],
          skills: ['AutoCAD', 'Staad Pro', 'Project Management', 'Site Planning', 'Surveying']
        }
      ]
    },
    medical: {
      courses: [
        {
          name: 'MBBS (Bachelor of Medicine)',
          duration: '5.5 years + 1 year internship',
          entrance: 'NEET UG',
          seats: '83,075 (All India)',
          eligibility: 'Physics, Chemistry, Biology + English',
          topColleges: ['AIIMS Delhi', 'JIPMER', 'CMC Vellore', 'MAMC Delhi', 'Grant Medical College'],
          specializations: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Cardiology', 'Neurology', 'Radiology'],
          salaryRange: '₹3-50 LPA',
          careerPath: ['Junior Resident → Senior Resident → Assistant Professor → Associate Professor → Professor'],
          opportunities: ['Government Hospitals', 'Private Practice', 'Medical Research', 'Healthcare Administration']
        },
        {
          name: 'BDS (Bachelor of Dental Surgery)',
          duration: '5 years + 1 year internship',
          entrance: 'NEET UG',
          seats: '26,949 (All India)',
          eligibility: 'Physics, Chemistry, Biology + English',
          topColleges: ['Maulana Azad Institute', 'Government Dental College Mumbai', 'King George Medical University'],
          specializations: ['Oral Surgery', 'Orthodontics', 'Periodontics', 'Prosthodontics', 'Pedodontics', 'Oral Pathology'],
          salaryRange: '₹2-20 LPA',
          careerPath: ['Dental Officer → Senior Dental Officer → Chief Dental Officer'],
          opportunities: ['Private Clinic', 'Government Service', 'Dental Hospitals', 'Teaching']
        },
        {
          name: 'BAMS (Ayurvedic Medicine)',
          duration: '5.5 years + 1 year internship',
          entrance: 'NEET UG',
          seats: '52,720 (All India)',
          specializations: ['Panchakarma', 'Kayachikitsa', 'Shalyatantra', 'Prasutitantra', 'Kaumarbhritya'],
          salaryRange: '₹2-15 LPA',
          opportunities: ['Government Ayurvedic Hospitals', 'Private Practice', 'Ayurvedic Research', 'Wellness Centers']
        },
        {
          name: 'BHMS (Homeopathic Medicine)',
          duration: '5.5 years + 1 year internship',
          entrance: 'NEET UG',
          seats: '12,705 (All India)',
          specializations: ['Classical Homeopathy', 'Clinical Homeopathy', 'Pediatric Homeopathy'],
          salaryRange: '₹2-12 LPA',
          opportunities: ['Government Homeopathic Hospitals', 'Private Clinics', 'Homeopathic Pharmaceuticals']
        }
      ]
    },
    commerce: {
      professionalCourses: [
        {
          name: 'Chartered Accountancy (CA)',
          duration: '3-5 years',
          levels: ['CA Foundation', 'CA Intermediate', 'CA Final + Articleship'],
          eligibility: 'Class 12 Commerce/Any stream',
          examBody: 'ICAI',
          salaryRange: '₹6-100 LPA',
          jobRoles: ['Auditor', 'Tax Consultant', 'Financial Analyst', 'CFO', 'Finance Manager'],
          topFirms: ['Deloitte', 'PwC', 'EY', 'KPMG', 'Grant Thornton'],
          specializations: ['Taxation', 'Audit', 'Corporate Finance', 'Forensic Accounting', 'International Finance'],
          skills: ['Financial Reporting', 'Taxation Laws', 'Audit', 'Excel', 'Tally', 'SAP']
        },
        {
          name: 'Company Secretary (CS)',
          duration: '2-4 years',
          levels: ['CS Foundation', 'CS Executive', 'CS Professional'],
          examBody: 'ICSI',
          salaryRange: '₹4-50 LPA',
          jobRoles: ['Company Secretary', 'Compliance Officer', 'Legal Advisor', 'Corporate Lawyer'],
          specializations: ['Corporate Laws', 'Securities Laws', 'Banking Laws', 'Insurance Laws'],
          skills: ['Corporate Governance', 'Legal Compliance', 'Secretarial Practice']
        },
        {
          name: 'Cost & Management Accountant (CMA)',
          duration: '2-4 years',
          levels: ['CMA Foundation', 'CMA Intermediate', 'CMA Final'],
          examBody: 'ICMAI',
          salaryRange: '₹3-30 LPA',
          jobRoles: ['Cost Accountant', 'Management Accountant', 'Financial Controller'],
          specializations: ['Cost Accounting', 'Management Accounting', 'Financial Management']
        }
      ],
      businessCourses: [
        {
          name: 'BBA (Bachelor of Business Administration)',
          duration: '3 years',
          specializations: ['Finance', 'Marketing', 'HR', 'Operations', 'International Business', 'Digital Marketing'],
          topColleges: ['IIM Rohtak', 'NMIMS Mumbai', 'Christ University', 'Symbiosis Pune'],
          salaryRange: '₹2-15 LPA',
          jobRoles: ['Business Analyst', 'Marketing Executive', 'HR Executive', 'Operations Manager'],
          skills: ['Business Analytics', 'Marketing', 'Finance', 'Leadership', 'Communication']
        },
        {
          name: 'B.Com (Bachelor of Commerce)',
          duration: '3 years',
          specializations: ['Accounting & Finance', 'Banking & Insurance', 'Taxation', 'International Business'],
          careerOptions: ['Banking', 'Insurance', 'Stock Market', 'Mutual Funds', 'Corporate Finance'],
          governmentJobs: ['Bank PO', 'Insurance Officer', 'Income Tax Officer', 'Customs Officer'],
          salaryRange: '₹2-12 LPA'
        }
      ]
    },
    arts: {
      courses: [
        {
          name: 'BA English Literature',
          duration: '3 years',
          careerOptions: ['Journalism', 'Content Writing', 'Teaching', 'Publishing', 'Media', 'Civil Services'],
          specializations: ['Creative Writing', 'Literary Criticism', 'Comparative Literature'],
          salaryRange: '₹2-20 LPA',
          topColleges: ['Hindu College', 'St. Stephens', 'Presidency Kolkata', 'Fergusson Pune'],
          skills: ['Writing', 'Communication', 'Critical Thinking', 'Research']
        },
        {
          name: 'BA Psychology',
          duration: '3 years',
          careerOptions: ['Clinical Psychology', 'Counseling', 'HR', 'Market Research', 'Social Work'],
          higherStudies: ['MA Psychology', 'M.Phil', 'PhD', 'Clinical Psychology Diploma'],
          salaryRange: '₹2-25 LPA',
          specializations: ['Clinical', 'Counseling', 'Industrial', 'Educational', 'Sports Psychology'],
          skills: ['Counseling', 'Assessment', 'Research Methods', 'Statistics']
        },
        {
          name: 'BA Political Science',
          duration: '3 years',
          careerOptions: ['Civil Services', 'Politics', 'Journalism', 'International Relations', 'NGOs'],
          governmentJobs: ['IAS', 'IFS', 'IPS', 'State Civil Services'],
          salaryRange: '₹3-50 LPA',
          skills: ['Public Policy', 'International Relations', 'Research', 'Administration']
        }
      ],
      lawCourses: [
        {
          name: 'BA LLB (5 Year Integrated)',
          duration: '5 years',
          entrance: 'CLAT, AILET, LSAT',
          topColleges: ['NLS Bangalore', 'NALSAR Hyderabad', 'WBNUJS Kolkata', 'ILS Pune'],
          specializations: ['Corporate Law', 'Criminal Law', 'Constitutional Law', 'International Law', 'IPR'],
          saleerRange: '₹3-100 LPA',
          careerPaths: ['Litigation', 'Corporate Lawyer', 'Judge', 'Legal Advisor', 'Law Firm Partner'],
          topFirms: ['AZB Partners', 'Khaitan & Co', 'Shardul Amarchand', 'Cyril Amarchand']
        }
      ]
    },
    governmentJobs: {
      civilServices: [
        {
          name: 'UPSC Civil Services',
          posts: ['IAS', 'IPS', 'IFS', 'IRS', 'IRTS', 'IDAS', 'ICLS'],
          eligibility: 'Graduation in any discipline',
          ageLimit: '21-32 years (with relaxations)',
          salaryRange: '₹56,100 - ₹2,50,000 per month',
          examPattern: 'Prelims + Mains + Interview',
          attempts: '6 attempts (General), 9 (OBC), Unlimited (SC/ST)',
          preparation: '12-18 months intensive study',
          topInstitutes: ['Vajiram & Ravi', 'Vision IAS', 'Drishti IAS', 'Shankar IAS']
        },
        {
          name: 'State Public Service Commission',
          posts: ['Deputy Collector', 'DSP', 'BDO', 'Tehsildar'],
          salaryRange: '₹35,000 - ₹1,50,000 per month',
          examPattern: 'Prelims + Mains + Interview',
          states: 'All 28 states conduct separate exams'
        }
      ],
      banking: [
        {
          name: 'IBPS PO (Probationary Officer)',
          eligibility: 'Graduation in any discipline',
          salaryRange: '₹23,700 - ₹42,020 per month',
          banks: ['SBI', 'PNB', 'BOB', 'Canara Bank', 'Union Bank'],
          examPattern: 'Prelims + Mains + Interview',
          preparation: '6-12 months'
        },
        {
          name: 'SBI PO',
          salaryRange: '₹27,620 - ₹46,030 per month',
          examPattern: 'Prelims + Mains + Group Exercise + Interview',
          careerGrowth: 'PO → Assistant Manager → Deputy Manager → Assistant General Manager'
        },
        {
          name: 'RBI Grade B',
          salaryRange: '₹35,150 - ₹62,205 per month',
          eligibility: 'Graduation with 60% marks',
          examPattern: 'Prelims + Mains + Interview',
          departments: ['General', 'Economic & Policy Research', 'Statistics']
        }
      ],
      defense: [
        {
          name: 'NDA (National Defense Academy)',
          eligibility: '12th Pass (PCM for Army/Air Force, any stream for Navy)',
          ageLimit: '16.5 - 19.5 years',
          training: '3 years at NDA + 1 year at respective service academy',
          salaryRange: '₹56,100 - ₹1,77,500 per month',
          services: ['Army', 'Navy', 'Air Force']
        },
        {
          name: 'CDS (Combined Defense Services)',
          eligibility: 'Graduation',
          ageLimit: '20-25 years',
          salaryRange: '₹56,100 - ₹1,77,500 per month',
          training: '1 year at respective service academy'
        }
      ]
    },
    emergingFields: [
      {
        name: 'Artificial Intelligence & Machine Learning',
        courses: ['B.Tech AI/ML', 'M.Tech AI', 'PG Diploma in AI'],
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'Computer Vision', 'NLP'],
        jobRoles: ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Research Scientist'],
        salaryRange: '₹6-80 LPA',
        companies: ['Google', 'Microsoft', 'Amazon', 'OpenAI', 'NVIDIA', 'DeepMind'],
        growth: '35% annually',
        demand: 'Extremely High'
      },
      {
        name: 'Data Science & Analytics',
        courses: ['B.Sc Data Science', 'M.Sc Data Science', 'PG Diploma in Data Analytics'],
        skills: ['Python/R', 'SQL', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning'],
        jobRoles: ['Data Scientist', 'Data Analyst', 'Business Analyst', 'Data Engineer'],
        salaryRange: '₹4-60 LPA',
        companies: ['Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'Ola', 'IBM', 'Accenture'],
        growth: '30% annually'
      },
      {
        name: 'Cybersecurity',
        courses: ['B.Tech Cybersecurity', 'M.Tech Information Security', 'CEH', 'CISSP'],
        skills: ['Ethical Hacking', 'Network Security', 'Cloud Security', 'Penetration Testing'],
        jobRoles: ['Security Analyst', 'Ethical Hacker', 'Security Consultant', 'CISO'],
        salaryRange: '₹5-70 LPA',
        companies: ['Wipro', 'TCS', 'Quick Heal', 'K7 Computing', 'FireEye'],
        growth: '25% annually'
      },
      {
        name: 'Digital Marketing',
        courses: ['PG Diploma in Digital Marketing', 'MBA Digital Marketing'],
        skills: ['SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Google Ads', 'Analytics'],
        jobRoles: ['Digital Marketing Manager', 'SEO Specialist', 'Content Strategist', 'Social Media Manager'],
        salaryRange: '₹3-40 LPA',
        companies: ['Flipkart', 'Amazon', 'Myntra', 'Nykaa', 'BigBasket'],
        growth: '20% annually'
      }
    ]
  };

  const handlePathClick = (path) => {
    setSelectedPath(path);
    setOpenDialog(true);
  };

  const CareerCard = ({ option, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
      onClick={() => onClick(option)}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          backgroundColor: option.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'white'
        }}>
          {option.icon}
        </Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {option.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {option.description}
        </Typography>
        {option.nextSteps && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {option.nextSteps.slice(0, 2).map((step, idx) => (
              <Chip key={idx} label={step} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Flowchart Node Component
  const FlowNode = ({ title, subtitle, color, children, isRoot = false, width = 200 }) => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative'
    }}>
      <Paper sx={{
        p: 2,
        backgroundColor: color,
        color: 'white',
        borderRadius: 3,
        textAlign: 'center',
        minWidth: width,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        fontSize: isRoot ? '1.2rem' : '1rem',
        fontWeight: isRoot ? 700 : 600
      }}>
        <Typography variant={isRoot ? "h5" : "h6"} fontWeight={isRoot ? 800 : 600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {subtitle}
          </Typography>
        )}
      </Paper>
      {children && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mt: 3 
        }}>
          {/* Vertical line */}
          <Box sx={{ 
            width: 2, 
            height: 30, 
            backgroundColor: '#ddd' 
          }} />
          {children}
        </Box>
      )}
    </Box>
  );

  // Branch Component for connecting multiple nodes
  const BranchContainer = ({ children, title }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {title && (
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#666' }}>
          {title}
        </Typography>
      )}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'relative'
      }}>
        {/* Horizontal connecting line */}
        <Box sx={{
          position: 'absolute',
          top: -15,
          left: '10%',
          right: '10%',
          height: 2,
          backgroundColor: '#ddd',
          zIndex: 0
        }} />
        {children}
      </Box>
    </Box>
  );

  // Navigation tabs configuration
  const navigationTabs = [
    { id: 'overview', label: 'Career Overview', icon: <TrendingUpIcon /> },
    { id: 'engineering', label: 'Engineering (200+ Branches)', icon: <EngineeringIcon /> },
    { id: 'medical', label: 'Medical & Healthcare', icon: <MedicalIcon /> },
    { id: 'commerce', label: 'Commerce & Finance', icon: <BusinessIcon /> },
    { id: 'arts', label: 'Arts & Humanities', icon: <ArtsIcon /> },
    { id: 'government', label: 'Government Jobs', icon: <GovernmentIcon /> },
    { id: 'emerging', label: 'Emerging Fields', icon: <ITIcon /> },
    { id: 'international', label: 'Global Opportunities', icon: <AviationIcon /> }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3
      }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          🎯 Ultimate Career Guidance & Roadmap System
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          Comprehensive career guidance with 100x detailed information for every possible career path
        </Typography>
        
        {/* Enhanced Stats */}
        <Grid container spacing={3}>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>2000+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Career Options</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>150+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Entrance Exams</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>50+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Career Streams</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>5000+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Colleges Worldwide</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>100+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Countries</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700}>₹1L-5Cr</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Salary Range</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          borderBottom: 1, 
          borderColor: 'divider',
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {navigationTabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              startIcon={tab.icon}
              sx={{
                minWidth: 200,
                py: 2,
                px: 3,
                borderRadius: 0,
                backgroundColor: activeTab === tab.id ? 'primary.main' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: activeTab === tab.id ? 'primary.dark' : 'grey.100'
                }
              }}
            >
              {tab.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, overflow: 'auto' }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            📊 Complete Career Ecosystem Overview
          </Typography>
          
          {/* Visual Flowchart */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: 1200,
            py: 4
          }}>
            
            {/* Level 1: 10th Standard */}
            <FlowNode 
              title="10th Standard (S.S.C.)" 
              subtitle="Secondary School Completion - Foundation Level"
              color="#1976d2" 
              isRoot={true}
              width={350}
            />
            
            {/* Vertical spacing */}
            <Box sx={{ height: 40, width: 2, backgroundColor: '#ddd', my: 2 }} />
            
            {/* Level 2: Stream Selection */}
            <BranchContainer title="Choose Your Stream (Critical Decision Point)">
              <FlowNode title="Science Stream" color="#4caf50" width={180}>
                <BranchContainer>
                  <FlowNode title="PCM" subtitle="Physics, Chemistry, Mathematics" color="#2e7d32" width={150} />
                  <FlowNode title="PCB" subtitle="Physics, Chemistry, Biology" color="#388e3c" width={150} />
                  <FlowNode title="PCMB" subtitle="All Four Subjects" color="#1b5e20" width={150} />
                </BranchContainer>
              </FlowNode>
              
              <FlowNode title="Commerce Stream" color="#ff9800" width={180}>
                <BranchContainer>
                  <FlowNode title="With Maths" subtitle="CA/CS/Economics Path" color="#f57c00" width={150} />
                  <FlowNode title="Without Maths" subtitle="BBA/B.Com Path" color="#ff9800" width={150} />
                  <FlowNode title="Vocational" subtitle="Banking/Insurance" color="#ef6c00" width={150} />
                </BranchContainer>
              </FlowNode>
              
              <FlowNode title="Arts/Humanities" color="#9c27b0" width={180}>
                <BranchContainer>
                  <FlowNode title="Core Humanities" subtitle="History, Geography, Pol Sci" color="#7b1fa2" width={150} />
                  <FlowNode title="Languages" subtitle="Literature, Languages" color="#8e24aa" width={150} />
                  <FlowNode title="Creative Arts" subtitle="Fine Arts, Music, Dance" color="#6a1b9a" width={150} />
                </BranchContainer>
              </FlowNode>
            </BranchContainer>
            
            {/* Level 3: Higher Education Gateway */}
            <Box sx={{ height: 60, width: 2, backgroundColor: '#ddd', my: 3 }} />
            <FlowNode 
              title="12th Standard (H.S.C.) + Entrance Preparation" 
              subtitle="Gateway to Higher Education & Professional Courses"
              color="#d32f2f" 
              width={400}
            />
            
            {/* Major Career Pathways */}
            <Box sx={{ height: 40, width: 2, backgroundColor: '#ddd', my: 2 }} />
            <BranchContainer title="Major Career Pathways (100+ Options in Each)">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlowNode title="Engineering & Technology" subtitle="200+ Specializations" color="#1976d2" width={200} />
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  JEE Main/Advanced, BITSAT, State CETs
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlowNode title="Medical & Healthcare" subtitle="50+ Medical Fields" color="#e91e63" width={200} />
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  NEET UG/PG, AIIMS, JIPMER
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlowNode title="Business & Management" subtitle="Finance, Marketing, HR" color="#ff9800" width={200} />
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  CAT, MAT, XAT, SNAP
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FlowNode title="Law & Legal Studies" subtitle="Constitutional, Corporate" color="#9c27b0" width={200} />
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  CLAT, AILET, LSAT
                </Typography>
              </Box>
            </BranchContainer>
            
            {/* Career Success Levels */}
            <Box sx={{ height: 60, width: 2, backgroundColor: '#ddd', my: 3 }} />
            <FlowNode 
              title="Professional Success & Leadership" 
              subtitle="Executive, Entrepreneurial & Innovation Roles"
              color="#388e3c" 
              width={400}
            />
            
            <Box sx={{ height: 40, width: 2, backgroundColor: '#ddd', my: 2 }} />
            <BranchContainer title="Ultimate Career Destinations">
              <FlowNode title="Global Corporations" subtitle="CEO, CTO, CFO Level" color="#1565c0" width={180}>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Fortune 500" size="small" />
                    <Chip label="Unicorn Startups" size="small" />
                    <Chip label="₹50L-5Cr PA" size="small" />
                  </Stack>
                </Box>
              </FlowNode>
              
              <FlowNode title="Government Leadership" subtitle="IAS, IPS, IFS" color="#2e7d32" width={180}>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Civil Services" size="small" />
                    <Chip label="Policy Making" size="small" />
                    <Chip label="₹56K-2.5L PM" size="small" />
                  </Stack>
                </Box>
              </FlowNode>
              
              <FlowNode title="Innovation & Research" subtitle="Scientists, Researchers" color="#7b1fa2" width={180}>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Nobel Prize Track" size="small" />
                    <Chip label="Patents" size="small" />
                    <Chip label="Global Impact" size="small" />
                  </Stack>
                </Box>
              </FlowNode>
              
              <FlowNode title="Entrepreneurship" subtitle="Founders, Innovators" color="#f57c00" width={180}>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="Startup Founder" size="small" />
                    <Chip label="IPO Journey" size="small" />
                    <Chip label="Wealth Creation" size="small" />
                  </Stack>
                </Box>
              </FlowNode>
            </BranchContainer>
          </Box>
        </Paper>
      )}

      {/* Engineering Tab Content */}
      {activeTab === 'engineering' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            ⚙️ Engineering & Technology - 200+ Specializations
          </Typography>
          
          <Grid container spacing={3}>
            {careerPaths.engineering.branches.map((branch, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {branch.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      💰 Salary Range: {branch.salaryRange}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Specializations ({branch.specializations.length})</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {branch.specializations.map((spec, idx) => (
                            <Chip key={idx} label={spec} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Entrance Exams</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {branch.entranceExams.map((exam, idx) => (
                            <Chip key={idx} label={exam} variant="outlined" size="small" />
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Top Colleges</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {branch.topColleges.map((college, idx) => (
                            <Typography key={idx} variant="body2">• {college}</Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Job Roles & Companies</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="subtitle3" fontWeight={600} gutterBottom>Job Roles:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {branch.jobRoles.map((role, idx) => (
                            <Chip key={idx} label={role} size="small" color="primary" />
                          ))}
                        </Box>
                        <Typography variant="subtitle3" fontWeight={600} gutterBottom>Top Companies:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {branch.companies.map((company, idx) => (
                            <Chip key={idx} label={company} size="small" color="secondary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Required Skills</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {branch.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" variant="outlined" color="success" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Medical Tab Content */}
      {activeTab === 'medical' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            🏥 Medical & Healthcare - Complete Medical Career Guide
          </Typography>
          
          <Grid container spacing={3}>
            {careerPaths.medical.courses.map((course, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {course.name}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ⏱️ Duration: {course.duration}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          💰 Salary: {course.salaryRange}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      🎯 Entrance: {course.entrance}
                    </Typography>
                    
                    {course.seats && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        🪑 Total Seats: {course.seats}
                      </Typography>
                    )}
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Specializations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.specializations.map((spec, idx) => (
                            <Chip key={idx} label={spec} size="small" color="primary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Top Medical Colleges</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {course.topColleges.map((college, idx) => (
                            <Typography key={idx} variant="body2">• {college}</Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                    
                    {course.careerPath && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Career Progression</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2">{course.careerPath}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Career Opportunities</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.opportunities.map((opp, idx) => (
                            <Chip key={idx} label={opp} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Commerce Tab Content */}
      {activeTab === 'commerce' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            💼 Commerce & Finance - Business & Professional Courses
          </Typography>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Professional Courses (High Earning Potential)
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.commerce.professionalCourses.map((course, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {course.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ⏱️ Duration: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary Range: {course.salaryRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      🏛️ Exam Body: {course.examBody}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Course Levels</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {course.levels.map((level, idx) => (
                            <Chip key={idx} label={level} size="small" />
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Job Roles</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.jobRoles.map((role, idx) => (
                            <Chip key={idx} label={role} size="small" color="primary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    {course.topFirms && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Top Firms</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.topFirms.map((firm, idx) => (
                              <Chip key={idx} label={firm} size="small" color="secondary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Specializations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.specializations.map((spec, idx) => (
                            <Chip key={idx} label={spec} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Required Skills</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="success" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Business & Management Courses
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.commerce.businessCourses.map((course, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {course.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ⏱️ Duration: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      💰 Salary Range: {course.salaryRange}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Specializations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.specializations.map((spec, idx) => (
                            <Chip key={idx} label={spec} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    {course.topColleges && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Top Colleges</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={1}>
                            {course.topColleges.map((college, idx) => (
                              <Typography key={idx} variant="body2">• {college}</Typography>
                            ))}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {course.jobRoles && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Job Roles</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.jobRoles.map((role, idx) => (
                              <Chip key={idx} label={role} size="small" color="primary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {course.skills && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Skills</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.skills.map((skill, idx) => (
                              <Chip key={idx} label={skill} size="small" color="success" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Government Jobs Tab */}
      {activeTab === 'government' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            🏛️ Government Jobs - Civil Services & Public Sector
          </Typography>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Civil Services (Most Prestigious)
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.governmentJobs.civilServices.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {service.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary: {service.salaryRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🎓 Eligibility: {service.eligibility}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📅 Age Limit: {service.ageLimit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📝 Pattern: {service.examPattern}
                    </Typography>
                    
                    {service.posts && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Posts Available</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {service.posts.map((post, idx) => (
                              <Chip key={idx} label={post} size="small" color="primary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {service.attempts && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Attempt Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2">{service.attempts}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {service.preparation && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Preparation Timeline</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2">{service.preparation}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {service.topInstitutes && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Top Coaching Institutes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {service.topInstitutes.map((institute, idx) => (
                              <Chip key={idx} label={institute} size="small" color="secondary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Banking Sector
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.governmentJobs.banking.map((bank, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {bank.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary: {bank.salaryRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🎓 Eligibility: {bank.eligibility}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📝 Pattern: {bank.examPattern}
                    </Typography>
                    
                    {bank.banks && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Participating Banks</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {bank.banks.map((bankName, idx) => (
                              <Chip key={idx} label={bankName} size="small" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {bank.careerGrowth && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Career Growth</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2">{bank.careerGrowth}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {bank.departments && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Departments</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {bank.departments.map((dept, idx) => (
                              <Chip key={idx} label={dept} size="small" color="info" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Defense Services
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.governmentJobs.defense.map((defense, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {defense.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary: {defense.salaryRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🎓 Eligibility: {defense.eligibility}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📅 Age Limit: {defense.ageLimit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      🏫 Training: {defense.training}
                    </Typography>
                    
                    {defense.services && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Services</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {defense.services.map((service, idx) => (
                              <Chip key={idx} label={service} size="small" color="error" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Emerging Fields Tab */}
      {activeTab === 'emerging' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            🚀 Emerging & Future-Ready Career Fields
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            High-growth, technology-driven careers with exceptional earning potential and global opportunities.
          </Typography>
          
          <Grid container spacing={3}>
            {careerPaths.emergingFields.map((field, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  cursor: 'pointer', 
                  background: 'linear-gradient(135deg, #667eea22 0%, #764ba222 100%)',
                  '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' } 
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {field.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary Range: {field.salaryRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📈 Growth: {field.growth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      🔥 Demand: {field.demand}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Available Courses</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {field.courses.map((course, idx) => (
                            <Chip key={idx} label={course} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Essential Skills</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {field.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="success" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Job Roles</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {field.jobRoles.map((role, idx) => (
                            <Chip key={idx} label={role} size="small" color="primary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Top Companies Hiring</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {field.companies.map((company, idx) => (
                            <Chip key={idx} label={company} size="small" color="secondary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Arts Tab Placeholder */}
      {activeTab === 'arts' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            🎨 Arts & Humanities - Creative & Social Sciences
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Comprehensive guide to arts, humanities, social sciences, and creative career paths.
          </Typography>
          
          <Grid container spacing={3}>
            {careerPaths.arts.courses.map((course, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {course.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ⏱️ Duration: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      💰 Salary Range: {course.salaryRange}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Career Options</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.careerOptions.map((option, idx) => (
                            <Chip key={idx} label={option} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    {course.specializations && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Specializations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.specializations.map((spec, idx) => (
                              <Chip key={idx} label={spec} size="small" color="primary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {course.higherStudies && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Higher Studies Options</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.higherStudies.map((study, idx) => (
                              <Chip key={idx} label={study} size="small" color="secondary" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    {course.governmentJobs && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Government Job Options</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {course.governmentJobs.map((job, idx) => (
                              <Chip key={idx} label={job} size="small" color="info" />
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Essential Skills</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.skills.map((skill, idx) => (
                            <Chip key={idx} label={skill} size="small" color="success" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            Law & Legal Studies
          </Typography>
          <Grid container spacing={3}>
            {careerPaths.arts.lawCourses.map((course, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                      {course.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ⏱️ Duration: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 Salary Range: {course.saleerRange}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      🎯 Entrance: {course.entrance}
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Top Law Colleges</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {course.topColleges.map((college, idx) => (
                            <Typography key={idx} variant="body2">• {college}</Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Specializations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.specializations.map((spec, idx) => (
                            <Chip key={idx} label={spec} size="small" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Career Paths</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.careerPaths.map((path, idx) => (
                            <Chip key={idx} label={path} size="small" color="primary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Top Law Firms</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.topFirms.map((firm, idx) => (
                            <Chip key={idx} label={firm} size="small" color="secondary" />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* International Tab Placeholder */}
      {activeTab === 'international' && (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
            🌍 Global Career Opportunities
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            International education, work opportunities, and global career pathways across 100+ countries.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    🇺🇸 United States
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Top universities: Harvard, MIT, Stanford, UC Berkeley
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Popular Programs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {['MS Computer Science', 'MBA', 'PhD Programs', 'Engineering'].map((program, idx) => (
                          <Chip key={idx} label={program} size="small" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    🇬🇧 United Kingdom
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Top universities: Oxford, Cambridge, Imperial College, LSE
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Popular Programs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {['Masters Programs', 'Finance', 'Law', 'Medicine'].map((program, idx) => (
                          <Chip key={idx} label={program} size="small" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                    🇨🇦 Canada
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Top universities: University of Toronto, UBC, McGill
                  </Typography>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Popular Programs</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {['Engineering', 'Healthcare', 'Business', 'AI/ML'].map((program, idx) => (
                          <Chip key={idx} label={program} size="small" />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4, mb: 2 }}>
            International Career Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">100+</Typography>
                <Typography variant="body2">Countries</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">5000+</Typography>
                <Typography variant="body2">Universities</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">₹1-10Cr</Typography>
                <Typography variant="body2">Salary Range</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">50+</Typography>
                <Typography variant="body2">Study Fields</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">10M+</Typography>
                <Typography variant="body2">Job Openings</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight={700} color="primary">200+</Typography>
                <Typography variant="body2">Visa Types</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Dialog for detailed view */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            {selectedPath?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedPath && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPath.description}
              </Typography>
              {selectedPath.nextSteps && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Next Steps:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPath.nextSteps.map((step, idx) => (
                      <Chip key={idx} label={step} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CareerGuidance; 