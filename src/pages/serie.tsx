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

  //if (loadingList == true) getEpisodesList();

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

    let skipped = false;
    let episode_number = 1;
    await episodesSiteArr.forEach((element) => {
      //if(element.includes('href')) console.log(element)
      if (element.includes('class="button active">')) {
        console.log(element);

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
    setEpisodesList(episodes_links);
    setSerieData(serie_data);

    console.log([episodes_links, serie_data]);
  }

  return (
    <>
      <Navbar></Navbar>
      <div id="content">
        <div id="ep_list">
          {example_list.reverse().map((ep) => {
            if (ep[0] != "")
              return (
                <div className="ep_data">
                  <div className="ep_num">{ep[2]}</div>
                  <div className="ep_titl">{ep[0]}</div>
                </div>
              );
          })}
        </div>
        <div id="player">here</div>
      </div>
    </>
  );
}

export default Serie;
