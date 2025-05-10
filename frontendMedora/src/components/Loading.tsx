import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './Loading.css';

interface LoadingProps {
  onLoaded?: () => void;
}

export default function Loading({ onLoaded }: LoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading metrics data
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          onLoaded?.();
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onLoaded]);

  return (
    <div className="loading-container">
      <div className="cyber-sphere">
        <div className="rings">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="ring"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <motion.div
          className="core"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.h2
        className="loading-text"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        INITIALIZING SYSTEM
      </motion.h2>
      <div className="metrics-row">
        <div className="metric-box">
          <div className="metric-value">{progress}%</div>
          <div className="metric-label">Loading Progress</div>
        </div>
      </div>
    </div>
  );
}
