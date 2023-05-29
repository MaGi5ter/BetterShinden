import React from "react";
import { useState } from "react";
import "./navbar.css";

function Navbar() {
  const [data, setData] = useState<animeData[] | []>();
  const [loading, setLoading] = useState(true);

  interface animeData {
    title_id: string;
    title: string;
    type: string;
    kind: string;
    title_status: string;
    cover: number;
    premiere_date: string;
    other_to: string;
    title_url: string;
  }

  function redirect(link: string) {
    window.location.href = link;
  }

  async function fetchAnimes(event: React.FormEvent<HTMLInputElement>) {
    //function fetches data about anime in seacrh bar from shinden api
    let searchString = event.currentTarget.value;

    let oshiresponse: any[] = [
      //I used this as exapmple output bcs from my local server I am unable to fetch data, beacause of cors policy
      {
        title_id: "60113",
        title:
          "Oshi no Ko awd awdaw adawdawd ultra długi naprawde jeszcze dluzzszy i jeszcze jeden",
        type: "Anime",
        kind: "TV",
        title_status: "Emitowane",
        cover: 364583,
        premiere_date: "12.04.2023",
        other_to: "<em>Oshi</em> no <em>Ko</em>",
        title_url: "https://shinden.pl/series/60113-oshi-no-ko",
      },
      {
        title_id: "57764",
        title: "Oshi no Ko",
        type: "Manga",
        kind: "Manga",
        title_status: "Publikowana",
        cover: 326117,
        premiere_date: "23.04.2020",
        other_to: "<em>Oshi</em> no <em>Ko</em>",
        title_url: "https://shinden.pl/manga/57764-oshi-no-ko",
      },
    ];

    if (searchString.length > 2) {
      let response = await fetch(`api/title/search?query=${searchString}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      setLoading(false);
      const data = await response.json();
      setData(data);
      // return data;
      // return oshiresponse;
    } else if (searchString.length < 3) {
      setLoading(true);
    }
  }

  return (
    <>
      <div id="navbar">
        <h1 id="logo">BetterShinden</h1>
        <div id="searchbar">
          <div className="srch">
            <input
              className="searc__bar"
              type="text"
              placeholder="Szukaj Anime.."
              onChange={fetchAnimes}
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </div>
          <ul
            className="drop"
            style={{
              display: loading ? "none" : "block",
            }}
          >
            {loading
              ? ""
              : data?.slice(0, 7).map((search_result) => {
                  if (search_result.type === "Anime") {
                    return (
                      <li
                        className="title_result"
                        onClick={() => redirect(search_result.title_url)}
                      >
                        <img
                          src={`/res/images/225x350/${search_result.cover}.jpg`}
                          alt="COVER"
                        />
                        <div className="title_content">
                          <h2>{search_result.title}</h2>
                          <h3>{search_result.title_status}</h3>
                        </div>
                      </li>
                    );
                  }
                })}
          </ul>
        </div>
        <div id="nav__buttons">
          <a href="#">
            <button>Logowanie</button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Navbar;
