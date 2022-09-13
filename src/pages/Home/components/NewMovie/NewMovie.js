import { useContext } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './NewMovie.module.scss';
import MovieItem from '~/components/MovieItem';
import { PagesContext } from '~/store/PagesContext';

const cx = classNames.bind(styles);

function NewMovie({ data }) {
    const pagesContext = useContext(PagesContext);

    const isMovieAdults = (categories) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name.includes('18+')) {
                return true;
            }
        }

        return false;
    };

    return (
        <div className={cx('wrapper')}>
            <div className="row">
                <div className="col l-12 mb-16">
                    <div className={cx('heading__wrapper')}>
                        <div className={cx('heading')}>Phim mới cập nhật</div>
                        <Link
                            to="/danh-sach/tat-ca/page=1"
                            className={cx('view__more')}
                            onClick={() => {
                                pagesContext.setDataPage(data);
                            }}
                        >
                            Xem thêm
                        </Link>
                    </div>

                    <div className="row sm-gutter">
                        {data.length > 4 ? (
                            !isMovieAdults(data[4].movie.category) ? (
                                <div className="col l-8 mt-16" key={data[4].movie._id}>
                                    <MovieItem
                                        src={data[4].movie.poster_url}
                                        movie={data[4].movie}
                                        episodes={data[4].episodes}
                                        imgBackground
                                    />
                                </div>
                            ) : (
                                ''
                            )
                        ) : (
                            <div className="col l-8 mt-16" key="1">
                                <MovieItem imgBackground />
                            </div>
                        )}

                        {(() => {
                            let ElmRender = [];
                            for (let i = 5; i < data.length; i++) {
                                if (!isMovieAdults(data[i].movie.category)) {
                                    ElmRender = [
                                        ...ElmRender,
                                        <div className="col l-4 mt-16" key={data[i].movie._id}>
                                            <MovieItem
                                                src={data[i].movie.thumb_url}
                                                movie={data[i].movie}
                                                episodes={data[i].episodes}
                                                imgBackground
                                            />
                                        </div>,
                                    ];
                                }
                            }

                            return ElmRender;
                        })()}

                        {/* Loading */}
                        {data.length < 5 &&
                            (() => {
                                let ElmRender = [];
                                for (let i = 1; i < 20; i++) {
                                    ElmRender = [
                                        ...ElmRender,
                                        <div className="col l-4 mt-16" key={i + 1}>
                                            <MovieItem imgBackground />
                                        </div>,
                                    ];
                                }

                                return ElmRender;
                            })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewMovie;
