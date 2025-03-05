document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const countryList = document.getElementById('country-list');

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            let countries = data;
            displayCountries(countries);

            searchBar.addEventListener('input', () => {
                const searchQuery = searchBar.value.toLowerCase();
                const filteredCountries = countries.filter(country =>
                    country.name.common.toLowerCase().includes(searchQuery)
                );
                displayCountries(filteredCountries);
            });
        });

    function formatDateTime(timezone) {
        // Check if the timezone is valid; if not, default to 'UTC'
        const validTimezone = timezone ? timezone : 'UTC';

        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: validTimezone
        };

        const date = new Date();
        let formatted = date.toLocaleString('en-GB', options);
        
        // Add ordinal suffix to day
        const day = date.getDate();
        const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day - day % 10 !== 10) * (day % 10)];
        
        // Replace the day number with day + suffix
        formatted = formatted.replace(/(\d+)/, day + suffix);
        
        // Format the date to "5th Mar 2025, 13:16"
        const [datePart, timePart] = formatted.split(', ');
        const formattedDate = `${datePart}, ${timePart}`; // Combine date and time with a comma
        return formattedDate;
    }

    function displayCountries(countries) {
        countryList.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('col-12', 'mb-4');
            const timezone = country.timezones ? country.timezones[0].replace('UTC', '').replace(':', '') : ''; // Keep it empty if not valid
            const currentDateTime = formatDateTime(timezone);
            
            countryCard.innerHTML = `
                <div class="card custom-card">
                    <div class="card-body d-flex">
                        <div class="flex-fill d-flex justify-content-center align-items-center">
                            <img src="${country.flags.png}" alt="${country.name.common}" class="w-100" />
                        </div>
                        <div class="col-7 d-flex flex-column">
                            <div style="margin-left: 10px;">
                                <h5 class="card-title">${country.name.common || 'N/A'}</h5>
                                <p class="card-text mb-1">Currency: ${country.currencies ? Object.values(country.currencies)[0].name : 'N/A'} (${country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A'})</p>
                                <p class="card-text">Current date and time: <span>${currentDateTime}</span></p>
                            </div>
                            <div class="mt-auto">
                                <button class="btn btn-primary btn-sm mr-2" onclick="showMap('${country.maps.googleMaps}')"><strong>Show Map</strong></button>
                                <button class="btn btn-secondary btn-sm" onclick="showDetails('${country.cca3}')"><strong>Details</strong></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            countryList.appendChild(countryCard);
        });
    }
});

function showMap(mapUrl) {
    window.open(mapUrl, '_blank');
}

function showDetails(cca3) {
    window.location.href = `detail.html?country=${cca3}`;
}