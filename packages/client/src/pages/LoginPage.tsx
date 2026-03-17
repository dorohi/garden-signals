import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import YardIcon from '@mui/icons-material/Yard';
import { useStore } from '../stores';

const LoginPage = observer(() => {
  const { authStore } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authStore.login(email, password);
      navigate('/');
    } catch {
      // Error handled by store
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <YardIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              DachaCare
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Войдите в свой аккаунт
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Электронная почта"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={authStore.isLoading}
              sx={{ mb: 2 }}
            >
              {authStore.isLoading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
            <Typography variant="body2" textAlign="center">
              Нет аккаунта?{' '}
              <Link component={RouterLink} to="/register">
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});

export default LoginPage;
