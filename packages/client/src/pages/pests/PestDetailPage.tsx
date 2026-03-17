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
import CardMedia from '@mui/material/CardMedia';
import { useStore } from '../../stores';
import { useWikiImage } from '../../hooks/useWikiImage';
import Breadcrumbs from '../../components/Breadcrumbs';

const PestDetailPage = observer(() => {
  const { pestId } = useParams<{ pestId: string }>();
  const { pestStore } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const pest = pestStore.selectedPest;
  const wikiImage = useWikiImage(pest?.name);

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

  const imageUrl = pest.imageUrl || wikiImage;
  const treatments = pest.treatments ?? [];
  const chemicalTreatments = treatments.filter((t: any) => t.type === 'CHEMICAL');
  const biologicalTreatments = treatments.filter((t: any) => t.type === 'BIOLOGICAL');
  const folkTreatments = treatments.filter((t: any) => t.type === 'FOLK');

  const renderTreatmentList = (items: any[]) => {
    if (items.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          Нет данных
        </Typography>
      );
    }
    return (
      <List>
        {items.map((item: any, index: number) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.name}
              secondary={item.description}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Вредители', to: '/pests' },
          { label: pest.name },
        ]}
      />
      <Card sx={{ mb: 3 }}>
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={pest.name}
            sx={{ height: 300, objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {pest.name}
          </Typography>

          {pest.description && (
            <>
              <Typography variant="h6" gutterBottom>
                Описание
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {pest.description}
              </Typography>
            </>
          )}

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

          {pest.prevention && (
            <>
              <Typography variant="h6" gutterBottom>
                Профилактика
              </Typography>
              <Typography variant="body1">
                {pest.prevention}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Методы борьбы
          </Typography>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
            <Tab label="Химическое лечение" />
            <Tab label="Биологическое лечение" />
            <Tab label="Народные средства" />
          </Tabs>
          {activeTab === 0 && renderTreatmentList(chemicalTreatments)}
          {activeTab === 1 && renderTreatmentList(biologicalTreatments)}
          {activeTab === 2 && renderTreatmentList(folkTreatments)}
        </CardContent>
      </Card>

      {pest.affectedPlants && pest.affectedPlants.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Поражаемые растения
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {pest.affectedPlants.map((plant: any, index: number) => (
                <Chip
                  key={index}
                  label={plant.name}
                  variant="outlined"
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
