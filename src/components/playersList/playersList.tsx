import React from "react";
import { useState } from "react";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";

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

interface Prop {
  players_url: string;
}

function PlayersList({ players_url }: Prop) {
  const [playersList, setPlayersList] = useState<playerData[]>([]);
  const [activePlayersURL, setActivePlayersURL] = useState<string>();
  const [activePlayer, setActivePlayer] = useState(0);

  console.log("new players url", players_url);

  if (activePlayersURL != players_url) {
    //Prevents insignificant reloading of playerslist
    setActivePlayersURL(players_url);
    getPlayersList(players_url);
  }

  async function getPlayersList(url: string) {
    let playersRaw = await fetchRAW(url);

    const parser = new DOMParser();
    const document = parser.parseFromString(playersRaw, "text/html");

    let players: playerData[] = Array.from(
      document.querySelectorAll("a[data-episode]")
    ).map((element) => {
      return JSON.parse(element.getAttribute("data-episode")!);
    });

    setPlayersList(players);
  }

  return (
    <div id="players_list">
      {playersList.map((player, index) => {
        return (
          <div
            className={
              index == activePlayer
                ? "player_info active_player"
                : "player_info"
            }
            onClick={(e) => {
              setActivePlayer(index);
              //   handleLoadPlayer(player.online_id, storageBasic, loadedPlayers);
            }}
          >
            <div className="player_quality">
              <b> {player.max_res}</b>
            </div>
            <div className="player_platform">{player.player}</div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayersList;
