import React from "react";
import { useState } from "react";
import parse from "html-react-parser";

interface loadedPlayerData {
  online_id: string;
  iframe: string;
}

interface Prop {
  player: loadedPlayerData;
}

function Player({ player }: Prop) {
  const [playerData, setPlayerData] = useState<loadedPlayerData>({
    online_id: "",
    iframe: "",
  });

  if (playerData != player) {
    setPlayerData(player);
  }

  if (playerData.online_id == "") {
    return (
      <img
        id="loading_gif"
        src="https://cdn.discordapp.com/attachments/773904529971871765/1113162814425661440/5_second_countdown_timer_with_beeps_classic_5_4_3_2_1.gif"
        alt="Odtwarzacz ładuje sie"
      />
    );
  } else {
    let ifr = parse(playerData.iframe);
    let src_ = ifr[1].props.src;
    return <iframe id="video_player" src={src_} allowFullScreen />;
  }
}

export default Player;
