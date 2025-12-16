import React from 'react';
import ReactDOM from 'react-dom/client';
import ContactPage from './components/ContactPage';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ContactPage />
        </React.StrictMode>
    );
}