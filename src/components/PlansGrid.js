import React from 'react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PlanCard from './PlanCard';
import plans from '../data/plans';

const PlansGrid = ({ onSelectPlan, onBack }) => {
  const soloPlans = plans.filter(plan => plan.name.includes('Solo Trip'));
  const frequentPlans = plans.filter(plan => plan.name.includes('Frequent Traveler'));
  const premiumPlans = plans.filter(plan => plan.name.includes('Premium Safety'));
  const sponsoredPlans = plans.filter(plan => plan.name.includes('Sponsored Safety'));
  const enterprisePlans = plans.filter(plan => plan.name.includes('Enterprise'));

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        {onBack && (
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ mb: 3 }}
          >
            Back to Home
          </Button>
        )}
        
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Choose Your Safety Plan
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto' }}
        >
          AI-powered travel safety with real-time monitoring, emergency support, and peace of mind for every journey.
        </Typography>
      </Box>

      {/* Solo Trip Plans */}
      <Box sx={{ mb: 10 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Shield />
          Solo Traveler Plans
        </Typography>
        <Grid container spacing={3}>
          {soloPlans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <PlanCard 
                plan={plan} 
                onSelect={onSelectPlan}
                featured={plan.name.includes('7 Days')}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Frequent Traveler Plans */}
      <Box sx={{ mb: 10 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <FlightTakeoff />
          Frequent Traveler
        </Typography>
        <Grid container spacing={3}>
          {frequentPlans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <PlanCard 
                plan={plan} 
                onSelect={onSelectPlan}
                featured={plan.billing_cycle === 'Yearly'}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Premium Safety Plans */}
      <Box sx={{ mb: 10 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Star />
          Premium Safety Network
        </Typography>
        <Grid container spacing={3}>
          {premiumPlans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <PlanCard 
                plan={plan} 
                onSelect={onSelectPlan}
                featured={plan.billing_cycle === 'Yearly'}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Sponsored Safety Plans */}
      <Box sx={{ mb: 10 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Favorite />
          Sponsored Safety
        </Typography>
        <Grid container spacing={3}>
          {sponsoredPlans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.id}>
              <PlanCard 
                plan={plan} 
                onSelect={onSelectPlan}
                featured={plan.billing_cycle === 'Yearly'}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Enterprise Plans */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Business />
          Enterprise Solutions
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {enterprisePlans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <PlanCard 
                plan={plan} 
                onSelect={onSelectPlan}
                featured={true}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Trust Badges */}
      <Box sx={{ 
        mt: 8, 
        pt: 6, 
        borderTop: 1, 
        borderColor: 'divider',
        textAlign: 'center'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Trusted by thousands of travelers worldwide
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          flexWrap: 'wrap',
          opacity: 0.6
        }}>
          <Security />
          <VerifiedUser />
          <HealthAndSafety />
          <SupportAgent />
        </Box>
      </Box>
    </Container>
  );
};

export default PlansGrid;