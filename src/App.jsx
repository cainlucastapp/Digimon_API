// src/App.jsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import Battle from "./pages/Battle"
import Hero from "./pages/Hero"
import List from "./pages/List"
import NotFound from "./pages/NotFound"
import ShowDigimon from "./pages/ShowDigimon"

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/digimon" element={<List key={location.key} />} />
        <Route path="/digimon/:id" element={<ShowDigimon />} />
        <Route path="/battle" element={<Battle key={location.key} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App