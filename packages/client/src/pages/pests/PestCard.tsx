import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import PestControlIcon from '@mui/icons-material/PestControl';
import Box from '@mui/material/Box';

interface PestCardProps {
  pest: any;
}

export default function PestCard({ pest }: PestCardProps) {
  const navigate = useNavigate();

  const signsPreview =
    pest.signs?.length > 120
      ? `${pest.signs.slice(0, 120)}...`
      : pest.signs;

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/pests/${pest.id}`)}>
        <CardContent>
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
