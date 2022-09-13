import PropTypes from 'prop-types';

import { Header } from '~/layouts/components/Header';
import { Footer } from '~/layouts/components/Footer';

function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
