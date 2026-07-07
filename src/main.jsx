import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { BlinkProvider } from './components/BlinkContext.jsx';
import { ListingsProvider } from './components/ListingsContext.jsx';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <BlinkProvider>
          <App />
        </BlinkProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
)
