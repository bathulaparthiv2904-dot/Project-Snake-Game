import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

// Retro beep effect using Web Audio API
let audioCtx: AudioContext | null = null;

const playBeep = () => {
  try {
    if (!audioCtx) {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return;
      audioCtx = new AudioContextCtor();
    }
    
    // Ensure context is running (browsers suspend it if not triggered by native user interaction)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Synth-like sweeping square wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    // Volume envelope (louder and punchier)
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio beep failed:", e);
  }
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const nextDirectionRef = useRef(direction);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirectionRef.current;
      setDirection(currentDir);

      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        playBeep();
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, hasStarted, food]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Proactively initialize/resume audio context on user gesture to bypass browser autoplay restrictions
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      } else if (!audioCtx) {
        const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextCtor) {
          audioCtx = new AudioContextCtor();
        }
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        
        if (!hasStarted) {
          setHasStarted(true);
        }
      }

      const { x: curX, y: curY } = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (curY !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (curY !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (curX !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (curX !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ': // spacebar for pause
          e.preventDefault();
          if (hasStarted && !gameOver) {
            setIsPaused(prev => !prev);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    setFood({ x: 15, y: 5 });
  };

  return (
    <div className="flex gap-6 items-center z-10 font-sans p-2">
      
      {/* Left Area (Score & Controls Tip) */}
      <div className="flex flex-col gap-5 w-44 shrink-0 self-stretch justify-between py-2">
        <div className="bg-black/30 border border-white/5 px-4 py-5 rounded-2xl flex flex-col items-center gap-2 w-full justify-center shadow-inner">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Score</p>
          <p className="text-3xl font-mono text-emerald-400 font-bold tracking-tight">{score.toString().padStart(4, '0')}</p>
        </div>

        <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-2xl w-full">
          <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Power node
          </p>
          <p className="text-[10px] leading-relaxed text-pink-100/70">Eat pink nodes to increase tempo and speed!</p>
        </div>

        <div className="text-white/30 font-sans text-[10px] text-center w-full px-1">
          Use <span className="font-mono text-white/60 bg-white/5 py-0.5 px-1 rounded">WASD</span> to move.<br/>Space to pause.
        </div>
      </div>

      {/* Game Board */}
      <div className="glass p-3 rounded-[2rem] relative shrink-0">
        <div 
          className="relative bg-black/40 rounded-xl overflow-hidden"
          style={{
            width: `${GRID_SIZE * 20}px`,
            height: `${GRID_SIZE * 20}px`
          }}
        >
          {/* Grid lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute rounded-sm ${
                  isHead 
                    ? 'bg-emerald-500 snake-node border-2 border-emerald-300 z-10' 
                    : 'bg-emerald-400 snake-node'
                }`}
                style={{
                  width: '18px',
                  height: '18px',
                  left: `${segment.x * 20 + 1}px`,
                  top: `${segment.y * 20 + 1}px`,
                  transition: 'all 0.05s linear'
                }}
              />
            );
          })}

          {/* Food */}
          <div
            className="absolute bg-pink-500 rounded-full food-node animate-pulse"
            style={{
              width: '16px',
              height: '16px',
              left: `${food.x * 20 + 2}px`,
              top: `${food.y * 20 + 2}px`,
            }}
          />

          {/* Overlays */}
          {!hasStarted && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/70 backdrop-blur-sm z-20 text-center px-4">
              <span className="text-emerald-400 font-mono text-base font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] mb-2">
                PRESS ANY KEY
              </span>
            </div>
          )}

          {isPaused && hasStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm z-20">
              <span className="text-white font-mono text-2xl tracking-widest font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                PAUSED
              </span>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-[2px] z-20 space-y-4">
              <h2 className="text-pink-500 font-mono text-2xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                GAME OVER
              </h2>
              <p className="text-white/80 font-mono text-base mb-2">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="mt-2 px-5 py-2 bg-white text-black text-sm font-bold font-mono hover:scale-105 transition-all rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
