import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Имотори - Премиум недвижими имоти в България',
    short_name: 'Имотори',
    description: 'Открийте луксозни недвижими имоти в България с Имотори. Премиум апартаменти, къщи и търговски имоти.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f2937',
    lang: 'bg',
    icons: [
      {
        src: '/imotory-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/imotory-icon.svg',
        sizes: '16x16',
        type: 'image/svg+xml',
      },
      {
        src: '/imotory-icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        src: '/imotory-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
      {
        src: '/imotory-icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/imotory-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
