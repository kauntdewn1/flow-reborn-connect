import { useState, useEffect } from 'react';
import ClickToHack from './components/ClickToHack';
import DebtBar from './components/DebtBar';
import MissionUnlock from './components/MissionUnlock';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';

const bgImage = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746600060/bg_geral_otapkg.png';
const glitchBtn = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746600135/button_glitch_tvrjsr.png';

type Mission = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  rewardXp: number;
  rewardFragments: number;
};

const levels = [
  { name: "Recruta Falido", xpRequired: 0 },
  { name: "Executor da Escassez", xpRequired: 100 },
  { name: "Alquimista da Urgência", xpRequired: 500 },
  { name: "Dominador do Terminal", xpRequired: 2000 },
  { name: "Lorde Glitch", xpRequired: 10000 }
];

function getProgressBar(percent: number, size = 10) {
  const filled = Math.round((percent / 100) * size);
  const empty = size - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent.toFixed(0)}%`;
}

function App() {
  const initialDebtAmount = 10000;
  const [xp, setXp] = useState<number>(0);
  const [fragments, setFragments] = useState<number>(0);
  const [currentDebt, setCurrentDebt] = useState<number>(initialDebtAmount);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [appKey] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [timerCountdown, setTimerCountdown] = useState('');
  const [missions, setMissions] = useState<Mission[]>([]);
  const wallet = useTonWallet();

  useEffect(() => {
    const saved = localStorage.getItem('reborn_grinder');
    if (saved) {
      const parsed = JSON.parse(saved);
      setXp(parsed.xp || 0);
      setFragments(parsed.fragments || 0);
      setCurrentDebt(parsed.debt || initialDebtAmount);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reborn_grinder', JSON.stringify({ 
      xp, 
      debt: currentDebt, 
      fragments 
    }));

    const newLevel = levels.slice().reverse().find(level => xp >= level.xpRequired) || levels[0];
    setCurrentLevel(newLevel);

    const currentIndex = levels.findIndex(l => l.name === newLevel.name);
    const nextLevel = levels[currentIndex + 1];
    const prevXP = newLevel.xpRequired;
    const nextXP = nextLevel ? nextLevel.xpRequired : xp;
    const progress = nextLevel ? ((xp - prevXP) / (nextXP - prevXP)) * 100 : 100;
    setProgressPercent(Math.min(100, Math.max(0, progress)));
  }, [xp, fragments, currentDebt]);

  useEffect(() => {
    const now = new Date();
    const target = new Date();
    target.setUTCHours(0, 0, 0, 0);
    if (now.getUTCHours() >= 0) target.setUTCDate(target.getUTCDate() + 1);

    const updateTimer = () => {
      const diff = target.getTime() - Date.now();
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      setTimerCountdown(`${h}:${m}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleHackSuccess = (xpGained: number, fragmentsGained: number) => {
    setXp(prev => prev + xpGained);
    setFragments(prev => prev + fragmentsGained);
    setClicks([...clicks, {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }]);
  };

  const handleMissionComplete = (missionId: string, gainedXp: number, gainedFragments: number) => {
    setXp(prev => prev + gainedXp);
    setFragments(prev => prev + gainedFragments);
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, isCompleted: true } : m));
  };

  const handlePayDebtWithTon = (amount: number) => {
    setCurrentDebt(prev => Math.max(0, prev - amount));
  };

  return (
    <motion.div key={appKey} className="relative bg-black text-white min-h-screen p-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Corrigido: Removido VisualEffect inexistente */}
      
      <motion.div className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url("${bgImage}")` }}
        animate={{ 
          scale: [1, 1.02, 1],
          y: [0, -20, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <header className="relative z-10 w-full max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-accent-glitch to-danger-text bg-clip-text text-transparent glitch tracking-wider">
          REBORN GRINDER // SYSTEM32.EXE
        </h1>
        <TonConnectButton />
      </header>

      <main className="relative z-10 w-full max-w-md space-y-6">
        <div className="mb-2 font-mono text-xs text-cyan-400 flex flex-col gap-1">
          <div>
            <span className="text-white">[ID: </span>
            <span className="text-accent-glitch">UQBj...8id</span>
            <span className="text-white">]</span>
            <span className="ml-2">[STATUS: <span className="text-yellow-400">INDEFINIDO</span>]</span>
          </div>
          <div>
            <span className="text-pink-500">↯</span> PROTOCOLO ATIVO <span className="ml-2 text-gray-400">[!]</span>
          </div>
          <div>
            <span className="text-gray-400">&gt;&gt;</span> <span className="text-cyan-300">Terminal seguro</span> <span className="ml-2 text-fuchsia-400">Ω</span>
          </div>
        </div>

        <div className="bg-black/70 p-4 rounded-xl border border-cyan-400/30 text-left font-mono">
          <div className="whitespace-pre leading-tight">
            <span className="text-accent-glitch font-bold">&gt; {currentLevel.name.toUpperCase()}</span>{"  "}
            <br />
            <span className="text-green-400">⚡ XP: {xp}</span> {getProgressBar(progressPercent)}
            <br />
            <span className="text-yellow-400">🧩 Fragments: {fragments}</span>
            <br />
            <span className="text-red-400">💸 Dívida: {currentDebt.toLocaleString()} TON</span>
            <br />
            <span className="text-cyan-400">⏰ PRÓXIMO: {timerCountdown}</span>
          </div>
        </div>

        <DebtBar currentDebt={currentDebt} initialDebt={initialDebtAmount} />

        {wallet && currentDebt > 0 && (
          <button
            onClick={() => handlePayDebtWithTon(100)}
            className="w-full py-3 px-6 rounded-xl border-2 text-white font-bold transition-transform hover:scale-105 shadow-xl"
            style={{
              backgroundImage: `url(${glitchBtn})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderColor: '#FF0040',
              boxShadow: '0 0 20px rgba(255,0,64,0.5)'
            }}
          >
            💸 Quitar 100 TON da Dívida
          </button>
        )}

        <ClickToHack onHackSuccess={handleHackSuccess} />

        <MissionUnlock
          availableMissions={missions.filter(m => !m.isCompleted)}
          onMissionComplete={handleMissionComplete}
        />
      </main>

      <footer className="relative z-10 w-full max-w-2xl text-center mt-auto pt-6">
        <p className="text-xs text-white/40 uppercase tracking-wider">
          SYSTEM32.CORRUPTED // ALL LOGS COMPROMISED
        </p>
      </footer>

      {clicks.map((click) => (
        <div key={click.id} className="absolute text-3xl font-bold text-accent-glitch pointer-events-none animate-pulse"
          style={{ top: `${click.y}px`, left: `${click.x}px` }}>
          +XP
        </div>
      ))}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-glitch to-transparent animate-pulse" />
    </motion.div>
  );
}

export default App;
