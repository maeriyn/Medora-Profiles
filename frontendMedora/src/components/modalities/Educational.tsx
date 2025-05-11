import { motion } from 'framer-motion'
import './modalities.css'

export default function EducationalModality() {
  return (
    <motion.div 
      className="modality-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-wrapper">
        <h1>Educational Data Generation</h1>
        <p>Create comprehensive educational records including transcripts, standardized 
           test scores, attendance records, and learning assessments. Perfect for 
           developing and testing educational technology systems while protecting 
           student privacy.</p>
      </div>
    </motion.div>
  )
}
