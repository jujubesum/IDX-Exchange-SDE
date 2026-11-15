import { useState, useMemo, useEffect, useRef } from 'react';
import { getPhotos } from './photos';
import './PropertyDetail.css';
 
// For the detail page. Takes the raw L_Photos value.
export default function PropertyImageGallery({ photos, alt = 'Property photo' }) {
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState([]);
  const [open, setOpen] = useState(false);
  const lightboxRef = useRef(null);
 
  const all = useMemo(() => getPhotos(photos), [photos]);
  const list = all.filter((url) => !broken.includes(url));
  const count = list.length;
  const current = Math.min(index, Math.max(count - 1, 0));
 
  // A div only receives key events if it is focusable (tabIndex) AND focused.
  useEffect(() => {
    if (open && lightboxRef.current) lightboxRef.current.focus();
  }, [open]);
 
  if (count === 0) {
    return <div className="photo-placeholder">No photo available</div>;
  }
 
  const markBroken = (url) => setBroken((b) => (b.includes(url) ? b : [...b, url]));
  const move = (delta) => setIndex((current + delta + count) % count);
 
  function handleKeyDown(e) {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
  }
 
  return (
    <div className="gallery">
      <button
        type="button"
        className="gallery-main"
        aria-label="Open photo full screen"
        onClick={() => setOpen(true)}
      >
        <img
          src={list[current]}
          alt={`${alt} ${current + 1} of ${count}`}
          onError={() => markBroken(list[current])}
        />
      </button>
 
      {count > 1 && (
        <div className="gallery-thumbs">
          {list.map((url, i) => (
            <button
              type="button"
              key={url}
              className={i === current ? 'gallery-thumb active' : 'gallery-thumb'}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => setIndex(i)}
            >
              <img src={url} alt="" loading="lazy" onError={() => markBroken(url)} />
            </button>
          ))}
        </div>
      )}
 
      {open && (
        <div
          className="lightbox"
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
 
          {count > 1 && (
            <button
              type="button"
              className="lightbox-arrow lightbox-prev"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
            >
              ‹
            </button>
          )}
 
          <img
            className="lightbox-image"
            src={list[current]}
            alt={`${alt} ${current + 1} of ${count}`}
            onClick={(e) => e.stopPropagation()}
          />
 
          {count > 1 && (
            <button
              type="button"
              className="lightbox-arrow lightbox-next"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
            >
              ›
            </button>
          )}
 
          <span className="lightbox-counter">
            {current + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
}
 