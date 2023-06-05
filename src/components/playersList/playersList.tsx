import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";
import "./playersList.css";

async function checkLogged() {
  let mainPage = await fetchRAW("https://shinden.pl");
  const parser = new DOMParser();
  const document = parser.parseFromString(mainPage, "text/html");

  let test = document.querySelector(".top-bar--nav-user");
  console.log(test);
  if (test == null) {
    return {
      logged: false,
      logout_link: "",
    };
  } else {
    let logout_link: string;
    test
      .querySelector(".bd")
      ?.querySelectorAll("li")
      .forEach((element, index) => {
        if (index == 3) {
          logout_link = element.querySelector("a")?.href!;
        }
      });

    return {
      logged: true,
      logout_link: logout_link!,
    };
  }
}

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

type loadPlayerFunction = (a: string) => Promise<void>;

interface Prop {
  players_url: string;
  loadPlayer: loadPlayerFunction;
}

function PlayersList({ players_url, loadPlayer }: Prop) {
  const [playersList, setPlayersList] = useState<playerData[]>([]);
  const [activePlayersURL, setActivePlayersURL] = useState<string>();
  const [activePlayer, setActivePlayer] = useState(0);
  const [logged, setLogged] = useState({
    logged: false,
    logout_link: "",
  });
  const [checkinglogged, setCheckingLogged] = useState(true);

  if (checkinglogged) {
    setCheckingLogged(false);
    handleLogged();
  }

  async function handleLogged() {
    let data = await checkLogged();
    console.log(data);
    setLogged(data);
  }

  if (activePlayersURL != players_url) {
    //Prevents insignificant reloading of playerslist
    setActivePlayersURL(players_url);
    getPlayersList(players_url);
  }

  async function getPlayersList(url: string) {
    setActivePlayer(0);
    let playersRaw = await fetchRAW(url);

    const parser = new DOMParser();
    const document = parser.parseFromString(playersRaw, "text/html");

    let players: playerData[] = Array.from(
      document.querySelectorAll("a[data-episode]")
    ).map((element) => {
      return JSON.parse(element.getAttribute("data-episode")!);
    });

    players[0] == undefined ? {} : loadPlayer(players[0].online_id);
    setPlayersList(players);
  }

  return (
    <div id="players_list">
      {playersList[0] == undefined &&
      useLocation().pathname.includes("titles") &&
      !logged.logged ? (
        <div className="playerslist-warning">
          NIE JESTEŚ ZALOGOWANY, TA SERIA WYMAGA KONTA BY JĄ OGLĄDAĆ
        </div>
      ) : (
        playersList.map((player, index) => {
          return (
            <div
              className={
                index == activePlayer
                  ? "player_info active_player"
                  : "player_info"
              }
              onClick={(e) => {
                setActivePlayer(index);
                loadPlayer(player.online_id);
              }}
            >
              <div className="player_quality">
                <b> {player.max_res}</b>
              </div>
              <div className="player_platform">{player.player}</div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PlayersList;
