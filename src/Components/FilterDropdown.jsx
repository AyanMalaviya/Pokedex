import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Popover,
  Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const types = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon',
  'dark', 'steel', 'fairy'
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const FilterDropdown = ({ setTypeFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (type) => {
    let updatedTypes;
    if (type === '') {
      updatedTypes = [];
    } else if (selectedTypes.includes(type)) {
      updatedTypes = selectedTypes.filter(t => t !== type);
    } else {
      updatedTypes = [...selectedTypes, type];
    }
    setSelectedTypes(updatedTypes);
    setTypeFilter(updatedTypes);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        variant="contained"
        color="warning"
        startIcon={<FilterAltIcon />}
        onClick={handleButtonClick}
        sx={{ borderRadius: 3, fontWeight: 600, boxShadow: 2 }}
      >
        {selectedTypes.length > 0
          ? `${selectedTypes.length} Type${selectedTypes.length > 1 ? 's' : ''} Selected`
          : 'Filter by Type'}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, borderRadius: 3, minWidth: 220 } }}
      >
        <FormControl component="fieldset" variant="standard">
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Pokémon Types
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTypes.length === 0}
                  onChange={() => handleCheckboxChange('')}
                  color="primary"
                />
              }
              label="All Types"
            />
            {types.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    color="primary"
                  />
                }
                label={capitalize(type)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Popover>
    </div>
  );
};

export default FilterDropdown;