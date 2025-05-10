import { Mission } from '../types';

interface MissionCardProps {
  mission: Mission;
  onComplete: (missionId: string, xp: number, fragments: number) => void;
}

export default function MissionCard({ mission, onComplete }: MissionCardProps) {
  return (
    <div className="bg-black/60 border border-accent-glitch p-4 rounded shadow-md hover:scale-105 transition-all">
      <h3 className="text-lg font-bold text-accent-glitch">{mission.title}</h3>
      <p className="text-xs text-white/80">{mission.description}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="text-xp-bar">XP: {mission.rewardXp}</span>
        <span className="text-accent-glitch">|</span>
        <span className="text-accent-glitch">FRAG: {mission.rewardFragments}</span>
      </div>
      <button
        onClick={() => onComplete(mission.id, mission.rewardXp, mission.rewardFragments)}
        className="mt-4 w-full bg-accent-glitch/20 hover:bg-accent-glitch/30 text-accent-glitch text-sm font-bold py-2 px-4 rounded border border-accent-glitch/50 transition-all"
      >
        COMPLETAR MISSÃO
      </button>
    </div>
  );
} 