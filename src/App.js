import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  //const apiRF = "https://api.data.gov.sg/v1/environment/rainfall";
  //const apiW2h = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
  //const apiRH = "https://api.data.gov.sg/v1/environment/relative-humidity";
  //const apiWD = "https://api.data.gov.sg/v1/environment/wind-direction";
  //const apiWS = "https://api.data.gov.sg/v1/environment/wind-speed";

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState([]);
  const [clock, setClock] = useState("");
  const [time, setTime] = useState("");
  const [defaultForecast, setDefaultForecast] = useState("")
  const [toggleDefault, setToggleDefault] = useState(false);
  const [forecast, setForecast] = useState("")

  const url = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
  //const url = 'https://api.data.gov.sg/v1/environment/rainfall';

  let areas;
  let specArea;
  let rainfall;
  let timeStamp;
  let specRainfall;
  let formattedTime;
  let currentTime;
  let defaultArea = "Tampines";
  
  const apiCall = (e) => {
    if(!search) return;
    if(e.key === "Enter"){
      setToggleDefault(true);
      axios.get(url)
      .then((response) => {
        // areas = response.data.metadata.stations;
        // rainfall = response.data.items[0].readings;
        
        // specArea = areas.filter(area => area.name.toLowerCase() === search.toLowerCase());
        // rainfall.filter(rf => {
        //   if(rf.station_id === specArea[0].id){
        //     specRainfall = rf.value;
        //   }
        // });
        // console.log(specRainfall)


        areas = response.data.items[0].forecasts;
        specArea = areas.filter(area => area.area.toLowerCase() === search.toLowerCase());
        setLocation(specArea[0].area);
        setForecast(specArea[0].forecast);

        timeStamp = response.data.items[0].timestamp
        formattedTime = new Date(timeStamp).toLocaleString('en-GB');
        setTime(formattedTime);

        
      }).catch((error) => {
        console.log(error)
      })
      setSearch('')
    }
  }

  const justLoaded = () => {
    axios.get(url).then((response) => {
      areas = response.data.items[0].forecasts;
      specArea = areas.filter(area => area.area === defaultArea);
      setDefaultForecast(specArea[0].forecast);

      timeStamp = response.data.items[0].timestamp
      formattedTime = new Date(timeStamp).toLocaleString('en-GB');
      setTime(formattedTime);
    })
  }
  
  useEffect(() => {
    justLoaded();
  }, [])

  const inputChange = (e) => {
    setSearch(e.target.value);
  }
  
  // useEffect(() => {
  //   setInterval(() => {
  //     setClock(new Date().toLocaleString('en-GB'));
  //   }, 1000);
  // }, []);
  
   
  return (
    <div className='app'>
      <div className='container'>
        <input
            autoFocus
            type="text"
            name="text"
            value={search}
            className="searchInput"
            onChange={(e) => inputChange(e)}
            onKeyDown={apiCall}
            placeholder="Enter location"
            autoComplete="on"
        />
        </div>
        <div className='infoContainer'>
          <div className='location'>
            {toggleDefault === false ? 
            <p>Location: {defaultArea}</p> :
            <p>Location: {location}</p>}
          </div>
          <div className='rainFall'>
          <p>Rainfall: </p>
          </div>
          <div className='forecast'>
            {toggleDefault === false ? 
            <p>Forecast: {defaultForecast}</p> :
            <p>Forecast: {forecast}</p>}
          </div>
          <div className='time'>
            <p>Current time: {clock}</p>
            <p>Updated at: {time}</p>
          </div>
        </div>
    </div>
  );
}

export default App;
