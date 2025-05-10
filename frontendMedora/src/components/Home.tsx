import { useRef, useEffect, useState } from 'react'
import './Home.css'

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

  return (
    <div className="home">
      <div className="content-wrapper">
        <div className="title-container" ref={titleContainerRef}>
          <span>Generate</span>
          <span>entire</span>
          <div className="cycling-text" ref={cyclingTextRef}>
            <span
              className="cycling-word"
              ref={el => (wordRefs.current[currentWord] = el)}
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
    </div>
  )
}
