import { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './MovieItem.module.scss';
import Image from '~/components/Image';
import { ClockIcon } from '~/components/icons';
import { Loading } from '~/components/Loading';
import { MovieContext } from '~/store/MovieContext';

const cx = classNames.bind(styles);

function MovieItem({ src = '', movie, episodes, imgBackground = false }) {
    const movieContext = useContext(MovieContext);

    const loading = !movie;

    const classNames = cx('wrapper', {
        imgBackground,
        loading: loading,
    });

    let Comp = 'div';
    let props = {};

    if (movie) {
        Comp = Link;
        props.to = '/phim/' + movie.slug;
        if (!document.location.pathname.includes('phim-da-luu')) {
            props.onClick = () => {
                movieContext.handleMovie({
                    movie,
                    episodes,
                });
            };
        }
    }

    return (
        <div className={classNames}>
            <Comp
                {...props}
                className={cx('movie__info', {
                    loading,
                })}
            >
                {loading ? (
                    <Loading noPadding={!imgBackground} delay={!imgBackground ? '5000ms' : '2500ms'} />
                ) : (
                    <>
                        <Image className={cx('movie__img')} src={src || movie.thumb_url} alt={movie.name} />

                        <div className={cx('movie__name')}>
                            <p className={cx('name__vn')}>{movie.name}</p>
                            <p className={cx('name__origin')}>{movie.origin_name}</p>
                        </div>
                        {imgBackground && <div className={cx('movie__overlay')}></div>}
                    </>
                )}
            </Comp>
            {!loading ? (
                <>
                    <div className={cx('movie__description')}>
                        <div className={cx('movie__year')}>{movie.year}</div>
                        {!document.location.pathname.includes('phim-da-luu') && (
                            <div className={cx('movie__episode')}>
                                <span>{movie.episode_current}</span>
                            </div>
                        )}
                        <div className={cx('movie__type')}>
                            {movie.type === 'series' ? 'Phim bộ' : movie.type === 'single' ? 'Phim lẻ' : 'Hoạt hình'}
                        </div>
                        {!document.location.pathname.includes('phim-da-luu') && (
                            <div className={cx('movie__status')}>
                                {movie.status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
                            </div>
                        )}
                        <div className={cx('movie__country')}>{movie.country[0].name}</div>
                    </div>
                    {imgBackground && (
                        <div className={cx('movie__time')}>
                            <ClockIcon className={cx('movie__clockIcon')} />
                            <span>
                                {movie.time
                                    .replace('1g', '1 giờ')
                                    .replace('phút', ' phút')
                                    .replace('2g', '2 giờ')
                                    .replace('1h', '1 giờ ')
                                    .replace('2h', '2 giờ ')
                                    .replace('Phút', 'phút')
                                    .replace('p/tập', ' phút/tập')}
                            </span>
                        </div>
                    )}
                </>
            ) : (
                ''
            )}
        </div>
    );
}

MovieItem.propTypes = {
    src: PropTypes.string,
    movie: PropTypes.object,
    episodes: PropTypes.array,
    imgBackground: PropTypes.bool,
};

export default memo(MovieItem);
