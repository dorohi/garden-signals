import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from '../../stores';

interface PestFormDialogProps {
  open: boolean;
  onClose: () => void;
  pest?: any;
}

export default function PestFormDialog({ open, onClose, pest }: PestFormDialogProps) {
  const { pestStore } = useStore();
  const isEdit = !!pest;

  const [form, setForm] = useState({
    name: '',
    signs: '',
    damage: '',
    preventionMethods: '',
    treatmentChemical: '',
    treatmentBio: '',
    treatmentFolk: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (pest) {
        setForm({
          name: pest.name ?? '',
          signs: pest.signs ?? '',
          damage: pest.damage ?? '',
          preventionMethods: pest.preventionMethods ?? '',
          treatmentChemical: pest.treatmentChemical ?? '',
          treatmentBio: pest.treatmentBio ?? '',
          treatmentFolk: pest.treatmentFolk ?? '',
          imageUrl: pest.imageUrl ?? '',
        });
      } else {
        setForm({ name: '', signs: '', damage: '', preventionMethods: '', treatmentChemical: '', treatmentBio: '', treatmentFolk: '', imageUrl: '' });
      }
    }
  }, [open, pest]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const ok = isEdit
      ? await pestStore.updatePest(pest.id, form)
      : await pestStore.createPest(form);
    setLoading(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать вредителя' : 'Новый вредитель'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={form.name} onChange={handleChange('name')} required fullWidth />
          <TextField label="Признаки поражения" value={form.signs} onChange={handleChange('signs')} required multiline rows={2} fullWidth />
          <TextField label="Наносимый вред" value={form.damage} onChange={handleChange('damage')} multiline rows={2} fullWidth />
          <TextField label="Профилактика" value={form.preventionMethods} onChange={handleChange('preventionMethods')} multiline rows={2} fullWidth />
          <TextField label="Химические методы борьбы" value={form.treatmentChemical} onChange={handleChange('treatmentChemical')} multiline rows={2} fullWidth />
          <TextField label="Биологические методы борьбы" value={form.treatmentBio} onChange={handleChange('treatmentBio')} multiline rows={2} fullWidth />
          <TextField label="Народные методы борьбы" value={form.treatmentFolk} onChange={handleChange('treatmentFolk')} multiline rows={2} fullWidth />
          <TextField label="URL изображения" value={form.imageUrl} onChange={handleChange('imageUrl')} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !form.name || !form.signs}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
