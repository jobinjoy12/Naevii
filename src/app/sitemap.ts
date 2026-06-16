import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://naevii.co',
      lastModified: new Date(),
    },
    {
      url: 'https://naevii.co/shop',
      lastModified: new Date(),
    },
  ]
}
