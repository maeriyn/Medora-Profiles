import { Parallax } from 'react-parallax'
import { motion } from 'framer-motion'
import './Hero.css'

const heroImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'  // Excel spreadsheet image

export default function Hero() {
  return (
    <Parallax
      blur={0}
      bgImage={heroImage}
      bgImageAlt="Data Spreadsheet"
      strength={300}
    >
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Shaping the Future of AI</h1>
          <p>Generate. Innovate. Transform.</p>
        </motion.div>
      </div>
    </Parallax>
  )
}
