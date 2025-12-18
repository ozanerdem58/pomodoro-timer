import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type TimerMode = 'work' | 'break';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const intervalRef = useRef<number | null>(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);

    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZURE=');
    audio.play().catch(() => {});
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Pomodoro Timer</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <div className={`w-2 h-2 rounded-full ${mode === 'work' ? 'bg-red-400 animate-pulse' : 'bg-green-400 animate-pulse'}`}></div>
              <p className="text-white/90 font-medium capitalize">{mode} Mode</p>
            </div>
          </div>

          <div className="relative mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${mode === 'work' ? 'text-red-400' : 'text-green-400'}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2 font-mono tracking-tight">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                mode === 'work'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-all transform hover:scale-95 shadow-lg backdrop-blur-sm"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Work Time</p>
                <p className="text-white text-xl font-bold">25:00</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Break Time</p>
                <p className="text-white text-xl font-bold">05:00</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-6">
          Stay focused and take regular breaks
        </p>
      </div>
    </div>
  );
}

export default App;
