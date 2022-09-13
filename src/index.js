import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import GridStyles from '~/components/GridStyles';
import { MovieProvider } from '~/store/MovieContext';
import { PagesProvider } from '~/store/PagesContext';
import { EpisodeProvider } from '~/store/EpisodeContext';
import { AuthProvider } from '~/store/AuthContext';
import { SaveMovieProvider } from '~/store/SaveMovieContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <GlobalStyles>
        <GridStyles>
            <AuthProvider>
                <PagesProvider>
                    <MovieProvider>
                        <SaveMovieProvider>
                            <EpisodeProvider>
                                <App />
                            </EpisodeProvider>
                        </SaveMovieProvider>
                    </MovieProvider>
                </PagesProvider>
            </AuthProvider>
        </GridStyles>
    </GlobalStyles>,
    //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
