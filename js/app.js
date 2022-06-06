const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                '../sw.js',
                {
                    scope: '/',
                }
            );
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};
registerServiceWorker();

const unsplashKey = 'uV_hCkvT1PJ2ztuDuinu1mWtZ6t4yKr7YhokjyRqF2Q'

async function getImage(city, weather) {
    var query = `${city} ${weather}`
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashKey}`;

    const response = await fetch(url);
    const image = await response.json();
    const back = image.results[0].urls.regular;

    const container = document.querySelector('.container');
    container.setAttribute('style', 'black')
    container.setAttribute('style', `background-image: url(${back})`);
}

function formatDate(timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    if (hours < 10) {
        hours = `${hours}`;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `=0${minutes}`;
    }
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
    var date = new Date(timestamp * 1000);
    var day = date.getDay();
    var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function displayForecast(response) {
    var forecast = response.data.daily;
    var forecastElement = document.querySelector("#forecast");

    var forecastHTML = `<div class="row">`;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            forecastHTML = forecastHTML + `
                        <div class="weatherSpace">
                            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
                            <div class="weather-forecast-temperatures">
                            <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}°</span>
                            <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}°</span>
                            </div>
                        </div>`;
        }
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    var apiKey = "f0609f63f731d925b48ee6c1654f8169";
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
    var temperatureElement = document.querySelector("#temperature");
    var cityElement = document.querySelector("#city");
    var descriptionElement = document.querySelector("#description");
    var windElement = document.querySelector("#wind");
    var dateElement = document.querySelector("#date");
    var iconElement = document.querySelector("#icon");

    var celsiusTemperature = response.data.main.temp;

    temperatureElement.innerHTML = Math.round(celsiusTemperature);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);
    getEvents(response.data.name);
    getForecast(response.data.coord);
}

function search(city) {
    var apiKey = "f0609f63f731d925b48ee6c1654f8169";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
    getImage(city, 'sunny');
}

function handleSubmit(event) {
    event.preventDefault();
    var cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

var form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Oslo");


const tmKey = 'AllGA1UdHqmhLwQMpfz1OG5MhedGWG2a';

async function getEvents(city) {
    const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?city=[${city}]&apikey=${tmKey}`;
    const response = await fetch(tmUrl);
    const results = await response.json();
    const events = results._embedded.events;

    events.forEach(event => {
        const container = document.getElementById('program')

        const eventCard = document.createElement('div');
        eventCard.classList.add('card')
        const eventCover = document.createElement('img');
        eventCover.setAttribute('src', event.images[0].url);
        eventCover.classList.add('event-cover');
        eventCard.append(eventCover);

        const eventName = document.createElement('h3');
        eventName.textContent = event.name;
        eventCard.append(eventName);

        container.append(eventCard);
    });
}
