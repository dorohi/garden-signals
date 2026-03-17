import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BugReportIcon from '@mui/icons-material/BugReport';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ParkIcon from '@mui/icons-material/Park';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface CareTypeIconProps {
  type: string;
  fontSize?: 'small' | 'medium' | 'large';
}

const careTypeConfig: Record<string, { icon: typeof WaterDropIcon; color: string }> = {
  WATER: { icon: WaterDropIcon, color: '#2196f3' },
  FERTILIZE: { icon: GrassIcon, color: '#795548' },
  PRUNE: { icon: ContentCutIcon, color: '#607d8b' },
  SPRAY: { icon: BugReportIcon, color: '#ff5722' },
  HARVEST: { icon: AgricultureIcon, color: '#ff9800' },
  PLANT: { icon: ParkIcon, color: '#4caf50' },
};

export default function CareTypeIcon({ type, fontSize = 'medium' }: CareTypeIconProps) {
  const config = careTypeConfig[type];

  if (!config) {
    return <HelpOutlineIcon fontSize={fontSize} sx={{ color: '#9e9e9e' }} />;
  }

  const IconComponent = config.icon;
  return <IconComponent fontSize={fontSize} sx={{ color: config.color }} />;
}

export function getCareTypeColor(type: string): string {
  return careTypeConfig[type]?.color ?? '#9e9e9e';
}
