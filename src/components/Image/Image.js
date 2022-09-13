import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Image.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Image({ src, alt, customFallback = images.bgDefault, className }) {
    // const [srcImage, setSrcImage] = useState(images.noImage);
    const imageRef = useRef();

    const classNames = cx('wrapper', {
        [className]: !!className,
    });

    // useEffect(() => {
    //     let observer;

    //     const lazyLoading = (img) => {
    //         img.removeAttribute('lazy-src');

    //         if ('IntersectionObserver' in window) {
    //             observer.unobserve(img);
    //         }

    //         setSrcImage(src);
    //     };

    //     if ('IntersectionObserver' in window) {
    //         observer = new IntersectionObserver((entries) => {
    //             entries.forEach((entry) => {
    //                 if (entry.isIntersecting) {
    //                     if (entry.target.hasAttribute('lazy-src')) lazyLoading(entry.target);
    //                 }
    //             });
    //         });

    //         observer.observe(imageRef.current);
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleError = () => {
        // setSrcImage(customFallback);
    };

    return (
        <img
            ref={imageRef}
            // lazy-src={src}
            src={src}
            alt={alt}
            className={classNames}
            onError={handleError}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Image;
