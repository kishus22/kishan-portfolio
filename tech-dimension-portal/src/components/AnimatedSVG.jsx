import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSVG = () => (
  <svg viewBox="0 0 200 200" width="200" height="200" className="animated-svg">
    <motion.circle
      cx="100"
      cy="100"
      r="80"
      stroke="hsl(210, 80%, 60%)"
      strokeWidth="4"
      fill="transparent"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    />
    <motion.line
      x1="100"
      y1="20"
      x2="100"
      y2="180"
      stroke="hsl(210, 80%, 70%)"
      strokeWidth="2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
    />
    <motion.line
      x1="20"
      y1="100"
      x2="180"
      y2="100"
      stroke="hsl(210, 80%, 70%)"
      strokeWidth="2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5, duration: 1 }}
    />
  </svg>
);

export default AnimatedSVG;
