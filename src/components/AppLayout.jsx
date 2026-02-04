import React from 'react';
import { useLocation } from 'react-router-dom';
import PageBackground from './PageBackground';

export default function AppLayout({ children, variant }) {
  const location = useLocation();

  // Determine background variant based on route if not explicitly provided
  const getVariant = () => {
    if (variant) return variant;
    
    const path = location.pathname;
    
    if (path.startsWith('/portal')) return 'portal';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/plans')) return 'plans';
    
    return 'home';
  };

  const bgVariant = getVariant();

  return (
    <>
      <PageBackground variant={bgVariant} />
      {children}
    </>
  );
}