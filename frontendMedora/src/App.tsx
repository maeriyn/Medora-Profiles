import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Menu from './components/Menu'
import Home from './components/Home'
import Biography from './components/Biography'
import Contact from './components/Contact'
import NoResults from './components/NoResults'
import Loading from './components/Loading'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  useEffect(() => {
    // Check if all resources are loaded
    const checkResources = () => {
      if (document.readyState === 'complete') {
        setResourcesLoaded(true);
      }
    };

    window.addEventListener('load', checkResources);
    checkResources();

    return () => {
      window.removeEventListener('load', checkResources);
    };
  }, []);

  // Only stop loading when both resources are loaded and loading animation completes
  const handleLoadingComplete = () => {
    if (resourcesLoaded) {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading onLoaded={handleLoadingComplete} />;
  }

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
