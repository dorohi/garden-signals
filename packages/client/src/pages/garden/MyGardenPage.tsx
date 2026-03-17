import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import PlantCard from './PlantCard';
import AddPlantDialog from './AddPlantDialog';
import EmptyState from '../../components/EmptyState';

const MyGardenPage = observer(() => {
  const { gardenId } = useParams<{ gardenId?: string }>();
  const { gardenStore } = useStore();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    gardenStore.loadGardens();
  }, [gardenStore]);

  useEffect(() => {
    const id = gardenId ?? gardenStore.gardens[0]?.id;
    if (id) {
      gardenStore.loadPlants(id);
      gardenStore.loadGarden(id);
    }
  }, [gardenId, gardenStore, gardenStore.gardens.length]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    const garden = gardenStore.gardens[newValue];
    if (garden) {
      gardenStore.loadPlants(garden.id);
      gardenStore.loadGarden(garden.id);
    }
  };

  if (gardenStore.isLoading && gardenStore.gardens.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (gardenStore.gardens.length === 0) {
    return (
      <EmptyState
        icon={<YardIcon sx={{ fontSize: 64 }} />}
        title="У вас пока нет сада"
        subtitle="Создайте свой первый сад, чтобы начать отслеживать растения"
        actionLabel="Создать сад"
        onAction={() => setAddDialogOpen(true)}
      />
    );
  }

  const currentGardenId = gardenId ?? gardenStore.gardens[selectedTab]?.id;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Мой сад
      </Typography>

      {gardenStore.gardens.length > 1 && (
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          {gardenStore.gardens.map((garden: any) => (
            <Tab key={garden.id} label={garden.name} />
          ))}
        </Tabs>
      )}

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
        gardenId={currentGardenId}
      />
    </Box>
  );
});

export default MyGardenPage;
