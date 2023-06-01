import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import LoginError from "../components/errorHandler/loginError";
import SerieInfo from "../components/serieInfo/serieInfo";
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
  const [serieData, setSerieData] = useState<serieDataIn>();
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
  interface serieDataIn {
    description: string;
    thumbnail_url: string;
    episode_count: number;
    rating: string;
    url: string;
    serie_name: string;
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

    let serie_data = getSerieData(episodesSiteArr);
    let episodesData = getEpisodesData(episodesSiteArr);

    serie_data.episode_count = episodesData.episodesNumber;
    let corrected_links = checkCorrect(episodesData.episodesData);

    if (corrected_links[0] == undefined) {
      setError(true);
      return;
    }

    setLoadingList(false);
    setEpisodesList(corrected_links);
    setSerieData(serie_data);
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
    let playersSiteRAW = await fetchRAW(`https://shinden.pl${url}`);
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
      <Navbar></Navbar>
      <LoginError trigger={error_}></LoginError>
      <div id="content">
        <div id="left-content">
          <div id="player_and_ep_list">
            <div id="ep_list">
              {episodesList.map((ep, index) => {
                if (ep[0] != "")
                  return (
                    <div
                      className={
                        index == activeEpisode ? "ep_data active_ep" : "ep_data"
                      }
                      onClick={(e) => {
                        setActiveEpisode(index);
                        loadPlayersList(ep[1]);
                      }}
                    >
                      <div className="ep_num">{ep[2]}</div>
                      <div className="ep_titl">{ep[0]}</div>
                    </div>
                  );
              })}
            </div>
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
          <SerieInfo
            serieInfo={
              serieData
                ? serieData
                : {
                    description: "",
                    thumbnail_url: "",
                    episode_count: 0,
                    rating: "",
                    url: "",
                    serie_name: "",
                  }
            }
          ></SerieInfo>
        </div>
        <Related></Related>
      </div>
    </>
  );
}

export default SeriePage;
