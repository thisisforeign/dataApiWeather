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
  const [rf, setRf] = useState("")
  const [defaultRF, setDefaultRF] = useState("")

  const urlWeather = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
  const urlRainfall = 'https://api.data.gov.sg/v1/environment/rainfall';

  let areasWeather;
  let specAreaWeather;
  let rainfall;
  let timeStamp;
  let specRainfall;
  let formattedTime;
  let currentTime;
  let defaultArea = "Tampines";
  let weatherCoordinates;
  let specWCoordinates;
  let rFCoordinates;
  let allRFLatitude;
  let allRFLongitude;
  let specRFCoordinates;
  let wLatitude;
  let wLongitude;
  let rFLatitude;
  let rFLongitude;
  let curr;
  let prev = 100; //since the distance wont be more than 100 because they are fixed
  let count;
  let specRFReading;
  let defaultWCoordinates;
  let defaultLatitude;
  let defaultLongitude;

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  const apiCall = (e) => {
    if(!search) return;
    if(e.key === "Enter"){
      setToggleDefault(true);
      axios.get(urlWeather)
      .then((response) => {
        // areasWeather = response.data.items[0].forecasts;
        // specAreaWeather = areasWeather.filter(areaW => areaW.area.toLowerCase() === search.toLowerCase());
        // setLocation(specAreaWeather[0].area);
        // setForecast(specAreaWeather[0].forecast);
        // console.log(areasWeather);

        // timeStamp = response.data.items[0].timestamp
        // formattedTime = new Date(timeStamp).toLocaleString('en-GB');
        // setTime(formattedTime);

        weatherCoordinates = response.data.area_metadata;
        specWCoordinates = weatherCoordinates.filter(areaC => areaC.name.toLowerCase() === search.toLowerCase());
        wLatitude = specWCoordinates[0].label_location.latitude;
        wLongitude = specWCoordinates[0].label_location.longitude;

        //coordinates = areasCoordinates.filter(areaC => areaC.)

      }).catch((error) => {
        console.log(error)
      });

      axios.get(urlRainfall)
      .then((response) => {
        rainfall = response.data.items[0].readings;

        rFCoordinates = response.data.metadata.stations;
        allRFLatitude = rFCoordinates.map(rfc => rfc.location.latitude);
        allRFLongitude = rFCoordinates.map(rfc => rfc.location.longitude);
        
        for(let i = 0; i < allRFLatitude.length; i++){
          curr = getDistanceFromLatLonInKm(wLatitude, wLongitude, allRFLatitude[i], allRFLongitude[i]);
          if(curr < prev){
            prev = curr;
            count = i;
          }
        }
        rFLatitude = allRFLatitude[count];
        rFLongitude = allRFLongitude[count];
        specRFCoordinates = rFCoordinates.filter(rfc => rfc.location.latitude === rFLatitude && rfc.location.longitude === rFLongitude);
        console.log(specRFCoordinates)
        console.log(specRFCoordinates[0].id)
        console.log(rainfall)
        specRFReading = rainfall.filter(rf => rf.station_id === specRFCoordinates[0].id);
        specRainfall = specRFReading[0].value;

        setRf(specRainfall);
      }).catch((error) => {
        console.log(error)
      })
      setSearch('')
    }
  }

  const justLoaded = () => {
    axios.get(urlWeather).then((response) => {
      areasWeather = response.data.items[0].forecasts;
      specAreaWeather = areasWeather.filter(areaW => areaW.area === defaultArea);
      setDefaultForecast(specAreaWeather[0].forecast);

      weatherCoordinates = response.data.area_metadata;
      defaultWCoordinates = weatherCoordinates.filter(areaC => areaC.name.toLowerCase() === defaultArea.toLowerCase());
      defaultLatitude = defaultWCoordinates[0].label_location.latitude;
      defaultLongitude = defaultWCoordinates[0].label_location.longitude;

      timeStamp = response.data.items[0].timestamp
      formattedTime = new Date(timeStamp).toLocaleString('en-GB');
      setTime(formattedTime);

    }).catch((error) => {
      console.log(error)
    });


    axios.get(urlRainfall)
    .then((response) => {
      rainfall = response.data.items[0].readings;

      rFCoordinates = response.data.metadata.stations;
      allRFLatitude = rFCoordinates.map(rfc => rfc.location.latitude);
      allRFLongitude = rFCoordinates.map(rfc => rfc.location.longitude);
      
      for(let i = 0; i < allRFLatitude.length; i++){
        curr = getDistanceFromLatLonInKm(defaultLatitude, defaultLongitude, allRFLatitude[i], allRFLongitude[i]);
        if(curr < prev){
          prev = curr;
          count = i;
        }
      }
      rFLatitude = allRFLatitude[count];
      rFLongitude = allRFLongitude[count];
      specRFCoordinates = rFCoordinates.filter(rfc => rfc.location.latitude === rFLatitude && rfc.location.longitude === rFLongitude);
      specRFReading = rainfall.filter(rf => rf.station_id === specRFCoordinates[0].id);
      specRainfall = specRFReading[0].value;

      setDefaultRF(specRainfall);

    }).catch((error) => {
      console.log(error)
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
            {toggleDefault === false ? 
            <p>Rainfall: {defaultRF}mm</p> :
            <p>Rainfall: {rf}mm</p>}
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
