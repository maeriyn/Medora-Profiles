import { motion } from 'framer-motion'
import './modalities.css'

export default function LegalModality() {
  return (
    <motion.div 
      className="modality-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-wrapper">
        <h1>Legal Data Generation</h1>
        <p>Generate synthetic legal documentation including contracts, court records, 
           regulatory filings, and compliance documents. Our system ensures 
           the generated data maintains legal validity while protecting sensitive 
           information and following jurisdictional requirements.</p>
      </div>
    </motion.div>
  )
}
