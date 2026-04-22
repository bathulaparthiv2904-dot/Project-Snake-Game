import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Music } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const TRACKS = [
  {
    title: "Good Morning World! (Dr. Stone)",
    url: "https://www.youtube.com/watch?v=pmanD_s7G3U",
    artist: "Burnout Syndromes"
  },
  {
    title: "Neon Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    artist: "AI Generator"
  },
  {
    title: "Cybernetic Heartbeat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    artist: "AI Generator"
  },
  {
    title: "Synthetic Soul",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    artist: "AI Generator"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    if (newVolume === 0) {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // If they unmute but volume is 0, bump it up a bit so they can hear something
    if (isMuted && volume === 0) {
      setVolume(0.5);
    }
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
          <h3 className="text-base font-bold text-white/90 truncate drop-shadow-md" title={track.title}>
            {track.title}
          </h3>
          <p className="text-[9px] text-emerald-400 font-mono tracking-widest mt-1.5 uppercase truncate" title={track.artist}>
            {track.artist} • {currentTrackIndex + 1}/{TRACKS.length}
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

      <div className="flex items-center gap-3 w-full px-2 mt-1 opacity-80 group">
        <button 
          onClick={toggleMute} 
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isMuted ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : volume < 0.5 ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={`flex-1 h-1 rounded-full appearance-none cursor-pointer outline-none transition-all ${isMuted ? 'bg-pink-500/20 accent-pink-500 hover:accent-pink-400' : 'bg-white/10 accent-emerald-400 hover:accent-emerald-300'}`} 
        />
      </div>
      
      <ReactPlayer
        url={track.url}
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        onEnded={handleEnded}
        width="0"
        height="0"
        style={{ display: 'none' }}
        config={{
          youtube: {
            playerVars: { autoplay: 1 }
          }
        }}
      />
    </div>
  );
}
