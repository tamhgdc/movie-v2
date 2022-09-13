import { useState, createContext } from 'react';

export const PagesContext = createContext();

function PagesProvider({ children }) {
    const [dataPage, setDataPage] = useState([]);

    return <PagesContext.Provider value={{ dataPage, setDataPage }}>{children}</PagesContext.Provider>;
}

export { PagesProvider };
