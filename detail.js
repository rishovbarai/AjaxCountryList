document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('country');
    const countryName = document.getElementById('country-name');
    const countryFlag = document.getElementById('country-flag');
    const countrySmallFlag = document.getElementById('country-small-flag');
    const countryNativeName = document.getElementById('country-native-name');
    const countryTld = document.getElementById('country-tld');
    const countryCapital = document.getElementById('country-capital');
    const countryRegion = document.getElementById('country-region');
    const countrySubregion = document.getElementById('country-subregion');
    const countryLanguages = document.getElementById('country-languages');
    const countryLatlng = document.getElementById('country-latlng');
    const countryArea = document.getElementById('country-area');
    const countryDemonyms = document.getElementById('country-demonyms');
    const countryCurrency = document.getElementById('country-currency');
    const countryTime = document.getElementById('country-time');
    const countryPopulation = document.getElementById('country-population');
    const borderCountries = document.getElementById('border-countries');
    const loader = document.createElement('div'); // Create a loader element
    loader.textContent = 'Loading country details...'; // Loader message
    loader.classList.add('loader'); // Add a class for styling
    document.body.appendChild(loader); // Append loader to the body

    fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            
            if (countryName) countryName.textContent = country.name.common;
            if (countryFlag) countryFlag.src = country.flags.png;
            if (countrySmallFlag) countrySmallFlag.src = country.flags.png;
            if (countryNativeName) countryNativeName.textContent = country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A';
            if (countryTld) countryTld.textContent = country.tld ? country.tld.join(', ') : 'N/A';
            if (countryCapital) countryCapital.textContent = country.capital ? country.capital.join(', ') : 'N/A';
            if (countryRegion) countryRegion.textContent = country.region || 'N/A';
            if (countrySubregion) countrySubregion.textContent = country.subregion || 'N/A';
            if (countryLanguages) countryLanguages.textContent = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            if (countryLatlng) countryLatlng.textContent = country.latlng ? country.latlng.join(', ') : 'N/A';
            if (countryArea) countryArea.textContent = country.area ? country.area.toLocaleString() : 'N/A';
            if (countryDemonyms) countryDemonyms.textContent = country.demonyms?.eng ? `${country.demonyms.eng.m} / ${country.demonyms.eng.f}` : 'N/A';
            
            const currencyInfo = country.currencies ? Object.values(country.currencies)[0] : null;
            if (countryCurrency) countryCurrency.textContent = currencyInfo ? `${currencyInfo.name} (${currencyInfo.symbol || 'N/A'})` : 'N/A';
            
            if (countryTime) countryTime.textContent = country.timezones ? country.timezones[0] : 'N/A';
            if (countryPopulation) countryPopulation.textContent = country.population ? country.population.toLocaleString() : 'N/A';

            if (country.borders && country.borders.length) {
                const borderPromises = country.borders.map(border =>
                    fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                        .then(response => response.json())
                        .then(data => data[0])
                        .catch(error => {
                            console.error(`Failed to fetch border country: ${border}`, error);
                            return null;
                        })
                );
                
                Promise.all(borderPromises)
                    .then(neighbors => {
                        neighbors
                            .filter(neighbor => neighbor !== null)
                            .forEach(neighbor => {
                                const neighborCard = document.createElement('div');
                                neighborCard.classList.add('col-md-4', 'mb-4');
                                
                                neighborCard.innerHTML = `
                                    <a href="detail.html?country=${neighbor.cca3}" class="text-decoration-none">
                                        <img src="${neighbor.flags.png}" alt="${neighbor.name.common}" class="img-fluid" style="height: 200px; width: 300px; object-fit: cover;" />
                                    </a>
                                `;
                                borderCountries.appendChild(neighborCard);
                            });
                    })
                    .catch(error => console.error('Error fetching border countries:', error));
            } else {
                const noNeighborsMsg = document.createElement('div');
                noNeighborsMsg.classList.add('col-12');
                noNeighborsMsg.innerHTML = '<p>This country has no neighboring countries.</p>';
                borderCountries.appendChild(noNeighborsMsg);
            }
        })
        .catch(error => {
            console.error('Error fetching country details:', error);
            if (countryName) countryName.textContent = 'Error loading country details';
        })
        .finally(() => {
            document.body.removeChild(loader); // Remove loader after fetching is done
        });
});