import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AdminApp from './admin/AdminApp';

const isRibalRoute = /^\/ribal\/?$/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isRibalRoute ? <AdminApp /> : <App />}
  </React.StrictMode>
);
