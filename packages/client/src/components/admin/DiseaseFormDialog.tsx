import { useState, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useStore } from '../../stores';
import { imagesApi } from '../../services/api';
import ImageUploadPreview from './ImageUploadPreview';
import ChipListInput from './ChipListInput';

const SEPARATOR = '. ';

function textToItems(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split(/(?:\.\s+|\;\s+|,\s+(?=[A-ZА-ЯЁ]))/).map(s => s.replace(/\.$/, '').trim()).filter(s => s.length > 0);
}

function itemsToText(items: string[]): string {
  return items.join(SEPARATOR);
}

interface DiseaseFormDialogProps {
  open: boolean;
  onClose: () => void;
  disease?: any;
}

export default function DiseaseFormDialog({ open, onClose, disease }: DiseaseFormDialogProps) {
  const { diseaseStore } = useStore();
  const isEdit = !!disease;

  const [form, setForm] = useState({ name: '', symptoms: '', cause: '', prevention: '' });
  const [chemical, setChemical] = useState<string[]>([]);
  const [bio, setBio] = useState<string[]>([]);
  const [folk, setFolk] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return disease?.imageUrl ?? null;
  }, [imageFile, disease?.imageUrl]);

  useEffect(() => {
    return () => { if (imageFile) URL.revokeObjectURL(previewUrl!); };
  }, [previewUrl, imageFile]);

  useEffect(() => {
    if (open) {
      setImageFile(null);
      if (disease) {
        setForm({
          name: disease.name ?? '',
          symptoms: disease.symptoms ?? '',
          cause: disease.cause ?? '',
          prevention: disease.prevention ?? '',
        });
        setChemical(textToItems(disease.treatmentChemical));
        setBio(textToItems(disease.treatmentBio));
        setFolk(textToItems(disease.treatmentFolk));
      } else {
        setForm({ name: '', symptoms: '', cause: '', prevention: '' });
        setChemical([]);
        setBio([]);
        setFolk([]);
      }
    }
  }, [open, disease]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        treatmentChemical: itemsToText(chemical) || null,
        treatmentBio: itemsToText(bio) || null,
        treatmentFolk: itemsToText(folk) || null,
      };

      let entityId: string | null = null;

      if (isEdit) {
        const ok = await diseaseStore.updateDisease(disease.id, payload);
        if (ok) entityId = disease.id;
      } else {
        const created = await diseaseStore.createDisease(payload);
        if (created) entityId = created.id;
      }

      if (entityId && imageFile) {
        const { data: img } = await imagesApi.upload('disease', entityId, imageFile);
        await diseaseStore.updateDisease(entityId, { imageUrl: img.url });
      }

      if (entityId) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать болезнь' : 'Новая болезнь'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '3fr 2fr' }, gap: 3, mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Название" value={form.name} onChange={handleChange('name')} required fullWidth />
            <TextField label="Симптомы" value={form.symptoms} onChange={handleChange('symptoms')} required multiline rows={3} fullWidth />
            <TextField label="Причина" value={form.cause} onChange={handleChange('cause')} multiline rows={2} fullWidth />
            <TextField label="Профилактика" value={form.prevention} onChange={handleChange('prevention')} multiline rows={2} fullWidth />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ImageUploadPreview previewUrl={previewUrl} onFileSelect={setImageFile} />
            </Box>
            <ChipListInput label="Химические методы борьбы" items={chemical} onChange={setChemical} color="error.main" />
            <ChipListInput label="Биологические методы борьбы" items={bio} onChange={setBio} color="success.main" />
            <ChipListInput label="Народные методы борьбы" items={folk} onChange={setFolk} color="warning.main" />
          </Box>
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
