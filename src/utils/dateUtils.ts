export function getNextFiveDays(): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const next5Days = [];
  for (let i = 0; i < 5; i++) {
    next5Days.push(days[new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).getDay()]);
  }
  return next5Days;
}
