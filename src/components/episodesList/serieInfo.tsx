import React from "react";
import "./serieinfo.css";

interface serieDataIn {
  description: string;
  thumbnail_url: string;
  episode_count: number;
  rating: string;
  url: string;
  serie_name: string;
}

interface Prop {
  serieInfo: serieDataIn;
}

function SerieInfo(prop: Prop) {
  return (
    <>
      <div id="serie_info_box">
        <div className="serie_thumbnail">
          <img src={prop.serieInfo.thumbnail_url} />
        </div>
        <div className="serie_informations">
          <h2 className="title">{prop.serieInfo.serie_name}</h2>
          <div className="description">{prop.serieInfo.description}</div>
        </div>
      </div>
    </>
  );
}

export default SerieInfo;
