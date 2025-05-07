import React, { useState, useEffect } from 'react';
import ClickToHack from './components/ClickToHack';
import DebtBar from './components/DebtBar';
import MissionUnlock, { Mission } from './components/MissionUnlock';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';

const levels = [
  { name: "Recruta Falido", xpRequired: 0, visualEffect: "Tela tremando", motionVariant: "screenShake" },
  { name: "Executor da Escassez", xpRequired: 100, visualEffect: "Texto rasgado ao fundo", effectClass: "text-glitch-background-effect" },
  { name: "Alquimista da Urgência", xpRequired: 500, visualEffect: "Terminal ganhando brilho", effectClass: "terminal-glow-effect" },
];

function App() {
  const initialDebtAmount = 10000;
  const [xp, setXp] = useState<number>(0);
  const [fragments, setFragments] = useState<number>(0);
  const [currentDebt, setCurrentDebt] = useState<number>(initialDebtAmount);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [appKey, setAppKey] = useState(0);
  const [activeVisualEffectClass, setActiveVisualEffectClass] = useState<string>('');
  const [activeMotionVariant, setActiveMotionVariant] = useState<string>('idle');
  const [missions, setMissions] = useState<Mission[]>([]);
  const wallet = useTonWallet();

  useEffect(() => {
    localStorage.setItem('rebornGrinderXp', xp.toString());
    localStorage.setItem('rebornGrinderFragments', fragments.toString());
    localStorage.setItem('rebornGrinderDebt', currentDebt.toString());
    localStorage.setItem('rebornGrinderMissions', JSON.stringify(missions.map(m => ({id: m.id, isCompleted: m.isCompleted}))));

    const newLevel = levels.slice().reverse().find(level => xp >= level.xpRequired) || levels[0];
    if (newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel);
      setActiveVisualEffectClass(newLevel.effectClass || '');
      setActiveMotionVariant(newLevel.motionVariant || 'idle');
    } else if (xp === 0 && levels[0].effectClass && activeVisualEffectClass !== levels[0].effectClass) {
      setActiveVisualEffectClass(levels[0].effectClass);
      setActiveMotionVariant(levels[0].motionVariant || 'idle');
    } else if (xp > 0 && !newLevel.effectClass && activeVisualEffectClass !== '') {
      setActiveVisualEffectClass('');
      setActiveMotionVariant('idle');
    }
  }, [xp, fragments, currentDebt, currentLevel.name, missions, activeVisualEffectClass, activeMotionVariant]);

  useEffect(() => {
    const savedXp = localStorage.getItem('rebornGrinderXp');
    const savedFragments = localStorage.getItem('rebornGrinderFragments');
    const savedDebt = localStorage.getItem('rebornGrinderDebt');
    const savedMissionsState = localStorage.getItem('rebornGrinderMissions');

    if (savedXp) {
      const loadedXp = parseInt(savedXp, 10);
      setXp(loadedXp);
      const initialLevelOnLoad = levels.slice().reverse().find(level => loadedXp >= level.xpRequired) || levels[0];
      setCurrentLevel(initialLevelOnLoad);
      setActiveMotionVariant(initialLevelOnLoad.motionVariant || 'idle');
      setActiveVisualEffectClass(initialLevelOnLoad.effectClass || '');
    }
    if (savedFragments) setFragments(parseInt(savedFragments, 10));
    if (savedDebt) setCurrentDebt(parseInt(savedDebt, 10));
    if (savedMissionsState) {
      try {
        const completedMissionInfo: Array<{id: string, isCompleted: boolean}> = JSON.parse(savedMissionsState);
        setMissions(prevInitialMissions => {
          return prevInitialMissions.map(initialMission => {
            const savedState = completedMissionInfo.find(s => s.id === initialMission.id);
            return savedState ? { ...initialMission, isCompleted: savedState.isCompleted } : initialMission;
          });
        });
      } catch (error) {
        console.error("Erro ao carregar estado das missões do localStorage:", error);
      }
    }
  }, []);

  const handleHackSuccess = (xpGained: number, fragmentsGained: number) => {
    setXp(prevXp => prevXp + xpGained);
    setFragments(prevFragments => prevFragments + fragmentsGained);
  };

  const completeMissionPayment = (amountPaid: number) => {
    setCurrentDebt(prevDebt => Math.max(0, prevDebt - amountPaid));
  };

  function handlePayDebtWithTon(arg0: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <motion.div
      key={appKey}
      className={`app-container bg-terminal-bg text-primary-text min-h-screen font-mono p-4 flex flex-col items-center ${activeVisualEffectClass}`}
      variants={{
        idle: { scale: 1 },
        screenShake: {
          x: [-2, 2, -2, 2, 0],
          transition: { duration: 0.5, repeat: Infinity }
        }
      }}
      animate={activeMotionVariant}
    >
      <header className="w-full max-w-4xl mx-auto px-4 text-center mb-6 flex justify-between items-center">
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="Reborn Grinder Logo" className="h-10 md:h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-accent-glitch animate-pulse bg-gradient-to-r from-accent-glitch to-danger-text bg-clip-text text-transparent">
          REBORN GRINDER // SYSTEM32.EXE
        </h1>
        <div className="flex-shrink-0">
          <TonConnectButton />
        </div>
      </header>

      <main className="w-full max-w-md">
        {wallet && (
          <div className="my-2 p-2 bg-black/70 border border-primary-text/30 rounded text-center text-xs">
            Carteira Conectada: <span className="text-accent-glitch">{`${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`}</span> ({wallet.device.appName})
          </div>
        )}

        <div className="mb-4 p-3 bg-black/50 rounded-lg border border-primary-text/30">
          <div className="flex justify-between text-lg">
            <span>Nível: <span className="text-accent-glitch font-semibold">{currentLevel.name}</span></span>
            <span>XP: <span className="text-primary-text font-semibold">{xp.toLocaleString()}</span></span>
          </div>
          <div className="text-sm">Fragmentos Corrompidos: <span className="text-primary-text font-semibold">{fragments.toLocaleString()}</span></div>
        </div>

        <DebtBar currentDebt={currentDebt} initialDebt={initialDebtAmount} />

        {wallet && currentDebt > 0 && (
          <button
            onClick={() => handlePayDebtWithTon(100)}
            className="w-full my-4 py-3 px-6 bg-gradient-to-r from-accent-glitch to-danger-text text-black font-bold rounded-xl border-2 border-accent-glitch hover:from-danger-text hover:to-accent-glitch transition-all duration-300 shadow-lg shadow-accent-glitch/30"
          >
            💸 Quitar 100 TON da Dívida
          </button>
        )}

        <ClickToHack onHackSuccess={handleHackSuccess} />

        <MissionUnlock
          availableMissions={missions.filter(m => !m.isCompleted)}
          currentLevelName={currentLevel.name}
          currentXp={xp}
        />
      </main>

      <footer className="w-full max-w-2xl text-center mt-auto pt-6">
        <p className="text-xs text-primary-text/60">
          Interface corrompida. Prossiga por sua conta e risco.
        </p>
      </footer>
    </motion.div>
  );
}

export default App;