import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import './Home.css'

const sections = [
  {
    title: 'Healthcare Documents',
    description: 'Generate comprehensive medical records, including patient histories, diagnoses, treatments, and lab results that maintain statistical accuracy while ensuring complete privacy.',
    image: '/images/healthcare.jpg',
    parallaxRange: [-150, 150]
  },
  {
    title: 'Financial Documents',
    description: 'Create realistic financial profiles including tax returns, bank statements, and investment portfolios that reflect real-world economic patterns and regulations.',
    image: '/images/financial.jpg',
    parallaxRange: [-100, 100]
  },
  {
    title: 'Educational Documents',
    description: 'Produce academic records, transcripts, and educational assessments that mirror actual educational institutions while preserving anonymity.',
    image: '/images/education.jpg',
    parallaxRange: [-150, 150] // Adjusted to match healthcare section
  },
  {
    title: 'Legal Documents',
    description: 'Generate legal documentation including contracts, court records, and regulatory filings that maintain legal validity while protecting sensitive information.',
    image: '/images/legal.jpg',
    parallaxRange: [-100, 100] // Adjusted to match financial section
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

export default function Home() {
  const cyclingWords = [
    'Towns',
    'Cities',
    'Districts',
    'Suburbs',
    'Metropolises',
    'Townships',
    'Neighborhoods'
  ]

  // Track the current word index based on animation timing
  const [currentWord, setCurrentWord] = useState(0)
  const cyclingTextRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const titleContainerRef = useRef<HTMLDivElement>(null)

  // Animation timing: 3s per word (synced with CSS)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % cyclingWords.length)
    }, 3000) // Match 3s CSS animation duration
    return () => clearInterval(interval)
  }, [cyclingWords.length])

  // Dynamically set widths for smooth resizing
  useEffect(() => {
    const wordEl = wordRefs.current[currentWord]
    const cyclingTextEl = cyclingTextRef.current
    const titleContainerEl = titleContainerRef.current
    if (wordEl && cyclingTextEl && titleContainerEl) {
      // Get width of current word
      const wordWidth = wordEl.offsetWidth
      // Get width of static text ("Generate entire " + cycling word)
      // Estimate: sum widths of "Generate", "entire", gaps, and cycling word
      // We'll use cyclingTextEl's padding + wordWidth + static text
      // For simplicity, set cycling-text width to wordWidth + 32px padding
      cyclingTextEl.style.setProperty('--cycling-width', `${wordWidth + 32}px`)
      // Now, set title-container width to fit all children
      // Get widths of "Generate" and "entire"
      const staticSpans = Array.from(titleContainerEl.children).filter(
        (el) => el.tagName === 'SPAN'
      ) as HTMLSpanElement[]
      const staticWidth = staticSpans.reduce((acc, el) => acc + el.offsetWidth, 0)
      // Add gap (gap * number of gaps)
      const gap = 24 // 1.5rem ≈ 24px
      const totalWidth = staticWidth + gap * 2 + wordWidth + 32
      titleContainerEl.style.setProperty('--title-width', `${totalWidth}px`)
    }
  }, [currentWord])

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smoother scroll progress with optimized spring settings
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30, // Increased damping for more controlled movement
    mass: 0.8,   // Increased mass for smoother transitions
    stiffness: 30 // Reduced stiffness for better flow
  })

  // Calculate section visibility based on viewport position
  const calculateSectionProgress = (index: number) => {
    // Each section takes up 1/sections.length of the total scroll range
    const sectionSize = 1 / sections.length
    // Start showing section slightly before it reaches viewport
    const start = Math.max(0, (index * sectionSize) - 0.1)
    // Keep section visible until next section starts
    const end = Math.min(1, ((index + 1) * sectionSize) + 0.1)
    return useTransform(smoothProgress, [start, start + 0.2, end - 0.2, end], [0, 1, 1, 0])
  }

  // Calculate parallax effect based on scroll position
  const calculateParallax = (index: number, range: number[]) => {
    const sectionSize = 1 / sections.length
    const sectionStart = index * sectionSize
    const sectionEnd = (index + 1) * sectionSize
    return useTransform(
      smoothProgress,
      [sectionStart, sectionEnd],
      range,
      { clamp: false } // Allow smooth overflow for parallax
    )
  }

  return (
    <div ref={containerRef} className="parallax-container">
      <motion.div 
        className="home"
        style={{
          opacity: useTransform(
            smoothProgress, 
            [0, 0.15, 0.3], 
            [1, 1, 0]
          ),
          scale: useTransform(
            smoothProgress,
            [0, 0.3],
            [1, 0.95]
          )
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
          >
            Get Started Free
          </motion.button>

          {/* Metrics container with fixed width wrapper */}
          <motion.div 
            className="metrics-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ maxWidth: '1000px', margin: '0 auto' }} // Fixed max width
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

      <div className="features-section">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, x: -50 }}  // All cards start from left
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}  // Stagger the animations
            viewport={{ once: true }}
          >
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {sections.map((section, index) => {
        const visibility = calculateSectionProgress(index)
        const yParallax = calculateParallax(index, section.parallaxRange)

        return (
          <motion.div 
            key={section.title}
            className="section"
            style={{
              opacity: visibility,
              // Ensure section is in view before starting parallax
              y: useTransform(
                smoothProgress,
                [(index / sections.length), ((index + 1) / sections.length)],
                [0, -50]
              )
            }}
          >
            <motion.div 
              className="parallax-layer background"
              style={{ y: yParallax }}
            >
              <motion.img 
                src={section.image} 
                alt={section.title}
                className={`section-image ${index === 0 ? 'color' : ''}`}
                style={{
                  scale: useTransform(visibility, [0, 1], [1.1, 1])
                }}
              />
            </motion.div>

            <motion.div 
              className="parallax-layer content"
              style={{
                y: useTransform(yParallax, (y) => y * -0.5), // Inverse parallax for content
              }}
            >
              <motion.div 
                className="section-content"
                style={{
                  opacity: visibility,
                  y: useTransform(visibility, [0, 1], [30, 0])
                }}
              >
                <h2 className="section-title">{section.title}</h2>
                <p className="section-description">{section.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
