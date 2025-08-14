// src/components/ProductSearchBar.jsx
import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductSearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar produtos..."
        value={search}
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ProductSearchBar;
