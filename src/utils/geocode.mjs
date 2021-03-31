import axios from "axios";

export default function geocode(address, callback) {
  const mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoidmV0dGlzIiwiYSI6ImNrbW9yNHI4eDEyaGQyb216NnJhbXhqOW4ifQ.q-9UBtM14HlEOU_D5ZAPAA&limit=1`;
  axios
    .get(mapBoxUrl)
    .then((response) => {
      //console.log(response.data);
      const features = response.data?.features;
      if (response.data && response.data.features.length === 0) {
        //console.log("ERROR: 404 Not found! Try different query parameter.");
        throw new Error(
          `ERROR: 404: ${address} not found! Try different query parameter.`
        );
      }
      const { center } = features[0];
      const geolocation = {
        city: address,
        lat: center[1],
        long: center[0],
      };
      // console.log(geolocation);
      callback(undefined, geolocation);
    })
    .catch((er) => {
      callback(er, undefined);
    });
}
