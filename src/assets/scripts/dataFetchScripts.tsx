import $ from "jquery";

export function fetchShindenApi(url: string) {
  return new Promise<string>((resolve) => {
    $.ajax({
      type: "GET",
      url: url,
      xhrFields: {
        withCredentials: true,
      },
      success: function (result) {
        resolve(result);
      },
    });
  });
}

export async function fetchRAW(url: string) {
  let response = await fetch(url, {
    method: "GET",
  });
  const data = await response.text();
  return data;
}

interface loadedPlayerData {
  online_id: string;
  iframe: string;
}

export async function loadPlayer(
  online_id: string,
  storage: string,
  loadedPlayers: loadedPlayerData[]
) {
  return new Promise<loadedPlayerData[]>(async (resolve) => {
    let id = loadedPlayers.findIndex((el) => el.online_id == online_id);

    console.log("szukaj Index", id);

    if (id != -1) resolve(loadedPlayers.slice());

    await fetchShindenApi(
      //shinden api first responses with timeout in ms , and after that timeout u can for few seconds get player data, in most cases it is 5sec
      `https://api4.shinden.pl/xhr/${online_id}/player_load?auth=${storage}`
    ).then((time) => {
      let timeout = Number(time);
      setTimeout(async () => {
        await fetchShindenApi(
          `https://api4.shinden.pl/xhr/${online_id}/player_show?auth=${storage}&width=765&height=-1`
        ).then((data) => {
          let dataArr = data.split("\n");
          for (const element of dataArr) {
            if (element.includes("<iframe ")) {
              let loaded = loadedPlayers;
              loaded.push({
                online_id: online_id,
                iframe: element,
              });
              resolve(loaded.slice());
            }
          }
        });
      }, timeout * 1000);
    });
  });
}
