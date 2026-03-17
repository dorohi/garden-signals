import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LandscapeIcon from '@mui/icons-material/Landscape';
import { useStore } from '../../stores';
import Breadcrumbs from '../../components/Breadcrumbs';
import VarietyList from './VarietyList';

const SpeciesDetailPage = observer(() => {
  const { speciesId } = useParams<{ speciesId: string }>();
  const { catalogStore } = useStore();

  useEffect(() => {
    if (speciesId) {
      catalogStore.loadSpeciesById(speciesId);
    }
  }, [speciesId, catalogStore]);

  if (catalogStore.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const species = catalogStore.selectedSpecies;
  if (!species) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        Вид не найден
      </Typography>
    );
  }

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: 'Каталог', to: '/catalog' },
          ...(species.category ? [{ label: species.category.name }] : []),
          { label: species.name },
        ]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {species.name}
          </Typography>
          {species.scientificName && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontStyle="italic"
              gutterBottom
            >
              {species.scientificName}
            </Typography>
          )}
          {species.description && (
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              {species.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Характеристики
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {species.wateringIntervalDays && (
              <Chip
                icon={<WaterDropIcon />}
                label={`Полив каждые ${species.wateringIntervalDays} дн.`}
                variant="outlined"
              />
            )}
            {species.sunRequirement && (
              <Chip
                icon={<WbSunnyIcon />}
                label={species.sunRequirement}
                variant="outlined"
              />
            )}
            {species.soilType && (
              <Chip
                icon={<LandscapeIcon />}
                label={species.soilType}
                variant="outlined"
              />
            )}
          </Box>

          {species.careTemplates && species.careTemplates.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Шаблоны ухода
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {species.careTemplates.map((tpl: any, idx: number) => (
                  <Chip
                    key={idx}
                    label={`${tpl.careType}: ${tpl.title}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Сорта
      </Typography>
      <VarietyList varieties={species.varieties ?? []} />
    </Box>
  );
});

export default SpeciesDetailPage;
