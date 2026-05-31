import { Region } from '@/types/game';
import { Map, Lock, MapPin } from 'lucide-react';

interface MapDashboardProps {
  regions: Region[];
  onSelectRegion: (regionId: string) => void;
}

export function MapDashboard({ regions, onSelectRegion }: MapDashboardProps) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <Map className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">World Map</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => (
          <button
            key={region.id}
            disabled={!region.isUnlocked}
            onClick={() => onSelectRegion(region.id)}
            className={`relative p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center h-32
              ${
                region.isUnlocked
                  ? 'border-blue-500/50 bg-blue-900/20 hover:border-blue-400 hover:bg-blue-800/30 cursor-pointer'
                  : 'border-slate-800 bg-slate-900/50 cursor-not-allowed opacity-60'
              }
            `}
          >
            {!region.isUnlocked ? (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center z-10">
                <Lock className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400 font-medium tracking-wider">FOG OF WAR</span>
              </div>
            ) : null}

            <MapPin className={`w-8 h-8 mb-2 ${region.isUnlocked ? 'text-blue-400' : 'text-slate-600'}`} />
            <h3 className={`font-bold ${region.isUnlocked ? 'text-blue-100' : 'text-slate-500'}`}>
              {region.name}
            </h3>

            {region.isUnlocked && region.storyProgress < 100 && (
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${region.storyProgress}%` }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
