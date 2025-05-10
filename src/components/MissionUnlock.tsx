// MissionUnlock.tsx
import React from 'react';

interface Mission {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardFragments: number;
  isCompleted: boolean;
}

interface Props {
  availableMissions: Mission[];
  onMissionComplete: (id: string, xp: number, frags: number) => void;
}

const MissionUnlock: React.FC<Props> = ({ availableMissions, onMissionComplete }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {availableMissions.map((mission) => (
        <div
          key={mission.id}
          className="bg-black/80 border border-accent-glitch p-4 rounded-lg text-sm shadow-lg hover:shadow-accent-glitch/30 transition-shadow duration-200"
        >
          <h3 className="text-lg text-accent-glitch font-bold mb-1">{mission.title}</h3>
          <p className="mb-2 text-primary-text/80">{mission.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-green-300">XP: {mission.rewardXp}</span>
            <span className="text-xs text-yellow-300">FRAG: {mission.rewardFragments}</span>
          </div>
          <button
            onClick={() => onMissionComplete(mission.id, mission.rewardXp, mission.rewardFragments)}
            className="mt-3 w-full bg-accent-glitch text-black py-1 rounded hover:brightness-125"
          >
            EXECUTAR
          </button>
        </div>
      ))}
    </div>
  );
};

export default MissionUnlock;