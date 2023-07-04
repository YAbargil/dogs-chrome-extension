import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.css";

interface Weather {
  city: string;
  region: string;
  celsius: number;
  condition: string;
  conditionImage: string;
}

//to do - api should be placed as as enviroment variable
const API_KEY = "aa39bfc09a6445cea7291709230307";

const formatWeather = (
  celsuis: number,
  condition: string,
  city: string,
  region: string
) => {
  return (
    <div>
      <p>
        {celsuis}
        <sup>O</sup> C{" , " + condition}
      </p>
      <p>
        {city},{region}
      </p>
    </div>
  );
};

export default function Weather() {
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    //getting current lat&long
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // const locationResponse = await axios.get(
      //   `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
      // );
      // console.log(data.city, data.countryName);
      const { data } = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=8`
      );
      setWeather({
        city: data.location.name,
        region: data.location.region,
        celsius: data.current.temp_c,
        condition: data.current.condition.text,
        conditionImage: "https:" + data.current.condition.icon,
      });
    });
  }, []);

  return (
    <div className="weather">
      {!weather ? (
        <h3>Loading ... </h3>
      ) : (
        <div>
          <img src={weather?.conditionImage} alt="weather-img"></img>
          {formatWeather(
            weather?.celsius,
            weather?.condition,
            weather?.city,
            weather?.region
          )}
        </div>
      )}
    </div>
  );
}
