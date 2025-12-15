import React from 'react';
import ReactDOM from 'react-dom/client';
import AboutPage from './components/AboutPage';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AboutPage />
        </React.StrictMode>
    );
}