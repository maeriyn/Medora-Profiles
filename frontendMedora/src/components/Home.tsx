import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './Home.css'

const sections = [
  {
    title: 'Healthcare Documents',
    description: 'Generate comprehensive medical records, including patient histories, diagnoses, treatments, and lab results that maintain statistical accuracy while ensuring complete privacy.',
    image: '/images/healthcare.jpg',
    parallaxRange: [-150, 150] // Increased from [-50, 50]
  },
  {
    title: 'Financial Documents',
    description: 'Create realistic financial profiles including tax returns, bank statements, and investment portfolios that reflect real-world economic patterns and regulations.',
    image: '/images/financial.jpg',
    parallaxRange: [-100, 100] // Increased from [-30, 30]
  },
  {
    title: 'Educational Documents',
    description: 'Produce academic records, transcripts, and educational assessments that mirror actual educational institutions while preserving anonymity.',
    image: '/images/education.jpg',
    parallaxRange: [-120, 120] // Increased from [-40, 40]
  },
  {
    title: 'Legal Documents',
    description: 'Generate legal documentation including contracts, court records, and regulatory filings that maintain legal validity while protecting sensitive information.',
    image: '/images/legal.jpg',
    parallaxRange: [-80, 80] // Increased from [-20, 20]
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
    offset: ["start start", "end start"]
  })

  return (
    <div ref={containerRef}>
      <motion.div 
        className="home"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0])  // Extended fade out
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
        </div>
      </motion.div>

      {sections.map((section, index) => {
        const sectionProgress = useTransform(
          scrollYProgress,
          [index * 0.2, (index + 1) * 0.2],
          [0, 1]
        )
        
        const y = useTransform(
          sectionProgress,
          [0, 1],
          section.parallaxRange
        )

        return (
          <motion.div 
            key={section.title}
            className="section"
            style={{
              opacity: useTransform(
                scrollYProgress,
                [index * 0.2, index * 0.2 + 0.15, index * 0.2 + 0.3], // Extended fade timing
                [0, 1, 0]
              )
            }}
          >
            <motion.img 
              src={section.image} 
              alt={section.title} 
              className={`section-image ${index === 0 ? 'color' : ''}`}
              style={{
                y,
                scale: useTransform(sectionProgress, [0, 1], [1.2, 1])
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            />
            <motion.div 
              className="section-content"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
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
