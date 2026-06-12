import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './styles/global.css'
import App from './App'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el elemento #root en el HTML.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
)
