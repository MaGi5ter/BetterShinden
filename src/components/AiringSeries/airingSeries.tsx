import React, { useState } from "react";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";
import "./airing.css";

interface airingData {
  image: string;
  url: string;
  title: string;
  kind: string;
}

async function getAiringData() {
  let airingRAW = await fetchRAW(
    "https://shinden.pl/series?genres-type=all&genres=e234&series_status%5B0%5D=Currently+Airing&start_date_precision=1&year_from=1995&sort_by=ranking-rate&sort_order=desc"
  );

  const parser = new DOMParser();
  const document = parser.parseFromString(airingRAW, "text/html");
  let data: airingData[] = Array.from(document.querySelectorAll(".div-row"))
    .filter((row) => {
      if (
        row.querySelector(".cover-col")?.querySelector("a")?.href == undefined
      )
        return false;
      return true;
    })
    .map((row) => {
      let image = row.querySelector(".cover-col")?.querySelector("a")?.href!;
      let url = row.querySelector(".desc-col")?.querySelector("a")?.href!;
      let title = row.querySelector(".desc-col")?.querySelector("a")
        ?.innerHTML!;
      let kind = row.querySelector(".title-kind-col")?.innerHTML!;

      return {
        image: image,
        url: url,
        title: title,
        kind: kind,
      };
    });

  return data;
}

function AiringSeries() {
  const [airingData, setAiringData] = useState<airingData[]>([]);

  handleData();
  async function handleData() {
    if (airingData[0] == undefined) {
      setAiringData(await getAiringData());
    }
  }

  return (
    <div className="airing-grid">
      <div className="airing-grid-title">Popularne Wychodzące Serie</div>
      <div className="airing-content">
        {airingData.map((serie, index) => {
          return (
            <a href={serie.url} className="airing-element">
              <div className="airing-data">
                <img className="airing-image" src={serie.image} />
                <div className="airing-footer">
                  <div className="airing-kind">{serie.kind}</div>
                </div>
              </div>
              <div className="airing-title">{serie.title}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default AiringSeries;
