import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PageContainer() {
  return (
    <>
      <div id="ambient" aria-hidden="true" />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
