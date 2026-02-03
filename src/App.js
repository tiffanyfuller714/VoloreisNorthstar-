import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid, Divider } from '@mui/material';
import { Security } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import HomePage from './components/HomePage';
import PlansGrid from './components/PlansGrid';
import Checkout from './components/Checkout';
import CustomerLogin from './portal/CustomerLogin';
import CustomerPortal from './portal/CustomerPortal';
import AdminLogin from './portal/AdminLogin';
import AdminPortal from './portal/AdminPortal';
import ProtectedRoute from './portal/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

function Navigation({ currentView, handleViewPlans, handleBackToHome }) {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal') || location.pathname.startsWith('/admin');

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security sx={{ color: '#1976d2', fontSize: 32 }} />
          <Typography 
            variant="h6" 
            component={isPortalRoute ? Link : "div"}
            to="/"
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: isPortalRoute ? 'pointer' : 'default',
              textDecoration: 'none'
            }}
          >
            VOLOREIS
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isPortalRoute ? (
            <>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button color="inherit">Back to Home</Button>
              </Link>
            </>
          ) : (
            <>
              {currentView !== 'home' && (
                <Button
                  color="inherit"
                  onClick={handleBackToHome}
                >
                  Home
                </Button>
              )}
              
              {currentView === 'home' && (
                <>
                  <Link to="/portal/login" style={{ textDecoration: 'none' }}>
                    <Button color="inherit">Login</Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewPlans}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleViewPlans = () => {
    setCurrentView('plans');
    window.scrollTo(0, 0);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentView('checkout');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPlan(null);
    window.scrollTo(0, 0);
  };

  const handleBackToPlans = () => {
    setCurrentView('plans');
    setSelectedPlan(null);
    window.scrollTo(0, 0);
  };

  const handleCheckoutSuccess = () => {
    // Redirect to success page or dashboard
    setCurrentView('home');
    setSelectedPlan(null);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewPlans={handleViewPlans} />;
      case 'plans':
        return (
          <PlansGrid
            onSelectPlan={handleSelectPlan}
            onBack={handleBackToHome}
          />
        );
      case 'checkout':
        return selectedPlan ? (
          <Checkout
            plan={selectedPlan}
            onBack={handleBackToPlans}
            onSuccess={handleCheckoutSuccess}
          />
        ) : (
          <HomePage onViewPlans={handleViewPlans} />
        );
      default:
        return <HomePage onViewPlans={handleViewPlans} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Navigation */}
          <Navigation 
            currentView={currentView}
            handleViewPlans={handleViewPlans}
            handleBackToHome={handleBackToHome}
          />

          {/* Main Content */}
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Portal Routes */}
              <Route path="/portal/login" element={<CustomerLogin />} />
              <Route
                path="/portal"
                element={
                  <ProtectedRoute allowRole="customer">
                    <CustomerPortal />
                  </ProtectedRoute>
                }
              />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowRole="admin">
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* Main App Routes */}
              <Route path="/" element={<HomePage onViewPlans={handleViewPlans} />} />
              <Route path="/plans" element={<PlansGrid onSelectPlan={handleSelectPlan} onBack={handleBackToHome} />} />
              <Route 
                path="/checkout" 
                element={selectedPlan ? <Checkout plan={selectedPlan} onBack={handleBackToPlans} onSuccess={handleCheckoutSuccess} /> : <HomePage onViewPlans={handleViewPlans} />} 
              />
            </Routes>
          </Box>

          {/* Footer - Only show on main pages, not portal */}
          <Box
            component="footer"
            sx={{
              bgcolor: 'grey.900',
              color: 'white',
              py: 6,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    VOLOREIS
                  </Typography>
                  <Typography variant="body2" color="grey.400">
                    AI-powered travel safety platform keeping travelers protected worldwide.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Product
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Features
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Pricing
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Mobile App
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Company
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      About
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Careers
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Contact
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Legal
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Privacy Policy
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Terms of Service
                    </Typography>
                    <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer' }}>
                      Cookie Policy
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Connect
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="grey.400">
                      Twitter
                    </Typography>
                    <Typography variant="body2" color="grey.400">
                      LinkedIn
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderColor: 'grey.700' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body2" color="grey.400">
                  © 2025 VOLOREIS. All rights reserved.
                </Typography>
                <Typography variant="body2" color="grey.400">
                  Made with ❤️ for safe travels
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;