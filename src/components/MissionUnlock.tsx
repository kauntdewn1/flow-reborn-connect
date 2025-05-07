import React from 'react';

interface Mission {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  rewardXp: number;
  rewardFragments: number;
}

interface MissionUnlockProps {
  availableMissions: Mission[];
  onMissionComplete?: (missionId: string, xp: number, fragments: number) => void;
}

const MissionUnlock: React.FC<MissionUnlockProps> = ({ availableMissions, onMissionComplete }) => {
  if (availableMissions.length === 0) return null;

  const handleAccept = (missionId: string, xp: number, fragments: number) => {
    if (onMissionComplete) onMissionComplete(missionId, xp, fragments);
  };

  return (
    <div className="bg-black/70 border border-cyan-400/20 rounded-xl p-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <img
          src="https://res.cloudinary.com/decskr6ey/image/upload/v1746599219/MISSOES_kaqeq3.png"
          alt="Missões"
          className="w-6 h-6"
        />
        <h2 className="text-accent-glitch text-lg font-bold tracking-wide">Missões Disponíveis</h2>
      </div>
      <div className="space-y-4">
        {availableMissions.map((mission) => (
          <div key={mission.id} className="bg-[#131313] border border-cyan-400/10 rounded-lg p-3 relative">
            <div className="absolute top-2 right-2">
              <img
                src="https://res.cloudinary.com/decskr6ey/image/upload/v1746599025/ALERTA_wix5jc.png"
                alt="Alerta"
                className="w-4 h-4 opacity-60"
              />
            </div>
            <h3 className="text-white text-sm font-semibold">{mission.title}</h3>
            <p className="text-xs text-gray-400">{mission.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
              <span>
                XP: <span className="text-accent-glitch font-bold">{mission.rewardXp}</span>
              </span>
              <span>
                FRAG: <span className="text-accent-glitch font-bold">{mission.rewardFragments}</span>
              </span>
              <img
                src="https://res.cloudinary.com/decskr6ey/image/upload/v1746599941/reward_zbcxq9.png"
                alt="Recompensa"
                className="w-5 h-5"
              />
            </div>
            <button
              onClick={() => handleAccept(mission.id, mission.rewardXp, mission.rewardFragments)}
              className="mt-3 w-full text-xs font-bold text-white py-2 rounded-lg border border-cyan-400 shadow-md hover:scale-105 transition-transform"
              style={{
                backgroundImage: `url("https://res.cloudinary.com/decskr6ey/image/upload/v1746600135/button_glitch_tvrjsr.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              ACEITAR MISSÃO
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionUnlock;
