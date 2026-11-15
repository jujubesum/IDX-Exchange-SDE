import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListingsPage from './ListingsPage';
import PropertyDetailPage from './PropertyDetailPage';
import './App.css';
 
function NotFound() {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Page not found</h2>
            <p>That page doesn't exist.</p>
            <Link to="/">Back to listings</Link>
        </div>
    );
}
 
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ListingsPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
