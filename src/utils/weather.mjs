import axios from "axios";

const base_url = "http://api.weatherstack.com";
const end_point_current = "/current";
const api_key = "?access_key=5b6488c1a133d61bbae1fde24369824b";
const unit_metric = "&units=m";
const unit_farenheit = "&units=f";
const query = "&query=";

export default function weather(lat, long, city, callback) {
  let url =
    base_url +
    end_point_current +
    api_key +
    unit_metric +
    query +
    `${lat},${long}`;

  // console.log(url);

  axios
    .get(url)
    .then((response) => {
      const { current } = response?.data;
      const { temperature, feelslike, weather_descriptions } = current;
      // console.log(current);
      const description = weather_descriptions[0];
      const data = {
        description,
        temperature,
        feelslike,
        city,
      };
      // console.log(data);
      callback(undefined, data);
    })
    .catch((er) => callback(er.message, undefined));
}
