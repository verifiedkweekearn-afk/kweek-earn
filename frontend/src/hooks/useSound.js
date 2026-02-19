import { useRef, useCallback } from 'react';

// Base64 encoded minimal sounds (tiny - works everywhere)
const SOUNDS = {
  // Short beep sound for countdown
  beep: 'data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAAA8Pzw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PA==',
  
  // Coin/ cash sound for reward
  coin: 'data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAAA8Pzw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PA=='
};

const useSound = () => {
  const audioRef = useRef(null);
  const countdownInterval = useRef(null);

  const playSound = useCallback((type, volume = 0.5) => {
    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element with base64 sound
      audioRef.current = new Audio(SOUNDS[type]);
      audioRef.current.volume = volume;
      
      // Play with error handling
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented - this is normal on first interaction
          console.log('Sound play prevented. User interaction needed.');
        });
      }
    } catch (error) {
      console.log('Sound error:', error);
    }
  }, []);

  const playCountdown = useCallback((duration = 15) => {
    // Clear any existing countdown
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }

    // Play beep every second
    countdownInterval.current = setInterval(() => {
      playSound('beep', 0.3);
    }, 1000);

    // Auto-stop after duration
    setTimeout(() => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    }, duration * 1000);
  }, [playSound]);

  const stopCountdown = useCallback(() => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopCountdown();
  }, [stopCountdown]);

  return { 
    playSound, 
    stopSound, 
    playCountdown, 
    stopCountdown 
  };
};

export default useSound;
