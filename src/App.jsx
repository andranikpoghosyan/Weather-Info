import React, { useState, useEffect } from "react";
import CurrentWeather from "./components/currentWeather/CurrentWeather.jsx";
import WeatherForecast from "./components/weatherForecast/WeatherForecast.jsx";
import "./App.scss";

function App() {
  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.coord) {
        setLocation({ lat: data.coord.lat, lon: data.coord.lon });
        setError("");
      } else {
        setError("City not found");
        alert(`City not found!`);
      }
    } catch (error) {
      console.error("Error fetching the weather data:", error);
      setError("An error occurred while fetching the weather data");
    }
  };

  const handleUnitToggle = () => {
    setUnit(unit == "metric" ? "imperial" : "metric");
  };

  return (
    <div className="Container">
      <div className="unit_toggle">
        <form onSubmit={handleSearch} className="search_form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="city_input"
          />
          <button type="submit" className="search_btn">
            Search
          </button>
        </form>
        <button className="toggle_button" onClick={handleUnitToggle}>
          Switch to {unit == "metric" ? "°F" : "°C"}
        </button>
      </div>

      <div className="app_container">
        <CurrentWeather location={location} unit={unit} />
        <WeatherForecast location={location} unit={unit} />
      </div>
    </div>
  );
}

export default App;
