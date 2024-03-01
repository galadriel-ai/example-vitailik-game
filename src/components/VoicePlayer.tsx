"use client";

import React, { useState } from 'react';
import ReactHowler from 'react-howler';


interface VoicePlayerProps {}

const VoicePlayer: React.FC<VoicePlayerProps> = () => {
  const [playing, setPlaying] = useState<boolean>(false);

  const togglePlay = (): void => {
    setPlaying(!playing);
  };

  return (
    <>
      <ReactHowler
        src={['/viilik.mp3']}
        playing={playing}
        loop={true}
      />
      <a className="px-3 py-2 rounded-md font-medium text-brand-neongreen" onClick={togglePlay}>{playing ? "■ Pause" : "▶ Play"} message from VitAIlik</a>
    </>
  );
};

export default VoicePlayer;