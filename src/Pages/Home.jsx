import React, { useState, useEffect } from 'react';
import { fetchPokemons, fetchPokemonDetails } from '../Services/api';
import Header from '../Components/Header';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

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
    if (typeFilter) {
      filtered = filtered.filter((poke) =>
        poke.types.some((t) => t.type.name === typeFilter)
      );
    }
    setFilteredPokemons(filtered);
  }, [searchTerm, typeFilter, pokemons]);

  // Group pokemons by type, ensuring no duplicates in each group
  const getTypeGroups = () => {
    const groups = {};
    filteredPokemons.forEach((poke) => {
      poke.types.forEach((t) => {
        const type = t.type.name;
        if (!groups[type]) groups[type] = new Map();
        groups[type].set(poke.id, poke); // Use Map to deduplicate by id
      });
    });
    // Convert each Map to array
    Object.keys(groups).forEach(type => {
      groups[type] = Array.from(groups[type].values());
    });
    return groups;
  };
  const typeGroups = getTypeGroups();
  const typesToShow = typeFilter ? [typeFilter] : Object.keys(typeGroups);
  const showGrouped = !searchTerm && !typeFilter;

  // Helper to render all details
  const renderPokemonDetails = (pokemon) => (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
      padding: 32,
      maxWidth: 420,
      margin: '40px auto',
      position: 'relative',
      zIndex: 1001
    }}>
      <button onClick={() => setSelectedPokemon(null)} style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: '#ef5350',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 32,
        height: 32,
        fontSize: 18,
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
      }}>×</button>
      <img src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} alt={pokemon.name} style={{ width: 180, height: 180, objectFit: 'contain', display: 'block', margin: '0 auto 16px auto' }} />
      <h2 style={{ textAlign: 'center', margin: '8px 0 4px 0' }}>{pokemon.name.toUpperCase()} <span style={{ color: '#888', fontSize: 18 }}>#{pokemon.id}</span></h2>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        {pokemon.types.map(t => (
          <span key={t.type.name} style={{ background: '#ffd600', borderRadius: 8, padding: '4px 12px', margin: '0 4px', fontWeight: 600 }}>{t.type.name}</span>
        ))}
      </div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Height:</b> {pokemon.height}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Weight:</b> {pokemon.weight}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Base Experience:</b> {pokemon.base_experience}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Abilities:</b> {pokemon.abilities.map(a => a.ability.name).join(', ')}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Stats:</b>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {pokemon.stats.map(s => (
            <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>
          ))}
        </ul>
      </div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Moves:</b> {pokemon.moves.slice(0, 8).map(m => m.move.name).join(', ')}{pokemon.moves.length > 8 ? '...' : ''}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Order:</b> {pokemon.order}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Species:</b> {pokemon.species.name}</div>
      <div style={{ fontSize: 15, color: '#444', marginBottom: 8 }}><b>Game Indices:</b> {pokemon.game_indices.length}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, position: 'relative' }}>
      <Header setSearchTerm={setSearchTerm} setTypeFilter={setTypeFilter} />
      {selectedPokemon && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.45)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {renderPokemonDetails(selectedPokemon)}
        </div>
      )}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="circle-loader" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : filteredPokemons.length === 0 ? (
        <p>No Pokémon found!</p>
      ) : showGrouped ? (
        typesToShow.map((type) => (
          <div key={type} style={{ marginBottom: 48 }}>
            <h2 style={{ textTransform: 'capitalize', margin: '24px 0 12px 0', color: '#555' }}>{type} Type</h2>
            <Slider {...{
              dots: true,
              infinite: true,
              speed: 800,
              slidesToShow: 3,
              slidesToScroll: 1,
              centerMode: true,
              autoplay: true,
              autoplaySpeed: 3500,
              pauseOnHover: true,
              arrows: true,
              responsive: [
                { breakpoint: 900, settings: { slidesToShow: 2 } },
                { breakpoint: 600, settings: { slidesToShow: 1 } }
              ]
            }}>
              {typeGroups[type].map((pokemon) => (
                <div key={pokemon.id} style={{ padding: 16 }}>
                  <div onClick={() => setSelectedPokemon(pokemon)} style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                    textAlign: 'center',
                    padding: 24,
                    minHeight: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}>
                    <img
                      src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      style={{ width: 220, height: 220, objectFit: 'contain', marginBottom: 16, transition: 'transform 0.3s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <h3 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>{pokemon.name.toUpperCase()}</h3>
                    <p style={{ margin: 0, color: '#888' }}>#{pokemon.id}</p>
                    <div style={{ marginTop: 8 }}>
                      {pokemon.types.map((t) => (
                        <span
                          key={t.type.name}
                          style={{
                            display: 'inline-block',
                            background: '#f5f5f5',
                            borderRadius: 8,
                            padding: '2px 10px',
                            margin: '0 4px',
                            fontSize: 13,
                            fontWeight: 500,
                            color: '#333'
                          }}
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ))
      ) : (
        <Slider {...{
          dots: true,
          infinite: true,
          speed: 800,
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          autoplay: true,
          autoplaySpeed: 3500,
          pauseOnHover: true,
          arrows: true,
          responsive: [
            { breakpoint: 900, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
          ]
        }}>
          {filteredPokemons.map((pokemon) => (
            <div key={pokemon.id} style={{ padding: 16 }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                textAlign: 'center',
                padding: 24,
                minHeight: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  style={{ width: 220, height: 220, objectFit: 'contain', marginBottom: 16, transition: 'transform 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <h3 style={{ margin: 0, fontWeight: 700, letterSpacing: 1 }}>{pokemon.name.toUpperCase()}</h3>
                <p style={{ margin: 0, color: '#888' }}>#{pokemon.id}</p>
                <div style={{ marginTop: 8 }}>
                  {pokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      style={{
                        display: 'inline-block',
                        background: '#f5f5f5',
                        borderRadius: 8,
                        padding: '2px 10px',
                        margin: '0 4px',
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
      <div className="sliding-bar"></div>
    </div>
  );
};

export default Home;
