import React from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Box, Chip } from '@mui/material';
import { Check, Star, Shield, Users, Building } from '@mui/icons-material';

const PlanCard = ({ plan, onSelect, featured }) => {
  const getIcon = () => {
    if (plan.name.includes('Enterprise')) return <Building />;
    if (plan.name.includes('Sponsored')) return <Users />;
    if (plan.name.includes('Premium')) return <Star />;
    return <Shield />;
  };

  const getFeatures = () => {
    const features = [];
    
    // Base features for all plans
    features.push({ text: 'AI-powered safety monitoring', included: true });
    features.push({ text: 'GPS location tracking', included: true });
    features.push({ text: 'Emergency button access', included: true });
    
    // Plan-specific features
    if (plan.name.includes('Solo Trip')) {
      features.push({ text: 'Single trip coverage', included: true });
      features.push({ text: 'Human oversight', included: true });
      features.push({ text: 'Emergency alerts', included: true });
      if (plan.name.includes('7 Days')) {
        features.push({ text: 'Extended 7-day coverage', included: true });
        features.push({ text: 'Full monitoring support', included: true });
      }
    }
    
    if (plan.name.includes('Frequent Traveler')) {
      features.push({ text: 'Unlimited trips', included: true });
      features.push({ text: 'Always-on protection', included: true });
      features.push({ text: 'Priority alerts', included: true });
      if (plan.billing_cycle === 'Yearly') {
        features.push({ text: 'Annual comprehensive coverage', included: true });
        features.push({ text: 'Best value - Save $40', included: true });
      } else {
        features.push({ text: 'Monthly flexibility', included: true });
      }
    }
    
    if (plan.name.includes('Premium Safety')) {
      features.push({ text: 'Structured check-ins', included: true });
      features.push({ text: 'On-demand human support', included: true });
      features.push({ text: 'Priority escalation', included: true });
      if (plan.billing_cycle === 'Yearly') {
        features.push({ text: 'Scheduled check-ins', included: true });
        features.push({ text: 'Live support team', included: true });
        features.push({ text: 'Highest-level protection', included: true });
        features.push({ text: 'Best value - Save $80', included: true });
      } else {
        features.push({ text: 'Proactive safety plan', included: true });
      }
    }
    
    if (plan.name.includes('Sponsored Safety')) {
      features.push({ text: 'Sponsor monitoring access', included: true });
      features.push({ text: 'Sponsor notifications', included: true });
      features.push({ text: 'Check-in system', included: true });
      if (plan.billing_cycle === 'Yearly') {
        features.push({ text: 'Full-year coverage', included: true });
        features.push({ text: 'Extended sponsor support', included: true });
        features.push({ text: 'Best value - Save $20', included: true });
      } else {
        features.push({ text: 'Weekly coverage', included: true });
      }
    }
    
    if (plan.name.includes('Enterprise')) {
      features.push({ text: 'Duty-of-care compliance', included: true });
      features.push({ text: 'Team management dashboard', included: true });
      features.push({ text: 'Organization-wide safety', included: true });
      features.push({ text: 'Admin console access', included: true });
      features.push({ text: 'Bulk user management', included: true });
      features.push({ text: 'Reporting & analytics', included: true });
    }
    
    return features;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: featured ? 3 : 1,
        borderColor: featured ? 'primary.main' : 'divider',
        boxShadow: featured ? 6 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: featured ? 8 : 4
        }
      }}
    >
      {featured && (
        <Chip
          label="MOST POPULAR"
          color="primary"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 'bold'
          }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            bgcolor: 'primary.light', 
            borderRadius: 2,
            mr: 2
          }}>
            {React.cloneElement(getIcon(), { color: 'primary' })}
          </Box>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
            {plan.name}
          </Typography>
        </Box>

        <Typography variant="h4" component="div" sx={{ mb: 0.5, fontWeight: 'bold' }}>
          ${plan.price}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
          {plan.billing_cycle}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 60 }}>
          {plan.description}
        </Typography>

        <List sx={{ flexGrow: 1, mb: 2 }}>
          {getFeatures().map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Check 
                  color={feature.included ? 'primary' : 'disabled'} 
                  fontSize="small"
                />
              </ListItemIcon>
              <ListItemText 
                primary={feature.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    color: feature.included ? 'text.primary' : 'text.disabled'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant={featured ? 'contained' : 'outlined'}
          color="primary"
          fullWidth
          size="large"
          onClick={() => onSelect(plan)}
          sx={{ 
            mt: 'auto',
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          Select Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;