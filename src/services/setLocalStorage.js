function setLocalStorage(id, name, episode) {
    let watchedMovies = JSON.parse(localStorage.getItem('Watched-Movie')) || {};

    if (watchedMovies[id]) {
        watchedMovies[id].watchedEpisodes = [...watchedMovies[id].watchedEpisodes, episode];
    } else {
        watchedMovies[id] = {
            name,
            watchedEpisodes: [episode],
        };
    }

    localStorage.setItem('Watched-Movie', JSON.stringify(watchedMovies));
}

export default setLocalStorage;
