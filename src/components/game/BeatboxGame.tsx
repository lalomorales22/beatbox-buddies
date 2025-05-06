
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InstrumentButton } from "./InstrumentButton";
import { Character } from "./Character";
import { GameControls } from "./GameControls";
import { toast } from "sonner";
import { playSound, startLoop, stopLoop, loadCustomSound } from "@/utils/audioUtils";

const instruments = [
  { id: "drum", name: "Drum", icon: "🥁", color: "#FF7F7F" },
  { id: "bass", name: "Bass", icon: "🎸", color: "#98FF98" },
  { id: "piano", name: "Piano", icon: "🎹", color: "#FFE66D" },
  { id: "cymbals", name: "Cymbals", icon: "🔔", color: "#87CEEB" },
  { id: "guitar", name: "Guitar", icon: "🎸", color: "#DDA0DD" },
  { id: "beatbox", name: "Beatbox", icon: "🎤", color: "#FFB6C1" },
  { id: "violin", name: "Violin", icon: "🎻", color: "#FFA07A" },
  { id: "trumpet", name: "Trumpet", icon: "🎺", color: "#FFD700" },
  { id: "saxophone", name: "Saxophone", icon: "🎷", color: "#F08080" },
  { id: "flute", name: "Flute", icon: "🎼", color: "#98FB98" },
  { id: "harp", name: "Harp", icon: "🎸", color: "#DEB887" },
  { id: "xylophone", name: "Xylophone", icon: "🎵", color: "#87CEFA" },
  { id: "triangle", name: "Triangle", icon: "📐", color: "#F0E68C" },
  { id: "maracas", name: "Maracas", icon: "🎵", color: "#FFA500" },
  { id: "tambourine", name: "Tambourine", icon: "🔔", color: "#BA55D3" },
  { id: "bongo", name: "Bongo", icon: "🥁", color: "#CD853F" },
  { id: "conga", name: "Conga", icon: "🥁", color: "#8B4513" },
  { id: "bells", name: "Bells", icon: "🔔", color: "#ADD8E6" },
  { id: "synth", name: "Synth", icon: "🎹", color: "#9370DB" },
  { id: "clap", name: "Clap", icon: "👏", color: "#F4A460" }
];

interface Character {
  id: string;
  type: string;
  position: { x: number; y: number };
  loopId?: number;
  customSound?: string;
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

    playSound(selectedInstrument);

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

  const handleCustomSoundChange = useCallback((id: string, file: File) => {
    const audioUrl = URL.createObjectURL(file);
    
    setCharacters(prev => {
      return prev.map(char => {
        if (char.id === id) {
          // If this character is already playing, stop its current loop
          if (char.loopId && isPlaying) {
            stopLoop(char.loopId);
          }
          
          const updatedChar = { 
            ...char, 
            customSound: audioUrl 
          };
          
          // If we're currently playing, start a new loop with the custom sound
          if (isPlaying) {
            const loopId = loadCustomSound(audioUrl);
            return { ...updatedChar, loopId };
          }
          
          return updatedChar;
        }
        return char;
      });
    });
    
    toast.success(`Custom sound uploaded!`);
  }, [isPlaying]);

  const removeCharacter = useCallback((id: string) => {
    setCharacters((prev) => {
      const char = prev.find(c => c.id === id);
      if (char?.loopId) {
        stopLoop(char.loopId);
      }
      return prev.filter((char) => char.id !== id);
    });
    toast.info("Removed beat");
  }, []);

  const handleClear = useCallback(() => {
    characters.forEach(char => {
      if (char.loopId) {
        stopLoop(char.loopId);
      }
    });
    setCharacters([]);
    toast.info("Cleared all beats");
  }, [characters]);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
    toast(isRecording ? "Recording stopped" : "Recording started");
  }, [isRecording]);

  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
    toast(isPlaying ? "Playback paused" : "Playback started");
  }, [isPlaying]);

  // Handle starting/stopping sound loops when playback state changes
  useEffect(() => {
    if (isPlaying) {
      setCharacters(prev => prev.map(char => {
        if (char.customSound) {
          return {
            ...char,
            loopId: loadCustomSound(char.customSound)
          };
        } else {
          return {
            ...char,
            loopId: startLoop(char.type)
          };
        }
      }));
    } else {
      characters.forEach(char => {
        if (char.loopId) {
          stopLoop(char.loopId);
        }
      });
      setCharacters(prev => prev.map(char => ({
        ...char,
        loopId: undefined
      })));
    }
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
              onCustomSoundChange={(file) => handleCustomSoundChange(char.id, file)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 flex-wrap">
        <motion.div
          className="flex justify-center gap-2 flex-wrap max-w-[1200px]"
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
              onClick={() => {
                setSelectedInstrument(instrument.id);
                playSound(instrument.id);
              }}
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
