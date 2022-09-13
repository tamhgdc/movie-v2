import { useState, createContext } from 'react';

import setLocalStorage from '~/services';

const EpisodeContext = createContext();

function EpisodeProvider({ children }) {
    const [episode, setEpisode] = useState(0);

    const isWatchedEpisode = (id, episode) => {
        let watchedMovies = JSON.parse(localStorage.getItem('Watched-Movie')) || {};

        if (watchedMovies[id] && watchedMovies[id].watchedEpisodes.includes(episode)) {
            return true;
        }

        return false;
    };

    const handleSetEpisode = (id, name, episode) => {
        if (!isWatchedEpisode(id, episode)) {
            setLocalStorage(id, name, episode);
        }

        // if (Object.keys(authContext.user).length) {
        //     addWatchedMovie(
        //         {
        //             movie: movieContext.dataMovie.movie,
        //             episodes: movieContext.dataMovie.episodes,
        //             episode: episode,
        //             link: movieContext.dataMovie.episodes[0].server_data[episode].link_m3u8,
        //             slugEpisode: movieContext.dataMovie.episodes[0].server_data[episode].slug,
        //         },
        //         authContext.user.uid,
        //     );
        // }

        setEpisode(() => episode);
    };

    return <EpisodeContext.Provider value={{ episode, handleSetEpisode }}>{children}</EpisodeContext.Provider>;
}

export { EpisodeContext, EpisodeProvider };
