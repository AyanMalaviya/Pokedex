import React from 'react';
import './Header.css';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';

const Header = ({ setSearchTerm, setTypeFilter }) => (
  <header className="header">
    <h1>Pokedex Explorer</h1>
    <div
      style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16
      }}
    >
      <SearchBar setSearchTerm={setSearchTerm} />
      <FilterDropdown setTypeFilter={setTypeFilter} />
    </div>
  </header>
);

export default Header;
