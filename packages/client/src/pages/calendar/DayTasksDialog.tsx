import { observer } from 'mobx-react-lite';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SnoozeIcon from '@mui/icons-material/Snooze';
import { format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStore } from '../../stores';
import CareTypeIcon from '../../components/CareTypeIcon';

interface DayTasksDialogProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  events: any[];
}

const DayTasksDialog = observer(({ open, onClose, date, events }: DayTasksDialogProps) => {
  const { calendarStore } = useStore();

  if (!date) return null;

  const dayEvents = events.filter((event: any) =>
    isSameDay(new Date(event.date), date),
  );

  const title = format(date, "d MMMM yyyy, EEEE", { locale: ru });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textTransform: 'capitalize' }}>{title}</DialogTitle>
      <DialogContent>
        {dayEvents.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            Нет задач на этот день
          </Typography>
        ) : (
          <List>
            {dayEvents.map((event: any, index: number) => (
              <ListItem
                key={event.scheduleId ?? index}
                secondaryAction={
                  event.scheduleId ? (
                    <Tooltip title="Отложить">
                      <IconButton
                        edge="end"
                        onClick={() => calendarStore.snoozeTask(event.scheduleId)}
                      >
                        <SnoozeIcon />
                      </IconButton>
                    </Tooltip>
                  ) : undefined
                }
              >
                {event.scheduleId && (
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      onChange={() => calendarStore.completeTask(event.scheduleId)}
                    />
                  </ListItemIcon>
                )}
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CareTypeIcon type={event.careType} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  secondary={event.plantName}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
});

export default DayTasksDialog;
