import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  GripHorizontal,
} from "lucide-react";

interface SystemStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  correctOrder: number;
}

const SYSTEMS: Record<string, { name: string; steps: SystemStep[] }> = {
  level1: {
    name: "Water Pump System",
    steps: [
      {
        id: "1",
        name: "Power",
        description: "Turn on electricity",
        icon: "🔌",
        correctOrder: 1,
      },
      {
        id: "2",
        name: "Control",
        description: "Activate the controller",
        icon: "🎛️",
        correctOrder: 2,
      },
      {
        id: "3",
        name: "Action",
        description: "Pump water out",
        icon: "💧",
        correctOrder: 3,
      },
    ],
  },
  level2: {
    name: "Traffic Light System",
    steps: [
      {
        id: "1",
        name: "Detect",
        description: "Sense traffic and pedestrians",
        icon: "🚗",
        correctOrder: 1,
      },
      {
        id: "2",
        name: "Process",
        description: "Computer calculates timing",
        icon: "⚙️",
        correctOrder: 2,
      },
      {
        id: "3",
        name: "Control",
        description: "Change light signals",
        icon: "🚦",
        correctOrder: 3,
      },
      {
        id: "4",
        name: "Result",
        description: "Traffic flows safely",
        icon: "✅",
        correctOrder: 4,
      },
    ],
  },
  level3: {
    name: "Smart Farm System",
    steps: [
      {
        id: "1",
        name: "Sense",
        description: "Sensors check soil moisture",
        icon: "📊",
        correctOrder: 1,
      },
      {
        id: "2",
        name: "Measure",
        description: "Compare to ideal levels",
        icon: "📏",
        correctOrder: 2,
      },
      {
        id: "3",
        name: "Decide",
        description: "Computer makes decision",
        icon: "🤖",
        correctOrder: 3,
      },
      {
        id: "4",
        name: "Act",
        description: "Activate irrigation system",
        icon: "💨",
        correctOrder: 4,
      },
      {
        id: "5",
        name: "Monitor",
        description: "Watch if plants thrive",
        icon: "🌱",
        correctOrder: 5,
      },
    ],
  },
};

export default function TechnologySystemBuilder() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const currentSystem =
    SYSTEMS[`level${currentLevel}` as keyof typeof SYSTEMS];
  const allSteps = currentSystem.steps;

  useEffect(() => {
    if (!showIntro) {
      // Shuffle steps for user to reorder
      const shuffled = [...allSteps].sort(() => Math.random() - 0.5);
      setUserOrder(shuffled.map((s) => s.id));
    }
  }, [showIntro, currentLevel]);

  const handleGameStart = () => {
    setShowIntro(false);
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setGameWon(false);
    }
  };

  const handleComplete = () => {
    navigate("/student/technology");
  };

  const checkWin = () => {
    const isCorrect = userOrder.every(
      (id, index) =>
        allSteps.find((s) => s.id === id)?.correctOrder === index + 1
    );
    return isCorrect;
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    const newOrder = [...userOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setUserOrder(newOrder);

    // Check win
    if (checkWin()) {
      setGameWon(true);
    }
  };

  const getStepById = (id: string) => allSteps.find((s) => s.id === id)!;

  // Game intro modal
  if (showIntro) {
    return (
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🧩 System Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">📘 What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                Technology systems only work when steps are in the correct order.
                Learn how systems like pumps, traffic lights, and farms follow a
                specific sequence to function properly!
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🎮 How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Drag system steps to reorder them</li>
                <li>• Put them in the correct sequence</li>
                <li>• Wrong order = system fails visually</li>
                <li>• Correct order = system works perfectly!</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🏆 What Success Looks Like</h3>
              <p className="text-sm text-muted-foreground">
                All steps light up green in sequence. The system animates and shows it
                working correctly!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/student/technology")}
                className="flex-1"
              >
                ❌ Go Back
              </Button>
              <Button onClick={handleGameStart} className="flex-1 bg-primary">
                ▶ Start Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Game completion modal
  if (gameWon) {
    return (
      <Dialog open={gameWon} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Perfect System!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">⚙️</p>
              <p className="text-lg font-semibold text-primary">System is working!</p>
              <p className="text-sm text-muted-foreground mt-2">
                You arranged the steps perfectly. {currentSystem.name} is now
                functioning at full capacity!
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Concept Summary</h3>
              <p className="text-sm text-muted-foreground">
                Every system has a logical sequence. Input → Process → Control → Output.
                This order is critical for systems to work correctly!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleComplete} className="flex-1 bg-secondary">
                🏠 Back to Games
              </Button>
              {currentLevel < 3 && (
                <Button onClick={handleNextLevel} className="flex-1 bg-primary">
                  ➡️ Next Level
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main game view
  const gameContent = (
    <div className="w-full h-full bg-gradient-to-br from-teal-900 via-green-900 to-emerald-800 flex flex-col p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">🧩 {currentSystem.name}</h2>
          <p className="text-sm text-teal-200">Level {currentLevel}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
          >
            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
            >
              <Maximize2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Steps to arrange */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {userOrder.map((stepId, index) => {
          const step = getStepById(stepId);
          return (
            <div
              key={stepId}
              draggable
              onDragStart={() => setDraggedItem(stepId)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedItem && draggedItem !== stepId) {
                  const fromIndex = userOrder.indexOf(draggedItem);
                  handleMoveStep(fromIndex, index);
                }
              }}
              className="bg-white/10 border-2 border-white/30 rounded-lg p-4 cursor-move hover:bg-white/20 transition transform hover:scale-105"
            >
              <div className="flex items-start gap-3">
                <GripHorizontal className="text-white/50 mt-1" size={20} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{step.icon}</span>
                    <div>
                      <div className="font-semibold text-white">
                        Step {index + 1}: {step.name}
                      </div>
                      <div className="text-xs text-white/70">{step.description}</div>
                    </div>
                  </div>
                </div>
                <div
                  className={`text-2xl font-bold px-3 py-1 rounded-full ${
                    step.correctOrder === index + 1
                      ? "bg-green-500 text-white"
                      : "bg-white/20 text-white/50"
                  }`}
                >
                  {step.correctOrder === index + 1 ? "✓" : "?"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="bg-black/50 text-white rounded-lg p-3 text-sm mt-4">
        <p>
          ✋ <strong>Drag</strong> steps to reorder them. All green checkmarks = WIN!
        </p>
      </div>
    </div>
  );

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-900 via-green-900 to-emerald-800">
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-white"
          >
            {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-white"
          >
            <Minimize2 size={24} />
          </button>
          <button
            onClick={() => navigate("/student/technology")}
            className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center p-4">
          {gameContent}
        </div>
      </div>
    );
  }

  // Embedded game view
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-br from-teal-900 via-green-900 to-emerald-800 h-96">
          {gameContent}
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <h3 className="font-semibold text-lg mb-2">About This Game</h3>
            <p className="text-sm text-muted-foreground">
              Every technology system has steps that must happen in order. Power must come
              before control. Control must come before action. Get the sequence right and
              watch the system come to life!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">💡 Key Concept</h3>
            <p className="text-xs text-muted-foreground">
              Systems thinking is about understanding dependencies. Each step enables the
              next one. Wrong order = broken system!
            </p>
          </div>

          <Button
            onClick={() => setIsFullscreen(true)}
            className="w-full bg-primary"
          >
            ⛶ Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
}
