import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import Home from './components/Home'
import Background from './components/Background'
import Biography from './components/Biography'
import Contact from './components/Contact'
import Hero from './components/Hero'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Background />
        <Menu />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Home />
              </>
            } />
            <Route path="/biography" element={<Biography />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
