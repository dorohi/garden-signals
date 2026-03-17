import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useStore } from '../../stores';
import { useEntityImages } from '../../hooks/useEntityImages';
import Breadcrumbs from '../../components/Breadcrumbs';
import ImageGallery from '../../components/ImageGallery';
import TreatmentList from '../../components/TreatmentList';

const DiseaseDetailPage = observer(() => {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const { diseaseStore, authStore } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const disease = diseaseStore.selectedDisease;
  const { images, upload, remove } = useEntityImages('disease', diseaseId);
  const isAdmin = authStore.user?.role === 'ADMIN';

  useEffect(() => {
    if (diseaseId) {
      diseaseStore.loadDiseaseById(diseaseId);
    }
  }, [diseaseId, diseaseStore]);

  if (diseaseStore.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!disease) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Болезнь не найдена
      </Typography>
    );
  }

  // Treatment text fields from disease model

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Болезни', to: '/diseases' },
          { label: disease.name },
        ]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {disease.name}
          </Typography>

          {disease.symptoms && (
            <>
              <Typography variant="h6" gutterBottom>
                Симптомы
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {disease.symptoms}
              </Typography>
            </>
          )}

          {disease.cause && (
            <>
              <Typography variant="h6" gutterBottom>
                Причина
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {disease.cause}
              </Typography>
            </>
          )}

          {disease.prevention && (
            <>
              <Typography variant="h6" gutterBottom>
                Профилактика
              </Typography>
              <Typography variant="body1">
                {disease.prevention}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {(images.length > 0 || isAdmin) && (
        <Box sx={{ mb: 2 }}>
          <ImageGallery images={images} isAdmin={isAdmin} onUpload={upload} onDelete={remove} />
        </Box>
      )}

      {(disease.treatmentChemical || disease.treatmentBio || disease.treatmentFolk) && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Меры борьбы
            </Typography>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
              <Tab label="Химические" />
              <Tab label="Биологические" />
              <Tab label="Народные" />
            </Tabs>
            {activeTab === 0 && <TreatmentList text={disease.treatmentChemical} color="error.main" />}
            {activeTab === 1 && <TreatmentList text={disease.treatmentBio} color="success.main" />}
            {activeTab === 2 && <TreatmentList text={disease.treatmentFolk} color="warning.main" />}
          </CardContent>
        </Card>
      )}

      {disease.plantDiseases && disease.plantDiseases.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Поражаемые растения
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {disease.plantDiseases.map((pd: any, index: number) => (
                <Chip
                  key={index}
                  label={pd.species?.name ?? ''}
                  variant="outlined"
                  color={
                    pd.severity === 'HIGH' || pd.severity === 'CRITICAL'
                      ? 'error'
                      : pd.severity === 'MEDIUM'
                        ? 'warning'
                        : 'default'
                  }
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
});

export default DiseaseDetailPage;
