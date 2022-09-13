import { useEffect, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss';
import Search from './Search';
import { HEADER_MENU, HEADER_LOG_ } from '~/constants';
import config from '~/config';
import List from '~/components/List';
import Image from '~/components/Image';
import { AuthContext } from '~/store/AuthContext';
import { PagesContext } from '~/store/PagesContext';
import { SaveMovieContext } from '~/store/SaveMovieContext';
import Popper from '~/components/Popper';
import ListItem from '~/components/List/ListItem';
import { SignOutIcon } from '~/components/icons';
import { auth } from '~/firebase/config';

const cx = classNames.bind(styles);

function Header() {
    const authContext = useContext(AuthContext);

    const pageContext = useContext(PagesContext);

    const saveMovieContext = useContext(SaveMovieContext);

    const headerRef = useRef();

    //Các biến để ẩn hiện Header khi scroll
    // -----Start------
    const prevScrollY = useRef(); // Giá trị scroll trước đó -> Xác định xem là đang scroll lên hay xuống

    const prevEventHeader = useRef(); // Giá trị tại thời điểm bắt đầu scroll lên hoặc xuống

    const isHideHeader = useRef();
    // -----End------

    useEffect(() => {
        const handleHideHeader = () => {
            if (!prevScrollY.current) {
                prevScrollY.current = 0;
            }

            if (!prevEventHeader.current) {
                prevEventHeader.current = 0;
            }

            if (!isHideHeader.current) {
                isHideHeader.current = false;
            }

            if (window.scrollY - prevScrollY.current > 0 && !isHideHeader.current) {
                isHideHeader.current = true;
                prevEventHeader.current = window.scrollY;
            }

            if (window.scrollY - prevScrollY.current < 0 && isHideHeader.current) {
                isHideHeader.current = false;
                prevEventHeader.current = window.scrollY;
            }

            if (!headerRef.current.classList.contains(cx('hidden')) && isHideHeader.current) {
                if (window.scrollY - prevEventHeader.current > 20 && window.scrollY > 100) {
                    headerRef.current.classList.add(cx('hidden'));
                }
            }

            if (headerRef.current.classList.contains(cx('hidden')) && !isHideHeader.current) {
                if (window.scrollY - prevEventHeader.current < -100) {
                    headerRef.current.classList.remove(cx('hidden'));
                }
            }

            prevScrollY.current = window.scrollY;
        };

        window.addEventListener('scroll', handleHideHeader);
        return () => window.removeEventListener('scroll', handleHideHeader);
    }, []);

    return (
        <div className={cx('wrapper')} ref={headerRef}>
            <div className="grid wide height_100">
                <div className="row height_100">
                    <div className="col l-12">
                        <div className={cx('inner')}>
                            <>
                                <Link
                                    to={config.routes.home}
                                    className={cx('logo')}
                                    onClick={() => {
                                        document.documentElement.scrollTop = 0;
                                    }}
                                >
                                    Watchflix
                                </Link>
                                <Search classNames={cx('ml_16')} />
                            </>

                            <div className={cx('actions')}>
                                <List menu={HEADER_MENU} hoverUnderline />
                                {Object.keys(authContext.user).length ? (
                                    <div className={cx('user')}>
                                        <Image
                                            src={authContext.user.photoURL}
                                            alt={authContext.user.displayName}
                                            className={cx('avatar', 'ml_16')}
                                        />
                                        <Popper classNames={cx('popper')}>
                                            <ListItem
                                                className={cx('item__user')}
                                                to="/danh-sach/phim-da-luu"
                                                onClick={() => {
                                                    if (saveMovieContext.saveMovies) {
                                                        pageContext.setDataPage(() => saveMovieContext.saveMovies);
                                                    }
                                                }}
                                            >
                                                Danh sách phim đã lưu
                                            </ListItem>
                                            <ListItem
                                                className={cx('item__user')}
                                                LeftIcon={
                                                    <SignOutIcon
                                                        className={cx('icon__menu__user')}
                                                        width="2.4rem"
                                                        height="2.4rem"
                                                    />
                                                }
                                                onClick={() => {
                                                    authContext.setUser({});
                                                    auth.signOut();
                                                }}
                                            >
                                                Đăng xuất
                                            </ListItem>
                                        </Popper>
                                    </div>
                                ) : (
                                    <List menu={HEADER_LOG_} outline classNames={cx('ml_16')} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
