import axios from 'axios';

const urlWeather = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
const urlRainfall = 'https://api.data.gov.sg/v1/environment/rainfall';

let areasWeather;
let areasRainfall;
let specAreaWeather;
let specAreaRainfall;

const ApiCall = (e) => {
    axios.get(urlWeather)
    .then((response) => {
      areasWeather = response.data.items[0].forecasts;
      console.log(areasWeather);

    }).catch((error) => {
      console.log(error)
    });

    axios.get(urlRainfall)
    .then((response) => {
      areasRainfall = response.data.metadata.stations;
      console.log(areasRainfall)

    }).catch((error) => {
      console.log(error)
    })
}
export default ApiCall;