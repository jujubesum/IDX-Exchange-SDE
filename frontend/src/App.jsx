
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListingsPage from './ListingsPage';
import "./App.css";

function NotFound() {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>404 - Invalid Route</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Back to Listings</a>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ListingsPage />} />
                <Route path="/api/properties" element={<ListingsPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
