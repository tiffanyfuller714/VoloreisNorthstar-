import React from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useLocation } from 'react-router-dom';

const routeToIndex = { '/': 0, '/plans': 1, '/checkout': 1, '/portal/login': 2, '/admin/login': 2 };
const indexToRoute = { 0: '/', 1: '/plans', 2: '/portal/login' };

export default function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname || '/';

  const initial = routeToIndex[pathname] ?? 0;
  const [value, setValue] = React.useState(initial);

  React.useEffect(() => {
    const idx = routeToIndex[location.pathname] ?? 0;
    setValue(idx);
  }, [location.pathname]);

  const isHidden =
    pathname.startsWith('/portal') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal/login') ||
    pathname.startsWith('/admin/login');

  if (isHidden) return null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const route = indexToRoute[newValue];
    if (route) navigate(route);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1400,
        display: { xs: 'block', md: 'none' },
      }}
    >
      <Paper
        sx={{
          borderRadius: 3,
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        }}
        elevation={6}
      >
        <BottomNavigation showLabels value={value} onChange={handleChange}>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Plans" icon={<TravelExploreIcon />} />
          <BottomNavigationAction label="Login" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
