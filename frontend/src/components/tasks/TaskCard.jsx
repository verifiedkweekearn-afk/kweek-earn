import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

// Platform intent URLs
const intentUrls = {
  facebook: (handle) => `intent://facebook.com/${handle}#Intent;package=com.facebook.katana;scheme=https;end;`,
  instagram: (handle) => `intent://instagram.com/_u/${handle}#Intent;package=com.instagram.android;scheme=https;end;`,
  tiktok: (handle) => `intent://tiktok.com/@${handle}#Intent;package=com.zhiliaoapp.musically;scheme=https;end;`,
  twitter: (handle) => `intent://twitter.com/${handle}#Intent;package=com.twitter.android;scheme=https;end;`,
  threads: (handle) => `intent://threads.net/@${handle}#Intent;package=com.instagram.barcelona;scheme=https;end;`,
  youtube: (handle) => `intent://youtube.com/@${handle}#Intent;package=com.google.android.youtube;scheme=https;end;`,
  snapchat: (handle) => `intent://snapchat.com/add/${handle}#Intent;package=com.snapchat.android;scheme=https;end;`,
};

const webUrls = {
  facebook: (handle) => `https://facebook.com/${handle}`,
  instagram: (handle) => `https://instagram.com/${handle}`,
  tiktok: (handle) => `https://tiktok.com/@${handle}`,
  twitter: (handle) => `https://twitter.com/${handle}`,
  threads: (handle) => `https://threads.net/@${handle}`,
  youtube: (handle) => `https://youtube.com/@${handle}`,
  snapchat: (handle) => `https://snapchat.com/add/${handle}`,
};

const TaskCard = ({ task, onComplete }) => {
  const { updateUserBalance } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canClaim, setCanClaim] = useState(false);
  const [completed, setCompleted] = useState(false);

  const taskData = task.Task || task;
  const platform = taskData.platform;
  const handle = taskData.handle.replace('@', '');
  const reward = taskData.reward || 300;

  const startTask = () => {
    // Try to open the app, fallback to browser after 500ms
    const intentUrl = intentUrls[platform]?.(handle);
    const webUrl = webUrls[platform]?.(handle);

    if (intentUrl) {
      window.location.href = intentUrl;
      // Fallback: if app not installed, open browser after a short delay
      setTimeout(() => {
        if (!document.hidden) {
          window.open(webUrl, '_blank');
        }
      }, 500);
    } else {
      window.open(webUrl, '_blank');
    }

    setTimerActive(true);
    setCanClaim(false);
    setSecondsLeft(60);

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimReward = async () => {
    if (!canClaim || completed) return;

    setLoading(true);
    try {
      const response = await API.put(`/tasks/complete/${task.id}`);
      // Update the global user context (balance updates everywhere)
      updateUserBalance(response.data.newBalance);
      setCompleted(true);
      if (onComplete) onComplete(task.id);
      toast.success(`+₦${reward}`);
    } catch (error) {
      toast.error('Failed to claim');
    } finally {
      setLoading(false);
    }
  };

  if (completed) return null;

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between mb-3">
        <div>
          <span className="font-bold text-lg">{taskData.handle}</span>
          <span className="ml-2 text-sm text-gray-500">• {platform}</span>
        </div>
        <span className="text-green-600 font-bold text-xl">₦{reward}</span>
      </div>

      {timerActive && (
        <div className="mb-3 text-center">
          <span className="text-2xl font-mono">{secondsLeft}s</span>
        </div>
      )}

      <div className="space-y-2">
        {!timerActive && !canClaim && !completed && (
          <button
            onClick={startTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
          >
            Open {platform}
          </button>
        )}

        <button
          onClick={claimReward}
          disabled={loading || !canClaim || completed}
          className={`w-full py-3 rounded font-bold ${
            canClaim && !completed
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : canClaim ? `CLAIM ₦${reward}` : 'Complete action first'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
