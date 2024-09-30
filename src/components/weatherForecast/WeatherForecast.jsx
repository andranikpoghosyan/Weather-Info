import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherForecast.scss";
import dayjs from "dayjs";

const API_KEY = import.meta.env.VITE_API_KEY;

function WeatherForecast({ location, unit }) {
  const [forecastData, setForecastData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (location) {
      fetchForecast(location.lat, location.lon);
    }
  }, [location, unit]);

  const fetchForecast = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
      const response = await axios.get(url);

      const filteredForecast = filterDailyForecasts(response.data.list);
      setForecastData(filteredForecast);

      if (filteredForecast.length > 0) {
        setSelectedDay(filteredForecast[0]);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const filterDailyForecasts = (list) => {
    const noonForecasts = list.filter((item) => {
      const date = new Date(item.dt_txt);
      return date.getHours() === 12;
    });
    return noonForecasts.slice(0, 5);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast_days">
        {forecastData.map((day) => (
          <div
            className={`day_container ${selectedDay == day ? "selected" : ""}`}
            key={day.dt}
            onClick={() => handleDayChange(day)}
          >
            <p>{dayjs(day.dt_txt).format("M/D/YYYY")}</p>
            <h3>
              {Math.trunc(day.main.temp)}° {unit == "metric" ? "C" : "F"}
            </h3>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              className="weather_icon_img"
              alt="weather icon"
            />
            <small>{day.weather[0].description}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherForecast;
