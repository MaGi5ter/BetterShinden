import { useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import LoginError from "../components/errorHandler/loginError";
import { player } from "../components/Player/Player";
import { fetchRAW, loadPlayer } from "../assets/scripts/dataFetchScripts";
import { getSerieData } from "../assets/scripts/dataExtracting";
import "../assets/serie.css";

function Title() {
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

  async function handleLoadPlayer(
    online_id: string,
    storage: string,
    loadedPlayers: loadedPlayerData[]
  ) {
    let newLoadedList = await loadPlayer(online_id, storage, loadedPlayers);
    setLoadedPlayers(newLoadedList.slice());
  }

  if (loadingList == true) getEpisodesList(getID(params.id));

  async function getEpisodesList(id: number) {
    let full_url = `https://shinden.pl/titles/${id}/all-episodes`;
    let episodesSiteRaw = await fetchRAW(full_url);
    let episodesSiteArr = episodesSiteRaw.split("\n");

    let serie_data = getSerieData(episodesSiteArr);

    console.log(serie_data);

    let episodes_links: any[] = [];
    let skipped = false;
    let episode_number = 1;
    await episodesSiteArr.forEach((element) => {
      //if(element.includes('href')) console.log(element)
      if (element.includes('class="button active">')) {
        // console.log(element);

        let elementArr = element.split('"');
        episodes_links[episodes_links.length - 1].push(elementArr[1]);
        episode_number = episode_number + 1;
      } else if (element.includes("ep-title")) {
        if (skipped) {
          element = element.replace('<td class="ep-title">', "");
          element = element.replace("</td>", "");

          episodes_links.push([element]);
        } else skipped = true;
      }
    });

    serie_data.episode_count = episode_number - 1;

    let i = 0; //WHILE RETURNS A LIST OF EPISOED AND LINKS WITH NUMBER OF EPISODES
    while (episode_number - i > 1) {
      // console.log(episode_number - (i+1),episodes_links[i])
      episodes_links[i].push(episode_number - (i + 1));
      i += 1;
    }

    let corrected_links = checkCorrect(episodes_links);

    console.log(corrected_links);

    if (corrected_links[0] == undefined) {
      setError(true);
      return;
    }

    setLoadingList(false);
    setEpisodesList(corrected_links);
    setSerieData(serie_data);
    console.log(episodes_links);
    loadPlayersList(corrected_links[0][1]); //FIRST ONE NEEDS TO BE DISPLAYED AUTOMATICCLY

    console.log([episodes_links, serie_data]);
  }

  function checkCorrect(episodesArr: any[]) {
    let output: any[] = [];

    episodesArr.forEach((episodeData) => {
      if (episodeData[1] == undefined) return;
      else output.push(episodeData);
    });

    return output.reverse();
  }

  async function loadPlayersList(url: string) {
    console.log("Player List", url);

    if (url == undefined) {
      setError(true);
      return;
    }

    let playersSiteRAW = await fetchRAW(`https://shinden.pl${url}`);
    let playersArr: playerData[] = [];

    let playersSiteRAWArr = playersSiteRAW.split("\n");

    let basic: string = "";

    playersSiteRAWArr.forEach((element) => {
      if (
        element.includes('<td class="ep-buttons"><a href="#" id="player_data_')
      ) {
        // console.log(element);
        element = element.replace(
          '<td class="ep-buttons"><a href="#" id="player_data_',
          ""
        );
        let elementsplit = element.split('"');
        elementsplit[2] = elementsplit[2].replace(/&quot;/g, '"');

        let playersdata: playerData = JSON.parse(elementsplit[2]);

        // console.log(elementsplit[2]);
        playersArr.push(playersdata);
      } else if (element.includes("_Storage.basic")) {
        element = element.replace(/ /g, "");
        element = element.replace("_Storage.basic='", "");
        element = element.replace("';", "");

        basic = element;
        setStorageBasic(element);
      }
    });

    setActivePlayer([0, ""]);
    setPlayersList(playersArr);
    handleLoadPlayer(playersArr[0].online_id, basic, loadedPlayers);
  }

  function handleError() {
    error_ ? setError(false) : setError(true);
  }

  //NEXT UPDATE SPLIT RETURN IN TO COMPONENTS

  return (
    <>
      <Navbar></Navbar>
      <div id="content">
        <LoginError trigger={error_}></LoginError>
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
    </>
  );
}

export default Title;
