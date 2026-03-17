import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStore } from '../../stores';
import CalendarGrid from './CalendarGrid';
import DayTasksDialog from './DayTasksDialog';

const CalendarPage = observer(() => {
  const { calendarStore } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const from = startOfMonth(calendarStore.currentDate).toISOString();
    const to = endOfMonth(calendarStore.currentDate).toISOString();
    calendarStore.loadEvents(from, to);
  }, [calendarStore, calendarStore.currentDate]);

  const handlePrev = () => {
    calendarStore.setCurrentDate(subMonths(calendarStore.currentDate, 1));
  };

  const handleNext = () => {
    calendarStore.setCurrentDate(addMonths(calendarStore.currentDate, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const monthTitle = format(calendarStore.currentDate, 'LLLL yyyy', { locale: ru });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
          {monthTitle}
        </Typography>
        <IconButton onClick={handlePrev}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={handleNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {calendarStore.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CalendarGrid
          currentDate={calendarStore.currentDate}
          events={calendarStore.events}
          onDayClick={handleDayClick}
        />
      )}

      <DayTasksDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        date={selectedDate}
        events={calendarStore.events}
      />
    </Box>
  );
});

export default CalendarPage;
