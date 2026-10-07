import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { authService } from '../../services/authService'

/**
 * Can be used two ways:
 * 1. As a layout route wrapper:  <Route element={<ProtectedRoute />}>...</Route>
 * 2. Wrapping a single element:  <ProtectedRoute><Player /></ProtectedRoute>
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!authService.isSignedIn()) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }

  // Layout route usage (no children — render Outlet)
  return children ?? <Outlet />
}
