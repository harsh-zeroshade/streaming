/**
 * Filter and sort a content array based on filter/sort options.
 *
 * @param {Array}  items   - Array of movie/series objects
 * @param {Object} filters - { genre, language, year, rating, maturity }
 * @param {string} sort    - 'rating' | 'year-desc' | 'year-asc' | 'title'
 * @returns {Array}
 */
export const filterContent = (items, filters = {}, sort = 'rating') => {
  let result = [...items]

  if (filters.genre) {
    result = result.filter((item) => item.genres?.includes(filters.genre))
  }
  if (filters.language) {
    result = result.filter(
      (item) => item.language?.toLowerCase() === filters.language.toLowerCase()
    )
  }
  if (filters.year) {
    result = result.filter((item) => String(item.year) === String(filters.year))
  }
  if (filters.minRating) {
    result = result.filter(
      (item) => parseFloat(item.rating) >= parseFloat(filters.minRating)
    )
  }

  switch (sort) {
    case 'rating':
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      break
    case 'year-desc':
      result.sort((a, b) => b.year - a.year)
      break
    case 'year-asc':
      result.sort((a, b) => a.year - b.year)
      break
    case 'title':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      break
  }

  return result
}

/**
 * Search across an array of content items by title, genre, cast, or description.
 */
export const searchContent = (items, query) => {
  if (!query || query.trim() === '') return items
  const q = query.toLowerCase()
  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.genres?.some((g) => g.toLowerCase().includes(q)) ||
      item.cast?.some((c) => c.toLowerCase().includes(q)) ||
      item.director?.toLowerCase().includes(q)
  )
}
