import { useState, createContext } from 'react';

const MovieContext = createContext();

function MovieProvider({ children }) {
    const [dataMovie, setDataMovie] = useState({});

    const handleMovie = (movie) => {
        setDataMovie(() => movie);
    };

    return <MovieContext.Provider value={{ dataMovie, handleMovie }}>{children}</MovieContext.Provider>;
}

export { MovieProvider, MovieContext };
