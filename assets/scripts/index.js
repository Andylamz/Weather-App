import { apiKey } from "./config.js";

// api key
// const apiKey = "56c56d3ba265425c9cd220405251405";
// button select
const locButton = document.querySelector(".loc-button");
// Today element select
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather img");
const todayTemp = document.querySelector(".weather-temp");
// Right side element select
const daysList = document.querySelector(".days-list");
const rainValue = document.querySelector(".rain-container>.value");
const humidityValue = document.querySelector(".humidity-container>.value");
const windValue = document.querySelector(".wind-container>.value");

// geolocation
navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const defaultLocation = `${lat},${lon}`;
  fetchWeatherData(defaultLocation);
});

//setting up short form for days
const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
// fetch Weather Data
async function fetchWeatherData(location = "london") {
  const locationUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=no&alerts=no`;
  try {
    const res = await fetch(locationUrl);
    if (!res.ok) throw new Error("Request Error!");
    const data = await res.json();
    const today = new Date();
    const { current, forecast, location } = data;
    const { forecastday } = forecast;
    daysList.innerHTML = "";
    let skipday = 0;
    console.log(location);
    const { country, name: city } = location;

    // Editing data on right side
    for (const item of forecastday) {
      const forecastDate = new Date(item.date);
      const day = forecastDate.getDay();
      const dayTemp = `${item.day.avgtemp_c}°C`;
      const iconCode = item.day.condition.icon;

      if (today.getDate() !== forecastDate.getDate()) {
        daysList.innerHTML += `
        <li>
        <img class="qi101 weather-icon" src="${iconCode}"></img>
        <span>${days[day]}</span>
        <span class="day-temp">${dayTemp}</span>
        </li>
        `;
      }
    }
    // Editing data on Left side (today)
    //  location
    const locationElement = document.querySelector(".today-info>div>span");
    locationElement.innerText = `${city}, ${
      country.split(" ").length > 1
        ? country
            .split(" ")
            .map((name) => name[0])
            .join("")
        : country
    }`;

    const getTodayCondition = current.condition.text;
    const todayIcon = current.condition.icon;
    const getTodayTemp = forecastday[0].day.avgtemp_c;
    const todayCondition = document.querySelector(".today-condition");
    console.log(forecastday[0], current);
    // day
    todayInfo.querySelector("h1").innerText = days[today.getDay()];
    // full date
    todayInfo.querySelector("span").innerText = today.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    // today info
    todayWeatherIcon.src = todayIcon;
    todayTemp.innerText = getTodayTemp;
    todayCondition.innerText = getTodayCondition;
    console.log(windValue);
    windValue.innerHTML = `${current["wind_mph"]} mph`;
    humidityValue.innerHTML = `${current.humidity} %`;
    rainValue.innerHTML = `${forecastday[0]["day"]["daily_chance_of_rain"]} %`;

    return data;
  } catch (err) {
    return console.log(err);
  }
}
// run callback when page is loaded - first Render
document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "london";
  //   fetchWeatherData(defaultLocation);
});

// fetchWeatherData(defaultLocation);

locButton.addEventListener("click", () => {
  const location = prompt("Enter your city");
  if (!location) return;

  fetchWeatherData(location);
});
