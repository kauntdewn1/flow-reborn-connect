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
  };

  const handleMissionComplete = (missionId: string, gainedXp: number, gainedFragments: number) => {
    setXp(prev => prev + gainedXp);
    setFragments(prev => prev + gainedFragments);
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, isCompleted: true } : m));
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Overlay de ruído */}
      <img src={bgNoise} alt="Noise" className="fixed inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-40" />
      <div className="scanlines" />
      {/* Fundo bunker */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${bgBunker}')` }} />

      {/* Header com logo e glitch */}
      <header className="relative z-10 w-full flex flex-col items-center pt-4 pb-2">
        <img src={logoReborn} alt="Logo Reborn" className="w-28 md:w-36 glitch-shadow drop-shadow-lg" />
        <h1 className="text-2xl md:text-4xl font-black glitch text-accent-glitch mt-2 tracking-widest">
          REBORN GRINDER // SYSTEM32.EXE
        </h1>
        <TonConnectButton />
      </header>

      {/* HUD com ícones */}
      <div className="relative z-10 flex items-center gap-4 mt-4 bg-black/60 rounded-lg px-4 py-2 border border-cyan-700 shadow-lg mx-auto w-fit">
        <img src={iconGlitch} className="w-5 h-5" alt="XP" />
        <span className="text-green-400 font-mono">XP: {xp}</span>
        <img src={iconFragments} className="w-5 h-5" alt="Fragments" />
        <span className="text-yellow-400 font-mono">Fragments: {fragments}</span>
        <img src={iconDebt} className="w-5 h-5" alt="Dívida" />
        <span className="text-red-400 font-mono">Dívida: {currentDebt} TON</span>
      </div>

      {/* Barra de progresso */}
      <div className="relative z-10 mt-2 mx-auto w-11/12 max-w-lg bg-black/40 rounded-lg p-2">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-cyan-400">Progresso: {progressPercent.toFixed(0)}%</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-yellow-400 font-bold">{currentLevel.name}</div>
            {progressPercent === 100 && (
              <img src={badgeLevelUp} alt="Level Up" className="w-4 h-4 animate-pulse" />
            )}
          </div>
        </div>
        <div className="h-2 bg-black/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Barra de dívida dinâmica com componente */}
      <div className="relative z-10 flex items-center gap-2 mt-4 mx-auto w-11/12 max-w-lg">
        <img src={iconDebt} className="w-6 h-6" alt="Dívida" />
        <DebtBar currentDebt={currentDebt} initialDebt={initialDebtAmount} />
      </div>

      {/* Botão de hack glitch com ClickToHack */}
      <div className="relative z-10 flex justify-center mt-6">
        <ClickToHack onHackSuccess={handleHackSuccess} />
      </div>

      {/* Missões com componente visual aprimorado */}
      <div className="relative z-10 mt-8 mx-auto w-11/12 max-w-lg">
        <div className="flex items-center gap-2 mb-2">
          <img src={iconMissions} className="w-5 h-5" alt="Missões" />
          <h2 className="text-lg font-bold text-cyan-400">MISSÕES DISPONÍVEIS</h2>
        </div>
        <MissionUnlock
          availableMissions={missions.filter(m => !m.isCompleted)}
          onMissionComplete={handleMissionComplete}
        />
      </div>

      {/* Overlay scanlines */}
      <div className="scanlines pointer-events-none absolute inset-0 z-50" />

      {clicks.map((click) => (
        <div key={click.id} className="absolute text-3xl font-bold text-accent-glitch pointer-events-none animate-pulse"
          style={{ top: `${click.y}px`, left: `${click.x}px` }}>
          +XP
        </div>
      ))}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-glitch to-transparent animate-pulse" />
    </div>
  );
}

export default App;
