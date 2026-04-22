import { motion, useDragControls } from 'motion/react';
import { X, Minus, Square } from 'lucide-react';
import { ReactNode } from 'react';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  defaultPosition?: { x: number, y: number };
  zIndex?: number;
  onFocus?: () => void;
}

export default function Window({ 
  title, 
  children, 
  onClose, 
  defaultPosition = { x: 50, y: 50 }, 
  zIndex = 10, 
  onFocus 
}: WindowProps) {
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onMouseDownCapture={onFocus}
      style={{ top: defaultPosition.y, left: defaultPosition.x, zIndex }}
      className="absolute glass flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-3xl bg-zinc-950/80"
    >
      {/* Title Bar - Drag Handle */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80 transition-colors"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold">
          {title}
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-white transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="hover:text-white transition-colors">
            <Square className="w-3 h-3" />
          </button>
          <button onClick={onClose} className="hover:text-pink-400 transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-2 flex-1">
        {children}
      </div>
    </motion.div>
  );
}
