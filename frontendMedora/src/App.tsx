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
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/biography" 
                element={
                  <div className="parallax-container">
                    <Biography />
                  </div>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <div className="parallax-container">
                    <Contact />
                  </div>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <div className="parallax-container">
                    <NoResults />
                  </div>
                } 
              />
            </Routes>
          </div>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
