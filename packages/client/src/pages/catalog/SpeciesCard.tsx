import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import YardIcon from '@mui/icons-material/Yard';
import { useWikiImage } from '../../hooks/useWikiImage';

interface SpeciesCardProps {
  species: any;
}

export default function SpeciesCard({ species }: SpeciesCardProps) {
  const navigate = useNavigate();
  const imageUrl = species.imageUrl || useWikiImage(species.name);

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/catalog/${species.id}`)}>
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={species.name}
            sx={{ height: 160, objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <YardIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          </Box>
        )}
        <CardContent>
          <Typography variant="h6" noWrap>
            {species.name}
          </Typography>
          {species.scientificName && (
            <Typography variant="body2" color="text.secondary" fontStyle="italic" noWrap>
              {species.scientificName}
            </Typography>
          )}
          <Box sx={{ mt: 1 }}>
            {species.varietyCount != null && (
              <Chip
                label={`${species.varietyCount} сортов`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
