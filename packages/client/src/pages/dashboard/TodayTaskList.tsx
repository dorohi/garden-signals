import { observer } from 'mobx-react-lite';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import SnoozeIcon from '@mui/icons-material/Snooze';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useStore } from '../../stores';
import CareTypeIcon from '../../components/CareTypeIcon';
import EmptyState from '../../components/EmptyState';

const TodayTaskList = observer(() => {
  const { calendarStore } = useStore();

  if (calendarStore.todayTasks.length === 0) {
    return (
      <EmptyState
        icon={<EventAvailableIcon sx={{ fontSize: 64 }} />}
        title="Нет задач на сегодня"
        subtitle="Все задачи выполнены или ещё не запланированы"
      />
    );
  }

  return (
    <Paper variant="outlined">
      <List>
        {calendarStore.todayTasks.map((task: any) => (
          <ListItem
            key={task.scheduleId}
            secondaryAction={
              <Tooltip title="Отложить">
                <IconButton
                  edge="end"
                  onClick={() => calendarStore.snoozeTask(task.scheduleId)}
                >
                  <SnoozeIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                onChange={() => calendarStore.completeTask(task.scheduleId)}
              />
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CareTypeIcon type={task.careType} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              secondary={task.plantName}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
});

export default TodayTaskList;
