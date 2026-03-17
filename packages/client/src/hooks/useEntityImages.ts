import { useState, useEffect, useCallback } from 'react';
import { imagesApi } from '../services/api';

export interface EntityImage {
  id: string;
  url: string;
  filename: string;
  order: number;
}

export function useEntityImages(entityType: string, entityId: string | undefined) {
  const [images, setImages] = useState<EntityImage[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const { data } = await imagesApi.getImages(entityType, entityId);
      setImages(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (file: File) => {
    if (!entityId) return;
    await imagesApi.upload(entityType, entityId, file);
    await load();
  };

  const remove = async (imageId: string) => {
    await imagesApi.deleteImage(imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return { images, loading, upload, remove, reload: load };
}
