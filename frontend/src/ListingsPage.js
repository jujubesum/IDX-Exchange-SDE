import React, { useState, useEffect } from 'react';
import { fetchProperties } from './api/client.js';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import Pagination from './Pagination';

export default function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;         
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, total);

    function handleSearch(newFilters){
        setFilters(newFilters);
        setCurrentPage(1);
    }

    function handlePageChange(page){
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        let ignore = false;

        async function loadProperties() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProperties({
                    ...filters,
                    limit: ITEMS_PER_PAGE,
                    offset: (currentPage - 1) * ITEMS_PER_PAGE,
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
    }, [filters, currentPage]);

    return (
        <div>
            <h1>Property Listings</h1>

            <PropertyFilters onSearch={handleSearch} />

            {loading && <p>Loading properties...</p>}

            {error && (
                <div style={{ color: "red", padding: "20px" }}>
                    <h2>Unable to Load Properties</h2>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <p>Showing {start}-{end} of {total} properties</p>

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

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}