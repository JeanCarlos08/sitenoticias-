import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home      from './pages/Home'
import Privacy   from './pages/Privacy'
import Terms     from './pages/Terms'
import About     from './pages/About'
import Contact   from './pages/Contact'
import NotFound  from './pages/NotFound'
import CookieBanner from './components/CookieBanner'
import './index.css'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/sobre"      element={<About />} />
        <Route path="/contato"    element={<Contact />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/termos"      element={<Terms />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </>
  )
}
