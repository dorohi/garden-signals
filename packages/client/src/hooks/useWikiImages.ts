import { useState, useEffect } from 'react';

interface WikiImage {
  url: string;
  thumb: string;
  title: string;
}

async function fetchWikiSummaryImage(lang: string, name: string, signal: AbortSignal): Promise<WikiImage | null> {
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      { signal },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.originalimage?.source) {
      return {
        url: data.originalimage.source,
        thumb: data.thumbnail?.source?.replace(/\/\d+px-/, '/400px-') || data.originalimage.source,
        title: data.title || name,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

async function fetchCommonsImages(name: string, limit: number, signal: AbortSignal): Promise<WikiImage[]> {
  const results: WikiImage[] = [];
  try {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrnamespace: '6',
      gsrsearch: name,
      gsrlimit: String(limit),
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '400',
      format: 'json',
      origin: '*',
    });
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      { signal },
    );
    if (!res.ok) return results;
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const page of Object.values(pages) as any[]) {
        const info = page.imageinfo?.[0];
        if (info?.thumburl && info?.url) {
          if (/\.(svg|pdf|ogg|ogv|webm)$/i.test(info.url)) continue;
          results.push({
            url: info.url,
            thumb: info.thumburl,
            title: page.title?.replace('File:', '') || '',
          });
        }
      }
    }
  } catch {
    // ignore
  }
  return results;
}

export function useWikiImages(name: string | undefined, limit = 10) {
  const [images, setImages] = useState<WikiImage[]>([]);

  useEffect(() => {
    if (!name) return;
    const controller = new AbortController();
    const { signal } = controller;

    const fetchAll = async () => {
      const seen = new Set<string>();
      const results: WikiImage[] = [];

      const addUnique = (img: WikiImage) => {
        if (seen.has(img.url)) return;
        seen.add(img.url);
        results.push(img);
      };

      // Fetch from multiple Wikipedia languages in parallel
      const [ruImg, enImg, deImg] = await Promise.all([
        fetchWikiSummaryImage('ru', name, signal),
        fetchWikiSummaryImage('en', name, signal),
        fetchWikiSummaryImage('de', name, signal),
      ]);
      if (ruImg) addUnique(ruImg);
      if (enImg) addUnique(enImg);
      if (deImg) addUnique(deImg);

      // Fetch from Wikimedia Commons
      const commons = await fetchCommonsImages(name, limit, signal);
      for (const img of commons) addUnique(img);

      setImages(results.slice(0, limit));
    };

    fetchAll();
    return () => controller.abort();
  }, [name, limit]);

  return images;
}
