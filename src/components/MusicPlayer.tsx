"use client";

import React, { useState } from 'react';
import ReactHowler from 'react-howler';


interface MusicPlayerProps {}

const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [playing, setPlaying] = useState<boolean>(false);

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
      <a className={"px-3 py-2 rounded-md font-medium hover:bg-gray-700 " + (playing ? "" : "line-through")} onClick={togglePlay}>music</a>
    </>
  );
};

export default MusicPlayer;