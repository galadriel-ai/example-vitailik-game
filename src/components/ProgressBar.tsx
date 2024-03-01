import React, { useEffect, useState } from 'react';

const FUN_WAITING_MESSAGES = [
  "on chain ai is slow lol",
  "join us to make this faster",
  "waiting for the ai to think",
  "cleaning up blockspace",
  "waiting for the ai to wake up",
  "burning gpus",
  "ever tried putting an LLM on-chain?"
];

interface ProgressBarProps {
  duration: number; // Total duration of progress in seconds
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ duration, message }) => {
  const [progress, setProgress] = useState(1);
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    setRandomMessage(
      FUN_WAITING_MESSAGES[Math.floor(Math.random() * FUN_WAITING_MESSAGES.length)]
    );

    const intervalTime = (duration * 1000) / 100;
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 1;
        if (nextProgress > 100) {
          //clearInterval(interval);
          //return 100;
          setRandomMessage(
            FUN_WAITING_MESSAGES[Math.floor(Math.random() * FUN_WAITING_MESSAGES.length)]
          );
          return 0;
        }
        return nextProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <>
      <p className='mb-2'>
        <span className="">{message}&nbsp;</span>
        <span className="text-brand-neongreen">{randomMessage}</span>
      </p>
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