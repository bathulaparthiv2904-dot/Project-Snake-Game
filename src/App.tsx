import { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import Window from './components/Window';
import { Gamepad2, Music, Power } from 'lucide-react';

export default function App() {
  const [openApps, setOpenApps] = useState({ snake: true, music: true });
  const [activeApp, setActiveApp] = useState<'snake' | 'music'>('snake');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleApp = (app: 'snake' | 'music') => {
    setOpenApps(prev => ({ ...prev, [app]: !prev[app] }));
    setActiveApp(app);
  };

  const focusApp = (app: 'snake' | 'music') => {
    setActiveApp(app);
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white overflow-hidden flex flex-col font-sans relative selection:bg-emerald-500/30">
      {/* Background Wallpaper */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 rounded-full blur-[120px] pointer-events-none" />
         {/* Desktop Grid Outline */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
      </div>

      {/* Desktop Area */}
      <main className="flex-1 relative z-10 w-full h-full overflow-hidden">
        {openApps.snake && (
          <Window
            title="SYNTH-SNAKE"
            defaultPosition={{ x: 100, y: 50 }}
            zIndex={activeApp === 'snake' ? 20 : 10}
            onFocus={() => focusApp('snake')}
            onClose={() => toggleApp('snake')}
          >
            <SnakeGame />
          </Window>
        )}

        {openApps.music && (
          <Window
            title="MEDIA PLAYER"
            defaultPosition={{ x: 700, y: 150 }}
            zIndex={activeApp === 'music' ? 20 : 10}
            onFocus={() => focusApp('music')}
            onClose={() => toggleApp('music')}
          >
            <MusicPlayer />
          </Window>
        )}
      </main>

      {/* Dock / Taskbar */}
      <footer className="h-14 z-50 flex items-center justify-between px-6 border-t border-white/10 shrink-0 bg-black/30 backdrop-blur-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all cursor-pointer">
            <Power className="w-4 h-4 text-white" />
          </button>
          <div className="h-6 w-[1px] bg-white/20 mx-2" />
          
          {/* App Icons */}
          <button 
            onClick={() => toggleApp('snake')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${openApps.snake ? 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] ring-1 ring-white/20' : 'hover:bg-white/5 opacity-50 hover:opacity-100'}`}
            title="Synth-Snake"
          >
            <Gamepad2 className="w-6 h-6 text-emerald-400" />
          </button>
          <button 
            onClick={() => toggleApp('music')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${openApps.music ? 'bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)] ring-1 ring-white/20' : 'hover:bg-white/5 opacity-50 hover:opacity-100'}`}
            title="Media Player"
          >
            <Music className="w-6 h-6 text-pink-400" />
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm font-mono text-white/50">
           <div className="flex flex-col items-end">
             <span className="text-white/80 font-bold">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
             <span className="text-[10px] uppercase">OS Build 1.0</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
