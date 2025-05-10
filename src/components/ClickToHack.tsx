// ClickToHack.tsx
import React from 'react';

interface Props {
  onHackSuccess: () => void;
}

const ClickToHack: React.FC<Props> = ({ onHackSuccess }) => {
  return (
    <button
      onClick={onHackSuccess}
      className="bg-gradient-to-r from-accent-glitch to-danger-text text-black font-bold py-2 px-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-200 border border-accent-glitch shadow-accent-glitch/30"
    >
      HACKEAR SISTEMA
    </button>
  );
};

export default ClickToHack;