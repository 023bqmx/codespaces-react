// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // เพิ่มบรรทัดนี้

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* เพิ่มบรรทัดนี้ */}
      <App />
    </BrowserRouter> {/* เพิ่มบรรทัดนี้ */}
  </React.StrictMode>
);

reportWebVitals();