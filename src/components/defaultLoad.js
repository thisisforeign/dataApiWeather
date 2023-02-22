import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

const [defaultForecast, setDefaultForecast] = useState("")

const defaultArea = "Tampines";

const justLoaded = () => {
    axios.get(url).then((response) => {
      let areas = response.data.items[0].forecasts;
      let specArea = areas.filter(area => area.area === defaultArea);
      console.log(specArea)
      setDefaultForecast(specArea[0].forecast);
    })
  }

  export default justLoaded;