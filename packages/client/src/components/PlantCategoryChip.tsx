import Chip from '@mui/material/Chip';
import YardIcon from '@mui/icons-material/Yard';
import GrassIcon from '@mui/icons-material/Grass';
import ForestIcon from '@mui/icons-material/Forest';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import SpaIcon from '@mui/icons-material/Spa';

interface PlantCategoryChipProps {
  category: string;
  size?: 'small' | 'medium';
}

const categoryConfig: Record<string, { color: string; icon: React.ReactElement }> = {
  vegetables: { color: '#4caf50', icon: <YardIcon fontSize="small" /> },
  fruits: { color: '#ff9800', icon: <ForestIcon fontSize="small" /> },
  herbs: { color: '#8bc34a', icon: <GrassIcon fontSize="small" /> },
  flowers: { color: '#e91e63', icon: <LocalFloristIcon fontSize="small" /> },
  berries: { color: '#9c27b0', icon: <SpaIcon fontSize="small" /> },
};

export default function PlantCategoryChip({ category, size = 'small' }: PlantCategoryChipProps) {
  const config = categoryConfig[category.toLowerCase()] ?? {
    color: '#757575',
    icon: <YardIcon fontSize="small" />,
  };

  return (
    <Chip
      label={category}
      size={size}
      icon={config.icon}
      sx={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        borderColor: config.color,
        '& .MuiChip-icon': { color: config.color },
      }}
      variant="outlined"
    />
  );
}
