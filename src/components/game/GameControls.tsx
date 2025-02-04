import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GameControlsProps {
  isRecording: boolean;
  isPlaying: boolean;
  onToggleRecording: () => void;
  onTogglePlayback: () => void;
  onClear: () => void;
}

export const GameControls = ({
  isRecording,
  isPlaying,
  onToggleRecording,
  onTogglePlayback,
  onClear,
}: GameControlsProps) => {
  return (
    <motion.div
      className="flex gap-2"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
    >
      <Button
        variant="default"
        onClick={onTogglePlayback}
        className="rounded-full w-12 h-12 p-0"
      >
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        <div className={`w-4 h-4 ${isPlaying ? "bg-white" : "text-white"}`}>
          {isPlaying ? "⏸️" : "▶️"}
        </div>
      </Button>
      <Button
        variant={isRecording ? "destructive" : "default"}
        onClick={onToggleRecording}
        className="rounded-full w-12 h-12 p-0"
      >
        <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
        <div
          className={`w-4 h-4 ${
            isRecording ? "rounded-sm bg-white" : "rounded-full bg-red-500"
          }`}
        />
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        className="rounded-full w-12 h-12 p-0"
      >
        <span className="sr-only">Clear All</span>
        <span className="text-xl">🗑️</span>
      </Button>
    </motion.div>
  );
};