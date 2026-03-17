import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';

interface TreatmentListProps {
  text: string | null | undefined;
  color?: string;
}

function splitToItems(text: string): string[] {
  // Split by periods, semicolons, or numbered patterns, then filter empty
  return text
    .split(/(?:\.\s+|\;\s+|,\s+(?=[A-ZА-ЯЁ]))/)
    .map((s) => s.replace(/\.$/, '').trim())
    .filter((s) => s.length > 3);
}

export default function TreatmentList({ text, color = 'primary.main' }: TreatmentListProps) {
  if (!text) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        Нет данных
      </Typography>
    );
  }

  const items = splitToItems(text);

  if (items.length <= 1) {
    return (
      <Typography variant="body1" sx={{ py: 1 }}>
        {text}
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {items.map((item, i) => (
        <ListItem key={i} sx={{ py: 0.5, alignItems: 'flex-start' }}>
          <ListItemIcon sx={{ minWidth: 24, mt: 1 }}>
            <CircleIcon sx={{ fontSize: 8, color }} />
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
}
