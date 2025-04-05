const API_KEY = "fadd2a74bfc8b691f2ce14cfbc9a0a02";

async function fetchWeather(lat, lon) {
    try {
        // Fetch current weather
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const weatherData = await weatherResponse.json();

        // Fetch air pollution data
        const airResponse = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const airData = await airResponse.json();

        // Fetch 5-day forecast (We will extract 7 days from this)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        updateWeatherUI(weatherData, airData, forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(weatherData, airData, forecastData) {
    // Update Current Weather
    document.getElementById("city").innerText = weatherData.name;
    document.getElementById("temperature").innerText = `${Math.round(weatherData.main.temp)}°C`;
    document.getElementById("condition").innerText = weatherData.weather[0].description;
    document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;

    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

    // Update Air Quality Values
    const airComponents = airData.list[0].components;
    document.getElementById("co").innerText = `${airComponents.co} μg/m³`;
    document.getElementById("no").innerText = `${airComponents.no} μg/m³`;
    document.getElementById("no2").innerText = `${airComponents.no2} μg/m³`;
    document.getElementById("o3").innerText = `${airComponents.o3} μg/m³`;
    document.getElementById("so2").innerText = `${airComponents.so2} μg/m³`;
    document.getElementById("pm2_5").innerText = `${airComponents.pm2_5} μg/m³`;
    document.getElementById("pm10").innerText = `${airComponents.pm10} μg/m³`;
    document.getElementById("nh3").innerText = `${airComponents.nh3} μg/m³`;

    // Update 7-Day Forecast
    updateForecastUI(forecastData);
}

function updateForecastUI(forecastData) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Clear previous forecast data

    let dailyForecast = {};

    // Extract only one forecast entry per day (at 12:00 PM)
    forecastData.list.forEach((entry) => {
        const date = new Date(entry.dt_txt);
        const day = date.toDateString(); // Convert to readable date

        if (!dailyForecast[day] && date.getHours() === 12) {
            dailyForecast[day] = {
                temp: entry.main.temp,
                icon: entry.weather[0].icon,
                description: entry.weather[0].description,
            };
        }
    });

    // Get the next 7 days from the extracted forecast
    Object.keys(dailyForecast).slice(0, 7).forEach((day) => {
        let data = dailyForecast[day];

        const forecastElement = document.createElement("div");
        forecastElement.classList.add("forecast-day");

        forecastElement.innerHTML = `
            <h4>${new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</h4>
            <img src="https://openweathermap.org/img/wn/${data.icon}.png">
            <p>${Math.round(data.temp)}°C</p>
            <p>${data.description}</p>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}

// Get user location and fetch weather
document.addEventListener("DOMContentLoaded", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => alert("Enable location for accurate weather data.")
    );
});