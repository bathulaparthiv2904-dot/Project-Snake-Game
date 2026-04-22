import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    title: "Neon Dreams (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    title: "Cybernetic Heartbeat (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
  },
  {
    title: "Synthetic Soul (AI Gen)",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const track = TRACKS[currentTrackIndex];

  return (
    <div className="flex flex-col items-center gap-5 w-60 mx-auto p-2 font-sans text-white">
      <div className="w-full flex flex-col items-center gap-4 text-center">
        <div className="w-40 h-40 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden glass">
          <Music className="text-white/50 w-12 h-12" />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] rounded-3xl pointer-events-none" />
        </div>
        <div className="w-full">
          <h3 className="text-base font-bold text-white/90 truncate drop-shadow-md">
            {track.title.replace(" (AI Gen)", "")}
          </h3>
          <p className="text-[9px] text-emerald-400 font-mono tracking-widest mt-1.5 uppercase">
            AI TRACK • {currentTrackIndex + 1}/{TRACKS.length}
          </p>
        </div>
      </div>

      <div className="w-full h-1 bg-white/10 rounded-full relative mt-1">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-emerald-400 rounded-full shadow-[0_0_10px_#4ade80]" />
      </div>

      <div className="flex items-center justify-between w-full px-2 mt-2">
        <button onClick={prevTrack} className="text-white/40 hover:text-white transition-colors">
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button 
          onClick={togglePlay} 
          className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        
        <button onClick={nextTrack} className="text-white/40 hover:text-white transition-colors">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
      
      <audio ref={audioRef} src={track.url} onEnded={handleEnded} />
    </div>
  );
}
