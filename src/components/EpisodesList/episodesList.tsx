import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { fetchRAW } from "../../assets/scripts/dataFetchScripts";

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

interface episodeData {
  title: string;
  url: string;
}

type loadPlayersFunction = (a: string) => Promise<void>;

interface Prop {
  loadPlayers: loadPlayersFunction;
}

function EpisodesList(prop: Prop) {
  const params = useParams();

  const [loadingList, setLoadingList] = useState(true);
  const [episodesList, setEpisodesList] = useState<episodeData[]>([]);
  const [activeEpisode, setActiveEpisode] = useState(0);

  let currentRoute = useLocation();
  if (loadingList) {
    let route = currentRoute.pathname.includes("titles") ? "titles" : "series";
    getEpisodesList(getID(params.id), route);
  }

  async function getEpisodesList(id: number, route: string) {
    let full_url = `https://shinden.pl/${route}/${id}/all-episodes`;
    let episodesSiteRaw = await fetchRAW(full_url);

    const parser = new DOMParser();
    const document = parser.parseFromString(episodesSiteRaw, "text/html");
    let episodeList: episodeData[] = [];
    document
      .querySelector(".list-episode-checkboxes")
      ?.querySelectorAll("tr")
      .forEach((episode) => {
        let episodeData: episodeData = { title: "", url: "" };
        episodeData.title = episode.querySelector(".ep-title")?.innerHTML || "";
        episodeData.url = episode.querySelector("a")?.href || "";

        episodeList.push(episodeData);
      });

    episodeList = episodeList.reverse();
    setEpisodesList(episodeList);
    setLoadingList(false);
  }

  return (
    <div id="ep_list">
      {episodesList.map((ep, index) => {
        if (ep.title != "")
          return (
            <div
              className={
                index == activeEpisode ? "ep_data active_ep" : "ep_data"
              }
              onClick={(e) => {
                setActiveEpisode(index);
                prop.loadPlayers(ep.url);
              }}
            >
              <div className="ep_num">{index + 1}</div>
              <div className="ep_titl">{ep.title}</div>
            </div>
          );
      })}
    </div>
  );
}

export default EpisodesList;
