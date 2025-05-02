import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import './Header.css';

const Header = ({ setSearchTerm, setTypeFilter }) => (
  <AppBar position="static" color="default" elevation={2} className="header-appbar">
    <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', py: 2 }}>
      <Typography variant="h4" component="div" sx={{ color: '#FFD600', fontWeight: 'bold', letterSpacing: 2, mb: 1 }}>
        Pokedex Explorer
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          background: '#fffbe6',
          borderRadius: 2,
          mt: 1,
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        <SearchBar setSearchTerm={setSearchTerm} />
        <FilterDropdown setTypeFilter={setTypeFilter} />
      </Paper>
    </Toolbar>
  </AppBar>
);

export default Header;
