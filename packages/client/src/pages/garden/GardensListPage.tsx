import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import YardIcon from '@mui/icons-material/Yard';
import GrassIcon from '@mui/icons-material/Grass';
import { useStore } from '../../stores';
import EmptyState from '../../components/EmptyState';

const GardensListPage = observer(() => {
  const { gardenStore } = useStore();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    gardenStore.loadGardens();
  }, [gardenStore]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const garden = await gardenStore.createGarden(newName.trim(), newDesc.trim() || undefined);
      setCreateOpen(false);
      setNewName('');
      setNewDesc('');
      navigate(`/garden/${garden.id}`);
    } catch {
      // handled by store
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, gardenId: string) => {
    e.stopPropagation();
    if (!gardenStore.deleteGarden) return;
    await gardenStore.deleteGarden(gardenId);
  };

  if (gardenStore.isLoading && gardenStore.gardens.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Мои сады
      </Typography>

      {gardenStore.gardens.length === 0 ? (
        <EmptyState
          icon={<YardIcon sx={{ fontSize: 64 }} />}
          title="У вас пока нет сада"
          subtitle="Создайте свой первый сад, чтобы начать отслеживать растения"
          actionLabel="Создать сад"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <Grid container spacing={2}>
          {gardenStore.gardens.map((garden: any) => (
            <Grid item xs={12} sm={6} md={4} key={garden.id}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => navigate(`/garden/${garden.id}`)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GrassIcon color="primary" />
                      <Typography variant="h6" sx={{ flex: 1 }}>
                        {garden.name}
                      </Typography>
                      {gardenStore.gardens.length > 1 && (
                        <Tooltip title="Удалить сад">
                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(e, garden.id)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    {garden.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {garden.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {garden._count?.plants ?? 0} растений
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setCreateOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Новый сад</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Название"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Описание (необязательно)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button onClick={handleCreate} variant="contained" disabled={creating || !newName.trim()}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default GardensListPage;
