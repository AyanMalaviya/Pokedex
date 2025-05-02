import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain } from '../Services/api';
import './PokemonDetail.css';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const poke = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(poke);
      const speciesData = await fetchPokemonSpecies(poke.species.url);
      const evoChainUrl = speciesData.evolution_chain.url;
      const evoData = await fetchEvolutionChain(evoChainUrl);
      setEvolution(flattenEvolutionChain(evoData.chain));
      setLoading(false);
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

  if (loading) return <div className="pokemon-detail-container">Loading...</div>;
  if (!pokemon) return <div className="pokemon-detail-container">Not found.</div>;

  return (
    <div className="pokemon-detail-container">
      <Link to="/" className="back-link">← Back to List</Link>
      <img
        src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
      />
      <h1>{pokemon.name.toUpperCase()} <span>#{pokemon.id}</span></h1>
      <div className="types">
        {pokemon.types.map(t => (
          <span key={t.type.name} className={`type type-${t.type.name}`}>{t.type.name}</span>
        ))}
      </div>
      <div className="stats">
        <h2>Stats</h2>
        <ul>
          {pokemon.stats.map(s => (
            <li key={s.stat.name}>
              <b>{s.stat.name}:</b> {s.base_stat}
            </li>
          ))}
        </ul>
      </div>
      <div className="abilities">
        <h2>Abilities</h2>
        <ul>
          {pokemon.abilities.map(a => (
            <li key={a.ability.name}>{a.ability.name}</li>
          ))}
        </ul>
      </div>
      <div className="moves">
        <h2>Moves</h2>
        <ul>
          {pokemon.moves.slice(0, 10).map(m => (
            <li key={m.move.name}>{m.move.name}</li>
          ))}
        </ul>
        {pokemon.moves.length > 10 && <span>...and more</span>}
      </div>
      <div className="evolution">
        <h2>Evolution Chain</h2>
        <div className="evo-chain">
          {evolution.map((evoName, idx) => (
            <span key={evoName}>
              {idx > 0 && <span className="evo-arrow">→</span>}
              <Link to={`/pokemon/${evoName}`} className="evo-link">{evoName}</Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;