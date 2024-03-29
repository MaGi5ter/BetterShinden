import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import LoginError from "../components/errorHandler/loginError";
import SerieInfo from "../components/serieInfo/serieInfo";
import EpisodesList from "../components/EpisodesList/episodesList";
import PlayersList from "../components/playersList/playersList";
import Related from "../components/related/relatedSeries";
import Player from "../components/Player/Player";
import { fetchRAW, loadPlayer } from "../assets/scripts/dataFetchScripts";
import "../assets/serie.css";

function SeriePage() {
  const [activePlayers, setActivePlayers] = useState<string>("");
  const [displayedPlayer, setDisplayedPlayer] = useState<loadedPlayerData>({
    online_id: "",
    iframe: "",
  });
  const [storageBasic, setStorageBasic] = useState<string>("");
  const [loadedPlayers, setLoadedPlayers] = useState<loadedPlayerData[]>(
    JSON.parse(localStorage.getItem("loaded")!) || []
  );
  const [error_, setError] = useState(false); //currently dont used

  console.log(loadedPlayers);

  interface loadedPlayerData {
    online_id: string;
    iframe: string;
  }

  async function getStorageBasic() {
    let rawMainArr = (await fetchRAW(`https://shinden.pl`)).split("\n");
    let storageBasic: string = "";
    rawMainArr.forEach((element) => {
      if (element.includes("_Storage.basic")) {
        element = element.replace(/ /g, "");
        element = element.replace("_Storage.basic='", "");
        element = element.replace("';", "");
        storageBasic = element;
      }
    });
    setStorageBasic(storageBasic);
    return storageBasic;
  }

  async function newHandlePlayer(online_id: string) {
    setDisplayedPlayer({
      online_id: "",
      iframe: "",
    });
    let storageBasic_ =
      storageBasic == "" ? await getStorageBasic() : storageBasic;
    let newLoadedList = await loadPlayer(
      online_id,
      storageBasic_,
      loadedPlayers
    );

    localStorage.setItem("loaded", JSON.stringify(newLoadedList));

    setLoadedPlayers(JSON.parse(localStorage.getItem("loaded")!));

    let toDisplay = newLoadedList.find(
      (element) => element.online_id == online_id
    ) || { online_id: "", iframe: "" };
    setDisplayedPlayer(toDisplay);
  }

  async function loadPlayersList(url: string) {
    console.log(displayedPlayer);
    setActivePlayers(url);
  }

  return (
    <>
      <Navbar></Navbar>
      <LoginError trigger={error_}></LoginError>
      <div id="content">
        <div id="left-content">
          <div id="player_and_ep_list">
            <EpisodesList loadPlayers={loadPlayersList}></EpisodesList>
            <div id="player">
              <Player player={displayedPlayer}></Player>
              <PlayersList
                players_url={activePlayers}
                loadPlayer={newHandlePlayer}
              ></PlayersList>
            </div>
          </div>
          <SerieInfo></SerieInfo>
        </div>
        <Related></Related>
      </div>
    </>
  );
}

export default SeriePage;
