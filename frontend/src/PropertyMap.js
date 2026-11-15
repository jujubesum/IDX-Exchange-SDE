import './PropertyDetail.css';
 
export default function PropertyMap({ latitude, longitude, address }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
 
  // Coordinates arrive as strings; render only when both are real numbers
  const lat = latitude === '' || latitude == null ? NaN : Number(latitude);
  const lng = longitude === '' || longitude == null ? NaN : Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
 
  return (
    <section className="detail-section">
      <h2>Location</h2>
      {apiKey ? (
        <iframe
          className="map-frame"
          title={`Map of ${address || 'property'}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <p>Map unavailable: REACT_APP_GOOGLE_MAPS_API_KEY is not set.</p>
      )}
      <p>
        <a href={directionsHref} target="_blank" rel="noopener noreferrer">
          Get Directions
        </a>
      </p>
    </section>
  );
}