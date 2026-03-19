import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useStore } from '../../stores';
import { imagesApi } from '../../services/api';

interface PestFormDialogProps {
  open: boolean;
  onClose: () => void;
  pest?: any;
}

export default function PestFormDialog({ open, onClose, pest }: PestFormDialogProps) {
  const { pestStore } = useStore();
  const isEdit = !!pest;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    signs: '',
    damage: '',
    preventionMethods: '',
    treatmentChemical: '',
    treatmentBio: '',
    treatmentFolk: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setImageFile(null);
      if (pest) {
        setForm({
          name: pest.name ?? '',
          signs: pest.signs ?? '',
          damage: pest.damage ?? '',
          preventionMethods: pest.preventionMethods ?? '',
          treatmentChemical: pest.treatmentChemical ?? '',
          treatmentBio: pest.treatmentBio ?? '',
          treatmentFolk: pest.treatmentFolk ?? '',
        });
      } else {
        setForm({ name: '', signs: '', damage: '', preventionMethods: '', treatmentChemical: '', treatmentBio: '', treatmentFolk: '' });
      }
    }
  }, [open, pest]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let entityId: string | null = null;

      if (isEdit) {
        const ok = await pestStore.updatePest(pest.id, form);
        if (ok) entityId = pest.id;
      } else {
        const created = await pestStore.createPest(form);
        if (created) entityId = created.id;
      }

      if (entityId && imageFile) {
        const { data: img } = await imagesApi.upload('pest', entityId, imageFile);
        await pestStore.updatePest(entityId, { imageUrl: img.url });
      }

      if (entityId) onClose();
    } finally {
      setLoading(false);
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
          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => fileInputRef.current?.click()}>
              {imageFile ? imageFile.name : 'Загрузить изображение'}
            </Button>
            {imageFile && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {(imageFile.size / 1024).toFixed(0)} КБ
              </Typography>
            )}
          </Box>
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
