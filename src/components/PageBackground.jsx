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

const toWebp = (src) => src.replace(/\.jpg$/i, '.webp');

export default function PageBackground({ variant = 'home' }) {
  const bg = backgrounds[variant] || backgrounds.home;
  const webp = {
    lg: toWebp(bg.lg),
    md: toWebp(bg.md),
    sm: toWebp(bg.sm),
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    >
      <picture style={{ display: 'block', width: '100%', height: '100%' }}>
        <source
          type="image/webp"
          srcSet={`${webp.sm} 640w, ${webp.md} 1024w, ${webp.lg} 1600w`}
          sizes="100vw"
        />
        <img
          src={bg.lg}
          srcSet={`${bg.sm} 640w, ${bg.md} 1024w, ${bg.lg} 1600w`}
          sizes="100vw"
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </picture>
    </div>
  );
}
