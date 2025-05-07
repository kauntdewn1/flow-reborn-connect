import React, { useState, useEffect } from 'react';
import ClickToHack from './components/ClickToHack';
import DebtBar from './components/DebtBar';
import MissionUnlock, { Mission } from './components/MissionUnlock';
import { TonConnectButton, useTonConnectUI, useTonWallet } from '@ton/tonconnect-ui-react'; // Importar componentes e hooks do TON Connect
import { motion } from 'framer-motion'; // Importar motion

// Definição de Níveis (exemplo)
const levels = [
  { name: "Recruta Falido", xpRequired: 0, visualEffect: "Tela tremando", motionVariant: "screenShake" }, // Usará framer-motion
  { name: "Executor da Escassez", xpRequired: 100, visualEffect: "Texto rasgado ao fundo", effectClass: "text-glitch-background-effect" }, // Continuará com CSS
  { name: "Alquimista da Urgência", xpRequired: 500, visualEffect: "Terminal ganhando brilho", effectClass: "terminal-glow-effect" }, // Continuará com CSS
  // Adicione mais níveis conforme seu plano
];

function App() {
  const initialDebtAmount = 10000; // Dívida inicial de -10.000 TON
  const [xp, setXp] = useState<number>(0);
  const [fragments, setFragments] = useState<number>(0);
  const [currentDebt, setCurrentDebt] = useState<number>(initialDebtAmount);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [appKey, setAppKey] = useState(0);
  const [activeVisualEffectClass, setActiveVisualEffectClass] = useState<string>(''); // Supondo que você renomeou para isso
  const [activeMotionVariant, setActiveMotionVariant] = useState<string>('idle');

  useEffect(() => {
    // Salvar dados no localStorage quando mudarem
    localStorage.setItem('rebornGrinderXp', xp.toString());
    localStorage.setItem('rebornGrinderFragments', fragments.toString());
    localStorage.setItem('rebornGrinderDebt', currentDebt.toString());
    localStorage.setItem('rebornGrinderMissions', JSON.stringify(missions.map(m => ({id: m.id, isCompleted: m.isCompleted}))));

    // Lógica de Nível
    const newLevel = levels.slice().reverse().find(level => xp >= level.xpRequired) || levels[0];
    if (newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel);
      console.log(`Novo Nível: ${newLevel.name}! Efeito: ${newLevel.visualEffect}`);
      setActiveVisualEffect(newLevel.effectClass || ''); // Set the new effect class
    } else if (xp === 0 && levels[0].effectClass && activeVisualEffect !== levels[0].effectClass) {
      // Ensure initial effect is set if starting at level 0 with an effect
      setActiveVisualEffect(levels[0].effectClass);
    } else if (xp > 0 && !newLevel.effectClass && activeVisualEffect !== '') {
      // Clear effect if the new level has no effectClass defined
      setActiveVisualEffect('');
    }

  }, [xp, fragments, currentDebt, currentLevel.name, missions, activeVisualEffect]);


  useEffect(() => {
    // Carregar dados do localStorage se existirem
    const savedXp = localStorage.getItem('rebornGrinderXp');
    const savedFragments = localStorage.getItem('rebornGrinderFragments');
    const savedDebt = localStorage.getItem('rebornGrinderDebt');
    const savedMissionsState = localStorage.getItem('rebornGrinderMissions');

    if (savedXp) {
        const loadedXp = parseInt(savedXp, 10);
        setXp(loadedXp);
        // Determine initial level and effect based on loaded XP
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
        setMissions(prevInitialMissions => prevInitialMissions.map(initialMission => {
          const savedState = completedMissionInfo.find(s => s.id === initialMission.id);
          return savedState ? { ...initialMission, isCompleted: savedState.isCompleted } : initialMission;
        }));
      } catch (error) {
        console.error("Erro ao carregar estado das missões do localStorage:", error);
      }
    }
  }, []); // Executa apenas uma vez ao montar o componente


  const handleHackSuccess = (xpGained: number, fragmentsGained: number) => {
    setXp(prevXp => prevXp + xpGained);
    setFragments(prevFragments => prevFragments + fragmentsGained);
    // Aqui você pode adicionar lógica para reduzir a dívida com missões, etc.
    // Por enquanto, o hack só dá XP e fragmentos.
  };

  // Função para simular pagamento de missão (exemplo)
  const completeMissionPayment = (amountPaid: number) => {
    setCurrentDebt(prevDebt => Math.max(0, prevDebt - amountPaid));
    // Adicionar som de "alívio digital"
  };

  return (
    <motion.div 
      key={appKey}
      className={`app-container bg-terminal-bg text-primary-text min-h-screen font-mono p-4 flex flex-col items-center ${activeVisualEffectClass}`}
      variants={appContainerVariants}
      animate={activeMotionVariant} 
    >
      <header className="w-full max-w-4xl mx-auto px-4 text-center mb-6 flex justify-between items-center">
        <div className="flex-shrink-0">
           <img src="/logo.png" alt="Reborn Grinder Logo" className="h-10 md:h-12" />
        </div>
        
        <h1 className="flex-grow text-2xl sm:text-3xl md:text-4xl font-bold text-accent-glitch animate-pulse text-center px-2">
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

        {/* Botão para pagar dívida com TON (exemplo) */}
        {wallet && currentDebt > 0 && (
          <button
            onClick={() => handlePayDebtWithTon(100)} // Pagar 100 TON de exemplo
            className="my-4 w-full p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded shadow-lg shadow-blue-500/30 transition-all"
          >
            Pagar 100 TON da Dívida com Carteira
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
    </div>
  );
}
export default App;