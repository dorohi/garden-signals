import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import BugReportIcon from '@mui/icons-material/BugReport';
import Box from '@mui/material/Box';


interface DiseaseCardProps {
  disease: any;
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const navigate = useNavigate();
  const imageUrl = disease.imageUrl;

  const symptomsPreview =
    disease.symptoms?.length > 100
      ? `${disease.symptoms.slice(0, 100)}...`
      : disease.symptoms;

  return (
    <Card>
      <CardActionArea
        onClick={() => navigate(`/diseases/${disease.id}`)}
        sx={{ display: 'flex', alignItems: 'stretch', height: '100%' }}
      >
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={disease.name}
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
            <BugReportIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          </Box>
        )}
        <CardContent sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BugReportIcon color="error" fontSize="small" />
            <Typography variant="h6" noWrap>
              {disease.name}
            </Typography>
          </Box>
          {symptomsPreview && (
            <Typography variant="body2" color="text.secondary">
              {symptomsPreview}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
