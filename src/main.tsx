import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './app/page.tsx'
import './index.css'
import { Toaster } from './components/ui/sonner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
    <Toaster/>
  </StrictMode>,
)
