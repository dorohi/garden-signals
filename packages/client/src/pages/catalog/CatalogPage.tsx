import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useStore } from '../../stores';
import CategorySection from './CategorySection';
import EmptyState from '../../components/EmptyState';

const CatalogPage = observer(() => {
  const { catalogStore } = useStore();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    catalogStore.loadCategories();
  }, [catalogStore]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query);
    if (query.trim()) {
      catalogStore.searchPlants(query.trim());
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Каталог растений
      </Typography>

      <TextField
        fullWidth
        placeholder="Поиск растений..."
        value={searchInput}
        onChange={handleSearch}
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {catalogStore.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : searchInput.trim() ? (
        catalogStore.species.length === 0 ? (
          <EmptyState
            icon={<MenuBookIcon sx={{ fontSize: 64 }} />}
            title="Ничего не найдено"
            subtitle="Попробуйте изменить запрос"
          />
        ) : (
          <CategorySection
            category={{ id: 'search', name: 'Результаты поиска' }}
            species={catalogStore.species}
            defaultExpanded
          />
        )
      ) : (
        catalogStore.categories.map((category: any) => (
          <CategorySection
            key={category.id}
            category={category}
          />
        ))
      )}
    </Box>
  );
});

export default CatalogPage;
