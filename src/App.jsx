// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
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
        <Route path="/digimon" element={<List />} />
        <Route path="/digimon/:id" element={<ShowDigimon />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App