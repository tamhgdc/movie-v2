import classNames from 'classnames/bind';

import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

function Popper({ visible = false, offset = [0, 0], classNames, children }) {
    const className = cx('wrapper', {
        [classNames]: !!classNames,
        show__popper: visible,
    });

    return <div className={className}>{children}</div>;
}

export default Popper;
