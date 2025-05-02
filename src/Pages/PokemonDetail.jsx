import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain } from '../Services/api';
import { Box, Typography, Chip, Stack, Card, CardContent, CardMedia, Paper, Divider, CircularProgress, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './PokemonDetail.css';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllMoves, setShowAllMoves] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const poke = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(poke);
        const speciesData = await fetchPokemonSpecies(poke.species.url);
        const evoChainUrl = speciesData.evolution_chain.url;
        const evoData = await fetchEvolutionChain(evoChainUrl);
        setEvolution(flattenEvolutionChain(evoData.chain));
      } catch (err) {
        setError('Failed to load Pokémon details.');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [name]);

  function flattenEvolutionChain(chain) {
    const evo = [];
    let current = chain;
    while (current) {
      evo.push(current.species.name);
      current = current.evolves_to[0];
    }
    return evo;
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={60} color="primary" /></Box>;
  if (error || !pokemon) return <Box sx={{ textAlign: 'center', mt: 8 }}><Typography color="error">{error || 'Not found.'}</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', mt: 5, mb: 5 }}>
      <Paper elevation={6} sx={{ borderRadius: 5, p: { xs: 2, sm: 4 }, background: 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)' }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} color="primary" variant="outlined">
          Back to List
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardMedia
            component="img"
            image={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            sx={{ width: 200, height: 200, objectFit: 'contain', mb: 2 }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2, mb: 1, textTransform: 'capitalize' }}>
            {pokemon.name}
            <Typography component="span" variant="h6" sx={{ color: '#888', ml: 1 }}>#{pokemon.id}</Typography>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {pokemon.types.map(t => (
              <Chip key={t.type.name} label={t.type.name} sx={{ background: '#ffd600', color: '#222', fontWeight: 600, textTransform: 'capitalize' }} />
            ))}
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Stats</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {pokemon.stats.map(s => (
              <Paper key={s.stat.name} elevation={2} sx={{ p: 1.5, minWidth: 90, textAlign: 'center', mb: 1, background: '#fffde7' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{s.stat.name}</Typography>
                <Typography variant="h6" color="primary">{s.base_stat}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Abilities</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {pokemon.abilities.map(a => (
              <Chip key={a.ability.name} label={a.ability.name} color="info" variant="outlined" sx={{ textTransform: 'capitalize', mb: 1 }} />
            ))}
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Moves</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {pokemon.moves.slice(0, showAllMoves ? pokemon.moves.length : 10).map(m => (
              <Chip key={m.move.name} label={m.move.name} color="secondary" variant="outlined" sx={{ textTransform: 'capitalize', mb: 1 }} />
            ))}
            {pokemon.moves.length > 10 && !showAllMoves && (
              <Button size="small" sx={{ ml: 1 }} onClick={() => setShowAllMoves(true)}>
                and more...
              </Button>
            )}
            {pokemon.moves.length > 10 && showAllMoves && (
              <Button size="small" sx={{ ml: 1 }} onClick={() => setShowAllMoves(false)}>
                show less
              </Button>
            )}
          </Stack>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Evolution Chain</Typography>
          <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap" spacing={1}>
            {evolution.map((evoName, idx) => (
              <React.Fragment key={evoName}>
                {idx > 0 && <ArrowForwardIosIcon fontSize="small" sx={{ mx: 1, color: '#888' }} />}
                <Button
                  component={Link}
                  to={`/pokemon/${evoName}`}
                  variant={evoName === pokemon.name ? 'contained' : 'outlined'}
                  color={evoName === pokemon.name ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                >
                  {evoName}
                </Button>
              </React.Fragment>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default PokemonDetail;