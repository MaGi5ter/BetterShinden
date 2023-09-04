import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";
import "./related.css";

function getLocation() {
  let current = useLocation().pathname.trim().split("/");
  let output = `/${current[1]}/${current[2]}`;
  return output;
}

async function collectData() {
  let location = getLocation();
  const rawSeriePage = await fetchRAW(`https://shinden.pl${location}`);
  const parser = new DOMParser();
  const document = parser.parseFromString(rawSeriePage, "text/html");

  let relations = document.querySelectorAll(".relation_t2t");
  let relationsData: relation[] = [];

  relations.forEach((relation) => {
    let figcaptions = relation.querySelectorAll("figcaption");
    let relationData: relation = {
      title: "",
      link: "",
      image: "",
      serieType: "",
      type: "",
    };

    relationData.link = figcaptions[0].getElementsByTagName("a")[0].href;
    relationData.title = figcaptions[0].getElementsByTagName("a")[0].title;
    relationData.serieType = figcaptions[1].innerHTML;
    relationData.type = figcaptions[2].innerHTML;
    relationData.image = relation.getElementsByTagName("img")[0].src;

    relationsData.push(relationData);
  });

  return relationsData;
}

interface relation {
  title: string;
  link: string;
  image: string;
  serieType: string;
  type: string;
}

function Related() {
  const [relationsData, setRelationsData] = useState<relation[]>();
  const [loading, setLoading] = useState(true);

  if (loading) handleRelationsData();
  async function handleRelationsData() {
    let data = await collectData();
    setRelationsData(data);
    setLoading(false);
  }

  // console.log("RELATED", getLocation());

  collectData();

  return (
    <div id="related_list">
      <h2>Powiązane Serie</h2>
      <div id="list">
        {loading
          ? "Ładowanie Danych"
          : relationsData?.map((relation) => {
              return (
                <a href={relation.link} className="relation_link">
                  <div className="related_serie">
                    <img className="related_image" src={relation.image} />
                    <div className="related_info">
                      <p className="related_type">{relation.serieType}</p>
                      <p className="related_title">{relation.title}</p>
                      <p className="related_type">{relation.type}</p>
                    </div>
                  </div>
                </a>
              );
            })}
      </div>
    </div>
  );
}

export default Related;
