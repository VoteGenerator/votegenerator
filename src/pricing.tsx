import React from 'react';
import ReactDOM from 'react-dom/client';
import PricingPage from './components/PricingPage';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <PricingPage />
        </React.StrictMode>
    );
}