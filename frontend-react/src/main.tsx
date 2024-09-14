import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterComponent from './routes-utils/router-conmonent.tsx'
import { AuthProvider } from './hooks/auth-provider.tsx'
import { TostProvider } from './hooks/tost-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TostProvider>
      <AuthProvider>
        <RouterComponent />
      </AuthProvider>
    </TostProvider>
  </StrictMode>,
)
