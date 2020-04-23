'use strict';

const apiKey = '6a8f8872dfcd40a3801e7a331e543a53';
const youtubeKey = 'AIzaSyDHuEVNKKo0zxsLdo7ghUFrh0yIi6tdc-I';
const searchURL = 'https://api.spoonacular.com/recipes/findByIngredients';
const recipeInfoURL = 'https://api.spoonacular.com/recipes/'; //{id}/information + apiKey
const youtubeURL = 'https://www.googleapis.com/youtube/v3/search';

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
    for (let i = 0; i < responseJson.length; i++) {
        if (responseJson[i].missedIngredientCount > 0){
            $('.results-js').append(
                `<div class='displayRecipes'>
                <img class='top' src='${responseJson[i].image}'>
                <h3 class='top'>${responseJson[i].title}</h3>
                <div class = 'missed-ingredients-${responseJson[i].id}'>
                <h3 class = 'missed-ingredients-title'>Missed ingredients</h3>
                <ul>`);
            for (let n = 0; n < responseJson[i].missedIngredients.length; n++) {
                $(`.missed-ingredients-${responseJson[i].id}`).append(
                        `<li class='missed-ingredient-item'>${responseJson[i].missedIngredients[n].name}</li>`);
            }
            $('.results-js').append(
                `</ul></div>
                </div>
                <div class='buttons'>
                <button class = 'info' data-id="${responseJson[i].id}">Get More Info</button>
                <button class = 'video' data-title="${responseJson[i].title}">Get Video</button>
                <hr></div>`
            );
        }
    }
    //display the results section  
    $('.results').removeClass('hidden');
}

function getRecipeVideo(recipeName) {
    const videoURL = youtubeURL + '?part=snippet&maxResults=1&type=video&' + `q=${recipeName}&key=` + youtubeKey;

    console.log(videoURL);

    fetch(videoURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => openVideoWindow(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong getting info: ${err.message}`);
        });
}

function getRecipeInfo(recipeId) {
    const infoURL = recipeInfoURL + recipeId + '/information?apiKey=' + apiKey;

    console.log(infoURL);

    fetch(infoURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => openInfoWindow(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong getting info: ${err.message}`);
        });
}

function openInfoWindow(data) {
    window.open(data.sourceUrl, '_blank'); //_blank opens in new tab
}

function openVideoWindow(video) {
    console.log(video.items[0].id.videoId);
    window.open('https://www.youtube.com/watch?v=' + video.items[0].id.videoId, '_blank')
}

function getRecipes(items, number = 10) {
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
    $('body').on('click', '.info', e => {
        const id = $(e.target).data('id');
        getRecipeInfo(id);
    })
    $('body').on('click', '.video', e => {
        const title = $(e.target).data('title');
        getRecipeVideo(title);
    }) 
}

$(watchForm);