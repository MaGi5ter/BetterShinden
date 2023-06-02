import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import "./serieinfo.css";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";

interface serieBasicData {
  thumbnail_url: string;
  description: string;
  title: string;
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

function SerieInfo() {
  const params = useParams();

  const [loadingData, setLoadingData] = useState(true);
  const [serieData, setSerieData] = useState<serieBasicData>();

  let currentRoute = useLocation();

  if (loadingData) {
    let route = currentRoute.pathname.includes("titles") ? "titles" : "series";
    getSerieInfo(getID(params.id), route);
  }

  async function getSerieInfo(id: number, route: string) {
    let full_url = `https://shinden.pl/${route}/${id}/all-episodes`;
    let episodesSiteRaw = await fetchRAW(full_url);

    const parser = new DOMParser();
    const document = parser.parseFromString(episodesSiteRaw, "text/html");

    //GETS DESCRIPTION
    let a = document.querySelector('meta[name="description"]');
    let description: string = a
      ? a.outerHTML
          .replace('<meta name="description" content=" ', "")
          .replace('"></meta>', "")
          .replace('">', "")
      : "Brak Opisu";

    //GETS THUMBNAIL
    let thumbnail =
      document
        .querySelector(".info-aside-img")
        ?.outerHTML.replace('<img class="info-aside-img" src="', "")
        .replace('">', "") || "";

    //GETS THUMBNAIL
    let name = document.querySelector(".title")?.innerHTML || "Brak Tytułu";

    setSerieData({
      thumbnail_url: thumbnail,
      description: description,
      title: name,
    });
    setLoadingData(false);
  }

  return (
    <>
      <div id="serie_info_box">
        <div className="serie_thumbnail">
          <img src={serieData?.thumbnail_url} />
        </div>
        <div className="serie_informations">
          <h2 className="title">{serieData?.title}</h2>
          <div className="description">{serieData?.description}</div>
        </div>
      </div>
    </>
  );
}

export default SerieInfo;
