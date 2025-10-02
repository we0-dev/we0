import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'

// For web builds, use the web version
import App from './App.web.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)  