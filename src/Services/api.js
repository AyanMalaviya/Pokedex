import axios from 'axios';

export const fetchPokemons = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
  return response.data.results;
};

export const fetchPokemonDetails = async (urlOrName) => {
  // Accepts either a URL or a Pokémon name
  const url = urlOrName.startsWith('http')
    ? urlOrName
    : `https://pokeapi.co/api/v2/pokemon/${urlOrName}`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchPokemonSpecies = async (urlOrName) => {
  // Accepts either a URL or a Pokémon name
  const url = urlOrName.startsWith('http')
    ? urlOrName
    : `https://pokeapi.co/api/v2/pokemon-species/${urlOrName}`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchEvolutionChain = async (url) => {
  const response = await axios.get(url);
  return response.data;
};
