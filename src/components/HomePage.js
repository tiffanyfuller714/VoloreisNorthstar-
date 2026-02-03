import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Fade } from '@mui/material';
import { 
  Security, 
  VerifiedUser, 
  Star, 
  ArrowForward,
  Smartphone,
  Shield,
  Headset,
  GpsFixed
} from '@mui/icons-material';

const HomePage = ({ onViewPlans }) => {
  const features = [
    {
      icon: <GpsFixed sx={{ fontSize: 40 }} />,
      title: 'Real-Time GPS Tracking',
      description: 'Your location is monitored in real-time with AI-powered alerts for unexpected movements or potential risks.'
    },
    {
      icon: <Shield sx={{ fontSize: 40 }} />,
      title: 'Emergency Button',
      description: 'One-tap emergency assistance connects you immediately to our professional safety operators 24/7.'
    },
    {
      icon: <Headset sx={{ fontSize: 40 }} />,
      title: 'Human Oversight',
      description: 'Our trained safety team monitors your journey and responds to alerts within minutes.'
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Monitoring',
      description: 'Advanced AI algorithms detect anomalies and potential risks before they become emergencies.'
    },
    {
      icon: <Smartphone sx={{ fontSize: 40 }} />,
      title: 'Easy to Use',
      description: 'Simple, intuitive mobile app that keeps you protected without being intrusive or complicated.'
    },
    {
      icon: <Star sx={{ fontSize: 40 }} />,
      title: 'Premium Features',
      description: 'Scheduled check-ins, priority escalation, and comprehensive safety profiles for complete protection.'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Protected Travelers' },
    { value: '100K+', label: 'Trips Monitored' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Operator Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Solo Traveler',
      text: 'VOLOREIS gave me the confidence to travel alone through Southeast Asia. Knowing someone was watching over me was priceless.',
      rating: 5
    },
    {
      name: 'James L.',
      role: 'Business Traveler',
      text: 'As someone who travels weekly, the Frequent Traveler plan is essential. Peace of mind at an unbeatable price.',
      rating: 5
    },
    {
      name: 'Maria R.',
      role: 'Family Sponsor',
      text: 'My daughter is studying abroad, and the Sponsored Safety plan lets me know she\'s safe without being intrusive.',
      rating: 5
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%)',
          color: 'white',
          py: 20,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      mb: 2,
                      display: 'inline-block'
                    }}
                  >
                    AI-POWERED TRAVEL SAFETY
                  </Typography>
                  
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    Travel Safely.<br />
                    Explore Freely.
                  </Typography>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      lineHeight: 1.8
                    }}
                  >
                    Real-time GPS tracking, emergency assistance, and AI-powered monitoring keep you safe on every journey. Trusted by thousands of travelers worldwide.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={onViewPlans}
                      endIcon={<ArrowForward />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: 'white',
                        color: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      View Plans
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 400,
                    height: 400,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <Security sx={{ fontSize: 200, opacity: 0.9 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2, display: 'block' }}
            >
              WHY CHOOSE VOLOREIS
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
              Advanced Features for Ultimate Safety
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ 
                      bgcolor: 'primary.light', 
                      p: 2, 
                      borderRadius: 2, 
                      display: 'inline-block',
                      mb: 2
                    }}>
                      {React.cloneElement(feature.icon, { color: 'primary' })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2, display: 'block' }}
          >
            SIMPLE PROCESS
          </Typography>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
            Get Protected in 3 Easy Steps
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {[
            {
              step: '01',
              title: 'Choose Your Plan',
              description: 'Select the safety plan that fits your travel needs and budget'
            },
            {
              step: '02',
              title: 'Setup Your Profile',
              description: 'Add your itinerary, emergency contacts, and safety preferences'
            },
            {
              step: '03',
              title: 'Travel Protected',
              description: 'Start your trip with confidence, knowing we\'ve got your back'
            }
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: 'primary.light',
                    mb: 2,
                    opacity: 0.3
                  }}
                >
                  {item.step}
                </Typography>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 12, bgcolor: 'grey.50' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2, display: 'block' }}
            >
              TESTIMONIALS
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
              What Our Travelers Say
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ fontSize: 20, color: '#FFD700' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          py: 16,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Travel with Confidence?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of travelers who trust VOLOREIS for their safety
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onViewPlans}
            endIcon={<ArrowForward />}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: 'white',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
