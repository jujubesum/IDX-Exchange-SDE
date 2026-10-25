import React, { useState, useEffect } from 'react';
import { fetchProperties } from './api/client.js';
import PropertyCard from './PropertyCard';

export default function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = new URLSearchParams(window.location.search);
    useEffect(() => {
        async function loadProperties() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProperties({
                    limit: params.get("limit") || 20,
                    offset: params.get("offset") || 0
                });

                setProperties(data.response);
                setTotal(data.total);
            } catch (err) {
                setError(err.message || "Failed to load properties.");
            } finally {
                setLoading(false);
            }
        }

        loadProperties();
    }, []);

    if (loading) {
        return <p>Loading properties...</p>;
    }

    if (error) {
        return (
            <div style={{ color: "red", padding: "20px" }}>
                <h2>Unable to Load Properties</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Property Listings</h1>
            <p>Showing {properties.length} of {total} properties</p>

            {properties.length === 0 ? (
                <p>No properties found.</p>
            ) : (
                <div className="property-grid">
                    {properties.map((property, index) => (
                        <PropertyCard
                            key={property.L_ListingID ?? index}
                            property={property}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}