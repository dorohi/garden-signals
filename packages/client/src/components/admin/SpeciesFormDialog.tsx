import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useStore } from '../../stores';
import { imagesApi } from '../../services/api';

const sunOptions = [
  { value: 'FULL_SUN', label: 'Полное солнце' },
  { value: 'PARTIAL_SHADE', label: 'Полутень' },
  { value: 'FULL_SHADE', label: 'Тень' },
];

const soilOptions = [
  { value: 'SANDY', label: 'Песчаная' },
  { value: 'LOAMY', label: 'Суглинистая' },
  { value: 'CLAY', label: 'Глинистая' },
  { value: 'PEATY', label: 'Торфяная' },
  { value: 'CHALKY', label: 'Известковая' },
  { value: 'SILTY', label: 'Илистая' },
];

interface SpeciesFormDialogProps {
  open: boolean;
  onClose: () => void;
  species?: any;
}

export default function SpeciesFormDialog({ open, onClose, species }: SpeciesFormDialogProps) {
  const { catalogStore } = useStore();
  const isEdit = !!species;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    nameScientific: '',
    categoryId: '',
    description: '',
    wateringIntervalDays: 7,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setImageFile(null);
      if (species) {
        setForm({
          name: species.name ?? '',
          nameScientific: species.nameScientific ?? '',
          categoryId: species.categoryId ?? '',
          description: species.description ?? '',
          wateringIntervalDays: species.wateringIntervalDays ?? 7,
          wateringNormLiters: species.wateringNormLiters ?? 5,
          sunRequirement: species.sunRequirement ?? 'FULL_SUN',
          soilType: species.soilType ?? 'LOAMY',
        });
      } else {
        setForm({
          name: '',
          nameScientific: '',
          categoryId: catalogStore.categories[0]?.id ?? '',
          description: '',
          wateringIntervalDays: 7,
          wateringNormLiters: 5,
          sunRequirement: 'FULL_SUN',
          soilType: 'LOAMY',
        });
      }
    }
  }, [open, species, catalogStore.categories]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let entityId: string | null = null;

      if (isEdit) {
        const ok = await catalogStore.updateSpecies(species.id, form);
        if (ok) entityId = species.id;
      } else {
        const created = await catalogStore.createSpecies(form);
        if (created) entityId = created.id;
      }

      if (entityId && imageFile) {
        const { data: img } = await imagesApi.upload('species', entityId, imageFile);
        await catalogStore.updateSpecies(entityId, { imageUrl: img.url });
      }

      if (entityId) onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Редактировать вид' : 'Новый вид'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={form.name} onChange={handleChange('name')} required fullWidth />
          <TextField label="Научное название" value={form.nameScientific} onChange={handleChange('nameScientific')} fullWidth />
          <TextField
            label="Категория"
            value={form.categoryId}
            onChange={handleChange('categoryId')}
            select
            required
            fullWidth
          >
            {catalogStore.categories.map((cat: any) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <TextField label="Описание" value={form.description} onChange={handleChange('description')} multiline rows={3} fullWidth />
          <TextField label="Интервал полива (дней)" type="number" value={form.wateringIntervalDays} onChange={handleChange('wateringIntervalDays')} fullWidth />
          <TextField label="Норма полива (л)" type="number" value={form.wateringNormLiters} onChange={handleChange('wateringNormLiters')} fullWidth />
          <TextField label="Освещение" value={form.sunRequirement} onChange={handleChange('sunRequirement')} select fullWidth>
            {sunOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <TextField label="Тип почвы" value={form.soilType} onChange={handleChange('soilType')} select fullWidth>
            {soilOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
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
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !form.name || !form.categoryId}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
