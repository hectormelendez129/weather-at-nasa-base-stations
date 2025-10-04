// Define const
// NASA Facilities JSON (via CORS proxy) Maureen, Leeanne, Godwin
// No API-key needed for nasa station url
const nasaStationsUrl = 'https://corsproxy.io/?url=https://data.nasa.gov/docs/legacy/gvk9-iz74.json'

// OpenWeather API key
const weatherApiKey = 'd23e009d9e3c420522a7d9b1300082d7';

// Initialize Leaflet map reference: leafletjs.com
const map = L.map('map').setView([37.0, -95.0], 4);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Fetch NASA stations first

fetch(nasaStationsUrl)
    .then(response => response.json())
    .then(data => {
        const stations = data; //Nasa Station data

        stations.forEach(station => {
            const lat = station.location.latitude;
            const lng = station.location.longitude;

            // Add station marker / map balloons
            const marker = L.marker([lat, lng]).addTo(map);

            // Fetch weather for this location
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${weatherApiKey}`;

            fetch(weatherUrl)
                .then(res => res.json())
                .then(weather => {
                    //for station marker / map balloon information
                    const popupContent = `
                        <strong>${station.center}</strong><br>
                        Facility: ${station.facility}<br>
                        City: ${station.city}, ${station.state}, ${station.country}<br>
                        Weather: ${weather.weather[0].description}, ${weather.main.temp}°F
                    `;
                    marker.bindPopup(popupContent);

                    console.log(popupContent);
                })
                .catch(err => {
                    console.error('Weather fetch error:', err);
                    marker.bindPopup(`<b>${station.center}</b><br>Weather data unavailable.`);
                });
        });
    })
    .catch(err => console.error('NASA fetch error:', err));
