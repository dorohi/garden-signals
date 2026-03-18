import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from '../../stores';

interface DiseaseFormDialogProps {
  open: boolean;
  onClose: () => void;
  disease?: any;
}

export default function DiseaseFormDialog({ open, onClose, disease }: DiseaseFormDialogProps) {
  const { diseaseStore } = useStore();
  const isEdit = !!disease;

  const [form, setForm] = useState({
    name: '',
    symptoms: '',
    cause: '',
    prevention: '',
    treatmentChemical: '',
    treatmentBio: '',
    treatmentFolk: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (disease) {
        setForm({
          name: disease.name ?? '',
          symptoms: disease.symptoms ?? '',
          cause: disease.cause ?? '',
          prevention: disease.prevention ?? '',
          treatmentChemical: disease.treatmentChemical ?? '',
          treatmentBio: disease.treatmentBio ?? '',
          treatmentFolk: disease.treatmentFolk ?? '',
          imageUrl: disease.imageUrl ?? '',
        });
      } else {
        setForm({ name: '', symptoms: '', cause: '', prevention: '', treatmentChemical: '', treatmentBio: '', treatmentFolk: '', imageUrl: '' });
      }
    }
  }, [open, disease]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const ok = isEdit
      ? await diseaseStore.updateDisease(disease.id, form)
      : await diseaseStore.createDisease(form);
    setLoading(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать болезнь' : 'Новая болезнь'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={form.name} onChange={handleChange('name')} required fullWidth />
          <TextField label="Симптомы" value={form.symptoms} onChange={handleChange('symptoms')} required multiline rows={2} fullWidth />
          <TextField label="Причина" value={form.cause} onChange={handleChange('cause')} multiline rows={2} fullWidth />
          <TextField label="Профилактика" value={form.prevention} onChange={handleChange('prevention')} multiline rows={2} fullWidth />
          <TextField label="Химические методы борьбы" value={form.treatmentChemical} onChange={handleChange('treatmentChemical')} multiline rows={2} fullWidth />
          <TextField label="Биологические методы борьбы" value={form.treatmentBio} onChange={handleChange('treatmentBio')} multiline rows={2} fullWidth />
          <TextField label="Народные методы борьбы" value={form.treatmentFolk} onChange={handleChange('treatmentFolk')} multiline rows={2} fullWidth />
          <TextField label="URL изображения" value={form.imageUrl} onChange={handleChange('imageUrl')} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !form.name || !form.symptoms}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
