import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';

interface ChipListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export default function ChipListInput({ label, items, onChange, color = 'default' }: ChipListInputProps) {
  const [input, setInput] = useState('');

  const addItem = () => {
    const value = input.trim();
    if (value) {
      onChange([...items, value]);
      setInput('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      {items.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {items.map((item, i) => (
            <Chip
              key={i}
              label={item}
              size="small"
              color={color}
              variant="outlined"
              onDelete={() => removeItem(i)}
            />
          ))}
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Добавить..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <IconButton size="small" onClick={addItem} disabled={!input.trim()} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
