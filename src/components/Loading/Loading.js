import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function Loading({ marginBottom = '0px', delay = '2500ms', preview = false, noPadding = false, className }) {
    const loadingRef = useRef();

    const classNames = cx('container', {
        [className]: !!className,
        preview,
    });

    useEffect(() => {
        const container = loadingRef.current;
        const content = container.firstChild;

        let containerHeight = container.clientHeight;

        if (containerHeight < 40) {
            let totalPaddingVertical = 20; // Default

            let placeholderHeight = 20; // Default

            placeholderHeight = Math.round(containerHeight / 4) * 2;

            totalPaddingVertical = containerHeight - placeholderHeight;
            container.style.padding = totalPaddingVertical / 2 + 'px';
        }

        container.style.marginBottom = marginBottom;

        content.style.animation = `${cx('reflect')} ${delay} ease-out infinite`;

        if (noPadding) {
            container.style.padding = 0;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={loadingRef} className={classNames}>
            <div className={cx('placeholder')}>
                <div className={cx('content')}></div>
            </div>
        </div>
    );
}

Loading.propTypes = {
    marginBottom: PropTypes.string,
    delay: PropTypes.string,
    className: PropTypes.string,
};

export default Loading;
