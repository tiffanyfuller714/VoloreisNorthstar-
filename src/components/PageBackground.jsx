import React from 'react';

const backgrounds = {
  home: {
    lg: '/images/home/LG.jpg',
    md: '/images/home/MD.jpg',
    sm: '/images/home/SM.jpg',
  },
  plans: {
    lg: '/images/plans/LG.jpg',
    md: '/images/plans/MD.jpg',
    sm: '/images/plans/SM.jpg',
  },
  portal: {
    lg: '/images/portal/LG.jpg',
    md: '/images/portal/MD.jpg',
    sm: '/images/portal/SM.jpg',
  },
  admin: {
    lg: '/images/admin/LG.jpg',
    md: '/images/admin/MD.jpg',
    sm: '/images/admin/SM.jpg',
  },
  custom: {
    lg: '/images/custom/LG.jpg',
    md: '/images/custom/MD.jpg',
    sm: '/images/custom/SM.jpg',
  },
};

export default function PageBackground({ variant = 'home' }) {
  const bg = backgrounds[variant] || backgrounds.home;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          url('${bg.lg}'),
          url('${bg.md}'),
          url('${bg.sm}')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: -1,
      }}
    />
  );
}