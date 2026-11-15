import { useState, useMemo } from 'react';
import { getPhotos } from './photos';
import './PropertyDetail.css';
 
// For listing cards. Takes the raw L_Photos value.
export default function PropertyImageCarousel({ photos, alt = 'Property photo' }) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState([]);
 
  const all = useMemo(() => getPhotos(photos), [photos]);
  const list = all.filter((url) => !broken.includes(url));
  const count = list.length;
 
  if (count === 0) {
    return <div className="photo-placeholder">No photo available</div>;
  }
 
  const current = Math.min(index, count - 1);
 
  function step(e, delta) {
    // The card is a link: stop the click from navigating to the detail page
    e.preventDefault();
    e.stopPropagation();
    setIndex((current + delta + count) % count);
  }
 
  return (
    <div className="carousel">
      <img
        src={list[current]}
        alt={alt}
        onError={() => setBroken((b) => [...b, list[current]])}
      />
      {count > 1 && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-prev"
            aria-label="Previous photo"
            onClick={(e) => step(e, -1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel-arrow carousel-next"
            aria-label="Next photo"
            onClick={(e) => step(e, 1)}
          >
            ›
          </button>
          <span className="carousel-counter">
            {current + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}