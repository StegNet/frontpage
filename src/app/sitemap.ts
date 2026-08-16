import type { MetadataRoute } from 'next';

// Required for `output: "export"` — the sitemap must be generated statically at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://stegnet.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
