import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstrumentButton } from "./InstrumentButton";
import { Character } from "./Character";
import { GameControls } from "./GameControls";
import { toast } from "sonner";

const instruments = [
  { id: "drum", name: "Drum", icon: "🥁", color: "#FF7F7F" },
  { id: "bass", name: "Bass", icon: "🎸", color: "#98FF98" },
  { id: "piano", name: "Piano", icon: "🎹", color: "#FFE66D" },
  { id: "cymbals", name: "Cymbals", icon: "🔔", color: "#87CEEB" },
  { id: "guitar", name: "Guitar", icon: "🎸", color: "#DDA0DD" },
  { id: "beatbox", name: "Beatbox", icon: "🎤", color: "#FFB6C1" },
];

interface Character {
  id: string;
  type: string;
  position: { x: number; y: number };
}

export const BeatboxGame = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedInstrument) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 40;
    const y = e.clientY - rect.top - 40;

    setCharacters((prev) => [
      ...prev,
      {
        id: `${selectedInstrument}-${Date.now()}`,
        type: selectedInstrument,
        position: { x, y },
      },
    ]);

    toast.success(`Added ${selectedInstrument} beat!`);
  }, [selectedInstrument]);

  const removeCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
    toast.info("Removed beat");
  }, []);

  const handleClear = useCallback(() => {
    setCharacters([]);
    toast.info("Cleared all beats");
  }, []);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
    toast(isRecording ? "Recording stopped" : "Recording started");
  }, [isRecording]);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
    toast(isPlaying ? "Playback paused" : "Playback started");
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-game-background p-4">
      <div
        className="w-full h-[60vh] bg-gradient-to-b from-blue-200 to-green-200 rounded-xl shadow-xl mb-4 relative cursor-pointer"
        onClick={handleCanvasClick}
      >
        <AnimatePresence>
          {characters.map((char) => (
            <Character
              key={char.id}
              type={char.type}
              position={char.position}
              isPlaying={isPlaying}
              onRemove={() => removeCharacter(char.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 flex-wrap">
        <motion.div
          className="flex justify-center gap-4 flex-wrap"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          {instruments.map((instrument) => (
            <InstrumentButton
              key={instrument.id}
              name={instrument.name}
              icon={instrument.icon}
              color={instrument.color}
              isActive={selectedInstrument === instrument.id}
              onClick={() => setSelectedInstrument(instrument.id)}
            />
          ))}
        </motion.div>
        <GameControls
          isRecording={isRecording}
          isPlaying={isPlaying}
          onToggleRecording={toggleRecording}
          onTogglePlayback={togglePlayback}
          onClear={handleClear}
        />
      </div>
    </div>
  );
};