import Home from '~/pages/Home';
import Movie from '~/pages/Movie';
import List from '~/pages/List';

import config from '~/config';

const publicRoutes = [
    {
        id: 1,
        path: config.routes.home,
        component: Home,
    },
    {
        id: 2,
        path: config.routes.movie,
        component: Movie,
    },
    {
        id: 3,
        path: config.routes.list,
        component: List,
    },
    {
        id: 4,
        path: config.routes.watchMovie,
        component: Movie,
    },
];

const privateRoutes = [
    {
        id: 100,
        path: config.routes.saveMovies,
        component: List,
    },
];

export { publicRoutes, privateRoutes };
