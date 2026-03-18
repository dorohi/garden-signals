import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useStore } from '../../stores';

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

  const [form, setForm] = useState({
    name: '',
    nameScientific: '',
    categoryId: '',
    description: '',
    wateringIntervalDays: 7,
    wateringNormLiters: 5,
    sunRequirement: 'FULL_SUN',
    soilType: 'LOAMY',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
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
          imageUrl: species.imageUrl ?? '',
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
          imageUrl: '',
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
    const data = { ...form };
    const ok = isEdit
      ? await catalogStore.updateSpecies(species.id, data)
      : await catalogStore.createSpecies(data);
    setLoading(false);
    if (ok) {
      onClose();
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
          <TextField label="URL изображения" value={form.imageUrl} onChange={handleChange('imageUrl')} fullWidth />
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
