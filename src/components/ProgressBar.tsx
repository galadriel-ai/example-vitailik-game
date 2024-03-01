import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  duration: number; // Total duration of progress in seconds
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ duration, message }) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    // Calculate the interval time to update the progress state
    const intervalTime = (duration * 1000) / 100;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 1;
        if (nextProgress > 100) {
          clearInterval(interval);
          return 100;
        }
        return nextProgress;
      });
    }, intervalTime);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <>
      <p>{message}</p>
      <div className="w-full bg-white h-2.5 dark:bg-gray-700">
        <div
          className="bg-brand-neongreen h-2.5"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressBar;