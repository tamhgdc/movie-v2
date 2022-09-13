import { useState, memo } from 'react';
import classNames from 'classnames/bind';

import SliderItem from '~/components/SliderItem';
import styles from './Slider.module.scss';

const cx = classNames.bind(styles);

function Slider({ data }) {
    const [slideShow, setSlideShow] = useState(0);

    const handleChangeSlideShow = (index) => {
        setSlideShow(index);
    };

    return (
        <>
            <div className="row">
                {data.map((item, index) => {
                    return (
                        <SliderItem
                            key={item.movie._id}
                            movie={item.movie}
                            episodes={item.episodes}
                            show={index === slideShow}
                        />
                    );
                })}

                {!data.length && <SliderItem show />}
            </div>

            <div className="row">
                <div className={cx('wrapper')}>
                    {data.map((item, index) => (
                        <div key={item.movie._id} className="col l-3">
                            <div className={cx('item__preview')} onClick={() => handleChangeSlideShow(index)}>
                                <div className="row">
                                    <SliderItem
                                        preview
                                        show
                                        movie={item.movie}
                                        episodes={item.episodes}
                                        active={index === slideShow}
                                    />
                                </div>
                                <div className={cx('item__order')}>{'0' + (index + 1)}</div>
                            </div>
                        </div>
                    ))}

                    {!data.length && [
                        // Show slider preview loading
                        <div key="1" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="2" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="3" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="4" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                    ]}
                </div>
            </div>
        </>
    );
}

export default memo(Slider);
