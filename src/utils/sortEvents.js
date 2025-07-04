export function sortedEvents(events) {
  return [...events].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
} 