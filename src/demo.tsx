import React from 'react';
import ReactDOM from 'react-dom/client';
import DemoPage from './components/DemoPage';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <DemoPage />
        </React.StrictMode>
    );
}