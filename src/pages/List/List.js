import { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './List.module.scss';
import * as getService from '~/services/getService';
import { PagesContext } from '~/store/PagesContext';
import MovieItem from '~/components/MovieItem';
import { BackIcon, ForwardIcon } from '~/components/icons';

const cx = classNames.bind(styles);

function List() {
    const dataPage = useContext(PagesContext).dataPage;

    const [page, setPage] = useState(1);

    const [listMovie, setListMovie] = useState(dataPage);

    if (document.location.pathname.includes('phim-da-luu')) {
        if (!listMovie.length && dataPage) {
            if (listMovie !== 'you have not saved any movies yet') {
                setListMovie(() => dataPage);
            }
        }
    }

    const totalPages = useRef();

    const handleChangePage = (newPage) => {
        setListMovie([]);
        document.documentElement.scrollTop = 104;
        setPage(() => newPage);
    };

    useEffect(() => {
        if (!document.location.pathname.includes('phim-da-luu')) {
            if (!listMovie.length) {
                try {
                    (async () => {
                        const result = await getService.getPage(page);
                        if (!totalPages.current) {
                            totalPages.current = result.pagination.totalPages;
                        }

                        const movieDetails = await Promise.all(
                            result.items.map((movie) => getService.getMovie(movie.slug)),
                        );

                        setListMovie(movieDetails);
                    })();
                } catch (error) {
                    console.log(error);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div className={cx('wrapper')}>
            <div className="grid wide">
                <div className="row">
                    <div className="col l-12">
                        <div className={cx('list__header')}></div>
                        <div className={cx('list__movie')}>
                            {(() => {
                                const isMovieAdults = (category) => {
                                    for (let i = 0; i < category.length; i++) {
                                        if (category[i].name.includes('18+')) {
                                            return true;
                                        }
                                    }
                                    return false;
                                };

                                let arrMovie = [];
                                if (listMovie === 'you have not saved any movies yet') {
                                    arrMovie = (
                                        <div className={cx('notification__nonSave')}>Bạn chưa lưu phim nào!</div>
                                    );
                                } else {
                                    for (let i = 0; i < listMovie.length; i++) {
                                        if (!isMovieAdults(listMovie[i].movie.category)) {
                                            arrMovie = [
                                                ...arrMovie,
                                                <MovieItem
                                                    key={listMovie[i].movie._id}
                                                    movie={listMovie[i].movie}
                                                    episodes={listMovie[i].episodes}
                                                />,
                                            ];
                                        }
                                    }

                                    if (!listMovie.length) {
                                        for (let i = 0; i < 24; i++) {
                                            arrMovie = [...arrMovie, <MovieItem key={i} />];
                                        }
                                    }
                                }

                                return arrMovie;
                            })()}
                        </div>

                        <div className={cx('list__pagination')}>
                            <div className={cx('pagination__list')}>
                                {page > 1 && (
                                    <>
                                        <Link
                                            to={'/danh-sach/tat-ca/page=1'}
                                            className={cx('pagination__btn', 'double__btn')}
                                            onClick={() => handleChangePage(1)}
                                        >
                                            <BackIcon className={cx('btn__absolute')} />
                                            <BackIcon />
                                        </Link>
                                        <Link
                                            to={'/danh-sach/tat-ca/page=' + (page - 1)}
                                            className={cx('pagination__btn')}
                                            onClick={() => handleChangePage(page - 1)}
                                        >
                                            <BackIcon />
                                        </Link>
                                    </>
                                )}

                                {(() => {
                                    // Pagination
                                    if (!document.location.pathname.includes('phim-da-luu')) {
                                        let arrPagination = [];

                                        let Comp = 'div';
                                        let props = {};

                                        if (page <= 3) {
                                            for (let i = 1; i <= 5; i++) {
                                                if (page === i) {
                                                    Comp = 'div';
                                                    props = {};
                                                } else {
                                                    Comp = Link;
                                                    props.to = '/danh-sach/tat-ca/page=' + i;
                                                    props.onClick = () => handleChangePage(i);
                                                }

                                                arrPagination = [
                                                    ...arrPagination,
                                                    <Comp
                                                        key={i}
                                                        {...props}
                                                        className={cx('pagination__item', page === i ? 'active' : '')}
                                                    >
                                                        {i}
                                                    </Comp>,
                                                ];
                                            }
                                        } else if (!totalPages.current || page < totalPages.current - 1) {
                                            for (let i = page - 2; i < page + 3; i++) {
                                                if (page === i) {
                                                    Comp = 'div';
                                                    props = {};
                                                } else {
                                                    Comp = Link;
                                                    props.to = '/danh-sach/tat-ca/page=' + i;
                                                    props.onClick = () => handleChangePage(i);
                                                }

                                                arrPagination = [
                                                    ...arrPagination,
                                                    <Comp
                                                        key={i}
                                                        {...props}
                                                        className={cx('pagination__item', page === i ? 'active' : '')}
                                                    >
                                                        {i}
                                                    </Comp>,
                                                ];
                                            }
                                        } else {
                                            for (let i = totalPages.current - 4; i <= totalPages.current; i++) {
                                                if (page === i) {
                                                    Comp = 'div';
                                                    props = {};
                                                } else {
                                                    Comp = Link;
                                                    props.to = '/danh-sach/tat-ca/page=' + i;
                                                    props.onClick = () => handleChangePage(i);
                                                }

                                                arrPagination = [
                                                    ...arrPagination,
                                                    <Comp
                                                        key={i}
                                                        {...props}
                                                        className={cx('pagination__item', page === i ? 'active' : '')}
                                                    >
                                                        {i}
                                                    </Comp>,
                                                ];
                                            }
                                        }

                                        if (totalPages.current && page < totalPages.current - 2) {
                                            if (page < totalPages.current - 3) {
                                                arrPagination = [
                                                    ...arrPagination,
                                                    <div key="..." className={cx('pagination__dots')}>
                                                        ...
                                                    </div>,
                                                ];
                                            }
                                            arrPagination = [
                                                ...arrPagination,
                                                <Link
                                                    key={totalPages.current}
                                                    to={'/danh-sach/tat-ca/page=' + totalPages.current}
                                                    onClick={() => handleChangePage(totalPages.current)}
                                                    className={cx('pagination__item')}
                                                >
                                                    {totalPages.current}
                                                </Link>,
                                            ];
                                        }

                                        return arrPagination;
                                    }
                                })()}
                                {(!totalPages.current || page < totalPages.current) &&
                                    !document.location.pathname.includes('phim-da-luu') && (
                                        <Link
                                            to={'/danh-sach/tat-ca/page=' + (page + 1)}
                                            onClick={() => handleChangePage(page + 1)}
                                            className={cx('pagination__btn')}
                                        >
                                            <ForwardIcon />
                                        </Link>
                                    )}
                                {totalPages.current && page < totalPages.current && (
                                    <Link
                                        to={'/danh-sach/tat-ca/page=' + totalPages.current}
                                        onClick={() => handleChangePage(totalPages.current)}
                                        className={cx('pagination__btn', 'double__btn')}
                                    >
                                        <ForwardIcon className={cx('btn__absolute')} />
                                        <ForwardIcon />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default List;
