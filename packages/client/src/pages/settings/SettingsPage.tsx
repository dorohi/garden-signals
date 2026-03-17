import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useStore } from '../../stores';
import RegionSelector from './RegionSelector';
import NotificationPrefs from './NotificationPrefs';

const SettingsPage = observer(() => {
  const { authStore, themeStore } = useStore();
  const user = authStore.user;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Профиль
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <TextField
              label="Имя"
              value={user?.name ?? ''}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />
            <TextField
              label="Электронная почта"
              value={user?.email ?? ''}
              slotProps={{ input: { readOnly: true } }}
              fullWidth
            />
            <Chip
              icon={user?.role === 'ADMIN' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
              label={user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
              color={user?.role === 'ADMIN' ? 'primary' : 'default'}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Регион
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <RegionSelector />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Уведомления
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <NotificationPrefs />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Оформление
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={themeStore.mode === 'dark'}
                onChange={themeStore.toggle}
              />
            }
            label="Тёмная тема"
          />
        </CardContent>
      </Card>
    </Box>
  );
});

export default SettingsPage;
