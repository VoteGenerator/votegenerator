import React from 'react';
import ReactDOM from 'react-dom/client';
import ComparePage from './components/ComparePage';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <ComparePage />
        </React.StrictMode>
    );
}