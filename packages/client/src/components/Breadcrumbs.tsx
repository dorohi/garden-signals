import { Link as RouterLink } from 'react-router-dom';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
      {items.map((item, index) =>
        index < items.length - 1 && item.to ? (
          <Link
            key={index}
            component={RouterLink}
            to={item.to}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={index} color="text.primary">
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
}