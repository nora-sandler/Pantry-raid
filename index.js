'use strict';

const apiKey = '6a8f8872dfcd40a3801e7a331e543a53'; 
const searchURL = 'https://api.spoonacular.com/recipes/findByIngredients';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  $('#js-error-message').html('');
  $('.results-js').html('');
  console.log(responseJson);
  // iterate through the items array
  for (let i = 0; i < responseJson.length; i++){
      $('.results-js').append(
        `<h3>${responseJson[i].title}</h3>
        <hr>`
      )
  };
  //display the results section  
  $('.results').removeClass('hidden');
};

function getRecipes(items, number=10) {
  const params = {
    apiKey: apiKey,
    ingredients: items,
    number
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val().replace(/\s/g, '');
    const limit = $('.js-max-results').val();
    getRecipes(searchTerm, limit);
  });
}

$(watchForm);