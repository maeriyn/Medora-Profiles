import { motion } from 'framer-motion'
import { useEffect } from 'react'
import './Pricing.css'

interface PricingProps {
  onClose: () => void;
  onContactClick: () => void;
}

export default function Pricing({ onClose, onContactClick }: PricingProps) {
  useEffect(() => {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const plans = [
    {
      name: 'Basic',
      price: '$99/month',
      features: [
        '10,000 records/month',
        'Basic data types',
        'Email support',
        'API access'
      ]
    },
    {
      name: 'Professional',
      price: '$299/month',
      features: [
        '50,000 records/month',
        'Advanced data types',
        'Priority support',
        'API access',
        'Custom fields'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Unlimited records',
        'All data types',
        'Dedicated support',
        'Custom API integration',
        'Advanced analytics'
      ]
    }
  ]

  return (
    <motion.div 
      className="pricing-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="pricing-modal">
        <h2>Choose Your Plan</h2>
        <div className="pricing-grid">
          {plans.map(plan => (
            <div key={plan.name} className="pricing-card">
              <div>
                <h3>{plan.name}</h3>
                <div className="price">{plan.price}</div>
              </div>
              <div className="pricing-features">
                <ul>
                  {plan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button onClick={onContactClick} className="contact-button">
                  Contact Us
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="close-button">
          Go Back
        </button>
      </div>
    </motion.div>
  )
}
