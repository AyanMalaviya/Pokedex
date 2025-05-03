import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import { fetchPokemons, fetchPokemonDetails } from '../Services/api';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardMedia, Stack, Paper, CircularProgress } from '@mui/material';

const Compare = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [firstData, setFirstData] = useState(null);
  const [secondData, setSecondData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokemons().then(list => setPokemonList(list));
  }, []);

  useEffect(() => {
    const fetchBoth = async () => {
      setLoading(true);
      if (first) setFirstData(await fetchPokemonDetails(first));
      else setFirstData(null);
      if (second) setSecondData(await fetchPokemonDetails(second));
      else setSecondData(null);
      setLoading(false);
    };
    fetchBoth();
  }, [first, second]);

  return (
    <>
      <Header 
        comparePokemonList={pokemonList}
        setCompareFirst={setFirst}
        setCompareSecond={setSecond}
      />
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 5, mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
          Compare Pokémon
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="flex-start">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>First Pokémon</InputLabel>
            <Select value={first} label="First Pokémon" onChange={e => setFirst(e.target.value)}>
              <MenuItem value=""><em>None</em></MenuItem>
              {pokemonList.map(p => (
                <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Second Pokémon</InputLabel>
            <Select value={second} label="Second Pokémon" onChange={e => setSecond(e.target.value)}>
              <MenuItem value=""><em>None</em></MenuItem>
              {pokemonList.map(p => (
                <MenuItem key={p.name} value={p.name}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center" alignItems="flex-start" sx={{ mt: 4 }}>
          {[firstData, secondData].map((poke, idx) => poke && (
            <Card key={idx} sx={{ minWidth: 280, maxWidth: 340, mx: 'auto', borderRadius: 4, boxShadow: 6, background: 'linear-gradient(135deg, #fffbe6 60%, #ffe066 100%)' }}>
              <CardMedia
                component="img"
                image={poke.sprites.other?.['official-artwork']?.front_default || poke.sprites.front_default}
                alt={poke.name}
                sx={{ width: 160, height: 160, objectFit: 'contain', mx: 'auto', mt: 2 }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{poke.name.toUpperCase()}</Typography>
                <Typography variant="body2" color="text.secondary">#{poke.id}</Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                  {poke.types.map((t) => (
                    <Paper key={t.type.name} sx={{ px: 1.5, py: 0.5, background: '#ffd600', color: '#222', fontWeight: 600, textTransform: 'capitalize' }}>{t.type.name}</Paper>
                  ))}
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Stats</Typography>
                <Stack spacing={0.5}>
                  {poke.stats.map(s => (
                    <Box key={s.stat.name} sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
                      <span style={{ textTransform: 'capitalize' }}>{s.stat.name}</span>
                      <b>{s.base_stat}</b>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Compare;
