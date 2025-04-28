import React from 'react';
const SearchBar = ({ setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search Pokémon..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-bar"
    />
  );
};
export default SearchBar;
