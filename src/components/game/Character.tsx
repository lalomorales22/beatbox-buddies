
import { motion } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";

interface CharacterProps {
  type: string;
  position: { x: number; y: number };
  isPlaying: boolean;
  onRemove: () => void;
  onCustomSoundChange: (file: File) => void;
}

export const Character = ({ 
  type, 
  position, 
  isPlaying, 
  onRemove, 
  onCustomSoundChange 
}: CharacterProps) => {
  const [fileInputId] = useState(`file-upload-${Date.now()}`);
  
  const characterStyles = {
    drum: { color: "#FF7F7F", icon: "🥁", animation: "bounce-slow" },
    bass: { color: "#98FF98", icon: "🎸", animation: "pulse-soft" },
    piano: { color: "#FFE66D", icon: "🎹", animation: "bounce-slow" },
    cymbals: { color: "#87CEEB", icon: "🔔", animation: "pulse-soft" },
    guitar: { color: "#DDA0DD", icon: "🎸", animation: "bounce-slow" },
    beatbox: { color: "#FFB6C1", icon: "🎤", animation: "pulse-soft" },
    violin: { color: "#FFA07A", icon: "🎻", animation: "bounce-slow" },
    trumpet: { color: "#FFD700", icon: "🎺", animation: "pulse-soft" },
    saxophone: { color: "#F08080", icon: "🎷", animation: "bounce-slow" },
    flute: { color: "#98FB98", icon: "🎼", animation: "pulse-soft" },
    harp: { color: "#DEB887", icon: "🎸", animation: "bounce-slow" },
    xylophone: { color: "#87CEFA", icon: "🎵", animation: "pulse-soft" },
    triangle: { color: "#F0E68C", icon: "📐", animation: "bounce-slow" },
    maracas: { color: "#FFA500", icon: "🎵", animation: "pulse-soft" },
    tambourine: { color: "#BA55D3", icon: "🔔", animation: "bounce-slow" },
    bongo: { color: "#CD853F", icon: "🥁", animation: "pulse-soft" },
    conga: { color: "#8B4513", icon: "🥁", animation: "bounce-slow" },
    bells: { color: "#ADD8E6", icon: "🔔", animation: "pulse-soft" },
    synth: { color: "#9370DB", icon: "🎹", animation: "bounce-slow" },
    clap: { color: "#F4A460", icon: "👏", animation: "pulse-soft" }
  }[type] || { color: "#FF7F7F", icon: "🎵", animation: "bounce-slow" };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "audio/mpeg" || file.type === "audio/mp3") {
        onCustomSoundChange(file);
      }
    }
  };

  const triggerFileUpload = () => {
    document.getElementById(fileInputId)?.click();
  };

  return (
    <motion.div
      className={`absolute ${isPlaying ? `animate-${characterStyles.animation}` : ""}`}
      style={{ left: position.x, top: position.y }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer relative group"
            style={{ backgroundColor: characterStyles.color }}
            onClick={onRemove}
          >
            <span className="text-3xl">{characterStyles.icon}</span>
            <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={triggerFileUpload}>
            Upload Custom Sound
          </ContextMenuItem>
          <ContextMenuItem onClick={onRemove}>
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <input
        id={fileInputId}
        type="file"
        accept=".mp3,audio/mpeg"
        onChange={handleFileChange}
        className="hidden"
      />
    </motion.div>
  );
};
