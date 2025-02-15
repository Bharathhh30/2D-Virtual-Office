import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FireBaseProvider } from './context/FireBase.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <FireBaseProvider>
      <App />
    </FireBaseProvider>
    </BrowserRouter>
  </StrictMode>,
)
