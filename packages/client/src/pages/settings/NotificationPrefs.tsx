import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStore } from '../../stores';

const NotificationPrefs = observer(() => {
  const { notificationStore } = useStore();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    notificationStore.loadTelegramStatus();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [notificationStore]);

  const handleLinkTelegram = async () => {
    await notificationStore.linkTelegram();
    if (notificationStore.telegramDeepLink) {
      window.open(notificationStore.telegramDeepLink, '_blank');
      // Poll for status change while user is in Telegram
      pollRef.current = setInterval(async () => {
        await notificationStore.loadTelegramStatus();
        if (notificationStore.telegramLinked && pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }, 3000);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Telegram
        </Typography>

        {notificationStore.telegramLinked ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Chip
              icon={<CheckCircleIcon />}
              label="Telegram привязан — уведомления включены"
              color="success"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
            <Typography variant="body2" color="text.secondary">
              Вы будете получать напоминания об уходе за растениями в Telegram.
            </Typography>
            <Button
              size="small"
              color="error"
              variant="text"
              startIcon={<LinkOffIcon />}
              onClick={notificationStore.unlinkTelegram}
              disabled={notificationStore.isLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              Отвязать Telegram
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Привяжите Telegram-бота, чтобы получать напоминания об уходе за растениями.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<TelegramIcon />}
              onClick={handleLinkTelegram}
              disabled={notificationStore.isLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              Привязать Telegram
            </Button>
            {notificationStore.telegramDeepLink && !notificationStore.telegramLinked && (
              <Typography variant="caption" color="text.secondary">
                Если ссылка не открылась,{' '}
                <a
                  href={notificationStore.telegramDeepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  нажмите здесь
                </a>
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default NotificationPrefs;
