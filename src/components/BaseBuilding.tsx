import { Building, Resources } from '@/types/game';
import { Hammer, Plus, ArrowUpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AVAILABLE_BUILDINGS = [
  { id: 'hq', name: 'Hero Headquarters', baseCost: { metal: 100, energy: 50, crystals: 10 } },
  { id: 'lab', name: 'Research Lab', baseCost: { metal: 80, energy: 120, crystals: 25 } },
  { id: 'training', name: 'Training Center', baseCost: { metal: 150, energy: 80, crystals: 5 } },
  { id: 'defense', name: 'Defense Tower', baseCost: { metal: 200, energy: 100, crystals: 15 } },
];

interface BaseBuildingProps {
  buildings: Building[];
  resources: Resources;
  onBuild: (buildingId: string, name: string, cost: Resources) => void;
  onUpgrade: (buildingId: string) => void;
}

export function BaseBuilding({ buildings, resources, onBuild, onUpgrade }: BaseBuildingProps) {
  const canAfford = (cost: Resources) => {
    return (
      resources.metal >= cost.metal &&
      resources.energy >= cost.energy &&
      resources.crystals >= cost.crystals
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <Hammer className="w-6 h-6 text-orange-400" />
        <h2 className="text-2xl font-bold text-white">Base Construction</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AVAILABLE_BUILDINGS.map((template, index) => {
          const existingBuilding = buildings.find(b => b.id === template.id);
          const currentCost = existingBuilding
            ? {
                metal: Math.floor(template.baseCost.metal * Math.pow(1.5, existingBuilding.level)),
                energy: Math.floor(template.baseCost.energy * Math.pow(1.5, existingBuilding.level)),
                crystals: Math.floor(template.baseCost.crystals * Math.pow(1.5, existingBuilding.level))
              }
            : template.baseCost;

          const affordable = canAfford(currentCost);

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-slate-800 rounded-lg p-5 border border-slate-700 flex flex-col shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{template.name}</h3>
                  {existingBuilding && (
                    <span className="text-sm text-orange-400 font-medium">Level {existingBuilding.level}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mb-6 text-sm">
                <div className="text-slate-400">Cost:</div>
                <div className={`flex items-center gap-1 ${resources.metal >= currentCost.metal ? 'text-slate-300' : 'text-red-400'}`}>
                   M: {currentCost.metal}
                </div>
                <div className={`flex items-center gap-1 ${resources.energy >= currentCost.energy ? 'text-slate-300' : 'text-red-400'}`}>
                   E: {currentCost.energy}
                </div>
                <div className={`flex items-center gap-1 ${resources.crystals >= currentCost.crystals ? 'text-slate-300' : 'text-red-400'}`}>
                   C: {currentCost.crystals}
                </div>
              </div>

              <div className="mt-auto">
                {existingBuilding ? (
                  <motion.button
                    whileHover={affordable ? { scale: 1.02 } : {}}
                    whileTap={affordable ? { scale: 0.98 } : {}}
                    onClick={() => onUpgrade(template.id)}
                    disabled={!affordable}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowUpCircle className="w-4 h-4" /> Upgrade
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={affordable ? { scale: 1.02 } : {}}
                    whileTap={affordable ? { scale: 0.98 } : {}}
                    onClick={() => onBuild(template.id, template.name, currentCost)}
                    disabled={!affordable}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Construct
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
