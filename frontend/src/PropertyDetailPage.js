import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyDetail } from './api/client.js';
import { formatPrice, humanize } from './format.js';
import PropertyImageGallery from './PropertyImageGallery';
import PropertyMap from './PropertyMap';
import OpenHouses from './OpenHouses';
import './PropertyDetail.css';
 
function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value ?? '—'}</strong>
      <span>{label}</span>
    </div>
  );
}
 
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    let ignore = false;
 
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setProperty(null);
 
        const data = await fetchPropertyDetail(id);
        if (ignore) return;
 
        // A 200 with an empty body should still count as "not found"
        if (!data || !data.L_ListingID) throw new Error('Property not found.');
        setProperty(data);
      } catch (err) {
        if (ignore) return;
        setError(
          err.message === 'Request failed: 404'
            ? 'Property not found.'
            : err.message || 'Failed to load property.'
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    }
 
    load();
    return () => {
      ignore = true;
    };
  }, [id]);
 
  if (loading) return <p>Loading property...</p>;
 
  if (error || !property) {
    return (
      <div className="detail">
        <h2>Unable to load this property</h2>
        <p>{error}</p>
        <Link to="/">Back to listings</Link>
      </div>
    );
  }
 
  const baths = Number(property.LM_Dec_3);
  const bathsText =
    property.LM_Dec_3 == null || !Number.isFinite(baths) ? null : String(baths);
  const sqft = property.LM_Int2_3 ? Number(property.LM_Int2_3).toLocaleString() : null;
 
  const details = [
    ['MLS #', property.L_DisplayId],
    ['Status', humanize(property.L_Status)],
    ['Type', humanize(property.L_Type_)],
    ['Style', humanize(property.ArchitecturalStyle)],
    ['Lot size', property.LotSizeAcres ? `${Number(property.LotSizeAcres).toFixed(2)} acres` : ''],
    ['Stories', property.StoriesTotal],
    ['Garage spaces', property.L_Keyword5],
    ['View', humanize(property.View)],
    ['Cooling', humanize(property.Cooling)],
    ['Heating', humanize(property.Heating)],
    ['Days on market', property.DaysOnMarket],
    [
      'Listed by',
      [property.ListAgentFullName, property.LO1_OrganizationName].filter(Boolean).join(', '),
    ],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');
 
  // ASSUMPTION: adjust this key to whatever your endpoint returns for open houses
  const openHouses = property.openHouses ?? property.open_houses ?? property.OpenHouses ?? [];
 
  return (
    <main className="detail">
      <Link to="/" className="detail-back">← Back to listings</Link>
 
      <PropertyImageGallery
        photos={property.L_Photos}
        alt={`Property at ${property.L_Address}`}
      />
 
      <h1>{formatPrice(property.L_SystemPrice)}</h1>
      <p className="detail-address">
        {property.L_Address}
        <br />
        {[property.L_City, property.L_State].filter(Boolean).join(', ')} {property.L_Zip}
      </p>
 
      <div className="stats">
        <Stat label="Beds" value={property.L_Keyword2} />
        <Stat label="Baths" value={bathsText} />
        <Stat label="Sq ft" value={sqft} />
        <Stat label="Year built" value={property.YearBuilt} />
      </div>
 
      {property.L_Remarks && (
        <section className="detail-section">
          <h2>Description</h2>
          <p>{property.L_Remarks}</p>
        </section>
      )}
 
      <section className="detail-section">
        <h2>Property details</h2>
        <dl className="details-list">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
 
      <PropertyMap
        latitude={property.LMD_MP_Latitude}
        longitude={property.LMD_MP_Longitude}
        address={property.L_Address}
      />
 
      <OpenHouses openHouses={openHouses} />
    </main>
  );
}