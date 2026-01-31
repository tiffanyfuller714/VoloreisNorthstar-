const plans = [
  {
    id: 'solo-trip-pass',
    name: 'Solo Trip Pass',
    price: 14.99,
    billing_cycle: 'Per Trip',
    description: 'Short-term travel safety coverage for a single trip. Includes AI monitoring, human oversight, and emergency alerts.',
    max_trips_per_period: 1,
    duration_days: null,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      unlimited_trips: false,
      check_ins: false,
      priority_support: false
    }
  },
  {
    id: 'solo-trip-pass-7days',
    name: 'Solo Trip Pass (7 Days)',
    price: 24.99,
    billing_cycle: '7 Days',
    description: 'Extended short-term coverage for trips lasting up to one week with full monitoring and support.',
    max_trips_per_period: 1,
    duration_days: 7,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      extended_coverage: true,
      full_support: true,
      unlimited_trips: false
    }
  },
  {
    id: 'frequent-traveler-monthly',
    name: 'Frequent Traveler Membership (Monthly)',
    price: 19.99,
    billing_cycle: 'Monthly',
    description: 'Always-on safety coverage for travelers who move often. Includes unlimited trips, AI monitoring, and human oversight.',
    max_trips_per_period: 999,
    duration_days: 30,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      unlimited_trips: true,
      priority_alerts: true,
      flexible_billing: true
    }
  },
  {
    id: 'frequent-traveler-yearly',
    name: 'Frequent Traveler Membership (Yearly)',
    price: 199.00,
    billing_cycle: 'Yearly',
    description: 'Annual version of Frequent Traveler Membership offering continuous protection across all trips.',
    max_trips_per_period: 999,
    duration_days: 365,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      unlimited_trips: true,
      priority_alerts: true,
      annual_coverage: true,
      best_value: true
    }
  },
  {
    id: 'premium-safety-monthly',
    name: 'Premium Safety Network (Monthly)',
    price: 39.99,
    billing_cycle: 'Monthly',
    description: 'Proactive safety plan with structured check-ins, on-demand human support, and priority escalation.',
    max_trips_per_period: 999,
    duration_days: 30,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      structured_check_ins: true,
      on_demand_support: true,
      priority_escalation: true,
      proactive_safety: true
    }
  },
  {
    id: 'premium-safety-yearly',
    name: 'Premium Safety Network (Yearly)',
    price: 399.00,
    billing_cycle: 'Yearly',
    description: 'Annual premium coverage including scheduled check-ins, live support, and highest-level protection.',
    max_trips_per_period: 999,
    duration_days: 365,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      structured_check_ins: true,
      on_demand_support: true,
      priority_escalation: true,
      scheduled_check_ins: true,
      live_support: true,
      highest_protection: true,
      best_value: true
    }
  },
  {
    id: 'sponsored-safety-weekly',
    name: 'Sponsored Safety (Weekly)',
    price: 29.99,
    billing_cycle: 'Weekly',
    description: 'Coverage sponsored by a loved one. Includes monitoring, check-ins, and sponsor notifications.',
    max_trips_per_period: 999,
    duration_days: 7,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      sponsor_monitoring: true,
      sponsor_notifications: true,
      check_ins: true,
      weekly_coverage: true
    }
  },
  {
    id: 'sponsored-safety-yearly',
    name: 'Sponsored Safety (Yearly)',
    price: 299.00,
    billing_cycle: 'Yearly',
    description: 'Full-year sponsored coverage with monitoring, check-ins, and sponsor-backed escalation.',
    max_trips_per_period: 999,
    duration_days: 365,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      sponsor_monitoring: true,
      sponsor_notifications: true,
      check_ins: true,
      full_year_coverage: true,
      extended_sponsor_support: true,
      best_value: true
    }
  },
  {
    id: 'enterprise-coverage',
    name: 'Enterprise Coverage (Monthly)',
    price: 19.95,
    billing_cycle: 'Monthly',
    description: 'Duty-of-care travel safety coverage designed for organizations, universities, and teams.',
    max_trips_per_period: 999,
    duration_days: 30,
    features: {
      ai_monitoring: true,
      human_oversight: true,
      emergency_alerts: true,
      duty_of_care: true,
      team_management: true,
      organization_safety: true,
      admin_console: true,
      bulk_user_management: true,
      reporting: true,
      analytics: true
    }
  }
];

export default plans;