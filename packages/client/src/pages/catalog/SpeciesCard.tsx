import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

interface SpeciesCardProps {
  species: any;
}

export default function SpeciesCard({ species }: SpeciesCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/catalog/${species.id}`)}>
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
