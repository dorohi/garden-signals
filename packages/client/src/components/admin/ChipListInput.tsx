import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';

interface ChipListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  color?: string;
}

export default function ChipListInput({ label, items, onChange, color = 'text.secondary' }: ChipListInputProps) {
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
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {items.length > 0 && (
        <List dense disablePadding sx={{ mb: 0.5 }}>
          {items.map((item, i) => (
            <ListItem
              key={i}
              disableGutters
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => removeItem(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
              sx={{ py: 0.25 }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                <CircleIcon sx={{ fontSize: 8, color }} />
              </ListItemIcon>
              <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
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
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
