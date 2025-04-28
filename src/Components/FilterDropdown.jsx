import React from 'react';

const types = [
  '', 'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon',
  'dark', 'steel', 'fairy'
];

const FilterDropdown = ({ setTypeFilter }) => {
  return (
    <select onChange={(e) => setTypeFilter(e.target.value)} className="filter-dropdown">
      {types.map((type) => (
        <option key={type} value={type}>
          {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'All Types'}
        </option>
      ))}
    </select>
  );
};
export default FilterDropdown;
