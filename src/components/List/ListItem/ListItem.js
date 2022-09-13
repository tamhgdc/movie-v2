import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './ListItem.module.scss';
import Popper from '~/components/Popper';

const cx = classNames.bind(styles);

function ListItem({
    href,
    to,
    SubMenu,
    LeftIcon,
    RightIcon,
    hoverUnderline = false,
    outline = false,
    ml_8 = false,
    className,
    onClick,
    children,
}) {
    let Comp = 'div';

    const props = {
        href,
        to,
    };

    const classNames = cx('item', {
        outline,
        [className]: !!className,
        mr_4: !!SubMenu,
        ml_8,
    });

    if (href) {
        Comp = 'a';
    } else if (to) {
        Comp = Link;
    }

    if (onClick) {
        props.onClick = onClick;
    }

    if (children === 'Đăng Nhập') {
        props.onClick = (e) => {
            e.stopPropagation();

            const modalLogin = document.getElementById('modal-login');

            modalLogin.style.display = 'block';
        };
    }

    return (
        <Comp className={classNames} {...props}>
            {LeftIcon}
            <span className={cx('content')}>
                {children}
                {hoverUnderline && <span className={cx('content__underline')}></span>}
            </span>
            {RightIcon && <RightIcon className={cx('icon')} />}
            {SubMenu && <Popper classNames={cx('popper')}>{SubMenu}</Popper>}
        </Comp>
    );
}

ListItem.propTypes = {
    href: PropTypes.string,
    to: PropTypes.string,
    SubMenu: PropTypes.array,

    hoverUnderline: PropTypes.bool,
    outline: PropTypes.bool,
    children: PropTypes.node,
};

export default ListItem;
