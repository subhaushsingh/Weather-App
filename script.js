const searchBtn = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const WeatherCardDiv = document.querySelector(".weather-cards");
const CurrentWeatherDiv = document.querySelector(".current-weather");

const locationBtn =  document.querySelector(".location-btn");

const API_KEY ="aee9a814e8175fc360e3126512106132";
;


const createWeatherCard = (cityName, weatherItem, index) => {
    if (index == 0) {
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
};

const WeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}`;
    fetch(WEATHER_API)
        .then(res => res.json())
        .then(data => {
            const UniqueForecastDays = new Set();
            const fiveDaysForecast = [];

            for (const forecast of data.list) {
                const forecastDate = new Date(forecast.dt_txt).toDateString();
                if (!UniqueForecastDays.has(forecastDate)) {
                    UniqueForecastDays.add(forecastDate);
                    fiveDaysForecast.push(forecast);
                }
                if (UniqueForecastDays.size === 5) break; 
            }

            
            WeatherCardDiv.innerHTML = "";
            CurrentWeatherDiv.innerHTML = "";

            
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    CurrentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                } else {
                    WeatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });
        })
        .catch(error => {
            alert("Error occurred while fetching the weather forecast!");
            console.error(error);
        });
};

function getCityCoordinates() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                return alert(`No coordinates found for ${cityName}`);
            }
            const { name, lat, lon } = data[0];
            WeatherDetails(name, lat, lon);
        })
        .catch(error => {
            alert("Error occurred while fetching the coordinates");
            console.error(error);
        });
}


const  getUserCoordinates = ()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const {latitude,longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL)
        .then(res => res.json())
        .then(data => {
            const {name} = data[0];
            WeatherDetails(name,latitude,longitude);
        })
        .catch(error => {
            alert("Error occurred while fetching the City!");
        });
        },
        error=>{
            if (error.code == error.PERMISSION_DENIED){
                alert("Location permission denied!");
            }
        }
    )
}


searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click",getUserCoordinates)