import { useState, useEffect } from 'react';
import ClickToHack from './components/ClickToHack';
import DebtBar from './components/DebtBar';
import MissionUnlock from './components/MissionUnlock';
import { TonConnectButton } from '@tonconnect/ui-react';

// Imagens e ícones
const logoReborn = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746598594/logo-reborn_pfdio9.png';
const iconDebt = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599089/DIVIDA_opojqz.png';
const iconFragments = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599166/FRAG_wlaotb.png';
const iconGlitch = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599367/glitch_heokdq.png';
const iconMissions = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599219/MISSOES_kaqeq3.png';
const badgeLevelUp = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599800/badget_jyrfck.png';
const bgNoise = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746599498/bg_noise_xow8jw.png';
const bgBunker = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746600060/bg_geral_otapkg.png';
const avatarGlitch = 'https://res.cloudinary.com/decskr6ey/image/upload/v1746600135/avatar_glitch_tvrjsr.png';

// Sons
const playSound = (sound: string) => {
  new Audio(sound).play().catch(() => {});
};

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

function App() {
  const initialDebtAmount = 10000;
  const [xp, setXp] = useState<number>(0);
  const [fragments, setFragments] = useState<number>(0);
  const [currentDebt, setCurrentDebt] = useState<number>(initialDebtAmount);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      title: 'Hack Inicial',
      description: 'Complete seu primeiro hack',
      isCompleted: false,
      rewardXp: 50,
      rewardFragments: 10
    },
    {
      id: '2',
      title: 'Dívida Reduzida',
      description: 'Reduza sua dívida em 1000 TON',
      isCompleted: false,
      rewardXp: 100,
      rewardFragments: 25
    }
  ]);

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

  const handleHackSuccess = (xpGained: number, fragmentsGained: number) => {
    setXp(prev => prev + xpGained);
    setFragments(prev => prev + fragmentsGained);
    setCurrentDebt(prev => Math.max(0, prev - 100));
    setClicks([...clicks, {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }]);
    playSound('/sounds/hack.mp3');
  };

  const handleMissionComplete = (missionId: string, gainedXp: number, gainedFragments: number) => {
    setXp(prev => prev + gainedXp);
    setFragments(prev => prev + gainedFragments);
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, isCompleted: true } : m));
    playSound('/sounds/mission-complete.mp3');
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Overlay de ruído */}
      <img src={bgNoise} alt="Noise" className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 mix-blend-overlay" />
      <div className="scanlines" />
      
      {/* Fundo bunker */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${bgBunker}')` }} />

      {/* HUD Fixo */}
      <div className="fixed top-0 left-0 w-full bg-black/80 border-b border-accent-glitch z-50 px-4 py-2 flex justify-between items-center text-primary-text font-mono text-xs sm:text-sm shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <img src={avatarGlitch} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-accent-glitch animate-pulse" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-1">
              <img src={iconGlitch} className="w-4 h-4" alt="XP" />
              <span className="text-xp-bar font-bold">{xp}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={iconFragments} className="w-4 h-4" alt="Fragments" />
              <span className="text-accent-glitch font-bold">{fragments}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={iconDebt} className="w-4 h-4" alt="Dívida" />
              <span className="text-ton-debt font-bold">{currentDebt}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-danger-text font-bold">{currentLevel.name}</span>
              {progressPercent === 100 && (
                <img src={badgeLevelUp} alt="Level Up" className="w-4 h-4 animate-spin" />
              )}
            </div>
          </div>
        </div>
        <TonConnectButton />
      </div>

      {/* Conteúdo Principal */}
      <main className="pt-20 px-4">
        {/* Logo e Título */}
        <div className="flex flex-col items-center mb-8">
          <img src={logoReborn} alt="Logo Reborn" className="w-28 md:w-36 glitch-shadow drop-shadow-lg" />
          <h1 className="text-2xl md:text-4xl font-black glitch text-accent-glitch mt-2 tracking-widest">
            REBORN GRINDER // SYSTEM32.EXE
          </h1>
        </div>

        {/* Barra de dívida dinâmica */}
        <div className="relative z-10 flex items-center gap-2 mt-4 mx-auto w-11/12 max-w-lg">
          <img src={iconDebt} className="w-6 h-6" alt="Dívida" />
          <DebtBar currentDebt={currentDebt} initialDebt={initialDebtAmount} />
        </div>

        {/* Botão de hack */}
        <div className="relative z-10 flex justify-center mt-6">
          <ClickToHack onHackSuccess={handleHackSuccess} />
        </div>

        {/* Missões */}
        <div className="relative z-10 mt-8 mx-auto w-11/12 max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <img src={iconMissions} className="w-5 h-5" alt="Missões" />
            <h2 className="text-lg font-bold text-cyan-400 border-l-4 border-red-500 pl-2">MISSÕES DISPONÍVEIS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MissionUnlock
              availableMissions={missions.filter(m => !m.isCompleted)}
              onMissionComplete={handleMissionComplete}
            />
          </div>
        </div>
      </main>

      {/* Overlay scanlines */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50" />

      {/* Animações de XP */}
      {clicks.map((click) => (
        <div key={click.id} 
          className="absolute text-3xl font-bold text-accent-glitch pointer-events-none animate-pulse"
          style={{ 
            top: `${click.y}px`, 
            left: `${click.x}px`,
            textShadow: '0 0 10px #0ff, 0 0 20px #0ff'
          }}>
          +XP
        </div>
      ))}

      {/* Barra de progresso superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-glitch to-transparent animate-pulse z-50" />
    </div>
  );
}

export default App;
