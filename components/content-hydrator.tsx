'use client';

import { useEffect } from 'react';

type ContentItem = { content_key: string; kind: 'text' | 'image' | 'video'; text_value: string | null; updated_at: string };

export function ContentHydrator() {
  useEffect(() => {
    let active = true;
    fetch('/api/content').then((response) => response.json()).then(({ items }: { items: ContentItem[] }) => {
      if (!active) return;
      for (const item of items) {
        const nodes = document.querySelectorAll<HTMLElement>(`[data-cms-key="${CSS.escape(item.content_key)}"]`);
        nodes.forEach((node) => {
          if (item.kind === 'text' && item.text_value !== null) node.textContent = item.text_value;
          if (item.kind === 'image' || item.kind === 'video') {
            node.querySelector('.cms-media')?.remove();
            const media = document.createElement(item.kind);
            media.className = 'cms-media'; media.setAttribute('aria-label', node.getAttribute('data-cms-label') ?? '项目媒体');
            if (item.kind === 'video') { const video = media as HTMLVideoElement; video.controls = true; video.playsInline = true; video.preload = 'metadata'; }
            (media as HTMLImageElement | HTMLVideoElement).src = `/api/media?key=${encodeURIComponent(item.content_key)}&v=${encodeURIComponent(item.updated_at)}`;
            node.appendChild(media);
          }
        });
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  return null;
}
