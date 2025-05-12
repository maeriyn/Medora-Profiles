import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Pricing from './Pricing'
import ContactForm from './ContactForm'
import './Home.css'

const sections = [
  {
    title: 'Healthcare Documents',
    description: 'Generate comprehensive medical records, including patient histories, diagnoses, treatments, and lab results that maintain statistical accuracy while ensuring complete privacy.',
    image: '/images/healthcare.jpg',
    depth: 1.5,
    translateZ: -2,
    scale: 1.3,
    initialY: 100
  },
  {
    title: 'Financial Documents',
    description: 'Create realistic financial profiles including tax returns, bank statements, and investment portfolios that reflect real-world economic patterns and regulations.',
    image: '/images/financial.jpg',
    depth: 1.2,
    translateZ: -1.5,
    scale: 1.2,
    initialY: 50
  },
  {
    title: 'Educational Documents',
    description: 'Produce academic records, transcripts, and educational assessments that mirror actual educational institutions while preserving anonymity.',
    image: '/images/education.jpg',
    depth: 1.8,
    translateZ: -2.5,
    scale: 1.4,
    initialY: 150
  },
  {
    title: 'Legal Documents',
    description: 'Generate legal documentation including contracts, court records, and regulatory filings that maintain legal validity while protecting sensitive information.',
    image: '/images/legal.jpg',
    depth: 1.3,
    translateZ: -1.8,
    scale: 1.25,
    initialY: 75
  }
]

const metrics = [
  { value: '10M+', label: 'Documents Generated' },
  { value: '99.9%', label: 'Statistical Accuracy' },
  { value: '100%', label: 'Privacy Compliance' },
  { value: '24/7', label: 'Support Available' }
]

const features = [
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'End-to-end encryption and compliance with HIPAA, GDPR, and other regulations'
  },
  {
    icon: '📊',
    title: 'Statistical Accuracy',
    description: 'Data that mirrors real-world distributions and relationships'
  },
  {
    icon: '🔄',
    title: 'Real-time Generation',
    description: 'Generate thousands of documents in seconds'
  }
]

interface HomeProps {
  onPricingOpen: () => void;
  onPricingClose: () => void;
  isModalOpen: boolean;
}

export default function Home({ onPricingOpen, onPricingClose, isModalOpen }: HomeProps) {
  const navigate = useNavigate();
  const cyclingWords = [
    'Towns',
    'Cities',
    'Districts',
    'Suburbs',
    'Metropolises',
    'Townships',
    'Neighborhoods'
  ]

  const [currentWord, setCurrentWord] = useState(0)
  const cyclingTextRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const titleContainerRef = useRef<HTMLDivElement>(null)

  const [scrollY, setScrollY] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const [showPricing, setShowPricing] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const handleContactFormOpen = () => {
    setShowContactForm(true)
    onPricingOpen() // This will trigger the menu dimming
  }

  const handleContactFormClose = () => {
    setShowContactForm(false)
    onPricingClose() // This will restore the menu
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % cyclingWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [cyclingWords.length])

  useEffect(() => {
    const wordEl = wordRefs.current[currentWord]
    const cyclingTextEl = cyclingTextRef.current
    const titleContainerEl = titleContainerRef.current
    if (wordEl && cyclingTextEl && titleContainerEl) {
      const wordWidth = wordEl.offsetWidth
      const staticSpans = Array.from(titleContainerEl.children).filter(
        (el) => el.tagName === 'SPAN'
      ) as HTMLSpanElement[]
      const staticWidth = staticSpans.reduce((acc, el) => acc + el.offsetWidth, 0)
      const gap = 24
      const totalWidth = staticWidth + gap * 2 + wordWidth + 32
      cyclingTextEl.style.setProperty('--cycling-width', `${wordWidth + 32}px`)
      titleContainerEl.style.setProperty('--title-width', `${totalWidth}px`)
    }
  }, [currentWord])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSectionClick = (title: string) => {
    const path = title.split(' ')[0].toLowerCase();
    navigate(`/modalities/${path}`);
  };

  return (
    <div className="parallax-container">
      <motion.div 
        className="home"
        style={{
          filter: isModalOpen ? 'brightness(0.1)' : 'none',  // Decreased from 0.3 to 0.1
          transition: 'filter 0.3s ease'
        }}
      >
        <div className="content-wrapper">
          <div className="title-container" ref={titleContainerRef}>
            <span>Generate</span>
            <span>entire</span>
            <div className="cycling-text" ref={cyclingTextRef}>
              <span
                className="cycling-word"
                ref={el => {
                  wordRefs.current[currentWord] = el;
                }}
                key={cyclingWords[currentWord]}
              >
                {cyclingWords[currentWord]}
              </span>
            </div>
          </div>

          <p className="subtitle">
            Create complete, interconnected synthetic data for entire communities
          </p>
          
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContactFormOpen}
          >
            Start Free Trial
          </motion.button>

          <motion.div 
            className="metrics-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ maxWidth: '1000px', margin: '0 auto' }}
          >
            {metrics.map((metric, index) => (
              <motion.div 
                key={metric.label}
                className="metric-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.8 + (index * 0.15),
                  ease: "easeOut"
                }}
              >
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {showContactForm && (
        <ContactForm 
          onClose={handleContactFormClose}
        />
      )}

      <div className="features-section">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {sections.map((section, index) => {
        const yOffset = (scrollY * section.depth) % window.innerHeight
        const slideX = Math.min(0, (scrollY - (index * window.innerHeight * 0.8)) * 0.5)
        const translateZ = section.translateZ * (1 + scrollY * 0.0005)
        
        return (
          <motion.div 
            key={section.title}
            ref={el => { sectionRefs.current[index] = el; }}
            className="section"
            initial={{ y: section.initialY, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{
              perspective: "1000px",
              zIndex: sections.length - index,
            }}
          >
            <motion.div
              className="section-image-container"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              style={{
                transform: `translateX(${slideX}px) translateZ(${translateZ}px)`,
                transformStyle: "preserve-3d",
                borderRadius: "24px",
                overflow: "hidden"
              }}
            >
              <motion.img 
                src={section.image} 
                alt={section.title}
                className="section-image"
                whileHover={{
                  filter: "brightness(0.7) contrast(1.2)",
                }}
                style={{
                  filter: 'brightness(0.85) contrast(1.1)',
                  transformStyle: "preserve-3d",
                  borderRadius: "24px",
                  cursor: "pointer"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionClick(section.title);
                }}
              />
            </motion.div>
            <motion.div 
              className="section-content"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(0, 5, 16, 0.85)",
                transition: { duration: 0.3 }
              }}
              style={{
                transform: `translateX(${-slideX}px) translateZ(${translateZ * 0.5}px)`,
                transformStyle: "preserve-3d",
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer"
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSectionClick(section.title);
              }}
            >
              <h2 className="section-title">{section.title}</h2>
              <p className="section-description">{section.description}</p>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
