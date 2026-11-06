import React, { useState, useEffect } from 'react';
import { fetchProperties } from './api/client.js';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';

export default function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        let ignore = false;

        async function loadProperties() {
            const params = new URLSearchParams(window.location.search);
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProperties({
                    ...filters,
                    limit: params.get("limit") || 20,
                    offset: params.get("offset") || 0
                });

                if (ignore) return;
                setProperties(data.response);
                setTotal(data.total);
            } catch (err) {
                if (!ignore) setError(err.message || "Failed to load properties.");
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProperties();

        return () => {
            ignore = true;
        };
    }, [filters]);

    return (
        <div>
            <h1>Property Listings</h1>

            <PropertyFilters onSearch={setFilters} />

            {loading && <p>Loading properties...</p>}

            {error && (
                <div style={{ color: "red", padding: "20px" }}>
                    <h2>Unable to Load Properties</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <p>Showing {properties.length} of {total} properties</p>

                    {properties.length === 0 ? (
                        <p>
                            No properties match your filters. Try widening your
                            price range or clearing filters.
                        </p>
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
                </>
            )}
        </div>
    );
}