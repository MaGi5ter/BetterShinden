import React from "react";
import { useState } from "react";
import { fetchRAW } from "../../assets/scripts/dataFetchScripts";
import Popup from "../LoginPopup/popup";
import "./navbar.css";

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

function Navbar() {
  const [data, setData] = useState<animeData[] | []>();
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [logged, setLogged] = useState({
    logged: false,
    logout_link: "",
  });
  const [checkinglogged, setCheckingLogged] = useState(true);

  if (checkinglogged) {
    setCheckingLogged(false);
    handleLogged();
  }
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

  async function handleLogged() {
    let data = await checkLogged();
    console.log(data);
    setLogged(data);
  }

  function redirect(link: string) {
    window.location.href = link;
  }

  function handlePopup() {
    showPopup ? setShowPopup(false) : setShowPopup(true);
  }

  async function fetchAnimes(event: React.FormEvent<HTMLInputElement>) {
    //function fetches data about anime in seacrh bar from shinden api
    let searchString = event.currentTarget.value;

    if (searchString.length > 2) {
      let data;
      if (window.location.href == "https://shinden.pl") {
        let response = await fetch(`/api/title/search?query=${searchString}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        data = await response.json();
      } else {
        let response = await fetch(
          `https://shinden.pl/api/title/search?query=${searchString}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );
        data = await response.json();
      }
      setLoading(false);
      setData(data);
    } else if (searchString.length < 3) {
      setLoading(true);
    }
  }

  return (
    <>
      <Popup trigger={showPopup} close={handlePopup}></Popup>
      <div id="navbar">
        <div className="navbar-content">
          <a href="/" className="logo_link">
            <h1 id="logo"> BetterShinden</h1>
          </a>
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
            <a href={logged.logged ? logged.logout_link : "#"}>
              {logged.logged ? (
                <button>Wyloguj</button>
              ) : (
                <button onClick={(e) => handlePopup()}>Logowanie</button>
              )}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
