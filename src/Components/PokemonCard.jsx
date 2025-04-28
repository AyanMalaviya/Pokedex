import React from 'react';

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h3>{pokemon.name.toUpperCase()}</h3>
      <p>#{pokemon.id}</p>
      <div>
        {pokemon.types.map((t) => (
          <span key={t.type.name} className="type-badge">{t.type.name}</span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;
