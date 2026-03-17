import { useState } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import CareTypeIcon, { getCareTypeColor } from '../../components/CareTypeIcon';
import { plantsApi } from '../../services/api';

interface CareLogTimelineProps {
  logs: any[];
  onUpdate?: () => void;
}

export default function CareLogTimeline({ logs, onUpdate }: CareLogTimelineProps) {
  const [editLog, setEditLog] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (log: any) => {
    setEditLog(log);
    setEditTitle(log.title);
    setEditNotes(log.notes ?? '');
  };

  const handleSave = async () => {
    if (!editLog) return;
    setSaving(true);
    try {
      await plantsApi.updateLog(editLog.id, { title: editTitle, notes: editNotes || undefined });
      setEditLog(null);
      onUpdate?.();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      await plantsApi.deleteLog(logId);
      onUpdate?.();
    } catch {
      // ignore
    }
  };

  if (logs.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        Журнал ухода пуст
      </Typography>
    );
  }

  return (
    <>
      <List disablePadding>
        {logs.map((log: any, index: number) => (
          <Box key={log.id ?? index}>
            <ListItem alignItems="flex-start" sx={{ px: 1 }}>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  mt: 0.5,
                  color: getCareTypeColor(log.careType),
                }}
              >
                <CareTypeIcon type={log.careType} fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 8 }}>
                    <Typography variant="subtitle2">{log.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {format(new Date(log.completedAt ?? log.performedAt ?? log.createdAt), 'd MMM yyyy', {
                        locale: ru,
                      })}
                    </Typography>
                  </Box>
                }
                secondary={log.notes || undefined}
              />
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
                <Tooltip title="Редактировать">
                  <IconButton size="small" onClick={() => handleEdit(log)}>
                    <EditIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Удалить">
                  <IconButton size="small" onClick={() => handleDelete(log.id)}>
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
            {index < logs.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>

      <Dialog open={!!editLog} onClose={() => setEditLog(null)} fullWidth maxWidth="sm">
        <DialogTitle>Редактировать запись</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Название"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Заметки"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditLog(null)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !editTitle.trim()}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
