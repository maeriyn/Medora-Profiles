import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <Router>
      <div className="app">
        <div>
          <Menu isModalOpen={isModalOpen} />
        </div>
        <AnimatePresence mode="wait">
          <div className="page-container">
            <Routes>
              <Route path="/" element={
                <Home 
                  onPricingOpen={() => handleModalOpen()}
                  onPricingClose={() => handleModalClose()}
                  isModalOpen={isModalOpen}
                />
              } />
              <Route 
                path="/biography" 
                element={
                  <div>
                    <Biography />
                  </div>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <div>
                    <Contact />
                  </div>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <div>
                    <NoResults />
                  </div>
                } 
              />
              <Route 
                path="/modalities" 
                element={
                  <div>
                    <Modalities />
                  </div>
                } 
              />
              <Route 
                path="/modalities/healthcare" 
                element={
                  <div>
                    <HealthcareModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/financial" 
                element={
                  <div>
                    <FinancialModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/educational" 
                element={
                  <div>
                    <EducationalModality />
                  </div>
                } 
              />
              <Route 
                path="/modalities/legal" 
                element={
                  <div>
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
