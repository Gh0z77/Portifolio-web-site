import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import BootScreen from './components/BootScreen'
import TelegramFab from './components/TelegramFab'
import CustomCursor from './components/CustomCursor'
import MatrixRain from './components/backgrounds/MatrixRain'
import CursorGlow from './components/backgrounds/CursorGlow'
import AmbientFX from './components/AmbientFX'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import NotFound from './pages/NotFound'
import { loadTheme } from './lib/theme'
import { initSound } from './lib/sound'
import { trackPageView } from './lib/analytics'
import { useI18n } from './lib/i18n'
import { ADMIN_BASE, ADMIN_DASH } from './lib/admin'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contact = lazy(() => import('./pages/Contact'))
const TerminalPage = lazy(() => import('./pages/TerminalPage'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminContent = lazy(() => import('./pages/admin/AdminContent'))
const AdminStats = lazy(() => import('./pages/admin/AdminStats'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))

/** Sahifa almashganda tepaga qaytarish */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const { lang } = useI18n()
  const isAdmin = location.pathname.startsWith(ADMIN_BASE)

  // Har sahifa ochilishini statistikaga yozish (admin sahifalari hisoblanmaydi)
  useEffect(() => {
    trackPageView(location.pathname, lang)
  }, [location.pathname, lang])

  // Iron Man uslubidagi boot ekrani — sessiyada faqat bir marta (har yangilashda 3 soniya kuttirmaydi), adminda emas
  const [booting, setBooting] = useState(() => {
    if (window.location.pathname.startsWith(ADMIN_BASE)) return false
    try {
      if (sessionStorage.getItem('ghost-booted')) return false
      sessionStorage.setItem('ghost-booted', '1')
    } catch {
      /* storage yopiq — boot ko'rsatiladi */
    }
    return true
  })

  // Admin panel tanlagan tema ranglarini yuklash
  useEffect(() => {
    loadTheme()
  }, [])

  // Ovoz tizimi: barcha tugma/havola bosilishlariga blip qo'shadi
  useEffect(() => initSound(), [])

  // Admin ichki sahifalari almashganda butun layout qayta yuklanmasin:
  // dashboard/* uchun bitta doimiy kalit ishlatiladi.
  const routeKey = location.pathname.startsWith(ADMIN_DASH)
    ? ADMIN_DASH
    : location.pathname

  return (
    <>
      {booting && <BootScreen onDone={() => setBooting(false)} />}
      <CustomCursor />
      <MatrixRain />
      <CursorGlow />
      {!isAdmin && <AmbientFX />}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <ScrollProgress />
      <ScrollToTop />

      {!isAdmin && <Navbar />}

      <main className={isAdmin ? '' : 'pt-20'}>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={routeKey}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terminal" element={<TerminalPage />} />

              <Route path={ADMIN_BASE} element={<AdminLogin />} />
              <Route path={ADMIN_DASH} element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="stats" element={<AdminStats />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <TelegramFab />}
    </>
  )
}
