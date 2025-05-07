import React, { useState } from 'react';
import ClickToHack from './components/ClickToHack';
import DebtBar from './components/DebtBar';
import MissionUnlock from './components/MissionUnlock';

const App: React.FC = () => {
  const [currentDebt, setCurrentDebt] = useState(1000);
  const [xp, setXp] = useState(0);
  const [availableMissions, setAvailableMissions] = useState([
    {
      id: '1',
      title: 'Missão Inicial',
      description: 'Complete sua primeira missão para ganhar XP e reduzir sua dívida.',
      rewardText: '-100 TON Dívida, +50 XP',
      levelRequired: 0,
      isCompleted: false,
      actionText: 'INICIAR MISSÃO',
      onComplete: () => {
        setCurrentDebt(prev => prev - 100);
        setXp(prev => prev + 50);
      }
    }
  ]);

  const handleHackSuccess = (xpGained: number, fragmentsGained: number) => {
    setXp(prev => prev + xpGained);
    setCurrentDebt(prev => Math.max(0, prev - fragmentsGained * 50));
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-primary-text p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-accent-glitch text-center mb-6">
          HACKER VIRTUAL
        </h1>
        
        <DebtBar currentDebt={currentDebt} initialDebt={1000} />
        
        <ClickToHack onHackSuccess={handleHackSuccess} />
        
        <MissionUnlock 
          availableMissions={availableMissions}
          currentLevelName="Iniciante"
          currentXp={xp}
        />
      </div>
    </div>
  );
};

export default App; 