import { useEffect, useState } from "react";
import ClickToHack from "./components/ClickToHack";
import DebtBar from "./components/DebtBar";
import MissionUnlock from "./components/MissionUnlock";
import { TonConnectButton } from "@tonconnect/ui-react";

// Assets
const logo = "https://res.cloudinary.com/decskr6ey/image/upload/v1746598594/logo-reborn_pfdio9.png";
const bgNoise = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599498/bg_noise_xow8jw.png";
const bgBunker = "https://res.cloudinary.com/decskr6ey/image/upload/v1746600060/bg_geral_otapkg.png";
const avatar = "https://res.cloudinary.com/decskr6ey/image/upload/v1746600135/avatar_glitch_tvrjsr.png";
const xpIcon = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599367/glitch_heokdq.png";
const fragIcon = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599166/FRAG_wlaotb.png";
const debtIcon = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599089/DIVIDA_opojqz.png";
const badge = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599800/badget_jyrfck.png";
const missionsIcon = "https://res.cloudinary.com/decskr6ey/image/upload/v1746599219/MISSOES_kaqeq3.png";

const levels = [
  { name: "Recruta Falido", xpRequired: 0 },
  { name: "Executor da Escassez", xpRequired: 100 },
  { name: "Alquimista da Urgência", xpRequired: 500 },
  { name: "Dominador do Terminal", xpRequired: 2000 },
  { name: "Lorde Glitch", xpRequired: 10000 },
];

function App() {
  const initialDebt = 10000;
  const [xp, setXp] = useState(0);
  const [frags, setFrags] = useState(0);
  const [debt, setDebt] = useState(initialDebt);
  const [level, setLevel] = useState(levels[0]);
  const [progress, setProgress] = useState(0);
  const [missions, setMissions] = useState([
    { id: "1", title: "Hack Inicial", description: "Complete seu primeiro hack", isCompleted: false, rewardXp: 50, rewardFragments: 10 },
    { id: "2", title: "Dívida Reduzida", description: "Reduza sua dívida em 1000 TON", isCompleted: false, rewardXp: 100, rewardFragments: 25 },
  ]);

  useEffect(() => {
    const local = localStorage.getItem("reborn_grinder");
    if (local) {
      const parsed = JSON.parse(local);
      setXp(parsed.xp || 0);
      setFrags(parsed.fragments || 0);
      setDebt(parsed.debt || initialDebt);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reborn_grinder", JSON.stringify({ xp, fragments: frags, debt }));
    const newLevel = levels.slice().reverse().find(lvl => xp >= lvl.xpRequired) || levels[0];
    setLevel(newLevel);
    const nextLevel = levels[levels.indexOf(newLevel) + 1];
    const pct = nextLevel ? ((xp - newLevel.xpRequired) / (nextLevel.xpRequired - newLevel.xpRequired)) * 100 : 100;
    setProgress(pct);
  }, [xp, frags, debt]);

  const handleHack = () => {
    setXp(xp + 50);
    setFrags(frags + 5);
    setDebt(prev => Math.max(0, prev - 100));
    new Audio("/sounds/hack.mp3").play().catch(() => {});
  };

  const handleMission = (id: string, xpG: number, fragG: number) => {
    setXp(x => x + xpG);
    setFrags(f => f + fragG);
    setMissions(ms => ms.map(m => m.id === id ? { ...m, isCompleted: true } : m));
    new Audio("/sounds/mission-complete.mp3").play().catch(() => {});
  };

  return (
    <div className="relative min-h-screen bg-black text-primary-text font-mono overflow-hidden">
      {/* BG Noise */}
      <img src={bgNoise} className="fixed inset-0 opacity-10 z-0 mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 bg-cover bg-center z-0 opacity-10" style={{ backgroundImage: `url(${bgBunker})` }} />

      {/* HUD */}
      <header className="fixed w-full top-0 left-0 z-50 bg-black/80 text-xs px-4 py-2 border-b border-accent-glitch flex justify-between items-center backdrop-blur-sm shadow-lg">
        <div className="flex gap-3 items-center">
          <img src={avatar} className="w-7 h-7 rounded-full border border-accent-glitch" />
          <div className="flex gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1"><img src={xpIcon} className="w-3 h-3" /> {xp}</div>
            <div className="flex items-center gap-1"><img src={fragIcon} className="w-3 h-3" /> {frags}</div>
            <div className="flex items-center gap-1"><img src={debtIcon} className="w-3 h-3" /> {debt}</div>
            <div className="text-danger-text">{level.name}</div>
            {progress === 100 && <img src={badge} className="w-3 h-3 animate-spin" />}
          </div>
        </div>
        <TonConnectButton />
      </header>

      {/* CONTEÚDO */}
      <main className="pt-24 px-4 max-w-lg mx-auto text-center space-y-6">
        <img src={logo} className="mx-auto w-28 md:w-36 drop-shadow-lg" />
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-accent-glitch to-danger-text bg-clip-text text-transparent animate-pulse">
          REBORN GRINDER // SYSTEM32.EXE
        </h1>

        {/* BARRA DE DÍVIDA */}
        <div className="flex items-center justify-center gap-2">
          <img src={debtIcon} className="w-5 h-5" />
          <DebtBar currentDebt={debt} initialDebt={initialDebt} />
        </div>

        {/* BOTÃO DE HACKEAR */}
        <ClickToHack onHackSuccess={handleHack} />

        {/* MISSÕES */}
        <div className="text-left">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <img src={missionsIcon} className="w-4 h-4" />
            <h2 className="text-lg font-bold border-l-4 border-red-600 pl-2">MISSÕES DISPONÍVEIS</h2>
          </div>
          <MissionUnlock
            availableMissions={missions.filter(m => !m.isCompleted)}
            onMissionComplete={handleMission}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
