import { useEffect, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { findDOMNode } from 'react-dom';

import styles from './Movie.module.scss';
import { MovieContext } from '~/store/MovieContext';
import { EpisodeContext } from '~/store/EpisodeContext';
import { SaveMovieContext, findIndexMovieInSaveMovies } from '~/store/SaveMovieContext';
import { AuthContext } from '~/store/AuthContext';
import Image from '~/components/Image';
import Video from '~/components/Video';
import { CloseIcon, BookMarkIcon, BookMarkCheckIcon } from '~/components/icons';
import { isSavedMovie } from '~/store/SaveMovieContext';
import { addSaveMovies, removeSaveMovies, getMovie } from '~/services';
import { Loading } from '~/components/Loading';

const isWatchedEpisode = (id, episode) => {
    let watchedMovies = JSON.parse(localStorage.getItem('Watched-Movie')) || {};

    if (watchedMovies[id] && watchedMovies[id].watchedEpisodes.includes(episode)) {
        return true;
    }

    return false;
};

const cx = classNames.bind(styles);

function Movie() {
    const authContext = useContext(AuthContext);
    const movieContext = useContext(MovieContext);
    const episodeContext = useContext(EpisodeContext);
    const saveMoviesContext = useContext(SaveMovieContext);

    const movie = movieContext.dataMovie.movie;
    const episodes = movieContext.dataMovie.episodes;

    const loading = !movie;

    useEffect(() => {
        if (!movie) {
            const slugMovie = document.location.pathname.split('/')[2];

            (async () => {
                const data = await getMovie(slugMovie);

                movieContext.handleMovie({
                    movie: data.movie,
                    episodes: data.episodes,
                });
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper', { loading: loading })}>
            <div className="grid wide">
                {document.location.pathname.includes('xem-phim') ? (
                    <div className={cx('movie__video')}>
                        <div className="row">
                            <div className="col l-12">
                                <div className={cx('video__movie__name')}>
                                    {movie.name || 'N/A'}
                                    {(() => {
                                        let props = {};

                                        const isSavedFilm = isSavedMovie(
                                            saveMoviesContext.saveMovies,
                                            movieContext.dataMovie,
                                        );

                                        if (Object.keys(authContext.user).length) {
                                            if (isSavedFilm) {
                                                props.onClick = () => {
                                                    let indexRemove = findIndexMovieInSaveMovies(
                                                        saveMoviesContext.saveMovies,
                                                        movieContext.dataMovie,
                                                    );

                                                    if (indexRemove > -1) {
                                                        saveMoviesContext.setSaveMovies((prev) => {
                                                            let arr = [...prev];
                                                            arr.splice(indexRemove, 1);

                                                            return arr;
                                                        });
                                                    }

                                                    removeSaveMovies(movieContext.dataMovie, authContext.user.uid);
                                                };
                                            } else {
                                                props.onClick = () => {
                                                    saveMoviesContext.setSaveMovies((prev) => {
                                                        if (prev === 'you have not saved any movies yet') {
                                                            return [movieContext.dataMovie];
                                                        }

                                                        return [...prev, movieContext.dataMovie];
                                                    });

                                                    addSaveMovies(movieContext.dataMovie, authContext.user.uid);
                                                };
                                            }
                                        } else {
                                            props.onClick = () => {
                                                // renderError
                                                const notification__error = document.querySelector(
                                                    `.${cx('save__movie__notification')}`,
                                                );

                                                notification__error.style.display = 'flex';

                                                setTimeout(() => {
                                                    if (findDOMNode(notification__error)) {
                                                        notification__error.style.display = 'none';
                                                    }
                                                }, 5000);
                                            };
                                        }

                                        return (
                                            <div className={cx('movie__bookmark')} {...props}>
                                                {isSavedFilm ? (
                                                    <BookMarkCheckIcon width="3.2rem" height="3.2rem" />
                                                ) : (
                                                    <BookMarkIcon width="3.2rem" height="3.2rem" />
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <Video />
                                <div className={cx('save__movie__notification')}>Bạn cần đăng nhập để lưu phim</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cx('movie__intro')}>
                        <div className="row">
                            <div className="col l-4">
                                <div className={cx('movie__img__wrapper')}>
                                    {movie ? (
                                        <>
                                            <Image
                                                className={cx('movie__img')}
                                                src={movie.thumb_url}
                                                alt={movie.name}
                                            />

                                            {(() => {
                                                let Comp = 'div';

                                                let props = {};

                                                if (episodes[0].server_data[0].link_m3u8) {
                                                    Comp = Link;

                                                    props = {
                                                        to: '/xem-phim/' + movie.slug,
                                                        onClick: () => {
                                                            episodeContext.handleSetEpisode(movie._id, movie.name, 0);
                                                        },
                                                    };

                                                    if (movie.type !== 'single') {
                                                        props.to += '-tap-' + episodes[0].server_data[0].slug;
                                                    }
                                                } else {
                                                    props.onClick = () => {
                                                        // renderError
                                                        const notification__error = document.querySelector(
                                                            `.${cx('movie__error')}`,
                                                        );

                                                        notification__error.style.display = 'flex';

                                                        setTimeout(() => {
                                                            if (findDOMNode(notification__error)) {
                                                                notification__error.style.display = 'none';
                                                            }
                                                        }, 5000);
                                                    };
                                                }

                                                return (
                                                    <Comp className={cx('movie__play')} {...props}>
                                                        Xem phim
                                                    </Comp>
                                                );
                                            })()}
                                        </>
                                    ) : (
                                        <Loading />
                                    )}
                                </div>
                            </div>
                            <div className="col l-8">
                                <div className={cx('description__wrapper')}>
                                    <div className={cx('movie__name')}>
                                        {movie ? <h2 className={cx('movie__nameVN')}>{movie.name}</h2> : <Loading />}
                                        {movie ? (
                                            <h3 className={cx('movie__nameOrigin')}>{movie.origin_name}</h3>
                                        ) : (
                                            <Loading />
                                        )}
                                    </div>
                                    <div className={cx('movie__description')}>
                                        {movie ? (
                                            <table className={cx('movie__des_table')}>
                                                <tbody>
                                                    <tr>
                                                        <th className={cx('table__header')}>Trạng thái:</th>
                                                        <td>{movie.episode_current || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Số tập:</th>
                                                        <td>{movie.episode_total || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Thời lượng:</th>
                                                        <td>{movie.time || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Năm phát hành:</th>
                                                        <td>{movie.year || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Chất lượng:</th>
                                                        <td>{movie.quality || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Ngôn ngữ:</th>
                                                        <td>{movie.lang || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Đạo diễn:</th>
                                                        <td>{movie.director.map((dir) => dir).join(', ') || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Diễn viên:</th>
                                                        <td>{movie.actor.map((act) => act).join(', ') || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Thể loại:</th>
                                                        <td>
                                                            {movie.category.map((genre) => genre.name).join(', ') ||
                                                                'N/A'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className={cx('table__header')}>Quốc gia:</th>
                                                        <td>{movie.country[0].name || 'N/A'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ) : (
                                            <Loading />
                                        )}
                                    </div>
                                    {(() => {
                                        if (movie) {
                                            let props = {};

                                            const isSavedFilm = isSavedMovie(
                                                saveMoviesContext.saveMovies,
                                                movieContext.dataMovie,
                                            );

                                            if (Object.keys(authContext.user).length) {
                                                if (isSavedFilm) {
                                                    props.onClick = () => {
                                                        let indexRemove = findIndexMovieInSaveMovies(
                                                            saveMoviesContext.saveMovies,
                                                            movieContext.dataMovie,
                                                        );

                                                        console.log(indexRemove);

                                                        if (indexRemove > -1) {
                                                            saveMoviesContext.setSaveMovies((prev) => {
                                                                let arr = [...prev];
                                                                arr.splice(indexRemove, 1);

                                                                return arr;
                                                            });
                                                        }

                                                        removeSaveMovies(movieContext.dataMovie, authContext.user.uid);
                                                    };
                                                } else {
                                                    props.onClick = () => {
                                                        saveMoviesContext.setSaveMovies((prev) => {
                                                            if (prev === 'you have not saved any movies yet') {
                                                                return [movieContext.dataMovie];
                                                            }

                                                            return [...prev, movieContext.dataMovie];
                                                        });

                                                        addSaveMovies(movieContext.dataMovie, authContext.user.uid);
                                                    };
                                                }
                                            } else {
                                                props.onClick = () => {
                                                    // renderError
                                                    const notification__error = document.querySelector(
                                                        `.${cx('save__movie__notification')}`,
                                                    );

                                                    notification__error.style.display = 'flex';

                                                    setTimeout(() => {
                                                        if (findDOMNode(notification__error)) {
                                                            notification__error.style.display = 'none';
                                                        }
                                                    }, 5000);
                                                };
                                            }

                                            return (
                                                <div className={cx('movie__bookmark')} {...props}>
                                                    {isSavedFilm ? (
                                                        <BookMarkCheckIcon width="3.2rem" height="3.2rem" />
                                                    ) : (
                                                        <BookMarkIcon width="3.2rem" height="3.2rem" />
                                                    )}
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                            <div className={cx('movie__error')}>
                                <CloseIcon className={cx('error__icon')} height="3.2rem" width="3.2rem" />
                                Hiện phim đang cập nhật
                            </div>
                            <div className={cx('save__movie__notification')}>Bạn cần đăng nhập để lưu phim</div>
                        </div>
                    </div>
                )}
                <div className={cx('movie__content')}>
                    <div className="row">
                        <div className="col l-12">
                            {movie ? (
                                <>
                                    <div className={cx('content__header')}>Nội dung phim</div>
                                    <span dangerouslySetInnerHTML={{ __html: movie.content }}></span>
                                </>
                            ) : (
                                <Loading className={cx('content__loading')} />
                            )}
                        </div>
                    </div>
                </div>

                {movie && movie.type !== 'single' && episodes[0].server_data[0].link_m3u8 && (
                    <div className={cx('movie__episodes')}>
                        <div className="row">
                            <div className="col l-12">
                                <div className={cx('episodes__header')}>Xem phim</div>
                                <ul className={cx('episodes__list')}>
                                    {(() => {
                                        let result = [];
                                        if (movie) {
                                            episodes[0].server_data.forEach((episode, index) => {
                                                if (episode.link_m3u8) {
                                                    result = [
                                                        ...result,
                                                        <Link
                                                            key={episode.filename || episode.slug}
                                                            to={'/xem-phim/' + movie.slug + '-tap-' + episode.slug}
                                                            onClick={() => {
                                                                episodeContext.handleSetEpisode(
                                                                    movie._id,
                                                                    movie.name,
                                                                    index,
                                                                );
                                                            }}
                                                            className={cx('episodes__item', {
                                                                watched: isWatchedEpisode(movie._id, index),
                                                            })}
                                                        >
                                                            <span className={cx('item__name')}>
                                                                {episode.name.replace('Tập ', '').replace('tập ', '')}
                                                            </span>
                                                        </Link>,
                                                    ];
                                                }
                                            });
                                        } else {
                                            result = <Loading />;
                                        }

                                        return result;
                                    })()}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Movie;
