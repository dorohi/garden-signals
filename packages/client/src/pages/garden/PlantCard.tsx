import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PlantCategoryChip from '../../components/PlantCategoryChip';

interface PlantCardProps {
  plant: any;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const navigate = useNavigate();

  const varietyName = plant.variety?.name ?? plant.varietyName;
  const speciesName = plant.variety?.species?.name ?? plant.speciesName;
  const categoryName = plant.variety?.species?.category?.name ?? plant.categoryName;

  const nextCareDate = plant.nextCareDate
    ? format(new Date(plant.nextCareDate), 'd MMMM', { locale: ru })
    : null;

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/garden/plant/${plant.id}`)}>
        <CardContent>
          <Typography variant="h6" noWrap>
            {plant.nickname || varietyName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {speciesName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {categoryName && (
              <PlantCategoryChip category={categoryName} />
            )}
          </Box>
          {nextCareDate && (
            <Typography variant="caption" color="text.secondary">
              Следующий уход: {nextCareDate}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
