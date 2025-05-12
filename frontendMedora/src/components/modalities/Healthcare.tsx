import { motion } from 'framer-motion'
import './modalities.css'

export default function HealthcareModality() {
  return (
    <motion.div 
      className="modality-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-wrapper">
        <h1>Healthcare Data Generation</h1>
        <p>Generate comprehensive medical records including patient histories, 
           diagnoses, treatments, lab results, and imaging reports. Our synthetic 
           data maintains HIPAA compliance while providing statistically accurate 
           representations of real-world medical scenarios and population health patterns.</p>
      </div>
    </motion.div>
  )
}
