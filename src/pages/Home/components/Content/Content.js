import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import Slider from '../Slider';
import NewMovie from '../NewMovie';
import styles from './Content.module.scss';
import * as getService from '~/services/getService';

const cx = classNames.bind(styles);

function Content() {
    const [movieSlideShow, setMovieSlideShow] = useState([]);

    const [movieOther, setMovieOther] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                const result = await getService.getPage(1);

                const getRequestArray = (start, end) => {
                    let requestArr = [];

                    for (let i = start; i < end; i++) {
                        requestArr = [...requestArr, getService.getMovie(result.items[i].slug)];
                    }

                    return requestArr;
                };

                const movieDetails = await Promise.all(getRequestArray(0, 4));

                setMovieSlideShow(movieDetails);

                setTimeout(async () => {
                    const movieOtherDetails = await Promise.all(getRequestArray(4, result.items.length));

                    setMovieOther(movieOtherDetails);
                }, 1);
            })();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className="grid wide">
                <div className="row">
                    <div className="col l-12 mb-16">
                        <Slider data={movieSlideShow} />
                    </div>
                </div>
                <NewMovie data={[...movieSlideShow, ...movieOther]} />
            </div>
        </div>
    );
}

export default Content;
