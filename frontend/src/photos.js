// Parses L_Photos (a JSON string) into an array of image URLs.
// Never throws: bad JSON, null, '' or a non-array all return [].
// Skips non-image entries such as DOCUMENT-Pdf links.
function isPhotoUrl(url) {
  return (
    typeof url === 'string' &&
    (/\/PHOTO-/i.test(url) || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url))
  );
}
 
export function getPhotos(photos) {
  try {
    const parsed = typeof photos === 'string' ? JSON.parse(photos) : photos;
    return Array.isArray(parsed) ? parsed.filter(isPhotoUrl) : [];
  } catch {
    return [];
  }
}
 