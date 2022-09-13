import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { privateRoutes, publicRoutes } from '~/routes';
import { DefaultLayout } from '~/layouts';
import Login from '~/components/Login';
import { AuthContext } from '~/store/AuthContext';

function App() {
    const authContext = useContext(AuthContext);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route) => {
                        const Layout = route.layout || DefaultLayout;
                        const Page = route.component;
                        return (
                            <Route
                                key={route.id}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            ></Route>
                        );
                    })}
                    {authContext.user &&
                        privateRoutes.map((route) => {
                            const Layout = route.layout || DefaultLayout;
                            const Page = route.component;
                            return (
                                <Route
                                    key={route.id}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                ></Route>
                            );
                        })}
                </Routes>
                <Login id="modal-login" />
            </div>
        </Router>
    );
}

export default App;
