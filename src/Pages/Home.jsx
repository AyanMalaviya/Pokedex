import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchPokemons, fetchPokemonDetails } from '../Services/api';
import Header from '../Components/Header';
import './Home.css';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Pagination,
  Stack
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState('id-asc');
  const { toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const basicData = await fetchPokemons();
        const detailedData = await Promise.all(
          basicData.map((poke) => fetchPokemonDetails(poke.url))
        );
        setPokemons(detailedData);
      } catch (err) {
        setError('Failed to fetch Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadPokemons();
  }, []);

  const filteredPokemons = useMemo(() => {
    let filtered = pokemons;
    if (searchTerm) {
      filtered = filtered.filter((poke) =>
        poke.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter.length > 0) {
      filtered = filtered.filter((poke) =>
        poke.types.some((t) => typeFilter.includes(t.type.name))
      );
    }
    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === 'id-asc') return a.id - b.id;
      if (sortOption === 'id-desc') return b.id - a.id;
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
    return filtered;
  }, [pokemons, searchTerm, typeFilter, sortOption]);

  const paginatedPokemons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPokemons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPokemons, currentPage, itemsPerPage]);

  const handleToggleFavorite = useCallback((id, e) => {
    e.stopPropagation();
    toggleFavorite(id);
  }, [toggleFavorite]);

  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);

  return (
    <Box className="home-container">
      <Header setSearchTerm={setSearchTerm} setTypeFilter={setTypeFilter} />
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <CircularProgress size={60} color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredPokemons.length === 0 ? (
        <Typography>No Pokémon found!</Typography>
      ) : (
        <>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center" sx={{ my: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="id-asc">Sort by ID (Asc)</MenuItem>
                <MenuItem value="id-desc">Sort by ID (Desc)</MenuItem>
                <MenuItem value="name-asc">Sort by Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Sort by Name (Z-A)</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                label="Per Page"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={20}>20 per page</MenuItem>
                <MenuItem value={50}>50 per page</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <div className="pokemon-grid">
            {paginatedPokemons.map((pokemon) => (
              <div className="pokemon-card" key={pokemon.id} onClick={() => navigate(`/pokemon/${pokemon.name}`)}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 2
                  }}
                  onClick={(e) => handleToggleFavorite(pokemon.id, e)}
                >
                  <StarIcon sx={{ color: '#FFD600', fontSize: 32, opacity: isFavorite(pokemon.id) ? 1 : 0.3 }} />
                </Box>
                <img
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  style={{ width: 140, height: 140, objectFit: 'contain', marginBottom: 12 }}
                />
                <div style={{ fontWeight: 700, fontSize: '1.2em', marginBottom: 4 }}>{pokemon.name.toUpperCase()}</div>
                <div style={{ color: '#888', fontSize: '1em', marginBottom: 8 }}>#{pokemon.id}</div>
                <div>
                  {pokemon.types.map((t) => (
                    <span key={t.type.name} className="type-badge">{t.type.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      <Box className="sliding-bar"></Box>
    </Box>
  );
};

export default Home;