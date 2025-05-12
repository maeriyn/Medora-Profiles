import { motion } from 'framer-motion'
import './modalities.css'

export default function FinancialModality() {
  return (
    <motion.div 
      className="modality-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="content-wrapper">
        <h1>Financial Data Generation</h1>
        <p>Generate realistic financial profiles including tax returns, bank statements, 
           credit reports, and investment portfolios. Our synthetic data maintains 
           statistical accuracy while reflecting real-world economic patterns 
           and regulatory compliance.</p>
      </div>
    </motion.div>
  )
}
