export function formatPrice(value) {
  const n = Number(value);
  if (value == null || value === '' || !Number.isFinite(n)) return 'Price unavailable';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}
 
// "SingleFamilyResidence" -> "Single Family Residence"; "CityLights,Coastline" -> "City Lights, Coastline"
export function humanize(value) {
  if (value == null || value === '') return '';
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/,\s*/g, ', ');
}
 
// "13:00:00" or "2026-03-01T13:00:00" -> "1:00 PM"
export function formatTime(value) {
  if (!value) return '';
  const match = String(value).match(/(\d{1,2}):(\d{2})/);
  if (!match) return String(value);
  let hours = Number(match[1]);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${match[2]} ${suffix}`;
}
 
// Uses the YYYY-MM-DD part only, so timezones can't shift the day.
export function formatDate(value) {
  if (!value) return '';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(value);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
 