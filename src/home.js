// Function to fetch and display multiple flags in a single row on the welcome page
function displayMultipleFlags() {
  const countryNames = ['Malaysia', 'Palestine', 'Canada', 'Saudi Arabia', 'Turkey', 'Argentina', 'France', 'Japan' ,'Germany']; // Example countries
  const flagsRow = document.getElementById('flagsRow');
  flagsRow.innerHTML = ''; 

  countryNames.forEach(countryName => {
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          const flagUrl = data[0].flags.svg || data[0].flags.png;

          const flagImg = document.createElement('img');
          flagImg.src = flagUrl;
          flagImg.alt = `Flag of ${data[0].name.common}`;

          flagsRow.appendChild(flagImg);
        }
      })
      .catch(error => {
        console.error(`Error fetching flag for ${countryName}:`, error);
      });
  });
}

window.onload = function() {
  displayMultipleFlags();
};
