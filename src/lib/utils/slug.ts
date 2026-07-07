export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'event'
}

// Short, human-tolerable disambiguator for slug collisions (e.g. "spring-gala-x4k9").
export function withRandomSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${slug}-${suffix}`
}
