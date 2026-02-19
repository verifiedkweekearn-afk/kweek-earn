import { useTheme } from '../context/ThemeContext';
import useSound from '../hooks/useSound';

const SoundTest = () => {
  const { theme } = useTheme();
  const { playSound } = useSound();

  return (
    <div className={`p-5 rounded-xl border ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <h2 className="text-lg font-bold mb-4">Sound Test</h2>
      <div className="space-y-2">
        <button
          onClick={() => playSound('/sounds/countdown-beep.mp3', 0.5)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Test Countdown Sound
        </button>
        <button
          onClick={() => playSound('/sounds/cashout.mp3', 0.5)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Test Cashout Sound
        </button>
      </div>
    </div>
  );
};

export default SoundTest;
