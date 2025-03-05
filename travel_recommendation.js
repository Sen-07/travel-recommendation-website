document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const clearButton = document.getElementById('clear-button');
  const resultsContainer = document.getElementById('results-container');

  async function fetchRecommendations() {
    try {
      const response = await fetch('travel_recommendation_api.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  function displayResults(results) {
    resultsContainer.innerHTML = '';
    results.forEach((item) => {
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('bg-white', 'rounded-xl', 'gap-4', 'w-full', 'flex', 'flex-col');
      resultDiv.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="w-full rounded-t-xl overflow-hidden"/>
        <h3 class="text-lg font-semibold pl-4">${item.name}</h3>
        <p class="font-medium text-gray-600 pl-4 mb-5">${item.description}</p>
      `;
      resultsContainer.appendChild(resultDiv);
    });
  }

  function searchRecommendations(keyword, data) {
    const searchKey = keyword.toLowerCase();
    let results = [];

    if (['beach', 'beaches'].includes(searchKey)) {
      results = data.beaches;
    } else if (['temple', 'temples'].includes(searchKey)) {
      results = data.temples;
    } else {
      data.countries.forEach((country) => {
        if (country.name.toLowerCase().includes(searchKey) || ['country', 'countries'].includes(searchKey)) {
          results = results.concat(country.cities);
        }
      });
    }

    displayResults(results);
  }

  searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) return;
      const data = await fetchRecommendations();
      if (data) {
        searchRecommendations(searchTerm, data);
      }
    }
  });

  searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;
    const data = await fetchRecommendations();
    if (data) {
      searchRecommendations(searchTerm, data);
    }
  });

  clearButton.addEventListener('click', () => {
    resultsContainer.innerHTML = '';
    searchInput.value = '';
  });
});
