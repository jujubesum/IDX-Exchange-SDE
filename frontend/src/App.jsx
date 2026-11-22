import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import ListingsPage from './ListingsPage';
import PropertyDetailPage from './PropertyDetailPage';
import FavoritesPage from './FavoritesPage';
import ErrorBoundary from './ErrorBoundary';
import { FavoritesProvider, useFavorites } from './useFavorites';
import './App.css';
import './Favorites.css';

function NavBar() {
    const { count } = useFavorites();
    return (
        <nav className="site-nav">
            <Link to="/">Listings</Link>
            <Link to="/favorites">Favorites ({count})</Link>
        </nav>
    );
}

function NotFound() {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Page not found</h2>
            <p>That page doesn't exist.</p>
            <Link to="/">Back to listings</Link>
        </div>
    );
}

// Inside the router so it can reset the boundary whenever the URL changes.
// The nav stays outside the boundary, so it still works after a page crashes.
function AppRoutes() {
    const location = useLocation();
    return (
        <ErrorBoundary resetKey={location.pathname}>
            <Routes>
                <Route path="/" element={<ListingsPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ErrorBoundary>
    );
}

export default function App() {
    return (
        <FavoritesProvider>
            <BrowserRouter>
                <NavBar />
                <AppRoutes />
            </BrowserRouter>
        </FavoritesProvider>
    );
}
