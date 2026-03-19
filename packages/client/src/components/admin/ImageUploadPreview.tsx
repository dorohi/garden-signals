import { useRef } from 'react';
import Box from '@mui/material/Box';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface ImageUploadPreviewProps {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  size?: number;
}

export default function ImageUploadPreview({ previewUrl, onFileSelect, size = 180 }: ImageUploadPreviewProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={handleChange}
      />
      {previewUrl ? (
        <Box
          component="img"
          src={previewUrl}
          onClick={handleClick}
          sx={{
            width: size,
            height: size,
            objectFit: 'cover',
            borderRadius: 2,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
        />
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            width: size,
            height: size,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        </Box>
      )}
    </>
  );
}
