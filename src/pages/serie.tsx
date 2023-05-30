import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "../assets/serie.css";
import $ from "jquery";

function Serie() {
  const params = useParams();

  const [episodesList, setEpisodesList] = useState(["Loading", "", "0"]);
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [activePlayer, setActivePlayer] = useState([0, ""]);
  const [serieData, setSerieData] = useState<serieDataIn>();
  const [loadingList, setLoadingList] = useState(true);
  const [playersList, setPlayersList] = useState<playerData[]>([]);
  const [storageBasic, setStorageBasic] = useState<string>("");
  const [loadedPlayers, setLoadedPlayers] = useState<loadedPlayerData[]>([]);

  let example_list: any = [
    ["", "/episode/60113-oshi-no-ko/view/221901", 11],
    ["", "/episode/60113-oshi-no-ko/view/221900", 10],
    ["", "/episode/60113-oshi-no-ko/view/221899", 9],
    ["", "/episode/60113-oshi-no-ko/view/221898", 8],
    ["Szum", "/episode/60113-oshi-no-ko/view/221897", 7],
    ["Egosurfing", "/episode/60113-oshi-no-ko/view/221896", 6],
    ["Randkowe reality show", "/episode/60113-oshi-no-ko/view/221895", 5],
    ["Aktorzy", "/episode/60113-oshi-no-ko/view/221894", 4],
    [
      "Telewizyjna drama na podstawie mangi",
      "/episode/60113-oshi-no-ko/view/221893",
      3,
    ],
    ["Trzecia opcja", "/episode/60113-oshi-no-ko/view/221892", 2],
    ["Matka i dzieci", "/episode/60113-oshi-no-ko/view/221891", 1],
  ];

  let example_players = [
    {
      online_id: "574311",
      player: "Dailymotion",
      username: "",
      user_id: "118604",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author:
        'Grupa: <a href="https://forum.shinden.pl/index.php?groups/translate/">ShindeSubs</a> | Tłumaczenie: <a href="https://shinden.pl/user/118604-voxten/">Voxten </a>',
      added: "2019-04-06 22:30:50",
      source: "https://shinden.pl/shindesubs",
    },
    {
      online_id: "1369282",
      player: "Cda",
      username: "",
      user_id: "258171",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Tłumacz: Kowren Korekta: qatil",
      added: "2023-02-11 01:00:00",
      source: "https://www.facebook.com/tlumaczenia.maou",
    },
    {
      online_id: "1390281",
      player: "Mega",
      username: "",
      user_id: "149230",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2023-03-30 00:57:14",
      source: "https://kny.wbijam.pl/pierwsza_seria-01.html",
    },
    {
      online_id: "1135413",
      player: "Gdrive",
      username: "",
      user_id: "314325",
      lang_audio: "pl",
      lang_subs: "",
      max_res: "720p",
      subs_author: "",
      added: "2021-10-06 16:35:27",
      source: "",
    },
    {
      online_id: "1134411",
      player: "Sibnet",
      username: "",
      user_id: "320808",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "720p",
      subs_author: "Jastrząb",
      added: "2021-10-03 16:15:44",
      source: "https://kny.wbijam.pl/pierwsza_seria-01.html",
    },
    {
      online_id: "867714",
      player: "Gdrive",
      username: "",
      user_id: "288551",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "720p",
      subs_author: "Askara",
      added: "2020-11-28 18:51:23",
      source: "https://animedesu.pl/",
    },
    {
      online_id: "1409125",
      player: "Dood",
      username: "",
      user_id: "93676",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "720p",
      subs_author: "Jastrząb",
      added: "2023-04-29 23:07:05",
      source: "https://kny.wbijam.pl/pierwsza_seria-01.html",
    },
    {
      online_id: "1407441",
      player: "Cda",
      username: "",
      user_id: "61161",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "480p",
      subs_author: "Askara",
      added: "2023-04-28 00:14:40",
      source: "https://desu-online.pl/anime/kimetsu-no-yaiba/",
    },
    {
      online_id: "1401689",
      player: "Streamsb",
      username: "",
      user_id: "93676",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2023-04-18 12:11:31",
      source: "https://kny.wbijam.pl/pierwsza_seria-01.html",
    },
    {
      online_id: "1392699",
      player: "Cda",
      username: "",
      user_id: "69915",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "",
      added: "2023-04-03 13:27:31",
      source: "",
    },
    {
      online_id: "1376704",
      player: "Cda",
      username: "",
      user_id: "320808",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2023-02-26 18:47:51",
      source: "https://kny.wbijam.pl",
    },
    {
      online_id: "1374417",
      player: "Cda",
      username: "",
      user_id: "320808",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2023-02-25 10:58:50",
      source: "https://kny.wbijam.pl",
    },
    {
      online_id: "1372824",
      player: "Cda",
      username: "",
      user_id: "320808",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2023-02-23 17:13:41",
      source: "https://kny.wbijam.pl",
    },
    {
      online_id: "1253530",
      player: "Cda",
      username: "",
      user_id: "69915",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "",
      added: "2022-05-24 21:07:19",
      source: "",
    },
    {
      online_id: "1203036",
      player: "Cda",
      username: "",
      user_id: "87735",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2022-02-21 18:42:45",
      source: "https://kny.wbijam.pl/pierwsza_seria.html",
    },
    {
      online_id: "1186114",
      player: "Cda",
      username: "",
      user_id: "71819",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2022-01-29 17:31:49",
      source: "https://kny.wbijam.pl/pierwsza_seria.html",
    },
    {
      online_id: "1180472",
      player: "Cda",
      username: "",
      user_id: "249306",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2022-01-25 20:25:09",
      source: "https://kny.wbijam.pl/pierwsza_seria.html",
    },
    {
      online_id: "1178942",
      player: "Cda",
      username: "",
      user_id: "326000",
      lang_audio: "pl",
      lang_subs: "",
      max_res: "1080p",
      subs_author: "Askara & Crimson Red",
      added: "2022-01-23 16:32:20",
      source: "https://animeni.pl/",
    },
    {
      online_id: "1177695",
      player: "Cda",
      username: "",
      user_id: "93676",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "",
      added: "2022-01-22 07:44:21",
      source: "",
    },
    {
      online_id: "1175805",
      player: "Cda",
      username: "",
      user_id: "317685",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "",
      added: "2022-01-18 18:23:40",
      source: "",
    },
    {
      online_id: "1134412",
      player: "Cda",
      username: "",
      user_id: "320808",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "Jastrząb",
      added: "2021-10-02 21:44:18",
      source: "https://kny.wbijam.pl/pierwsza_seria-01.html",
    },
    {
      online_id: "1131392",
      player: "Cda",
      username: "",
      user_id: "308454",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "1080p",
      subs_author: "",
      added: "2021-09-23 08:13:37",
      source: "",
    },
    {
      online_id: "1112418",
      player: "Cda",
      username: "",
      user_id: "221411",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "480p",
      subs_author: "",
      added: "2021-07-19 17:50:07",
      source: "",
    },
    {
      online_id: "973626",
      player: "Mp4upload",
      username: "",
      user_id: "249306",
      lang_audio: "jp",
      lang_subs: "en",
      max_res: "1080p",
      subs_author: "LostYears",
      added: "2021-01-26 19:33:34",
      source:
        "https://www12.9anime.to/watch/demon-slayer-kimetsu-no-yaiba.6q67/ep-1",
    },
    {
      online_id: "923993",
      player: "Dood",
      username: "",
      user_id: "325645",
      lang_audio: "en",
      lang_subs: "",
      max_res: "1080p",
      subs_author: "",
      added: "2020-12-29 23:35:29",
      source: "https://gogoanime.so/kimetsu-no-yaiba-dub-episode-1",
    },
    {
      online_id: "923992",
      player: "Mp4upload",
      username: "",
      user_id: "325645",
      lang_audio: "en",
      lang_subs: "",
      max_res: "1080p",
      subs_author: "",
      added: "2020-12-29 23:35:26",
      source: "https://gogoanime.so/kimetsu-no-yaiba-dub-episode-1",
    },
    {
      online_id: "885051",
      player: "Streamsb",
      username: "",
      user_id: "1",
      lang_audio: "jp",
      lang_subs: "en",
      max_res: "1080p",
      subs_author: "",
      added: "2020-12-06 13:35:31",
      source: "https://gogoanime.so/kimetsu-no-yaiba-episode-1",
    },
    {
      online_id: "867716",
      player: "Cda",
      username: "",
      user_id: "288551",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "720p",
      subs_author: "Askara",
      added: "2020-11-28 18:51:27",
      source: "https://animedesu.pl/",
    },
    {
      online_id: "802791",
      player: "Cda",
      username: "",
      user_id: "240768",
      lang_audio: "jp",
      lang_subs: "",
      max_res: "720p",
      subs_author: "",
      added: "2020-08-07 17:19:04",
      source: "https://www.cda.pl/video/55783688a",
    },
    {
      online_id: "574201",
      player: "Mp4upload",
      username: "",
      user_id: "81739",
      lang_audio: "jp",
      lang_subs: "en",
      max_res: "720p",
      subs_author: "",
      added: "2019-04-06 20:21:04",
      source: "http://www.animerush.tv/Kimetsu-no-Yaiba-episode-1/",
    },
    {
      online_id: "574190",
      player: "Mp4upload",
      username: "",
      user_id: "81739",
      lang_audio: "jp",
      lang_subs: "en",
      max_res: "360p",
      subs_author: "",
      added: "2019-04-06 19:39:02",
      source: "http://www.animerush.tv/Kimetsu-no-Yaiba-episode-1/",
    },
    {
      online_id: "1412929",
      player: "Gdrive",
      username: "",
      user_id: "1",
      lang_audio: "jp",
      lang_subs: "pl",
      max_res: "720p",
      subs_author: "",
      added: "2023-05-10 04:56:53",
      source: "http://www.animezone.pl/odcinki-online/kimetsu-no-yaiba/1",
    },
  ];

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

  function fetchShindenApi(url: string) {
    return new Promise<string>((resolve) => {
      $.ajax({
        type: "GET",
        url: url,
        xhrFields: {
          withCredentials: true,
        },
        success: function (result) {
          resolve(result);
        },
      });
    });
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

  async function fetchRAW(url: string) {
    let response = await fetch(url, {
      method: "GET",
    });
    const data = await response.text();
    return data;
  }

  if (loadingList == true) getEpisodesList();

  async function getEpisodesList() {
    let full_url = "";
    let serie_data = {
      description: "",
      thumbnail_url: "",
      episode_count: 0,
      rating: "",
      url: "",
      serie_name: "",
    };

    let id = getID(params.id);
    var serieDataRawHtml = await fetchRAW(`https://shinden.pl/series/${id}`);
    const serieDataRawHtmlArr = serieDataRawHtml.split("\n");

    for (let index = 0; index < serieDataRawHtml.length; index++) {
      //THIS FOR SEARCH FOR FULL LINK TO SERIE
      let element = serieDataRawHtmlArr[index];

      if (
        element.includes(
          `<link rel="canonical" href="https://shinden.pl/series/${id}`
        )
      ) {
        let elementarr = element.split('"');
        full_url = `${elementarr[3]}/all-episodes`;
        break;
      }
    }

    let episodesSiteRaw = await fetchRAW(full_url);
    let episodesSiteArr = episodesSiteRaw.split("\n");
    let episodes_links: any[] = [];

    await episodesSiteArr.forEach((element) => {
      if (element.includes('<img class="info-aside-img" src="')) {
        console.log(element);
        element = element.replace('<img class="info-aside-img" src="', "");
        element = element.replace('" />', "");
        element = `https://shinden.pl${element}`;
        serie_data.thumbnail_url = element;
      } else if (element.includes('<meta name="description" content="')) {
        element = element.replace('<meta name="description" content="', "");
        element = element.replace('">', "");
        element = element.replace(/&quot;/g, '"');
        element = element.replace(/&oacute;/g, "ó");
        element = element.replace(/&amp;#039;/g, "'");
        serie_data.description = element;
      } else if (element.includes('"ratingValue": "')) {
        element = element.replace('"ratingValue": "', "");
        element = element.replace('",', "");
        element = element.replace(/ /g, "");
        serie_data.rating = element;
      } else if (element.includes('"@id": ')) {
        element = element.replace('",', "");
        element = element.replace('"@id": "', "");
        element = element.replace(/ /g, "");
        serie_data.url = element;
      } else if (element.includes('"name": "')) {
        element = element.replace('    "name": "', "");
        element = element.replace('",', "");
        serie_data.serie_name = element;
      }
    });

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

    setLoadingList(false);
    setEpisodesList(episodes_links.reverse());
    setSerieData(serie_data);
    loadPlayersList(episodes_links[0][1]); //FIRST ONE NEEDS TO BE DISPLAYED AUTOMATICCLY

    console.log([episodes_links, serie_data]);
  }

  async function loadPlayersList(url: string) {
    console.log(url);

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
    loadPlayer(playersArr[0].online_id, basic);
  }

  // useEffect(() => {
  //   console.log(storageBasic);
  //   loadPlayer(playersList[0].online_id);
  // }, [storageBasic, playersList]);

  function handleActivePlayer(index: number, online_id: string) {
    console.log(index, online_id);
    setActivePlayer([index, online_id]);
  }

  async function loadPlayer(online_id: string, storage_basic: string = "") {
    console.log(activePlayer);

    let id = loadedPlayers.findIndex((el) => el.online_id == online_id);

    let storage = storageBasic != "" ? storageBasic : storage_basic;

    if (id != -1) return;
    await fetchShindenApi(
      //shinden api first responses with timeout in ms , and after that timeout u can for few seconds get player data, in most cases it is 5sec
      `https://api4.shinden.pl/xhr/${online_id}/player_load?auth=${storage}`
    ).then((time) => {
      let timeout = Number(time);
      setTimeout(async () => {
        await fetchShindenApi(
          `https://api4.shinden.pl/xhr/${online_id}/player_show?auth=${storage}&width=765&height=-1`
        ).then((data) => {
          let dataArr = data.split("\n");
          for (const element of dataArr) {
            if (element.includes("<iframe ")) {
              // console.log(element);
              let loaded = loadedPlayers;
              loaded.push({
                online_id: online_id,
                iframe: element,
              });
              console.log(loaded);
              console.log(activePlayer);
              console.log(playersList);
              setLoadedPlayers(loaded.slice());
            }
          }
        });
      }, timeout * 1000);
    });
  }

  function displayPlayer() {
    let id = loadedPlayers.findIndex(
      (el) => el.online_id == playersList[activePlayer[0]].online_id
    );

    console.log("displayPlayer", id, loadedPlayers);
    if (id === -1) {
      return <>Odtwarzacz ładuje sie</>;
    } else
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: `${loadedPlayers[id].iframe.replace(
              "iframe",
              'iframe id="video_player"'
            )}`,
          }}
        />
      );
    //<>{loadedPlayers[id].iframe}</>;
  }

  return (
    <>
      <Navbar></Navbar>
      <div id="content">
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
          <div id="_video">{displayPlayer()}</div>
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
                    loadPlayer(player.online_id);
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

export default Serie;
