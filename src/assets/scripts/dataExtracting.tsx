export function getSerieData(episodesSiteArr: string[]) {
  let serie_data = {
    description: "",
    thumbnail_url: "",
    episode_count: 0,
    rating: "",
    url: "",
    serie_name: "",
  };

  episodesSiteArr.forEach((element) => {
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

  return serie_data;
}

export function getEpisodesData(episodesSiteArr: string[]) {
  let episodes_links: any[] = [];
  let skipped = false;
  let episode_number = 1;
  episodesSiteArr.forEach((element) => {
    if (element.includes('class="button active">')) {
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

  let i = 0; //WHILE RETURNS A LIST OF EPISODES AND LINKS WITH NUMBER OF EPISODES
  while (episode_number - i > 1) {
    episodes_links[i].push(episode_number - (i + 1));
    i += 1;
  }

  return {
    episodesData: episodes_links,
    episodesNumber: episode_number - 1,
  };
}

interface playerData {
  online_id: string;
  player: string;
  username: string;
  user_id: string;
  lang_audio: string;
  lang_subs: string;
  max_res: string;
  subs_author: string;
  added: string;
  source: string;
}

export function getPlayersData(playersSiteRAWArr: string[]) {
  let playersArr: playerData[] = [];
  playersSiteRAWArr.forEach((element) => {
    if (
      element.includes('<td class="ep-buttons"><a href="#" id="player_data_')
    ) {
      element = element.replace(
        '<td class="ep-buttons"><a href="#" id="player_data_',
        ""
      );
      let elementsplit = element.split('"');
      elementsplit[2] = elementsplit[2].replace(/&quot;/g, '"');
      let playersdata: playerData = JSON.parse(elementsplit[2]);
      playersArr.push(playersdata);
    }
  });
  return playersArr;
}
