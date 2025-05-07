import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

export interface Mission {
  id: string;
  title: string;
  description: string;
  rewardText: string; // e.g., "-500 TON Dívida, +50 XP"
  unlocks?: string; // e.g., "Acesso ao Grupo WhatsApp"
  levelRequired: number; // XP or level index
  isCompleted: boolean;
  actionText: string; // e.g., "INFILTRAR GRUPO", "EXECUTAR"
  onComplete: () => void; // Callback when mission is "completed"
  type?: 'normal' | 'inverse_failure'; // For your "Missões Inversas"
  failureCondition?: string; // For inverse_failure missions
}

interface MissionUnlockProps {
  availableMissions: Mission[];
  currentXp: number; // To check if mission can be undertaken
}

const MissionUnlock: React.FC<MissionUnlockProps> = ({ availableMissions, currentXp }) => {
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  const handleToggleMission = (missionId: string) => {
    setExpandedMissionId(expandedMissionId === missionId ? null : missionId);
  };

  const handleCompleteMission = (mission: Mission) => {
    // Here, you'd typically call mission.onComplete()
    // which would be a function passed from App.tsx to update global state (debt, xp, etc.)
    // For now, we'll just log it and simulate the callback.
    console.log(`Attempting to complete mission: ${mission.title}`);
    mission.onComplete(); 
    // Potentially play a sound or show feedback
  };

  return (
    <div className="my-6 p-4 bg-black/40 border border-accent-glitch/30 rounded-lg shadow-xl shadow-accent-glitch/10">
      <h2 className="text-2xl font-bold text-accent-glitch mb-4 text-center">MISSÕES DISPONÍVEIS</h2>
      {availableMissions.length === 0 && (
        <p className="text-primary-text/70 text-center">Nenhuma missão disponível no momento. Continue hackeando.</p>
      )}
      <ul className="space-y-3">
        <AnimatePresence> {/* Wrap list items for exit animations if missions are removed */}
          {availableMissions.map((mission) => {
            const canAttempt = mission.levelRequired <= currentXp;
            return (
              <motion.li
                key={mission.id}
                layout // Animates layout changes (e.g., if items are reordered or removed)
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }} // Example exit animation
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`border rounded-md overflow-hidden
                            ${mission.isCompleted ? 'border-green-500/50 bg-green-900/30 opacity-70' 
                                                : canAttempt ? 'border-primary-text/40 bg-black/20 hover:border-primary-text' 
                                                             : 'border-gray-600/50 bg-gray-800/30 opacity-60 cursor-not-allowed'}`}
              >
                <button
                  onClick={() => canAttempt && !mission.isCompleted && handleToggleMission(mission.id)}
                  disabled={!canAttempt || mission.isCompleted}
                  className="w-full text-left p-3 flex justify-between items-center"
                >
                  <span className={`font-semibold ${mission.isCompleted ? 'text-green-400' : canAttempt ? 'text-primary-text' : 'text-gray-500'}`}>
                    {mission.title} {mission.isCompleted ? '(Concluída)' : ''}
                  </span>
                  {!mission.isCompleted && canAttempt && (
                    <span className="text-xs text-accent-glitch">
                      {expandedMissionId === mission.id ? '▼ Ocultar' : '▶ Detalhes'}
                    </span>
                  )}
                  {!canAttempt && !mission.isCompleted && (
                      <span className="text-xs text-alert-red">XP Insuficiente ({mission.levelRequired} XP)</span>
                  )}
                </button>
                <AnimatePresence>
                  {expandedMissionId === mission.id && !mission.isCompleted && canAttempt && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="p-3 border-t border-primary-text/20 bg-black/30"
                    >
                      <p className="text-sm text-primary-text/80 mb-2">{mission.description}</p>
                      <p className="text-xs text-yellow-400/80 mb-1">Recompensa: {mission.rewardText}</p>
                      {mission.unlocks && <p className="text-xs text-blue-400/80 mb-3">Desbloqueia: {mission.unlocks}</p>}
                      {mission.type === 'inverse_failure' && mission.failureCondition && (
                        <p className="text-xs text-orange-400/80 mb-2">Condição de Falha (para sucesso): {mission.failureCondition}</p>
                      )}
                      <motion.button
                        onClick={() => handleCompleteMission(mission)}
                        className="w-full mt-2 p-2 bg-accent-glitch/80 hover:bg-accent-glitch text-terminal-bg font-bold rounded transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {mission.actionText}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default MissionUnlock;