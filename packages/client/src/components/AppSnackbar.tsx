import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';

const AppSnackbar = observer(() => {
  const { snackbarStore } = useStore();

  return (
    <Snackbar
      open={snackbarStore.open}
      autoHideDuration={4000}
      onClose={snackbarStore.hide}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={snackbarStore.hide}
        severity={snackbarStore.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbarStore.message}
      </Alert>
    </Snackbar>
  );
});

export default AppSnackbar;
