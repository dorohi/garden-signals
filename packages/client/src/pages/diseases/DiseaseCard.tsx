import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import BugReportIcon from '@mui/icons-material/BugReport';
import Box from '@mui/material/Box';

interface DiseaseCardProps {
  disease: any;
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  const navigate = useNavigate();

  const symptomsPreview =
    disease.symptoms?.length > 120
      ? `${disease.symptoms.slice(0, 120)}...`
      : disease.symptoms;

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/diseases/${disease.id}`)}>
        <CardContent>
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
