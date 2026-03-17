import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import YardIcon from '@mui/icons-material/Yard';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PlantCategoryChip from '../../components/PlantCategoryChip';
import { useWikiImage } from '../../hooks/useWikiImage';

interface PlantCardProps {
  plant: any;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const navigate = useNavigate();

  const varietyName = plant.variety?.name ?? plant.varietyName;
  const speciesName = plant.variety?.species?.name ?? plant.speciesName;
  const categoryName = plant.variety?.species?.category?.name ?? plant.categoryName;
  const imageUrl = plant.variety?.species?.imageUrl ?? useWikiImage(speciesName);

  const nextCareDate = plant.nextCareDate
    ? format(new Date(plant.nextCareDate), 'd MMMM', { locale: ru })
    : null;

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/garden/plant/${plant.id}`)}>
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={speciesName}
            sx={{ height: 140, objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <YardIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
          </Box>
        )}
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
