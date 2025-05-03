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

const Header = ({ setSearchTerm, setTypeFilter, comparePokemonList, setCompareFirst, setCompareSecond }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Random Pokémon button handler
  const handleRandom = () => {
    if (location.pathname === '/compare' && comparePokemonList && comparePokemonList.length && (setCompareFirst || setCompareSecond)) {
      // Pick a random Pokémon from the list
      const randomIdx = Math.floor(Math.random() * comparePokemonList.length);
      const randomName = comparePokemonList[randomIdx].name;
      // Randomly choose to set first or second
      if (setCompareFirst && setCompareSecond) {
        if (Math.random() < 0.5) setCompareFirst(randomName);
        else setCompareSecond(randomName);
      } else if (setCompareFirst) {
        setCompareFirst(randomName);
      } else if (setCompareSecond) {
        setCompareSecond(randomName);
      }
      return;
    }
    // Default: navigate to random Pokémon detail
    const randomId = Math.floor(Math.random() * 1010) + 1;
    navigate(`/pokemon/${randomId}`);
  };

  return (
    <AppBar position="static" color="default" elevation={2} className="header-appbar">
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', py: 2, width: '100%' }}>
        <Typography variant="h4" component="div" sx={{ color: '#FFD600', fontWeight: 'bold', letterSpacing: 2, mb: 1 }}>
          Pokedex Explorer
        </Typography>
        <nav className="header-nav">
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
            className="nav-random-btn"
            style={{
              color: location.pathname.startsWith('/pokemon/') ? '#FFD600' : undefined
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
            p: 0,
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
