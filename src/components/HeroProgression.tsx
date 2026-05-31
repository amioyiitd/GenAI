import { Hero } from '@/types/game';
import { User, Shield, Star, Zap } from 'lucide-react';

interface HeroProgressionProps {
  heroes: Hero[];
  activeHeroId: string | null;
  onSelectHero: (heroId: string) => void;
}

export function HeroProgression({ heroes, activeHeroId, onSelectHero }: HeroProgressionProps) {
  if (heroes.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <User className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Hero Roster</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroes.map((hero) => (
          <div
            key={hero.id}
            className={`rounded-lg p-5 border-2 transition-colors cursor-pointer
              ${activeHeroId === hero.id
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-slate-700 bg-slate-800 hover:border-purple-500/50'
              }
            `}
            onClick={() => onSelectHero(hero.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-white">{hero.name}</h3>
                <span className="text-sm text-purple-300">{hero.heroClass}</span>
              </div>
              <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">Lvl {hero.level}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>XP Progress</span>
                <span>{hero.xp % 100} / 100</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${hero.xp % 100}%` }}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Abilities
              </h4>
              <ul className="space-y-2">
                {hero.abilities.map((ability, idx) => (
                  <li key={idx} className="text-sm text-slate-200 bg-slate-900 px-3 py-2 rounded flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" /> {ability}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
