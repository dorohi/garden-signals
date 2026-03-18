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
import PestControlIcon from '@mui/icons-material/PestControl';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../../stores';
import PestCard from './PestCard';
import EmptyState from '../../components/EmptyState';
import PestFormDialog from '../../components/admin/PestFormDialog';

const PestsPage = observer(() => {
  const { pestStore, authStore } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const isAdmin = authStore.user?.role === 'ADMIN';

  useEffect(() => {
    pestStore.loadPests();
  }, [pestStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    if (query.trim()) {
      pestStore.searchPests(query.trim());
    } else {
      pestStore.loadPests();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Вредители
      </Typography>

      <TextField
        fullWidth
        placeholder="Поиск вредителей..."
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

      {pestStore.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : pestStore.pests.length === 0 ? (
        <EmptyState
          icon={<PestControlIcon sx={{ fontSize: 64 }} />}
          title="Вредители не найдены"
          subtitle="Попробуйте изменить запрос"
        />
      ) : (
        <Grid container spacing={2}>
          {pestStore.pests.map((pest: any) => (
            <Grid item xs={12} sm={6} md={6} key={pest.id}>
              <PestCard pest={pest} />
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
          <PestFormDialog
            open={createOpen}
            onClose={() => setCreateOpen(false)}
          />
        </>
      )}
    </Box>
  );
});

export default PestsPage;
