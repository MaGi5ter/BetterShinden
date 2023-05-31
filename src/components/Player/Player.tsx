import React from "react";
import parse from "html-react-parser";

interface playerData {
  online_id: string;
  player: string;
  username: string;
  user_id: string;
  lang_audio: string;
  lang_subs: string;
  max_res: string;
  subs_author: string;
  added: string;
  source: string;
}

interface loadedPlayerData {
  online_id: string;
  iframe: string;
}

export function player( //tried making it as JSX but got IntrinsicAttributes and cant resolve issue, so made in that way
  loadedPlayers: loadedPlayerData[],
  playersList: playerData[],
  activePlayer: (string | number)[]
) {
  let id = loadedPlayers.findIndex(
    (el) => el.online_id == playersList[activePlayer[0]].online_id
  );

  console.log("displayPlayer", id, loadedPlayers);
  if (id === -1) {
    return (
      <img
        id="loading_gif"
        src="https://cdn.discordapp.com/attachments/773904529971871765/1113162814425661440/5_second_countdown_timer_with_beeps_classic_5_4_3_2_1.gif"
        alt="Odtwarzacz ładuje sie"
      />
    );
  } else {
    let ifr = parse(loadedPlayers[id].iframe);
    console.log(ifr);
    let src_ = ifr[1].props.src;
    console.log(src_);
    return <iframe id="video_player" src={src_} allowFullScreen />;
  }
}

// export default Player;
