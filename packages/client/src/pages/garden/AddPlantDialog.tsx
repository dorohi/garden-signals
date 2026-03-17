import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import { useStore } from '../../stores';

interface AddPlantDialogProps {
  open: boolean;
  onClose: () => void;
  gardenId?: string;
}

const AddPlantDialog = observer(({ open, onClose, gardenId }: AddPlantDialogProps) => {
  const { catalogStore, gardenStore } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [varietyId, setVarietyId] = useState('');
  const [nickname, setNickname] = useState('');
  const [plantedDate, setPlantedDate] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      catalogStore.loadCategories();
    }
  }, [open, catalogStore]);

  useEffect(() => {
    if (categoryId) {
      catalogStore.loadSpeciesByCategory(categoryId);
      setSpeciesId('');
      setVarietyId('');
    }
  }, [categoryId, catalogStore]);

  useEffect(() => {
    if (speciesId) {
      catalogStore.loadSpeciesById(speciesId);
      setVarietyId('');
    }
  }, [speciesId, catalogStore]);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!gardenId) return;

    await gardenStore.addPlant(gardenId, {
      varietyId,
      nickname: nickname || undefined,
      plantedDate: plantedDate || undefined,
      quantity: parseInt(quantity, 10),
      notes: notes || undefined,
    });

    handleReset();
    onClose();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCategoryId('');
    setSpeciesId('');
    setVarietyId('');
    setNickname('');
    setPlantedDate('');
    setQuantity('1');
    setNotes('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const steps = ['Выбор растения', 'Детали'];

  const varieties = catalogStore.selectedSpecies?.varieties ?? [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить растение</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Категория"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              fullWidth
            >
              {catalogStore.categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Вид"
              value={speciesId}
              onChange={(e) => setSpeciesId(e.target.value)}
              fullWidth
              disabled={!categoryId}
            >
              {catalogStore.species.map((sp: any) => (
                <MenuItem key={sp.id} value={sp.id}>
                  {sp.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Сорт"
              value={varietyId}
              onChange={(e) => setVarietyId(e.target.value)}
              fullWidth
              disabled={!speciesId}
            >
              {varieties.map((v: any) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Название (необязательно)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
              placeholder="Например: Помидоры у забора"
            />
            <TextField
              label="Дата посадки"
              type="date"
              value={plantedDate}
              onChange={(e) => setPlantedDate(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Количество"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { min: 1 } }}
            />
            <TextField
              label="Заметки"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Назад</Button>}
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 0 && !varietyId}
          >
            Далее
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>
            Добавить
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

export default AddPlantDialog;
