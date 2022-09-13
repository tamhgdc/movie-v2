import { useContext, memo } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './SliderItem.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import { Loading } from '~/components/Loading';
import { MovieContext } from '~/store/MovieContext';

const cx = classNames.bind(styles);

function SliderItem({
    movie,
    episodes = [
        {
            server_data: [],
        },
    ],
    preview = false,
    show = false,
    active = false,
    className,
}) {
    const movieContext = useContext(MovieContext);

    const loading = !movie;

    let isMovieAdult;
    if (!loading) {
        isMovieAdult = (() => {
            for (let i = 0; i < movie.category.length; i++) {
                if (movie.category[i].name.includes('18+')) {
                    return true;
                }
            }
        })();
    }

    let Comp = 'div';
    let props = {};

    if (movie && !preview) {
        Comp = Link;
        props.to = '/phim/' + movie.slug;
        props.onClick = () => {
            movieContext.handleMovie({
                movie,
                episodes,
            });
        };
    }

    const classNames = cx('wrapper', {
        show,
        preview,
        active,
        noLoading: !loading,
        [className]: !!className,
    });

    return (
        <div className={classNames}>
            <Comp {...props} className={cx('poster') + ' col l-4'}>
                {loading ? (
                    <Loading preview={preview} />
                ) : isMovieAdult ? (
                    ''
                ) : (
                    <Image className={cx('poster__img')} src={movie.thumb_url} alt={movie.name} />
                )}
            </Comp>
            <div className={cx('details') + ' col l-6 l-o-1'}>
                <div className={cx('movie__name')}>
                    {loading ? <Loading marginBottom="24px" /> : isMovieAdult ? 'Phim bị ẩn' : movie.name}
                </div>
                <div className={cx('movie__description')}>
                    <div className={cx('movie__description__content')}>
                        {loading ? (
                            <Loading marginBottom="32px" />
                        ) : isMovieAdult ? (
                            ''
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: movie.content }}></span>
                        )}
                    </div>

                    {!isMovieAdult && (
                        <div className={cx('description__more')}>
                            <div className={cx('des__more__content')}>
                                {loading ? (
                                    <Loading marginBottom="12px" />
                                ) : episodes[0].server_data.length > 1 ? (
                                    'Phim bộ: ' +
                                    (movie.status === 'completed'
                                        ? (movie.episode_total || movie.episode_current) + ' (Hoàn thành)'
                                        : movie.episode_current + ' (Chưa hoàn thành)')
                                ) : episodes[0].server_data[0].link_embed ? (
                                    movie.episode_total.includes('1 tập') || movie.type === 'single' ? (
                                        'Phim lẻ'
                                    ) : (
                                        'Phim bộ: Tập 1'
                                    )
                                ) : (
                                    'Phim bộ: Trailer'
                                )}
                            </div>

                            <div className={cx('movie__duration')}>
                                {loading ? (
                                    <Loading marginBottom="12px" />
                                ) : movie.time ? (
                                    'Thời gian: ' +
                                    movie.time
                                        .replace('1g', '1 giờ')
                                        .replace('phút', ' phút')
                                        .replace('2g', '2 giờ')
                                        .replace('1h', '1 giờ ')
                                        .replace('2h', '2 giờ ')
                                        .replace('1H', '1 giờ ')
                                        .replace('Phút', 'phút')
                                        .replace('p/tập', ' phút/tập') +
                                    ((movie.type === 'series' || movie.type === 'hoathinh') &&
                                    !movie.time.includes('/tập')
                                        ? '/tập'
                                        : '')
                                ) : (
                                    'Thời gian: N/A'
                                )}
                            </div>

                            <div
                                className={cx('movie__genre', {
                                    loading,
                                })}
                            >
                                {loading ? (
                                    <Loading />
                                ) : (
                                    'Thể loại: ' + movie.category.map((genre) => genre.name).join(', ')
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {loading || isMovieAdult ? (
                ''
            ) : (
                <Comp {...props} className={cx('play__wrapper')}>
                    <div className={cx('play__border')}>
                        <div className={cx('play__btn')}>
                            <Image src={images.playBtn} alt="Play" />
                        </div>
                    </div>
                </Comp>
            )}
        </div>
    );
}

SliderItem.propTypes = {
    movie: PropTypes.object,
    episodes: PropTypes.array,
    preview: PropTypes.bool,
    show: PropTypes.bool,
    active: PropTypes.bool,
};

export default memo(SliderItem);
