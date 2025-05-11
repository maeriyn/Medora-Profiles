import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import Home from './components/Home'
import Biography from './components/Biography'
import Contact from './components/Contact'
import NoResults from './components/NoResults'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Menu />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/biography" element={<Biography />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<NoResults />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
