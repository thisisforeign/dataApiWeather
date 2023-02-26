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

  let currentTime;
  let curr, prev = 100, count; //since the distance wont be more than 100 because they are fixed
  const defaultArea = "Tampines";

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) { //used to determine closest marker between APIs
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
        const areasWeather = response.data.items[0].forecasts;
        const specAreaWeather = areasWeather.filter(areaW => areaW.area.toLowerCase() === search.toLowerCase());
        setLocation(specAreaWeather[0].area);
        setForecast(specAreaWeather[0].forecast);

        const timeStamp = response.data.items[0].timestamp
        const formattedTime = new Date(timeStamp).toLocaleString('en-GB');
        setTime(formattedTime);

        const weatherCoordinates = response.data.area_metadata;
        const specWCoordinates = weatherCoordinates.filter(areaC => areaC.name.toLowerCase() === search.toLowerCase());
        const wLatitude = specWCoordinates[0].label_location.latitude;
        const wLongitude = specWCoordinates[0].label_location.longitude;


        axios.get(urlRainfall)
        .then((response) => {
          const rainfall = response.data.items[0].readings;
  
          const rFCoordinates = response.data.metadata.stations;
          const allRFLatitude = rFCoordinates.map(rfc => rfc.location.latitude);
          const allRFLongitude = rFCoordinates.map(rfc => rfc.location.longitude);
          
          for(let i = 0; i < allRFLatitude.length; i++){
            curr = getDistanceFromLatLonInKm(wLatitude, wLongitude, allRFLatitude[i], allRFLongitude[i]);
            if(curr < prev){
              prev = curr;
              count = i;
            }
          }
          const rFLatitude = allRFLatitude[count];
          const rFLongitude = allRFLongitude[count];
          const specRFCoordinates = rFCoordinates.filter(rfc => rfc.location.latitude === rFLatitude && rfc.location.longitude === rFLongitude);
          const specRFCoordinatesID = specRFCoordinates[0].id;
          const specRFReading = rainfall.filter(rf => rf.station_id === specRFCoordinatesID);
          const specRainfall = specRFReading[0].value;
          setRf(specRainfall);
  
        })
        
      }).catch((error) => {
        console.log(error)
      });

      setSearch('')
    }
  }

  const justLoaded = () => {
    axios.get(urlWeather).then((response) => {
      const areasWeather = response.data.items[0].forecasts;
      const specAreaWeather = areasWeather.filter(areaW => areaW.area === defaultArea);
      setDefaultForecast(specAreaWeather[0].forecast);

      const weatherCoordinates = response.data.area_metadata;
      const defaultWCoordinates = weatherCoordinates.filter(areaC => areaC.name.toLowerCase() === defaultArea.toLowerCase());
      const defaultLatitude = defaultWCoordinates[0].label_location.latitude;
      const defaultLongitude = defaultWCoordinates[0].label_location.longitude;

      const timeStamp = response.data.items[0].timestamp
      const formattedTime = new Date(timeStamp).toLocaleString('en-GB');
      setTime(formattedTime);

      axios.get(urlRainfall)
      .then((response) => {
        const rainfall = response.data.items[0].readings;
  
        const rFCoordinates = response.data.metadata.stations;
        const allRFLatitude = rFCoordinates.map(rfc => rfc.location.latitude);
        const allRFLongitude = rFCoordinates.map(rfc => rfc.location.longitude);
        
        for(let i = 0; i < allRFLatitude.length; i++){
          curr = getDistanceFromLatLonInKm(defaultLatitude, defaultLongitude, allRFLatitude[i], allRFLongitude[i]);
          if(curr < prev){
            prev = curr;
            count = i;
          }
        }
        const rFLatitude = allRFLatitude[count];
        const rFLongitude = allRFLongitude[count];
        const specRFCoordinates = rFCoordinates.filter(rfc => rfc.location.latitude === rFLatitude && rfc.location.longitude === rFLongitude);
        const specRFCoordinatesID = specRFCoordinates[0].id;
        const specRFReading = rainfall.filter(rf => rf.station_id === specRFCoordinatesID);
        const specRainfall = specRFReading[0].value;
        setDefaultRF(specRainfall);
  
      })

    }).catch((error) => {
      console.log(error)
    });
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
