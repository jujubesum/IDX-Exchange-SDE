import React from 'react';
import { Link } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';
import { formatPrice } from './format';
 
export default function PropertyCard({ property }) {
    // LM_Dec_3 arrives as a string like "5.0"
    const baths = Number(property.LM_Dec_3);
    const bathsText =
        property.LM_Dec_3 == null || !Number.isFinite(baths) ? 'N/A' : String(baths);
 
    return (
        <Link
            to={`/property/${property.L_ListingID}`}
            style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}
        >
            <div className="property-card">
                <PropertyImageCarousel
                    photos={property.L_Photos}
                    alt={`Property at ${property.L_Address}`}
                />
 
                <div className="property-details">
                    <h2>{formatPrice(property.L_SystemPrice)}</h2>
 
                    <p>{property.L_Address}</p>
                    <p>{property.L_City}, {property.L_State} {property.L_Zip}</p>
 
                    <p>Beds: {property.L_Keyword2 ?? 'N/A'}</p>
                    <p>Baths: {bathsText}</p>
                    <p>Square feet: {property.LM_Int2_3 ?? 'N/A'}</p>
                </div>
            </div>
        </Link>
    );
}