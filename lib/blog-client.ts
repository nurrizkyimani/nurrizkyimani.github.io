export function formatBlogDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
}
