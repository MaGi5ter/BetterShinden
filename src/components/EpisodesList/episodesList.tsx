import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { fetchRAW } from "../../assets/scripts/dataFetchScripts";
import {
  getSerieData,
  getEpisodesData,
  getPlayersData,
} from "../../assets/scripts/dataExtracting";

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

function EpisodesList() {
  const [loadingList, setLoadingList] = useState(true);

  let currentRoute = useLocation();
  if (loadingList) {
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
    // loadPlayersList(corrected_links[0][1]); //FIRST ONE NEEDS TO BE DISPLAYED AUTOMATICALLY
  }
}

export default EpisodesList;
