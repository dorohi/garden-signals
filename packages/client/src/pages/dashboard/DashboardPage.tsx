import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStore } from '../../stores';
import TodayTaskList from './TodayTaskList';
import GardenSummaryCard from './GardenSummaryCard';

const DashboardPage = observer(() => {
  const { calendarStore, gardenStore } = useStore();

  useEffect(() => {
    calendarStore.loadTodayTasks();
    gardenStore.loadGardens();
  }, [calendarStore, gardenStore]);

  const today = format(new Date(), "d MMMM yyyy", { locale: ru });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Задачи на сегодня
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {today}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          {calendarStore.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TodayTaskList />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <GardenSummaryCard />
        </Box>
      </Box>
    </Box>
  );
});

export default DashboardPage;
