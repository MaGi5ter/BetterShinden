import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import LoginError from "../components/errorHandler/loginError";
import SerieInfo from "../components/serieInfo/serieInfo";
import EpisodesList from "../components/EpisodesList/episodesList";
import PlayersList from "../components/playersList/playersList";
import Related from "../components/related/relatedSeries";
import { player } from "../components/Player/Player";
import { fetchRAW, loadPlayer } from "../assets/scripts/dataFetchScripts";
import {
  getSerieData,
  getEpisodesData,
  getPlayersData,
} from "../assets/scripts/dataExtracting";
import "../assets/serie.css";

function SeriePage() {
  const params = useParams();

  const [episodesList, setEpisodesList] = useState(["Loading", "", "0"]);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [activePlayer, setActivePlayer] = useState([0, ""]);
  const [activePlayers, setActivePlayers] = useState<string>("");
  const [loadingList, setLoadingList] = useState(true);
  const [playersList, setPlayersList] = useState<playerData[]>([]);
  const [storageBasic, setStorageBasic] = useState<string>("");
  const [loadedPlayers, setLoadedPlayers] = useState<loadedPlayerData[]>([]);
  const [error_, setError] = useState(false);

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

  function getID(params) {
    if (params == undefined) {
      return -1;
    } else {
      let newparams = String(params);
      let arr = newparams.trim().split(/-+/);
      let id = Number(arr[0]);
      return id;
    }
  }

  function handleActivePlayer(index: number, online_id: string) {
    console.log(index, online_id);
    setActivePlayer([index, online_id]);
  }

  function checkCorrect(episodesArr: any[]) {
    let output: any[] = [];
    episodesArr.forEach((episodeData) => {
      if (episodeData[1] == undefined) return;
      else output.push(episodeData);
    });

    return output.reverse();
  }

  async function handleLoadPlayer(
    online_id: string,
    storage: string,
    loadedPlayers: loadedPlayerData[]
  ) {
    let newLoadedList = await loadPlayer(online_id, storage, loadedPlayers);
    setLoadedPlayers(newLoadedList.slice());
  }

  let currentRoute = useLocation();
  if (loadingList == true) {
    let route = currentRoute.pathname.includes("titles") ? "titles" : "series";
    getEpisodesList(getID(params.id), route);
  }

  async function getEpisodesList(id: number, route: string) {
    let full_url = `https://shinden.pl/${route}/${id}/all-episodes`;
    let episodesSiteRaw = await fetchRAW(full_url);
    let episodesSiteArr = episodesSiteRaw.split("\n");

    let episodesData = getEpisodesData(episodesSiteArr);
    let corrected_links = checkCorrect(episodesData.episodesData);

    if (corrected_links[0] == undefined) {
      setError(true);
      return;
    }
    console.log(corrected_links);
    setLoadingList(false);
    setEpisodesList(corrected_links);
    loadPlayersList(corrected_links[0][1]); //FIRST ONE NEEDS TO BE DISPLAYED AUTOMATICALLY
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
    return storageBasic;
  }

  async function loadPlayersList(url: string) {
    // let playersSiteRAW = await fetchRAW(`https://shinden.pl${url}`);
    setActivePlayers(url);
    let playersSiteRAW = await fetchRAW(url);
    let playersSiteRAWArr = playersSiteRAW.split("\n");
    let playersArr = getPlayersData(playersSiteRAWArr);

    let basic: string = await getStorageBasic();
    setStorageBasic(basic);

    setActivePlayer([0, ""]);
    setPlayersList(playersArr);
    handleLoadPlayer(playersArr[0].online_id, basic, loadedPlayers);
  }

  //NEXT UPDATE SPLIT RETURN IN TO COMPONENTS

  return (
    <>
      <PlayersList players_url={activePlayers}></PlayersList>
      <Navbar></Navbar>
      <LoginError trigger={error_}></LoginError>
      <div id="content">
        <div id="left-content">
          <div id="player_and_ep_list">
            <EpisodesList loadPlayers={loadPlayersList}></EpisodesList>
            <div id="player">
              <div id="_video">
                {player(loadedPlayers, playersList, activePlayer)}
              </div>
              <div id="players_list">
                {playersList.map((player, index) => {
                  return (
                    <div
                      className={
                        index == activePlayer[0]
                          ? "player_info active_player"
                          : "player_info"
                      }
                      onClick={(e) => {
                        handleActivePlayer(index, `${player.online_id}`);
                        handleLoadPlayer(
                          player.online_id,
                          storageBasic,
                          loadedPlayers
                        );
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
