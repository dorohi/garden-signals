import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PestControlIcon from '@mui/icons-material/PestControl';
import Box from '@mui/material/Box';


interface PestCardProps {
  pest: any;
}

export default function PestCard({ pest }: PestCardProps) {
  const navigate = useNavigate();
  const imageUrl = pest.imageUrl;

  const signsPreview =
    pest.signs?.length > 100
      ? `${pest.signs.slice(0, 100)}...`
      : pest.signs;

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(`/pests/${pest.id}`)}
        sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}
      >
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={pest.name}
            sx={{ width: 180, height: 180, objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              width: 180,
              height: 180,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <PestControlIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          </Box>
        )}
        <CardContent sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PestControlIcon color="warning" fontSize="small" />
            <Typography variant="h6" noWrap>
              {pest.name}
            </Typography>
          </Box>
          {signsPreview && (
            <Typography variant="body2" color="text.secondary">
              {signsPreview}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
