import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppWithDevTools from './AppWithDevTools'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithDevTools />
  </StrictMode>,
)
