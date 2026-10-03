import { useEffect } from 'react';
import { FontItem } from '../data/fonts';

const loadedFamilies = new Set<string>();

export function useFontPreloader(fonts: FontItem[], active: boolean = true) {
  useEffect(() => {
    if (!active || fonts.length === 0) return;

    const newFamilies = fonts.filter(
      (f) => !f.isWebSafe && !loadedFamilies.has(f.name)
    );

    if (newFamilies.length === 0) return;

    newFamilies.forEach((f) => loadedFamilies.add(f.name));

    const familiesToLoad = newFamilies.map((f) => {
      const formattedName = f.name.replace(/\s+/g, '+');
      const targetWeights = f.weights && f.weights.length > 0
        ? [400, 600, 700].filter(w => f.weights.includes(w))
        : [400];
      const finalWeights = targetWeights.length > 0 ? targetWeights : [f.weights[0]];
      const weightsStr = [...finalWeights].sort((a, b) => a - b).join(';');
      return `family=${formattedName}:wght@${weightsStr}`;
    });

    const chunkSize = 12;
    for (let i = 0; i < familiesToLoad.length; i += chunkSize) {
      const chunk = familiesToLoad.slice(i, i + chunkSize);
      const url = `https://fonts.googleapis.com/css2?${chunk.join('&')}&display=swap`;

      const linkEl = document.createElement('link');
      linkEl.className = 'font-preview-preload-link';
      linkEl.rel = 'stylesheet';
      linkEl.href = url;
      document.head.appendChild(linkEl);
    }
  }, [fonts, active]);
}
