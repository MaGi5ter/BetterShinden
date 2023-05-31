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
