import { useEffect, useContext } from 'react';
import { auth, fbProvider } from '~/firebase/config';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import classNames from 'classnames/bind';

import styles from './Login.module.scss';
import { AuthContext } from '~/store/AuthContext';
import { SaveMovieContext } from '~/store/SaveMovieContext';
import { PagesContext } from '~/store/PagesContext';
import { getSaveMovies } from '~/services';

const cx = classNames.bind(styles);

function Login({ id, className }) {
    const authContext = useContext(AuthContext);
    const saveMoviesContext = useContext(SaveMovieContext);
    const pageContext = useContext(PagesContext);

    const handleFbLogin = () => {
        signInWithPopup(auth, fbProvider);
        // .then((result) => {
        //     // The signed-in user info.
        //     const user = result.user;

        //     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //     const credential = FacebookAuthProvider.credentialFromResult(result);
        //     const accessToken = credential.accessToken;

        //     // ...
        // })
        // .catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // The email of the user's account used.
        //     const email = error.customData.email;
        //     // The AuthCredential type that was used.
        //     const credential = FacebookAuthProvider.credentialFromError(error);

        //     // ...
        // });
    };
    useEffect(() => {
        const modalLoginWrapper = document.getElementById('modal-login');

        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (modalLoginWrapper.style.display === 'block') {
                    modalLoginWrapper.style.display = 'none';
                }

                authContext.setUser(() => ({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }));

                (async () => {
                    const saveMovies = await getSaveMovies(user.uid);

                    if (saveMovies === 'you have not saved any movies yet') {
                        saveMoviesContext.setSaveMovies(() => saveMovies);
                    } else {
                        saveMoviesContext.setSaveMovies(() => saveMovies.saveMovie);
                    }

                    if (document.location.pathname.includes('phim-da-luu')) {
                        if (saveMovies === 'you have not saved any movies yet') {
                            pageContext.setDataPage(() => saveMovies);
                        } else {
                            pageContext.setDataPage(() => saveMovies.saveMovie);
                        }
                    }
                })();
            } else {
                // User is signed out
                // ...
            }
        });

        // Click outside modal
        const modalLogin = modalLoginWrapper.lastElementChild;

        const handleClickOutSideModal = (e) => {
            if (modalLoginWrapper.style.display === 'block') {
                if (!modalLogin.contains(e.target)) {
                    modalLoginWrapper.style.display = 'none';
                }
            }
        };

        document.addEventListener('click', handleClickOutSideModal);

        return () => {
            document.removeEventListener('click', handleClickOutSideModal);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper', [className])} id={id}>
            <div className={cx('overlay')}></div>
            <div className={cx('modal')}>
                <div className={cx('loginWith-btn')} onClick={handleFbLogin}>
                    Đăng nhập với facebook
                </div>
            </div>
        </div>
    );
}

export default Login;
