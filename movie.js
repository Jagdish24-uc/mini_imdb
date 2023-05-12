
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('imdbID');

    fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=bf8c3398`)
      .then(response => response.json())
      .then(movie => {
        const movieDetails = document.querySelector('#movie-details');
        movieDetails.innerHTML = `
          <div class="row">
            <div class="col-md-4">
              <img src="${movie.Poster}" alt="${movie.Title}">
            </div>
            <div class="col-md-8">
              <h2>${movie.Title}</h2>
              <p><strong>Year:</strong> ${movie.Year}</p>
              <p><strong>Genre:</strong> ${movie.Genre}</p>
              <p><strong>Director:</strong> ${movie.Director}</p>
              <p><strong>Actors:</strong> ${movie.Actors}</p>
              <p><strong>Plot:</strong> ${movie.Plot}</p>
              <p><strong>Rated:</strong> ${movie.Rated}</p>
              <p><strong>imdbRating:</strong> ${movie.imdbRating}</p>
              <p><strong>Awards:</strong> ${movie.Awards}</p>
              <p><strong>Country:</strong> ${movie.Country}</p>
              
              
              
              
                  
               
              
            </div>
          </div>
        `;
      })
      .catch(error => console.error(error));