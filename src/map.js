// Initialize the map, centered at latitude and longitude coordinates for a global view
const map = L.map('map').setView([20, 0], 2);

//Navigation button
function toggleMenu() {
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.classList.toggle("active");
}

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let countryMarkers = []; // Array to hold country markers for easy access

// Fetch country data and add pins
async function addCountryPins() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    countries.forEach(country => {
      // Only add marker if lat/lng coordinates are available
      const latlng = country.latlng;
      if (!latlng) return;

      // Create a marker for the country
      const marker = L.marker(latlng).addTo(map);

      // Store marker data for search functionality
      countryMarkers.push({
        name: country.name.common,
        marker: marker,
      });

      // Display country information in a popup
      marker.bindPopup(`
        <h3>${country.name.common}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
        <p><strong>Currency:</strong> ${country.currencies ? Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol || ''})`).join(", ") : 'N/A'}</p>
        <img src="${country.flags?.png}" alt="Flag of ${country.name.common}" style="width: 100px; margin-top: 10px;">
      `);
    });
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

// Load the country pins on the map
addCountryPins();

// Search Functionality
function searchCountry() {
  const input = document.getElementById('countrySearch').value.toLowerCase().trim();

  // Loop through country markers and find a match
  countryMarkers.forEach(({ name, marker }) => {
    if (name.toLowerCase().includes(input)) {
      // Fly to the country's location and open popup
      map.flyTo(marker.getLatLng(), 5); // Adjust zoom level for closer view
      marker.openPopup();
    }
  });
}

