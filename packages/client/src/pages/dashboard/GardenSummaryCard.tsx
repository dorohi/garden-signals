import { observer } from 'mobx-react-lite';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import YardIcon from '@mui/icons-material/Yard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStore } from '../../stores';

const GardenSummaryCard = observer(() => {
  const { gardenStore, calendarStore } = useStore();

  const totalPlants = gardenStore.gardens.reduce(
    (sum: number, g: any) => sum + (g.plantCount ?? 0),
    0,
  );

  const completedToday = 0; // Will be populated from server data

  const stats = [
    {
      icon: <YardIcon color="primary" />,
      label: 'Растений',
      value: totalPlants,
    },
    {
      icon: <ScheduleIcon color="info" />,
      label: 'Активных задач',
      value: calendarStore.todayTasks.length,
    },
    {
      icon: <CheckCircleIcon color="success" />,
      label: 'Выполнено сегодня',
      value: completedToday,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Мой сад
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
            }}
          >
            {stat.icon}
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
});

export default GardenSummaryCard;
