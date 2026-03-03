import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RankedChoicePage from './pages/RankedChoicePage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <RankedChoicePage />
        </BrowserRouter>
    </React.StrictMode>
);