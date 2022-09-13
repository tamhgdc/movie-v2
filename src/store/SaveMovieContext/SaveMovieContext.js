import { useState, createContext } from 'react';

const SaveMovieContext = createContext();

function SaveMovieProvider({ children }) {
    const [saveMovies, setSaveMovies] = useState([]);

    return <SaveMovieContext.Provider value={{ saveMovies, setSaveMovies }}>{children}</SaveMovieContext.Provider>;
}

const isSavedMovie = (saveMovies, { movie }) => {
    //console.log(removeVietnameseTones(saveMovies));
    //console.log(typeof saveMovies);
    console.log(saveMovies);
    if (saveMovies === 'you have not saved any movies yet') {
        return false;
    }

    for (let i = 0; i < saveMovies.length; i++) {
        if (saveMovies[i].movie._id === movie._id) {
            return true;
        }
    }

    return false;
};

const findIndexMovieInSaveMovies = (saveMovies, { movie }) => {
    if (saveMovies === 'you have not saved any movies yet') {
        return -1;
    }

    for (let i = 0; i < saveMovies.length; i++) {
        if (saveMovies[i].movie._id === movie._id) {
            return i;
        }
    }

    return -1;
};

export { SaveMovieContext, SaveMovieProvider, isSavedMovie, findIndexMovieInSaveMovies };
