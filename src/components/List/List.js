import { memo } from 'react';
import classNames from 'classnames/bind';

import styles from './List.module.scss';
import ListItem from './ListItem';
import { ArrowBottomIcon } from '~/components/icons';

const cx = classNames.bind(styles);

function List({ menu = [], hoverUnderline = false, outline = false, classNames }) {
    const className = cx('wrapper', {
        [classNames]: !!classNames,
    });

    return (
        <div className={className}>
            {menu.map((item) => {
                let to;
                let RightIcon;
                let SubMenu;

                if (item.to) {
                    to = item.to;
                }

                if (item.subMenu) {
                    SubMenu = item.subMenu.map((subItem) => (
                        <ListItem key={subItem.id} to={subItem.to}>
                            {subItem.title}
                        </ListItem>
                    ));
                    RightIcon = ArrowBottomIcon;
                }

                return (
                    <ListItem
                        key={item.id}
                        to={to}
                        RightIcon={RightIcon}
                        SubMenu={SubMenu}
                        hoverUnderline={hoverUnderline}
                        outline={outline}
                        onClick={item.onClick}
                        ml_8
                    >
                        {item.title}
                    </ListItem>
                );
            })}
        </div>
    );
}

export default memo(List);
