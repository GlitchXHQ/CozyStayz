import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter,Router,Routes} from 'react-router-dom'
import {ClerkProvider} from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'

import App from './App.jsx'

const PUBLISHIBLE_KEY=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHIBLE_KEY)
  throw new Error('Add Clerk Publishible Key')

createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHIBLE_KEY} afterSignOutUrl={"/"}>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ClerkProvider>
)
