import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CareTypeIcon, { getCareTypeColor } from '../../components/CareTypeIcon';

interface CareLogTimelineProps {
  logs: any[];
}

export default function CareLogTimeline({ logs }: CareLogTimelineProps) {
  if (logs.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        Журнал ухода пуст
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {logs.map((log: any, index: number) => (
        <Box key={log.id ?? index}>
          <ListItem alignItems="flex-start" sx={{ px: 1 }}>
            <ListItemIcon
              sx={{
                minWidth: 40,
                mt: 0.5,
                color: getCareTypeColor(log.careType),
              }}
            >
              <CareTypeIcon type={log.careType} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">{log.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(log.performedAt ?? log.createdAt), 'd MMM yyyy', {
                      locale: ru,
                    })}
                  </Typography>
                </Box>
              }
              secondary={log.notes || undefined}
            />
          </ListItem>
          {index < logs.length - 1 && <Divider variant="inset" component="li" />}
        </Box>
      ))}
    </List>
  );
}
