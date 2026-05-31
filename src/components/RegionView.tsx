import { Region } from '@/types/game';
import { ArrowLeft, Search, Zap, Shield, ChevronRight } from 'lucide-react';

interface RegionViewProps {
  region: Region;
  onBack: () => void;
  onExplore: (regionId: string) => void;
  onSolve: (regionId: string) => void;
}

export function RegionView({ region, onBack, onExplore, onSolve }: RegionViewProps) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Map
      </button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{region.name}</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full ${region.villainDefeated ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {region.villainDefeated ? 'Secured' : 'Under Threat'}
            </span>
            <span className="text-slate-400">
              Story Progress: {region.storyProgress}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Search className="w-5 h-5" />
            <h3 className="text-lg font-bold">Exploration</h3>
          </div>
          <p className="text-slate-300 text-sm mb-6">
            Search the area for resources, hidden artifacts, and clues about the villain&apos;s plans.
          </p>
          <button
            onClick={() => onExplore(region.id)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Explore Area <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
          <div className="flex items-center gap-3 mb-4 text-amber-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-bold">Story Mission</h3>
          </div>
          <p className="text-slate-300 text-sm mb-6">
            Advance the region&apos;s storyline. Confront enemies, solve puzzles, and thwart the villain.
          </p>
          <button
            onClick={() => onSolve(region.id)}
            disabled={region.storyProgress >= 100}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {region.storyProgress >= 100 ? 'Story Complete' : 'Continue Story'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {region.storyProgress > 0 && !region.villainDefeated && (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-5">
           <div className="flex items-center gap-3 mb-3 text-red-400">
             <Shield className="w-5 h-5" />
             <h3 className="font-bold">Villain Activity Detected</h3>
           </div>
           <p className="text-red-200/70 text-sm">
             The villain is executing their plan. Continue the story missions to stop them before they corrupt the region completely.
           </p>
        </div>
      )}
    </div>
  );
}
