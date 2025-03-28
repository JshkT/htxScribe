import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      label="Search transcriptions"
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={{ mb: 3 }}
    />
  );
};

export default SearchBar; 