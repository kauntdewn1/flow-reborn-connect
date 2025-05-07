import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface ClickToHackProps {
  onHackSuccess: (xpGained: number, fragmentsGained: number) => void;
}

const ClickToHack: React.FC<ClickToHackProps> = ({ onHackSuccess }) => {
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState(0); // To re-trigger animation

  const handleHack = () => {
    // Lógica de Simulação de Hack
    const xpEarned = Math.floor(Math.random() * 10) + 1; // Ganha de 1 a 10 XP
    const fragmentsEarned = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0; // 30% de chance de ganhar 1-3 fragmentos

    onHackSuccess(xpEarned, fragmentsEarned);

    const feedback = `+${xpEarned} XP${fragmentsEarned > 0 ? `, +${fragmentsEarned} Frag.` : ''}`;
    setFeedbackText(feedback);
    setFeedbackKey(prev => prev + 1); // Increment key to re-trigger animation

    // Limpar feedback após um tempo
    setTimeout(() => {
      setFeedbackText(null);
    }, 1500);
  };

  return (
    <div className="my-6 flex flex-col items-center select-none">
      <motion.button
        onClick={handleHack}
        className="px-8 py-4 bg-accent-glitch hover:bg-accent-glitch/80 text-terminal-bg font-bold text-xl rounded-lg shadow-lg shadow-accent-glitch/30 active:shadow-accent-glitch/10 transition-all duration-150 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-glitch focus:ring-opacity-50"
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        HACKEAR SISTEMA
      </motion.button>
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
};

export default ClickToHack;