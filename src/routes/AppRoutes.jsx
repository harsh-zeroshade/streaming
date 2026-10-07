import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Lazy-loaded pages
const Home           = lazy(() => import('../pages/Home'))
const Movies         = lazy(() => import('../pages/Movies'))
const Series         = lazy(() => import('../pages/Series'))
const Search         = lazy(() => import('../pages/Search'))
const MovieDetails   = lazy(() => import('../pages/MovieDetails'))
const SeriesDetails  = lazy(() => import('../pages/SeriesDetails'))
const Genre          = lazy(() => import('../pages/Genre'))
const NewAndPopular  = lazy(() => import('../pages/NewAndPopular'))
const MyList         = lazy(() => import('../pages/MyList'))
const Player         = lazy(() => import('../pages/Player'))
const SignIn         = lazy(() => import('../pages/auth/SignIn'))
const SignUp         = lazy(() => import('../pages/auth/SignUp'))
const Plans          = lazy(() => import('../pages/subscription/Plans'))
const WhoIsWatching  = lazy(() => import('../pages/profile/WhoIsWatching'))
const CreateProfile  = lazy(() => import('../pages/profile/CreateProfile'))
const AccountSettings= lazy(() => import('../pages/account/AccountSettings'))
const HelpSupport    = lazy(() => import('../pages/support/HelpSupport'))

const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#17181a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.4)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,.15)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontSize: 13 }}>Loading…</p>
    </div>
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Public auth pages — no navbar/footer, no login required ── */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ── Player — full screen, protected ── */}
        <Route path="/watch/:type/:id" element={
          <ProtectedRoute><Player /></ProtectedRoute>
        } />

        {/* ── All other routes — protected + wrapped in PageContainer ── */}
        <Route element={
          <ProtectedRoute>
            <PageContainer />
          </ProtectedRoute>
        }>
          <Route path="/"              element={<Home />} />
          <Route path="/movies"        element={<Movies />} />
          <Route path="/series"        element={<Series />} />
          <Route path="/search"        element={<Search />} />
          <Route path="/movie/:id"     element={<MovieDetails />} />
          <Route path="/series/:id"    element={<SeriesDetails />} />
          <Route path="/genre/:genre"  element={<Genre />} />
          <Route path="/new-popular"   element={<NewAndPopular />} />
          <Route path="/my-list"       element={<MyList />} />
          <Route path="/plans"         element={<Plans />} />
          <Route path="/profiles"      element={<WhoIsWatching />} />
          <Route path="/profiles/create" element={<CreateProfile />} />
          <Route path="/account"       element={<AccountSettings />} />
          <Route path="/help"          element={<HelpSupport />} />
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  )
}
