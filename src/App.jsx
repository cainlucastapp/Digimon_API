// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"
import Hero from "./pages/Hero"
import List from "./pages/List"
import NotFound from "./pages/NotFound"
import ShowDigimon from "./pages/ShowDigimon"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/digimon" element={<List />} />
        <Route path="/digimon/:id" element={<ShowDigimon />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App