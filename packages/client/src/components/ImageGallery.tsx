import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export interface GalleryImage {
  id?: string;
  url: string;
  thumb?: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  isAdmin?: boolean;
  onUpload?: (file: File) => void;
  onDelete?: (imageId: string) => void;
}

export default function ImageGallery({ images, isAdmin, onUpload, onDelete }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  if (images.length === 0 && !isAdmin) return null;

  const handleOpen = (index: number) => {
    setCurrent(index);
    setOpen(true);
  };

  const handlePrev = () => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1));
  const handleNext = () => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    e.target.value = '';
  };

  const handleDeleteCurrent = () => {
    const img = images[current];
    if (img?.id && onDelete) {
      onDelete(img.id);
      if (current >= images.length - 1) setCurrent(Math.max(0, images.length - 2));
      if (images.length <= 1) setOpen(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, alignItems: 'center' }}>
        {images.map((img, i) => (
          <Box
            key={img.id ?? i}
            component="img"
            src={img.thumb ?? img.url}
            alt={img.title}
            onClick={() => handleOpen(i)}
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': { opacity: 0.8 },
            }}
          />
        ))}
        {isAdmin && onUpload && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={handleFileChange}
            />
            <Tooltip title="Добавить фото">
              <IconButton
                onClick={() => fileRef.current?.click()}
                sx={{
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                  borderRadius: 1,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                <AddPhotoAlternateIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        PaperProps={{ sx: { bgcolor: 'black', position: 'relative', m: 1, overflow: 'hidden' } }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
          {isAdmin && images[current]?.id && onDelete && (
            <IconButton
              onClick={handleDeleteCurrent}
              sx={{ color: 'white', bgcolor: 'rgba(244,67,54,0.7)', '&:hover': { bgcolor: 'rgba(244,67,54,0.9)' } }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <Box
            component="img"
            src={images[current]?.url}
            alt={images[current]?.title}
            sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
          {images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          )}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Dialog>
    </>
  );
}
