import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadScript } from '@react-google-maps/api';
import './index.css';
import App from './App.jsx';

const libraries = ['places'];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
      libraries={libraries}
    >
      <App />
    </LoadScript>
  </StrictMode>,
);
