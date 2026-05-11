/**
 * main
 * Frontend application entry point: mounts routing and Redux providers.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter handles client-side route transitions for the SPA. */}
    <BrowserRouter>
      {/* Redux Provider for global state management. */}
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)
