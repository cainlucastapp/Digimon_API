// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Hero from "./pages/Hero"
import List from "./pages/List"
import ShowDigimon from "./pages/ShowDigimon"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/digimon" element={<Navigate to="/digimon/page/1" replace />} />
        <Route path="/digimon/page/:page" element={<List />} />
        <Route path="/digimon/:id" element={<ShowDigimon />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App