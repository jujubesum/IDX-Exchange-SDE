import React from 'react';

export default function PropertyCard({ property }) {
    let photos = [];

    try {
        photos = JSON.parse(property.L_Photos || "[]");
    } catch (error) {
        photos = [];
    }

    const firstPhoto = photos[0];

    return (
        <div className="property-card">
            {firstPhoto ? (
                <img
                    src={firstPhoto}
                    alt={`Property at ${property.L_Address}`}
                    className="property-image"
                />
            ) : (
                <div className="property-image-placeholder">
                    No photo available
                </div>
            )}

            <div className="property-details">
                <h2>
                    {Number(property.L_SystemPrice).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0
                    })}
                </h2>

                <p>{property.L_Address}</p>
                <p>{property.L_City}, {property.L_State} {property.L_Zip}</p>

                <p>Square feet: {property.LM_Int2_3 ?? "N/A"}</p>
            </div>
        </div>
    );
}