import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Menu'
import Home from './components/Home'
import Biography from './components/Biography'
import Contact from './components/Contact'
import NoResults from './components/NoResults'
import Modalities from './components/Modalities'
import HealthcareModality from './components/modalities/Healthcare'
import FinancialModality from './components/modalities/Financial'
import EducationalModality from './components/modalities/Educational'
import LegalModality from './components/modalities/Legal'
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
              <Route 
                path="/modalities" 
                element={
                  <div className="parallax-container">
                    <Modalities />
                  </div>
                } 
              />
              <Route 
                path="/modalities/healthcare" 
                element={
                  <div className="parallax-container">
                    <HealthcareModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/financial" 
                element={
                  <div className="parallax-container">
                    <FinancialModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/educational" 
                element={
                  <div className="parallax-container">
                    <EducationalModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/legal" 
                element={
                  <div className="parallax-container">
                    <LegalModality />
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
