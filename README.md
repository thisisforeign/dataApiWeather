# dataApiWeather

![image](https://user-images.githubusercontent.com/109660863/222370342-16bced87-cecc-42aa-bfef-9afc7b48d0c3.png)
![image](https://user-images.githubusercontent.com/109660863/222735083-1f78a597-889e-430a-9d5a-58d6d7a403fc.png)
![image](https://user-images.githubusercontent.com/109660863/222735111-3129c9c3-273d-4568-b49c-e1312098cd44.png)



For vulnerability issues: https://github.com/facebook/create-react-app/issues/11174

Received a Error: error:0308010C:digital envelope routines::unsupported and couldn't find a fix besides: https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported

Due to the rainfall api having more markers than the forecast api, there were multiple rainfall markers close to a singular forecast api. For example, the Choa Chu Kang marker in the forecast api has 3 simingly equidistant markers. So I wanted to find the closest markers and found out about haversine formula: https://stackoverflow.com/questions/50882413/comparing-the-distance-between-multiple-points
https://www.youtube.com/watch?v=g8jcRkMVfHM&t=334s

Added specRFCoordinatesID = specRFCoordinates[0].id; to justLoaded() cause this error appears randomly: typeerror: cannot read properties of undefined (reading 'id') at array.filter (<anonymous>)

Encountered issues with calling wLatitude and wLongitude from the weather api to the rainfall api as in the rainfall api call, the variables would sometimes show undefined. Therefore, placed the 2nd call inside the 1st call so it would only execute after the first call.
