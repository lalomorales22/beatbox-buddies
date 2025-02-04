import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InstrumentButtonProps {
  name: string;
  icon: string;
  color: string;
  onClick: () => void;
  isActive?: boolean;
}

export const InstrumentButton = ({
  name,
  icon,
  color,
  onClick,
  isActive = false,
}: InstrumentButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-16 h-16 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300",
        isActive ? "ring-4 ring-white" : ""
      )}
      style={{ backgroundColor: color }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="sr-only">{name}</span>
    </motion.button>
  );
};