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

  // Group pokemons by type
  const getTypeGroups = () => {
    const groups = {};
    filteredPokemons.forEach((poke) => {
      poke.types.forEach((t) => {
        const type = t.type.name;
        if (!groups[type]) groups[type] = [];
        groups[type].push(poke);
      });
    });
    return groups;
  };
  const typeGroups = getTypeGroups();
  const typesToShow = typeFilter ? [typeFilter] : Object.keys(typeGroups);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Header setSearchTerm={setSearchTerm} setTypeFilter={setTypeFilter} />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredPokemons.length === 0 ? (
        <p>No Pokémon found!</p>
      ) : (
        typesToShow.map((type) => (
          <div key={type} style={{ marginBottom: 48 }}>
            <h2 style={{ textTransform: 'capitalize', margin: '24px 0 12px 0', color: '#555' }}>{type} Type</h2>
            <Slider {...{
              dots: false,
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
          </div>
        ))
      )}
      <div className="sliding-bar"></div>
    </div>
  );
};

export default Home;
