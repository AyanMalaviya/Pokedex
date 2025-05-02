import React from 'react';
import './Header.css';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';

const Header = ({ setSearchTerm, setTypeFilter }) => (
  <header className="header">
    <h1>Pokedex Explorer</h1>
    <div
      style={{
        position: 'relative',
        width: '100%',
        marginTop: 16,
        minHeight: 56
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </div>
      <div style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)' }}>
        <FilterDropdown setTypeFilter={setTypeFilter} />
      </div>
    </div>
  </header>
);

export default Header;
