import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LandscapeIcon from '@mui/icons-material/Landscape';
import { useStore } from '../../stores';
import { useWikiImage } from '../../hooks/useWikiImage';
import Breadcrumbs from '../../components/Breadcrumbs';
import VarietyList from './VarietyList';

const sunLabels: Record<string, string> = {
  FULL_SUN: 'Полное солнце',
  PARTIAL_SHADE: 'Полутень',
  FULL_SHADE: 'Тень',
};

const soilLabels: Record<string, string> = {
  SANDY: 'Песчаная',
  LOAMY: 'Суглинистая',
  CLAY: 'Глинистая',
  PEATY: 'Торфяная',
  CHALKY: 'Известковая',
  SILTY: 'Илистая',
};

const SpeciesDetailPage = observer(() => {
  const { speciesId } = useParams<{ speciesId: string }>();
  const { catalogStore } = useStore();
  const species = catalogStore.selectedSpecies;
  const wikiImage = useWikiImage(species?.name);

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
        {(species.imageUrl || wikiImage) && (
          <CardMedia
            component="img"
            image={species.imageUrl || wikiImage}
            alt={species.name}
            sx={{ height: 300, objectFit: 'cover' }}
          />
        )}
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
                label={sunLabels[species.sunRequirement] ?? species.sunRequirement}
                variant="outlined"
              />
            )}
            {species.soilType && (
              <Chip
                icon={<LandscapeIcon />}
                label={soilLabels[species.soilType] ?? species.soilType}
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
