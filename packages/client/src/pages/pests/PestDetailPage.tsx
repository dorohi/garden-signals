import { useEffect, useState } from 'react';
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
import { useStore } from '../../stores';
import { useEntityImages } from '../../hooks/useEntityImages';
import Breadcrumbs from '../../components/Breadcrumbs';
import ImageGallery from '../../components/ImageGallery';
import TreatmentList from '../../components/TreatmentList';

const PestDetailPage = observer(() => {
  const { pestId } = useParams<{ pestId: string }>();
  const { pestStore, authStore } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const pest = pestStore.selectedPest;
  const { images, upload, remove } = useEntityImages('pest', pestId);
  const isAdmin = authStore.user?.role === 'ADMIN';

  useEffect(() => {
    if (pestId) {
      pestStore.loadPestById(pestId);
    }
  }, [pestId, pestStore]);

  if (pestStore.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pest) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Вредитель не найден
      </Typography>
    );
  }

  // Treatment text fields from pest model

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Вредители', to: '/pests' },
          { label: pest.name },
        ]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {pest.name}
          </Typography>

          {pest.signs && (
            <>
              <Typography variant="h6" gutterBottom>
                Признаки поражения
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {pest.signs}
              </Typography>
            </>
          )}

          {pest.damage && (
            <>
              <Typography variant="h6" gutterBottom>
                Наносимый вред
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {pest.damage}
              </Typography>
            </>
          )}

          {pest.preventionMethods && (
            <>
              <Typography variant="h6" gutterBottom>
                Профилактика
              </Typography>
              <Typography variant="body1">
                {pest.preventionMethods}
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

      {(pest.treatmentChemical || pest.treatmentBio || pest.treatmentFolk) && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Методы борьбы
            </Typography>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
              <Tab label="Химические" />
              <Tab label="Биологические" />
              <Tab label="Народные" />
            </Tabs>
            {activeTab === 0 && <TreatmentList text={pest.treatmentChemical} color="error.main" />}
            {activeTab === 1 && <TreatmentList text={pest.treatmentBio} color="success.main" />}
            {activeTab === 2 && <TreatmentList text={pest.treatmentFolk} color="warning.main" />}
          </CardContent>
        </Card>
      )}

      {pest.plantPests && pest.plantPests.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Поражаемые растения
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {pest.plantPests.map((pp: any, index: number) => (
                <Chip
                  key={index}
                  label={pp.species?.name ?? ''}
                  variant="outlined"
                  color={
                    pp.severity === 'HIGH' || pp.severity === 'CRITICAL'
                      ? 'error'
                      : pp.severity === 'MEDIUM'
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

export default PestDetailPage;
