import { stringify } from "querystring";
import React from "react";
import { useState } from "react";
import { Route, Link, Routes, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "../assets/serie.css";

function Serie() {
  const params = useParams();
  const [episodesList, setEpisodesList] = useState();
  const [serieData, setSerieData] = useState<serieDataIn>();
  const [loadingList, setLoadingList] = useState(true);

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

  async function fetchRAW(url: string) {
    let response = await fetch(url, {
      method: "GET",
    });
    const data = await response.text();
    return data;
  }
  getEpisodesList();
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
    let episodes_links: any = [];

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

    let episode_number = 1;
    await episodesSiteArr.forEach((element) => {
      //if(element.includes('href')) console.log(element)
      if (element.includes('class="button active">')) {
        let elementArr = element.split('"');
        episodes_links.push([elementArr[1]]);
        episode_number = episode_number + 1;
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
    setEpisodesList(episodes_links);
    setSerieData(serie_data);

    console.log([episodes_links, serie_data]);
  }

  return (
    <>
      <Navbar></Navbar>
      <div id="ep_list"></div>
    </>
  );
}

export default Serie;
