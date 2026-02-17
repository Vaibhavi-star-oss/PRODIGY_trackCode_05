const apiKey = "4752379619c1d634bef912247d3a63e9";

const currentLocationBtn = document.getElementById('currentLocationBtn');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorDiv = document.getElementById('error');

async function fetchWeather(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        
        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);

    } catch (error) {
        weatherInfo.style.display = 'none';
        errorDiv.textContent = "❌ " + error.message;
    }
}


function displayWeather(data) {
    document.getElementById('locationName').textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById('temp').textContent =
        Math.round(data.main.temp) + " °C";

    document.getElementById('weatherCondition').textContent =
        data.weather[0].description;

    document.getElementById('hum').textContent =
        data.main.humidity + "%";

    document.getElementById('windSpeed').textContent =
        data.wind.speed + " m/s";

    weatherInfo.style.display = 'block';
    errorDiv.textContent = "";
}


currentLocationBtn.addEventListener('click', () => {

    if (!navigator.geolocation) {
        errorDiv.textContent = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            fetchWeather(url);
        },
        () => errorDiv.textContent = "Location permission denied"
    );
});


searchBtn.addEventListener('click', () => {

    const city = cityInput.value.trim();

    if (!city) {
        errorDiv.textContent = "Enter city name";
        return;
    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetchWeather(url);
});

cityInput.addEventListener('keydown', e => {
    if (e.key === "Enter") searchBtn.click();
});
