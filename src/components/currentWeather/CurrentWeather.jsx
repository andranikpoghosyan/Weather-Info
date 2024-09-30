import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CurrentWeather.scss";

const API_KEY = import.meta.env.VITE_API_KEY;

function CurrentWeather({ location, unit }) {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Yerevan");

  useEffect(() => {
    if (location) {
      fetchWeatherByCoordinates(location.lat, location.lon);
    } else {
      fetchWeatherByCity(city);
    }
  }, [location, unit]);

  const fetchWeatherByCoordinates = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      alert("Error fetching weather data");
    }
  };

  const fetchWeatherByCity = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      alert("City not found");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherByCity(city);
    }
  };

  return (
    <div className="current-weather">
      {weatherData && (
        <div className="current_city_weather">
          <h2>{weatherData.name}</h2>
          <h3>
            {Math.trunc(weatherData.main.temp)}° {unit == "metric" ? "C" : "F"}
          </h3>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>{weatherData.weather[0].description.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}

export default CurrentWeather;
