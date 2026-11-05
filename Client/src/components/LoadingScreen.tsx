import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const onLoadingCompleteRef = useRef(onLoadingComplete);

  // Keep ref updated
  useEffect(() => {
    onLoadingCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  useEffect(() => {
    // Start progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 2 + 1; // Increment by 1-3%

      if (currentProgress > 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (onLoadingCompleteRef.current) {
            onLoadingCompleteRef.current();
          }
        }, 500);
      }

      setProgress(currentProgress);
    }, 20); // Fast updates (20ms) for smoothness

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-sm px-4">
          {/* Logo */}
          <div className="mb-8 p-6 glass-card rounded-2xl border border-white/10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Eagle<span className="text-gradient">Byte</span>
            </h1>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-neon"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading Stats */}
          <div className="flex justify-between w-full text-xs font-mono text-muted-foreground">
            <span>LOADING...</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
