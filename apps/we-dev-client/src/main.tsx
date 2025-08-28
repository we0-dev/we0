import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)  