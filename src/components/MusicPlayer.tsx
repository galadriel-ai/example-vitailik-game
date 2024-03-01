"use client";

import React, { useState } from 'react';
import ReactHowler from 'react-howler';


interface MusicPlayerProps {}

const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [playing, setPlaying] = useState<boolean>(true);

  const togglePlay = (): void => {
    setPlaying(!playing);
  };

  return (
    <>
      <ReactHowler
        src={['/wildy_vitailik.mp3']}
        playing={playing}
        loop={true}
      />
      <a className={"px-3 py-2 rounded-md text-lg " + (playing ? "" : "line-through")} onClick={togglePlay}>music</a>
    </>
  );
};

export default MusicPlayer;