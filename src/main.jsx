import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('React is loading...'); // Debug log

const root = ReactDOM.createRoot(document.getElementById('root'));

console.log('Root element:', document.getElementById('root')); // Debug log

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App component rendered'); // Debug log