"use client";

import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { HeroClass } from "@/types/game";
import { MapDashboard } from "@/components/MapDashboard";
import { RegionView } from "@/components/RegionView";
import { BaseBuilding } from "@/components/BaseBuilding";
import { HeroProgression } from "@/components/HeroProgression";
import { Gamepad2, Settings, User } from "lucide-react";

export default function Home() {
  const { state, dispatch } = useGameState();

  // Local UI State
  const [heroName, setHeroName] = useState("");
  const [heroClass, setHeroClass] = useState<HeroClass>("Tech Builder");
  const [activeTab, setActiveTab] = useState<"map" | "base" | "heroes">("map");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const handleCreateHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) return;

    dispatch({
      type: "CREATE_HERO",
      payload: {
        id: Date.now().toString(),
        name: heroName,
        heroClass,
        level: 1,
        xp: 0,
        abilities: ["Basic Attack"],
      },
    });
  };

  const selectedRegion = selectedRegionId
    ? state.regions.find(r => r.id === selectedRegionId)
    : null;

  const handleExplore = () => {
    // Randomly find resources or get minor xp
    const findResources = Math.random() > 0.5;
    if (findResources) {
      dispatch({
        type: "ADD_RESOURCES",
        payload: {
          metal: Math.floor(Math.random() * 20) + 10,
          energy: Math.floor(Math.random() * 15) + 5,
          crystals: Math.floor(Math.random() * 5)
        }
      });
    }

    if (state.activeHeroId) {
      dispatch({ type: "GAIN_XP", payload: { heroId: state.activeHeroId, xp: 15 } });
    }
  };

  const handleSolve = (regionId: string) => {
    dispatch({ type: "PROGRESS_STORY", payload: { regionId, progress: 20 } });

    // Unlock new regions based on progress
    if (regionId === "base" && state.regions.find(r => r.id === "base")?.storyProgress === 100) {
      dispatch({ type: "UNLOCK_REGION", payload: "crystal_forest" });
    }

    if (state.activeHeroId) {
      dispatch({ type: "GAIN_XP", payload: { heroId: state.activeHeroId, xp: 50 } });
    }
  };

  // ACT 1: Hero Creation
  if (state.heroes.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Gamepad2 className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-center text-white mb-2">HEROVERSE</h1>
          <p className="text-slate-400 text-center mb-8">Create your hero to begin</p>

          <form onSubmit={handleCreateHero} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hero Name</label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Atharv"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Class</label>
              <select
                value={heroClass}
                onChange={(e) => setHeroClass(e.target.value as HeroClass)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Tech Builder">Tech Builder</option>
                <option value="Guardian">Guardian</option>
                <option value="Explorer">Explorer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg px-4 py-4 transition-colors shadow-lg shadow-blue-500/20"
            >
              Enter the HeroVerse
            </button>
          </form>
        </div>
      </main>
    );
  }

  // MAIN GAME UI (Acts 2-5)
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-black text-white hidden sm:block">HEROVERSE</span>
          </div>

          <div className="flex gap-4 sm:gap-6 text-sm sm:text-base font-medium">
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-xs uppercase">Metal</span>
              <span className="text-slate-300">{state.resources.metal}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-xs uppercase">Energy</span>
              <span className="text-blue-300">{state.resources.energy}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-xs uppercase">Crystals</span>
              <span className="text-purple-300">{state.resources.crystals}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            <button
              onClick={() => { setActiveTab("map"); setSelectedRegionId(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left whitespace-nowrap
                ${activeTab === "map" && !selectedRegionId ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Gamepad2 className="w-5 h-5" /> World Map
            </button>
            <button
              onClick={() => { setActiveTab("base"); setSelectedRegionId(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left whitespace-nowrap
                ${activeTab === "base" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Settings className="w-5 h-5" /> Base Building
            </button>
            <button
              onClick={() => { setActiveTab("heroes"); setSelectedRegionId(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left whitespace-nowrap
                ${activeTab === "heroes" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <User className="w-5 h-5" /> Heroes
            </button>
          </div>

          {/* View Container */}
          <div className="flex-1 min-w-0">
            {selectedRegionId && selectedRegion ? (
              <RegionView
                region={selectedRegion}
                onBack={() => setSelectedRegionId(null)}
                onExplore={handleExplore}
                onSolve={handleSolve}
              />
            ) : activeTab === "map" ? (
              <MapDashboard
                regions={state.regions}
                onSelectRegion={setSelectedRegionId}
              />
            ) : activeTab === "base" ? (
              <BaseBuilding
                buildings={state.buildings}
                resources={state.resources}
                onBuild={(id, name, cost) => {
                  dispatch({ type: "SPEND_RESOURCES", payload: cost });
                  dispatch({ type: "BUILD", payload: { id, name, level: 1, cost } });
                }}
                onUpgrade={(id) => {
                  const b = state.buildings.find(x => x.id === id);
                  if (b) {
                    const cost = {
                      metal: Math.floor(b.cost.metal * Math.pow(1.5, b.level)),
                      energy: Math.floor(b.cost.energy * Math.pow(1.5, b.level)),
                      crystals: Math.floor(b.cost.crystals * Math.pow(1.5, b.level))
                    };
                    dispatch({ type: "SPEND_RESOURCES", payload: cost });
                    dispatch({ type: "UPGRADE_BUILDING", payload: id });
                  }
                }}
              />
            ) : (
              <HeroProgression
                heroes={state.heroes}
                activeHeroId={state.activeHeroId}
                onSelectHero={(id) => dispatch({ type: "SET_ACTIVE_HERO", payload: id })}
              />
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
