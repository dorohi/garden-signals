import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { regionsApi, profileApi } from '../../services/api';
import { useStore } from '../../stores';

const RegionSelector = observer(() => {
  const { authStore, snackbarStore } = useStore();
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await regionsApi.getRegions();
        setRegions(data);
        if (authStore.user?.regionId) {
          const current = data.find((r: any) => r.id === authStore.user.regionId);
          setSelectedRegion(current ?? null);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authStore.user?.regionId]);

  const handleChange = async (_: any, value: any) => {
    setSelectedRegion(value);
    if (value) {
      try {
        await profileApi.updateProfile({ regionId: value.id });
        snackbarStore.show('Регион обновлён', 'success');
      } catch {
        snackbarStore.show('Ошибка обновления региона', 'error');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Autocomplete
        options={regions}
        getOptionLabel={(option: any) => option.name ?? ''}
        value={selectedRegion}
        onChange={handleChange}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Климатический регион"
            placeholder="Выберите регион"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      {selectedRegion?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selectedRegion.description}
        </Typography>
      )}
    </Box>
  );
});

export default RegionSelector;
