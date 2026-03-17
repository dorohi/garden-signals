import { useState, useEffect } from 'react';

export function useWikiImage(name: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!name) return;
    const controller = new AbortController();
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.thumbnail?.source) {
          setUrl(data.thumbnail.source.replace(/\/\d+px-/, '/500px-'));
        }
      } catch {
        // ignore abort / network errors
      }
    };
    fetchImage();
    return () => controller.abort();
  }, [name]);
  return url;
}
