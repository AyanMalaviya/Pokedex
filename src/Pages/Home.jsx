import React, { useState, useEffect } from 'react';
import { fetchPokemons, fetchPokemonDetails } from '../Services/api';
import Header from '../Components/Header';
import './Home.css';
import '../App.css';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Pagination,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState('id-asc');

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const basicData = await fetchPokemons();
        const detailedData = await Promise.all(
          basicData.map((poke) => fetchPokemonDetails(poke.url))
        );
        setPokemons(detailedData);
        setFilteredPokemons(detailedData);
      } catch (err) {
        setError('Failed to fetch Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadPokemons();
  }, []);

  useEffect(() => {
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

    setFilteredPokemons(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, typeFilter, pokemons, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemons = filteredPokemons.slice(startIndex, startIndex + itemsPerPage);

  const renderPokemonDetails = (pokemon) => (
    <Dialog
      open={!!pokemon}
      onClose={() => setSelectedPokemon(null)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>
          {pokemon.name.toUpperCase()} <Typography component="span" color="text.secondary">#{pokemon.id}</Typography>
        </span>
        <Button onClick={() => setSelectedPokemon(null)} color="error" size="small">
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <CardMedia
            component="img"
            image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            sx={{ width: 180, height: 180, objectFit: 'contain', mb: 2 }}
          />
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {pokemon.types.map(t => (
              <Chip key={t.type.name} label={t.type.name} color="warning" variant="filled" />
            ))}
          </Stack>
        </Box>
        <Typography variant="body2"><b>Height:</b> {pokemon.height}</Typography>
        <Typography variant="body2"><b>Weight:</b> {pokemon.weight}</Typography>
        <Typography variant="body2"><b>Base Experience:</b> {pokemon.base_experience}</Typography>
        <Typography variant="body2"><b>Abilities:</b> {pokemon.abilities.map(a => a.ability.name).join(', ')}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}><b>Stats:</b></Typography>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {pokemon.stats.map(s => (
            <li key={s.stat.name}>
              <Typography variant="body2" component="span">{s.stat.name}: {s.base_stat}</Typography>
            </li>
          ))}
        </ul>
        <Typography variant="body2"><b>Moves:</b> {pokemon.moves.slice(0, 8).map(m => m.move.name).join(', ')}{pokemon.moves.length > 8 ? '...' : ''}</Typography>
        <Typography variant="body2"><b>Order:</b> {pokemon.order}</Typography>
        <Typography variant="body2"><b>Species:</b> {pokemon.species.name}</Typography>
        <Typography variant="body2"><b>Game Indices:</b> {pokemon.game_indices.length}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedPokemon(null)} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box className="home-container" sx={{ px: { xs: 1, sm: 3 }, py: 2 }}>
      <Header setSearchTerm={setSearchTerm} setTypeFilter={setTypeFilter} />
      {selectedPokemon && renderPokemonDetails(selectedPokemon)}
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
          <Grid container spacing={2} justifyContent="center">
            {paginatedPokemons.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.04)', boxShadow: 6 }
                  }}
                  onClick={() => setSelectedPokemon(pokemon)}
                  elevation={3}
                >
                  <CardMedia
                    component="img"
                    image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    sx={{ width: 120, height: 120, objectFit: 'contain', mx: 'auto', mt: 2 }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{pokemon.name.toUpperCase()}</Typography>
                    <Typography variant="body2" color="text.secondary">#{pokemon.id}</Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                      {pokemon.types.map((t) => (
                        <Chip key={t.type.name} label={t.type.name} size="small" color="warning" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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