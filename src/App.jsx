import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import SplashScreen from './components/common/SplashScreen'

const SPLASH_KEY = 'nova_splash_shown'

export default function App() {
  // Check inside the component so it re-evaluates on every mount (important for dev HMR)
  const [splashDone, setSplashDone] = useState(
    () => !!sessionStorage.getItem(SPLASH_KEY)
  )

  return (
    <BrowserRouter>
      {!splashDone && (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}
      <AppRoutes />
    </BrowserRouter>
  )
}
