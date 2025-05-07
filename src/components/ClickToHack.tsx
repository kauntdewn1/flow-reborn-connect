import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface ClickToHackProps {
  onHackSuccess: (xp: number, fragments: number) => void;
}

export default function ClickToHack({ onHackSuccess }: ClickToHackProps) {
  const [isHacking, setIsHacking] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0); // To re-trigger animation

  const handleClick = () => {
    if (isHacking) return;
    
    setIsHacking(true);
    const xpGained = Math.floor(Math.random() * 10) + 1;
    const fragmentsGained = Math.floor(Math.random() * 5) + 1;
    
    onHackSuccess(xpGained, fragmentsGained);
    
    const feedback = `+${xpGained} XP, +${fragmentsGained} Frag.`;
    setFeedbackText(feedback);
    setFeedbackKey(prev => prev + 1); // Increment key to re-trigger animation
    
    setTimeout(() => {
      setIsHacking(false);
    }, 1000);
  };

  return (
    <div className="relative">
      <div className="circle-outer" onClick={handleClick}>
        <div className="circle-inner">
          <img src="/hacker.png" alt="Hacker" className="w-32 h-32 object-contain" />
        </div>
      </div>
      <div className="dot"></div>
      {isHacking && (
        <div className="absolute float-xp text-3xl font-bold text-accent-glitch">+XP</div>
      )}
      <AnimatePresence>
        {feedbackText && (
          <motion.div
            key={feedbackKey} // Use key to re-mount and re-animate
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5, transition: { duration: 0.4 } }}
            className="mt-3 text-sm text-primary-text font-semibold bg-black/50 px-3 py-1 rounded"
          >
            {feedbackText}
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-2 text-xs text-primary-text/70">
        Clique para simular uma tentativa de hack.
      </p>
    </div>
  );
}