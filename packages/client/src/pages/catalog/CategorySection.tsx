import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YardIcon from '@mui/icons-material/Yard';
import { catalogApi } from '../../services/api';
import SpeciesCard from './SpeciesCard';

interface CategorySectionProps {
  category: any;
  species?: any[];
  defaultExpanded?: boolean;
}

const CategorySection = observer(({ category, species: propSpecies, defaultExpanded = false }: CategorySectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [species, setSpecies] = useState<any[]>(propSpecies ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propSpecies) {
      setSpecies(propSpecies);
    }
  }, [propSpecies]);

  const handleExpand = async (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
    if (isExpanded && species.length === 0 && !propSpecies) {
      setLoading(true);
      try {
        const { data } = await catalogApi.getSpecies({ categoryId: category.id });
        setSpecies(data);
      } catch {
        // Handled silently
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Accordion expanded={expanded} onChange={handleExpand} sx={{ mb: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <YardIcon color="primary" />
          <Typography variant="h6">{category.name}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {species.map((sp: any) => (
              <Grid item xs={12} sm={6} md={4} key={sp.id}>
                <SpeciesCard species={sp} />
              </Grid>
            ))}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

export default CategorySection;
