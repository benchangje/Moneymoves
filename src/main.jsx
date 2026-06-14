import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from "./components/AuthContext";
import { BlinkProvider } from './components/BlinkContext.jsx';
import { ListingsProvider } from './components/ListingsContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  	<BrowserRouter>
      	<StrictMode>
			<AuthProvider>
				<BlinkProvider>
					<ListingsProvider>
						<App />
					</ListingsProvider>
				</BlinkProvider>
			</AuthProvider>		
     	 </StrictMode>
    </BrowserRouter>,
)
