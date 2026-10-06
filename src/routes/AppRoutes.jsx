import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Skeleton from '../components/common/Skeleton'

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'))
const Movies = lazy(() => import('../pages/Movies'))
const Series = lazy(() => import('../pages/Series'))
const Search = lazy(() => import('../pages/Search'))
const MovieDetails = lazy(() => import('../pages/MovieDetails'))
const SeriesDetails = lazy(() => import('../pages/SeriesDetails'))
const Genre = lazy(() => import('../pages/Genre'))
const NewAndPopular = lazy(() => import('../pages/NewAndPopular'))
const MyList = lazy(() => import('../pages/MyList'))
const Player = lazy(() => import('../pages/Player'))
const SignIn = lazy(() => import('../pages/auth/SignIn'))
const SignUp = lazy(() => import('../pages/auth/SignUp'))
const Plans = lazy(() => import('../pages/subscription/Plans'))
const WhoIsWatching = lazy(() => import('../pages/profile/WhoIsWatching'))
const CreateProfile = lazy(() => import('../pages/profile/CreateProfile'))
const AccountSettings = lazy(() => import('../pages/account/AccountSettings'))
const HelpSupport = lazy(() => import('../pages/support/HelpSupport'))

const PageLoader = () => (
  <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-white/40 text-sm">Loading…</span>
    </div>
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Player — full screen, no layout wrapper */}
        <Route path="/watch/:type/:id" element={<Player />} />

        {/* All other routes wrapped in PageContainer (navbar + footer) */}
        <Route element={<PageContainer />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route path="/genre/:genre" element={<Genre />} />
          <Route path="/new-popular" element={<NewAndPopular />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/profiles" element={<WhoIsWatching />} />
          <Route path="/profiles/create" element={<CreateProfile />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/help" element={<HelpSupport />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
