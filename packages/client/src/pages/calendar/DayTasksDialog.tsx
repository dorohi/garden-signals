import { useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'complete' | 'snooze' | null>(null);

  if (!date) return null;

  const dayEvents = events.filter((event: any) =>
    isSameDay(new Date(event.nextDueDate), date),
  );

  const title = format(date, "d MMMM yyyy, EEEE", { locale: ru });

  const handleConfirm = async () => {
    if (!confirmId || !confirmAction) return;
    if (confirmAction === 'complete') {
      await calendarStore.completeTask(confirmId);
    } else {
      await calendarStore.snoozeTask(confirmId);
    }
    setConfirmId(null);
    setConfirmAction(null);
  };

  return (
    <>
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
                  key={event.id ?? index}
                  secondaryAction={
                    <Tooltip title="Отложить">
                      <IconButton
                        edge="end"
                        onClick={() => { setConfirmId(event.id); setConfirmAction('snooze'); }}
                      >
                        <SnoozeIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemIcon>
                    <Tooltip title="Выполнить">
                      <IconButton
                        edge="start"
                        onClick={() => { setConfirmId(event.id); setConfirmAction('complete'); }}
                      >
                        <CheckCircleOutlineIcon color="action" />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CareTypeIcon type={event.careType} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={event.userPlant?.nickname || event.userPlant?.variety?.species?.name}
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

      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)} maxWidth="xs">
        <DialogTitle>
          {confirmAction === 'complete' ? 'Выполнить задачу?' : 'Отложить задачу?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmAction === 'complete'
              ? 'Задача будет отмечена как выполненная и перенесена на следующую дату.'
              : 'Задача будет перенесена на завтра.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Отмена</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={confirmAction === 'complete' ? 'success' : 'primary'}
          >
            {confirmAction === 'complete' ? 'Выполнить' : 'Отложить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default DayTasksDialog;
