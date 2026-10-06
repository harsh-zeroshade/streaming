/**
 * Genre list — slugs MUST match TMDB genre names exactly (case-insensitive)
 * so the backend's getByGenre() lookup succeeds.
 */
export const genres = [
  {
    id: 'action',
    name: 'Action',
    slug: 'Action',
    description: 'High-octane thrills and pulse-pounding sequences.',
    backdrop: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1400&q=80',
    color: '#7f1d1d',
  },
  {
    id: 'drama',
    name: 'Drama',
    slug: 'Drama',
    description: 'Compelling characters navigating the depths of human experience.',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80',
    color: '#1e3a5f',
  },
  {
    id: 'thriller',
    name: 'Thriller',
    slug: 'Thriller',
    description: 'Tension-filled stories where every moment counts.',
    backdrop: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1400&q=80',
    color: '#1c1c2e',
  },
  {
    id: 'science-fiction',
    name: 'Science Fiction',
    slug: 'Science Fiction',
    description: 'Visions of tomorrow that challenge what we know today.',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80',
    color: '#2d1b69',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    slug: 'Comedy',
    description: 'Laugh-out-loud stories that lift the spirit.',
    backdrop: 'https://images.unsplash.com/photo-1543584756-8f93af667375?w=1400&q=80',
    color: '#78350f',
  },
  {
    id: 'horror',
    name: 'Horror',
    slug: 'Horror',
    description: 'Fear-inducing tales that keep you on the edge of your seat.',
    backdrop: 'https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=1400&q=80',
    color: '#1a0a0a',
  },
  {
    id: 'romance',
    name: 'Romance',
    slug: 'Romance',
    description: 'Stories of connection, longing, and love against the odds.',
    backdrop: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1400&q=80',
    color: '#831843',
  },
  {
    id: 'animation',
    name: 'Animation',
    slug: 'Animation',
    description: 'Imaginative worlds brought to life frame by frame.',
    backdrop: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1400&q=80',
    color: '#14532d',
  },
  {
    id: 'mystery',
    name: 'Mystery',
    slug: 'Mystery',
    description: 'Puzzles, secrets, and the thrill of uncovering the truth.',
    backdrop: 'https://images.unsplash.com/photo-1507783548227-544c3ad8db44?w=1400&q=80',
    color: '#064e3b',
  },
  {
    id: 'crime',
    name: 'Crime',
    slug: 'Crime',
    description: 'Gritty tales from both sides of the law.',
    backdrop: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=1400&q=80',
    color: '#27272a',
  },
  {
    id: 'documentary',
    name: 'Documentary',
    slug: 'Documentary',
    description: 'Real stories, real stakes, real impact.',
    backdrop: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&q=80',
    color: '#134e4a',
  },
  {
    id: 'history',
    name: 'History',
    slug: 'History',
    description: 'The past brought vividly to life on screen.',
    backdrop: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=1400&q=80',
    color: '#78350f',
  },
]

export const getGenreBySlug = (slug) =>
  genres.find(g => g.slug.toLowerCase() === slug?.toLowerCase()) || null
