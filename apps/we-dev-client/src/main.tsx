import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

// Conditionally render App based on environment
const renderApp = async () => {
  let App;
  
  if (process.env.ELECTRON) {
    App = (await import('./App.tsx')).default;
  } else {
    App = (await import('./App.web.tsx')).default;
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

renderApp();  