import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';

const ProductSearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 4 }}>
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
