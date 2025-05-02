import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import './Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import CasinoIcon from '@mui/icons-material/Casino';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const Header = ({ setSearchTerm, setTypeFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Random Pokémon button handler
  const handleRandom = () => {
    // There are 1-1010 Pokémon in the PokéAPI as of Gen 9
    const randomId = Math.floor(Math.random() * 1010) + 1;
    navigate(`/pokemon/${randomId}`);
  };

  return (
    <AppBar position="static" color="default" elevation={2} className="header-appbar">
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', py: 2, width: '100%' }}>
        <Typography variant="h4" component="div" sx={{ color: '#FFD600', fontWeight: 'bold', letterSpacing: 2, mb: 1 }}>
          Pokedex Explorer
        </Typography>
        <nav className="header-nav" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Link
            to="/"
            className={`nav-link${location.pathname === '/' ? ' active' : ''}`}
          >
            <HomeIcon sx={{ mb: '-4px', mr: 0.5 }} /> Home
          </Link>
          <Link
            to="/favorites"
            className={`nav-link${location.pathname === '/favorites' ? ' active' : ''}`}
          >
            <StarIcon sx={{ mb: '-4px', mr: 0.5, color: '#FFD600' }} /> Favorites
          </Link>
          <Link
            to="/compare"
            className={`nav-link${location.pathname === '/compare' ? ' active' : ''}`}
          >
            <CompareArrowsIcon sx={{ mb: '-4px', mr: 0.5 }} /> Compare
          </Link>
          <button
            onClick={handleRandom}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: location.pathname.startsWith('/pokemon/') ? '#FFD600' : '#222',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Random Pokémon"
          >
            <CasinoIcon sx={{ mb: '-4px', mr: 0.5 }} /> Random
          </button>
        </nav>
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
          {setSearchTerm && <SearchBar setSearchTerm={setSearchTerm} />}
          {setTypeFilter && <FilterDropdown setTypeFilter={setTypeFilter} />}
        </Paper>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
