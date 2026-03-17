import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SnoozeIcon from '@mui/icons-material/Snooze';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { plantsApi, schedulesApi } from '../../services/api';
import { useStore } from '../../stores';
import CareTypeIcon from '../../components/CareTypeIcon';
import PlantCategoryChip from '../../components/PlantCategoryChip';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useWikiImage } from '../../hooks/useWikiImage';
import CareLogTimeline from './CareLogTimeline';

const PlantDetailPage = observer(() => {
  const { plantId } = useParams<{ plantId: string }>();
  const { snackbarStore } = useStore();
  const [plant, setPlant] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const speciesName = plant?.variety?.species?.name ?? plant?.speciesName;
  const wikiImage = useWikiImage(speciesName);

  useEffect(() => {
    if (!plantId) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const [plantRes, schedulesRes, logsRes] = await Promise.all([
          plantsApi.getPlant(plantId),
          plantsApi.getSchedules(plantId),
          plantsApi.getLogs(plantId),
        ]);
        setPlant(plantRes.data);
        setSchedules(schedulesRes.data);
        setLogs(logsRes.data);
      } catch {
        snackbarStore.show('Ошибка загрузки данных растения', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [plantId, snackbarStore]);

  const handleComplete = async (scheduleId: string) => {
    try {
      await schedulesApi.completeSchedule(scheduleId);
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, completed: true } : s)),
      );
      snackbarStore.show('Задача выполнена', 'success');
    } catch {
      snackbarStore.show('Ошибка', 'error');
    }
  };

  const handleSnooze = async (scheduleId: string) => {
    try {
      await schedulesApi.snoozeSchedule(scheduleId);
      snackbarStore.show('Задача отложена', 'info');
    } catch {
      snackbarStore.show('Ошибка', 'error');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!plant) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Растение не найдено
      </Typography>
    );
  }

  const varietyName = plant.variety?.name ?? plant.varietyName;
  const categoryName = plant.variety?.species?.category?.name ?? plant.categoryName;
  const imageUrl = plant.variety?.species?.imageUrl || wikiImage;

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Мой сад', to: '/garden' },
          { label: plant.nickname || varietyName },
        ]}
      />
      <Card sx={{ mb: 3 }}>
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={speciesName}
            sx={{ height: 250, objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4">
              {plant.nickname || varietyName}
            </Typography>
            {categoryName && (
              <PlantCategoryChip category={categoryName} />
            )}
          </Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {speciesName} — {varietyName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {plant.plantedDate && (
              <Chip
                label={`Посажено: ${format(new Date(plant.plantedDate), 'd MMMM yyyy', { locale: ru })}`}
                variant="outlined"
                size="small"
              />
            )}
            {plant.quantity && (
              <Chip
                label={`Количество: ${plant.quantity}`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>
          {plant.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {plant.notes}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label="Расписание ухода" />
        <Tab label="Журнал ухода" />
      </Tabs>

      {activeTab === 0 && (
        <List>
          {schedules.map((schedule: any) => (
            <ListItem
              key={schedule.id}
              secondaryAction={
                <Box>
                  <Tooltip title="Выполнить">
                    <IconButton onClick={() => handleComplete(schedule.id)}>
                      <CheckCircleOutlineIcon color="action" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Отложить">
                    <IconButton onClick={() => handleSnooze(schedule.id)}>
                      <SnoozeIcon color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <ListItemIcon>
                <CareTypeIcon type={schedule.careType} />
              </ListItemIcon>
              <ListItemText
                primary={schedule.title}
                secondary={
                  schedule.nextDueDate
                    ? `Следующий: ${format(new Date(schedule.nextDueDate), 'd MMMM yyyy', { locale: ru })}`
                    : undefined
                }
              />
            </ListItem>
          ))}
          {schedules.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 2, px: 2 }}>
              Нет активных расписаний
            </Typography>
          )}
        </List>
      )}

      {activeTab === 1 && (
        <CareLogTimeline
          logs={logs}
          onUpdate={async () => {
            if (!plantId) return;
            const { data } = await plantsApi.getLogs(plantId);
            setLogs(data);
          }}
        />
      )}
    </Box>
  );
});

export default PlantDetailPage;
