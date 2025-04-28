import axios from 'axios';

export const fetchPokemons = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
  return response.data.results;
};

export const fetchPokemonDetails = async (url) => {
  const response = await axios.get(url);
  return response.data;
};
