import React, { useEffect, useState, useMemo } from 'react';
import { fetchPokemonDetails } from '../Services/api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia, Chip, Stack, Button, Fade, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useFavorites } from '../hooks/useFavorites';
import './Favorites.css';

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
    <Box className="favorites-container" sx={{ minHeight: '100vh', background: 'linear-gradient(120deg, #fffbe6 60%, #ffe066 100%)', pb: 6 }}>
      <Paper elevation={6} sx={{ maxWidth: 900, mx: 'auto', mt: 5, mb: 4, borderRadius: 5, p: { xs: 2, sm: 4 }, background: 'rgba(255,255,255,0.95)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography className="favorites-title" variant="h4" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800, color: '#222', letterSpacing: 2 }}>
            <StarIcon sx={{ color: '#FFD600', mb: '-6px', mr: 1, fontSize: 36 }} /> Favorite Pokémon
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            sx={{
              background: '#FFD600',
              color: '#222',
              fontWeight: 700,
              fontSize: '1.1rem',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': { background: '#ffe066', color: '#000' }
            }}
          >
            Go to Home
          </Button>
        </Stack>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : memoizedFavorites.length === 0 ? (
          <Fade in timeout={600}>
            <Typography className="favorites-empty" sx={{ textAlign: 'center', mt: 8, color: '#888', fontSize: '1.2rem' }}>
              No favorites yet. Mark Pokémon as favorites to see them here!
            </Typography>
          </Fade>
        ) : (
          <Grid container spacing={4} className="favorites-grid" justifyContent="center" sx={{ mt: 1 }}>
            {memoizedFavorites.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={pokemon.id}>
                <Fade in timeout={500}>
                  <Card
                    className="favorites-card"
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
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                  >
                    <Box className="favorites-star" sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                      <StarIcon sx={{ color: '#FFD600', fontSize: 32, opacity: 1 }} />
                    </Box>
                    <CardMedia
                      component="img"
                      image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      sx={{ width: 140, height: 140, objectFit: 'contain', mx: 'auto', mt: 2, borderRadius: 2, background: '#fff' }}
                    />
                    <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                      <Typography className="favorites-name" variant="h6" sx={{ fontWeight: 700, fontSize: '1.2em', color: '#222', mb: 0.5 }}>{pokemon.name.toUpperCase()}</Typography>
                      <Typography className="favorites-id" variant="body2" color="text.secondary" sx={{ mb: 1 }}>#{pokemon.id}</Typography>
                      <Stack direction="row" spacing={1} justifyContent="center" className="favorites-types" sx={{ mt: 1, flexWrap: 'wrap' }}>
                        {pokemon.types.map((t) => (
                          <Chip key={t.type.name} label={t.type.name} size="small" className="favorites-type-badge" sx={{ background: '#ffd600', color: '#222', fontWeight: 600, textTransform: 'capitalize', mb: 0.5 }} />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Favorites;
