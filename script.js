//creates a constant variable  searchInput, resultsDiv  that references the input element, div element  with an ID of search, result.
const searchInput = document.querySelector('#search');
const resultsDiv = document.querySelector('#results');
//This creates a constant variable favorites that is assigned the value returned from parsing the string value of the 'favorites' key in localStorage, or an empty array if no value is found.
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];


function removeFavorite(imdbID) {
  const index = favorites.findIndex(movie => movie.imdbID === imdbID);//This creates a constant variable index that is assigned the index of the movie with the specified imdbID in the favorites array. The findIndex() method is used to search the array for the first movie that meets the condition specified in the arrow function.
  if (index !== -1) {                                                 //This checks if the index variable is not equal to -1, which indicates that a movie with the specified imdbID was found in the favorites array.
    favorites.splice(index, 1);                                       //This removes the movie 
    
    localStorage.setItem('favorites', JSON.stringify(favorites));     //This updates the value of the 'favorites' key in localStorage t
  }}

function renderFavorites(favorites) {
  const favoritesList = document.getElementById('favorites-list');

  // Clear any existing favorites from the list
  favoritesList.innerHTML = '';

  // Loop through the favorites array and create a new list item for each movie
  favorites.forEach(movie => {
    const li = document.createElement('li');
    li.className = 'list-group-item';

    // Create an image element for the movie poster
    const poster = document.createElement('img');
    if (movie.Poster !== 'N/A') {
      poster.src = movie.Poster;
      poster.alt = `${movie.Title} poster`;
    } else {
      poster.src = 'default_poster.jpg';
      poster.alt = `No poster available for ${movie.Title}`;
    }

    // Create a span element for the movie title
    const title = document.createElement('span');
    title.className = 'movie-title';
    title.textContent = movie.Title;

    // Create a delete button element
    const button = document.createElement('button');
    button.className = 'btn btn-outline-danger btn-sm float-right';
    button.innerHTML = '<i class="fas fa-trash-alt"></i>';

    // Add an event listener to the delete button
    button.addEventListener('click', () => {
      removeFavorite(movie.imdbID);
      renderFavorites(favorites);
    });

    // Append the poster image, title span, and delete button to the list item
    li.appendChild(poster);
    li.appendChild(title);
    li.appendChild(button);

    // Append the list item to the favorites list
    favoritesList.appendChild(li);
  });}

function addFavorite(movie) {
  //The find() method is used to search the array for the first movie that meets the condition specified in the arrow function.
  const existing = favorites.find(f => f.imdbID === movie.imdbID);
  //This checks if the existing variable is truthy the function returns without adding the new movie to the array.
  if (existing) {
    return;
  }

  //This adds the movie object to the end of the favorites array using the push() method.
  favorites.push(movie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  //This calls to update the list of favorite movies in the HTML.
  renderFavorites(favorites);
  }

searchInput.addEventListener('input', () => {
      //to update the list of favorite movies
      renderFavorites(favorites);
      // the search term from the input field, trims any whitespace, and converts it to lowercase for consistency
      const searchTerm = searchInput.value.trim().toLowerCase();
      //It checks if the search term is not empty
      if (searchTerm.length > 0) {
        //fetch request to the OMDb API to search for movies
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=bf8c3398`) 
          .then(response => response.json())
          .then(data => {
            //checks if the response from the OMDB API is successful or not
            if (data.Response === "True") {
              const movies = data.Search;
              resultsDiv.innerHTML = '';
              //iterates over the movies array, the loop creates a new div element to display the movie's information.
              movies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('card', 'mb-3');
                movieDiv.innerHTML = `
                  <div class="row no-gutters">
                    <div class="col-md-4">
                    <!-- When the user clicks on this link, it will take them to the movie.html page and display the movie details for the selected imdbID.-->
                      <a href="movie.html?imdbID=${movie.imdbID}">
                        <img src="${movie.Poster}" class="card-img" alt="${movie.Title}">
                      </a>
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <p class="card-text">${movie.Year}</p>
                        <i class="fa fa-heart"></i>
                      </div>
                      
                    </div>
                  </div>
                `;
                resultsDiv.appendChild(movieDiv);
                const heartIcon = movieDiv.querySelector('.fa-heart');
                //This code block adds an event listener to the heart icon of each movie card
                heartIcon.addEventListener('click', event => {
                                const favoriteMovie = {
                                        Title: movie.Title,
                                        Year: movie.Year,
                                        imdbID: movie.imdbID,
                                        Poster:movie.Poster
                                      };
                         //console.log(favoriteMovie);
                  addFavorite(favoriteMovie);
                });
              });
            } else {
              resultsDiv.innerHTML = '<p>No results found</p>';
            }
          })
          .catch(error => console.error(error));
      } else {
        resultsDiv.innerHTML = '';

      }
    });