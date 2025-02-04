import { motion } from "framer-motion";

interface CharacterProps {
  type: string;
  position: { x: number; y: number };
  isPlaying: boolean;
  onRemove: () => void;
}

export const Character = ({ type, position, isPlaying, onRemove }: CharacterProps) => {
  const characterStyles = {
    drum: {
      color: "#FF7F7F",
      icon: "🥁",
      animation: "bounce-slow",
    },
    bass: {
      color: "#98FF98",
      icon: "🎸",
      animation: "pulse-soft",
    },
    piano: {
      color: "#FFE66D",
      icon: "🎹",
      animation: "bounce-slow",
    },
    cymbals: {
      color: "#87CEEB",
      icon: "🔔",
      animation: "pulse-soft",
    },
    guitar: {
      color: "#DDA0DD",
      icon: "🎸",
      animation: "bounce-slow",
    },
    beatbox: {
      color: "#FFB6C1",
      icon: "🎤",
      animation: "pulse-soft",
    },
  }[type] || { color: "#FF7F7F", icon: "🎵", animation: "bounce-slow" };

  return (
    <motion.div
      className={`absolute ${isPlaying ? `animate-${characterStyles.animation}` : ""}`}
      style={{ left: position.x, top: position.y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer relative group"
        style={{ backgroundColor: characterStyles.color }}
        onClick={onRemove}
      >
        <span className="text-3xl">{characterStyles.icon}</span>
        <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
      </div>
    </motion.div>
  );
};