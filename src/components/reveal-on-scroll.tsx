'use client';

import { useEffect } from 'react';

// Marks each `.reveal` element with data-revealed once it scrolls into view,
// which starts its entrance animation (see `reveal` in globals.css).
export function RevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal:not([data-revealed])',
    );
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      // Start just before the element is fully on screen.
      { rootMargin: '0px 0px -10% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
