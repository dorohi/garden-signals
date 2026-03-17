import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useStore } from '../../stores';

interface VarietyListProps {
  varieties: any[];
}

export default function VarietyList({ varieties }: VarietyListProps) {
  const { gardenStore, snackbarStore } = useStore();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAdd = async (varietyId: string) => {
    const garden = gardenStore.gardens[0];
    if (!garden) {
      snackbarStore.show('Сначала создайте сад', 'warning');
      return;
    }
    setAddingId(varietyId);
    try {
      await gardenStore.addPlant(garden.id, { varietyId, quantity: 1 });
    } catch {
      // Error handled by store
    } finally {
      setAddingId(null);
    }
  };

  if (varieties.length === 0) {
    return (
      <Typography color="text.secondary">Нет доступных сортов</Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Срок созревания (дни)</TableCell>
            <TableCell>Морозоустойчивость</TableCell>
            <TableCell>Урожайность</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {varieties.map((variety: any) => (
            <TableRow key={variety.id}>
              <TableCell>{variety.name}</TableCell>
              <TableCell>{variety.maturityDays ?? '—'}</TableCell>
              <TableCell>{variety.frostResistance ?? '—'}</TableCell>
              <TableCell>{variety.yieldDescription ?? '—'}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAdd(variety.id)}
                  disabled={addingId === variety.id}
                >
                  Добавить в сад
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
