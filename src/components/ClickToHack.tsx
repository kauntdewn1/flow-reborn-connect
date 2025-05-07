import React from 'react';

interface ClickToHackProps {
  onHackSuccess: (xpGained: number, fragmentsGained: number) => void;
}

const ClickToHack: React.FC<ClickToHackProps> = ({ onHackSuccess }) => {
  const handleClick = () => {
    const xp = Math.floor(Math.random() * 20) + 10;
    const fragments = Math.floor(Math.random() * 5) + 1;
    onHackSuccess(xp, fragments);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="circle-outer relative cursor-pointer" onClick={handleClick}>
        <div className="circle-inner">
          <img
            src="https://res.cloudinary.com/decskr6ey/image/upload/v1746600608/mainterminal_qb11xa.png"
            alt="Terminal Glitch Hacker"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-accent-glitch uppercase tracking-wider">
        Toque no núcleo para executar o ataque
      </p>
    </div>
  );
};

export default ClickToHack;
