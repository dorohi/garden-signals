import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import YardIcon from '@mui/icons-material/Yard';
import { useStore } from '../../stores';
import Breadcrumbs from '../../components/Breadcrumbs';
import PlantCard from './PlantCard';
import AddPlantDialog from './AddPlantDialog';
import EmptyState from '../../components/EmptyState';
import CalendarPage from '../calendar/CalendarPage';

const MyGardenPage = observer(() => {
  const { gardenId } = useParams<{ gardenId: string }>();
  const navigate = useNavigate();
  const { gardenStore } = useStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!gardenId) {
      navigate('/garden');
      return;
    }
    gardenStore.loadGarden(gardenId);
    gardenStore.loadPlants(gardenId);
  }, [gardenId, gardenStore, navigate]);

  if (gardenStore.isLoading && !gardenStore.currentGarden) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!gardenStore.currentGarden) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Сад не найден
      </Typography>
    );
  }

  const garden = gardenStore.currentGarden;

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Мои сады', to: '/garden' },
          { label: garden.name },
        ]}
      />

      <Typography variant="h4" gutterBottom>
        {garden.name}
      </Typography>
      {garden.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {garden.description}
        </Typography>
      )}

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Растения" />
        <Tab label="Календарь" />
      </Tabs>

      {activeTab === 0 && (
        <>
          {gardenStore.userPlants.length === 0 ? (
            <EmptyState
              icon={<YardIcon sx={{ fontSize: 64 }} />}
              title="В саду пока нет растений"
              subtitle="Добавьте первое растение из каталога"
              actionLabel="Добавить растение"
              onAction={() => setAddDialogOpen(true)}
            />
          ) : (
            <Grid container spacing={2}>
              {gardenStore.userPlants.map((plant: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={plant.id}>
                  <PlantCard plant={plant} />
                </Grid>
              ))}
            </Grid>
          )}

          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => setAddDialogOpen(true)}
          >
            <AddIcon />
          </Fab>

          <AddPlantDialog
            open={addDialogOpen}
            onClose={() => setAddDialogOpen(false)}
            gardenId={gardenId}
          />
        </>
      )}

      {activeTab === 1 && <CalendarPage />}
    </Box>
  );
});

export default MyGardenPage;
