import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { observer } from 'mobx-react-lite';

import { StoreContext, rootStore, useStore } from './stores';
import { createAppTheme } from './theme/theme';
import Layout from './components/Layout';
import AppSnackbar from './components/AppSnackbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import GardensListPage from './pages/garden/GardensListPage';
import MyGardenPage from './pages/garden/MyGardenPage';
import PlantDetailPage from './pages/garden/PlantDetailPage';
import CatalogPage from './pages/catalog/CatalogPage';
import SpeciesDetailPage from './pages/catalog/SpeciesDetailPage';
import DiseasesPage from './pages/diseases/DiseasesPage';
import DiseaseDetailPage from './pages/diseases/DiseaseDetailPage';
import PestsPage from './pages/pests/PestsPage';
import PestDetailPage from './pages/pests/PestDetailPage';
import SettingsPage from './pages/settings/SettingsPage';

const AppContent = observer(() => {
  const { themeStore } = useStore();
  const theme = useMemo(() => createAppTheme(themeStore.mode), [themeStore.mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="garden" element={<GardensListPage />} />
          <Route path="garden/:gardenId" element={<MyGardenPage />} />
          <Route path="garden/plant/:plantId" element={<PlantDetailPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:speciesId" element={<SpeciesDetailPage />} />
          <Route path="diseases" element={<DiseasesPage />} />
          <Route path="diseases/:diseaseId" element={<DiseaseDetailPage />} />
          <Route path="pests" element={<PestsPage />} />
          <Route path="pests/:pestId" element={<PestDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <AppSnackbar />
    </ThemeProvider>
  );
});

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <AppContent />
    </StoreContext.Provider>
  );
}

export default App;
