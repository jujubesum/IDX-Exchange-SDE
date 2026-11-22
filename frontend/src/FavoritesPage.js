import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { useFavorites } from './useFavorites';
import './Favorites.css';

export default function FavoritesPage() {
  const { favorites, count } = useFavorites();

  return (
    <div className="favorites-page">
      <h1>Favorites ({count})</h1>

      {count === 0 ? (
        <p>
          No favorites yet. Tap the heart on a listing to save it.{' '}
          <Link to="/">Browse listings</Link>
        </p>
      ) : (
        <div className="property-grid">
          {favorites.map((property) => (
            <PropertyCard key={property.L_ListingID} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}