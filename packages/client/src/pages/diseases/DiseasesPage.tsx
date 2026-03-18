import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import BugReportIcon from '@mui/icons-material/BugReport';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../../stores';
import DiseaseCard from './DiseaseCard';
import EmptyState from '../../components/EmptyState';
import DiseaseFormDialog from '../../components/admin/DiseaseFormDialog';

const DiseasesPage = observer(() => {
  const { diseaseStore, authStore } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const isAdmin = authStore.user?.role === 'ADMIN';

  useEffect(() => {
    diseaseStore.loadDiseases();
  }, [diseaseStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    if (query.trim()) {
      diseaseStore.searchDiseases(query.trim());
    } else {
      diseaseStore.loadDiseases();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Болезни растений
      </Typography>

      <TextField
        fullWidth
        placeholder="Поиск болезней..."
        value={searchInput}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {diseaseStore.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : diseaseStore.diseases.length === 0 ? (
        <EmptyState
          icon={<BugReportIcon sx={{ fontSize: 64 }} />}
          title="Болезни не найдены"
          subtitle="Попробуйте изменить запрос"
        />
      ) : (
        <Grid container spacing={2}>
          {diseaseStore.diseases.map((disease: any) => (
            <Grid item xs={12} sm={6} md={6} key={disease.id}>
              <DiseaseCard disease={disease} />
            </Grid>
          ))}
        </Grid>
      )}

      {isAdmin && (
        <>
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => setCreateOpen(true)}
          >
            <AddIcon />
          </Fab>
          <DiseaseFormDialog
            open={createOpen}
            onClose={() => setCreateOpen(false)}
          />
        </>
      )}
    </Box>
  );
});

export default DiseasesPage;
