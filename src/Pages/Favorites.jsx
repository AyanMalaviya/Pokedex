import React, { useEffect, useState, useMemo } from 'react';
import { fetchPokemonDetails } from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useFavorites } from '../hooks/useFavorites';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const ids = favorites.map(Number);
      if (ids.length === 0) {
        setFavoritePokemons([]);
        setLoading(false);
        return;
      }
      try {
        const pokes = await Promise.all(
          ids.map((id) => fetchPokemonDetails(id.toString()))
        );
        setFavoritePokemons(pokes);
      } catch {
        setFavoritePokemons([]);
      }
      setLoading(false);
    };
    loadFavorites();
  }, [favorites]);

  const memoizedFavorites = useMemo(() => favoritePokemons, [favoritePokemons]);

  return (
    <Box sx={{ px: { xs: 1, sm: 3 }, py: 2, minHeight: '80vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
        <StarIcon sx={{ color: '#FFD600', mb: '-6px', mr: 1 }} /> Favorite Pokémon
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} color="primary" />
        </Box>
      ) : memoizedFavorites.length === 0 ? (
        <Typography sx={{ textAlign: 'center', mt: 6 }} color="text.secondary">
          No favorites yet. Mark Pokémon as favorites to see them here!
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {memoizedFavorites.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={pokemon.id}>
              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: 6,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  '&:hover': {
                    transform: 'scale(1.06)',
                    boxShadow: 12,
                    borderColor: '#ffd600'
                  },
                  border: '3px solid #ffe066',
                  maxWidth: 340,
                  mx: 'auto',
                  minHeight: 340,
                  background: 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)',
                  position: 'relative'
                }}
                onClick={() => navigate(`/pokemon/${pokemon.name}`)}
              >
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                  <StarIcon sx={{ color: '#FFD600', fontSize: 32 }} />
                </Box>
                <CardMedia
                  component="img"
                  image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  sx={{ width: 140, height: 140, objectFit: 'contain', mx: 'auto', mt: 2 }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{pokemon.name.toUpperCase()}</Typography>
                  <Typography variant="body2" color="text.secondary">#{pokemon.id}</Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                    {pokemon.types.map((t) => (
                      <Chip key={t.type.name} label={t.type.name} size="small" sx={{ background: '#ffd600', color: '#222', fontWeight: 600, textTransform: 'capitalize' }} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;
