const dropDown = document.querySelector('.dropdownMenu');
const dropOptions = document.querySelector('.drop-options');  
const toggle = document.querySelector('.toggle');
const icon = document.querySelector('.bx');  
const countries = document.querySelector('.countries');
const search = document.querySelector('.search');
const regions = document.querySelectorAll('.regions');

//Navigation button
function toggleMenu() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("active");
}

dropDown.addEventListener('click', () => {
  dropOptions.classList.toggle('show-option');
});

async function getCountries() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();
  console.log(data);
  data.forEach(countryData => {
    showCountry(countryData);
  });
}

getCountries();

function showCountry(data) {
  const country = document.createElement('div');
  country.classList.add('country');

  const name = data.name?.common || 'Unknown';
  const flag = data.flags?.png || '';
  const coatOfArms = data.coatOfArms?.png || '';
  const region = data.region || 'N/A';
  const capital = data.capital?.[0] || 'N/A';
  const languages = data.languages ? Object.values(data.languages).join(", ") : 'N/A';
  const timezones = data.timezones ? data.timezones.join(", ") : 'N/A';
  const mapLink = data.maps?.googleMaps || '#';
  const population = data.population ? data.population.toLocaleString() : 'N/A';
  const area = data.area ? data.area.toLocaleString() : 'N/A';
  const continent = data.continents?.[0] || 'N/A';
  const subregion = data.subregion || 'N/A';
  const currencies = data.currencies ? Object.values(data.currencies).map(currency => `${currency.name} (${currency.symbol || ''})`).join(", ") : 'N/A';

  country.innerHTML = `
    <div class="country-img">
      <div class="country-details">
        <h5 class="countryName">${name}</h5>
      </div>
      <img src="${flag}" alt="Flag of ${name}">
      ${coatOfArms ? `<div class="coat-of-arms"><p><strong>Coat of Arms:</strong></p><img src="${coatOfArms}" alt="Coat of Arms of ${name}"></div>` : ''}
    </div>
    <div class="country-details">
      <p><strong>Population:</strong> ${population}</p>
      <p class="regionName"><strong>Region:</strong> ${region}</p>
      <p><strong>Subregion:</strong> ${subregion}</p>
      <p><strong>Continent:</strong> ${continent}</p>
      <p><strong>Area:</strong> ${area} km²</p>
      <p><strong>Capital city:</strong> ${capital}</p>
      <p><strong>Languages:</strong> ${languages}</p>
      <p><strong>Timezones:</strong> ${timezones}</p>
      <p><strong>Currency:</strong> ${currencies}</p>
      <p><strong>Location:</strong> <a href="${mapLink}" target="_blank">View on Map</a></p>
    </div>
  `;
  
  countries.appendChild(country);
}

const countryName = document.getElementsByClassName('countryName');
search.addEventListener('input', e => {
  Array.from(countryName).forEach(country => {
    if (country.innerText.toLowerCase().includes(search.value.toLowerCase())) {
      country.parentElement.parentElement.style.display = "grid";
    } else {
      country.parentElement.parentElement.style.display = "none";
    }
  });
});

search.addEventListener('input', e => {
  const searchTerm = search.value.toLowerCase().trim();

  Array.from(countryName).forEach(country => {
    const countryContainer = country.closest('.country');
    if (country.innerText.toLowerCase().includes(searchTerm)) {
      countryContainer.style.display = "grid";
    } else {
      countryContainer.style.display = "none";
    }
  });
});

const regionName = document.getElementsByClassName('regionName');
regions.forEach(region => {
  region.addEventListener('click', e => {
    Array.from(regionName).forEach(element => {
      if (element.innerText.includes(region.innerText) || region.innerText === "All") {
        element.parentElement.parentElement.style.display = "grid";
      } else {
        element.parentElement.parentElement.style.display = "none";
      }
    });
  });
});
