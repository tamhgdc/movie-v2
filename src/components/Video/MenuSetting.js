import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './Video.module.scss';
import { PlaybackRate, BackIcon, ForwardIcon } from '~/components/icons';
import InputNumber from './InputNumber';
import { CheckIcon } from '~/components/icons';

const cx = classNames.bind(styles);

const SETTING_MENU = [
    {
        id: 2,
        title: 'Tự động chuyển tập',
        content: '',
        indexChildren: 2,
        iconRight: <ForwardIcon height="2rem" width="2rem" className={cx('item__icon--right')} />,
        childrenType: 'self-custom',
        childrenSelector: '#autoTransferEpisode',
        children: {
            title: 'Tự động chuyển tập',
            type: 'self-custom',
            indexParent: 1,
            index: 2,
            selector: '#autoTransferEpisode',
            data: (
                <form
                    id="autoTransferEpisode"
                    key="form__data"
                    style={{ display: 'none' }}
                    data-index="2"
                    data-parent="1"
                >
                    <label htmlFor="startAtMinute" style={{ padding: '8px 8px 0 8px', display: 'block' }}>
                        Tự động tua đến:
                    </label>
                    <div className={cx('item__input__wrapper')}>
                        <span className={cx('item__title')}>
                            <InputNumber
                                id="startAtMinute"
                                type="text"
                                className={cx('item__input')}
                                name="startAtMinute"
                            />
                            phút
                        </span>
                        <span className={cx('item__content')}>
                            <InputNumber type="text" className={cx('item__input')} name="startAtSecond" />
                            giây
                        </span>
                    </div>
                    <label htmlFor="endAtMinute" style={{ padding: '8px 8px 0 8px', display: 'block' }}>
                        Tự động chuyển tập khi đến:
                    </label>
                    <div className={cx('item__input__wrapper')}>
                        <span className={cx('item__title')}>
                            <InputNumber
                                id="endAtMinute"
                                type="text"
                                className={cx('item__input')}
                                name="endAtMinute"
                            />
                            phút
                        </span>
                        <span className={cx('item__content')}>
                            <InputNumber type="text" className={cx('item__input')} name="endAtSecond" />
                            giây
                        </span>
                    </div>
                    <div className={cx('item__btn__wrapper')}>
                        <div className={cx('item__btn')}>Lưu</div>
                    </div>
                </form>
            ),
        },
    },
    {
        id: 1,
        title: 'Tốc độ phát',
        content: 1,
        indexChildren: 3,
        type: 'playbackRate',
        iconLeft: <PlaybackRate className={cx('item__icon--left')} />,
        iconRight: <ForwardIcon height="2rem" width="2rem" className={cx('item__icon--right')} />,
        children: {
            title: 'Tốc độ phát',
            optionSelected: 0.75,
            index: 3,
            indexParent: 1,
            data: [
                {
                    id: 11,
                    title: 0.25,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 12,
                    title: 0.5,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 13,
                    title: 0.75,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 14,
                    title: 1,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 15,
                    title: 1.25,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 16,
                    title: 1.5,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 17,
                    title: 1.75,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
                {
                    id: 18,
                    title: 2,
                    type: 'playbackRate',
                    className: 'pl-24',
                },
            ],
        },
    },
];

function MenuSetting() {
    const menu = useRef({
        index: 1,
        data: SETTING_MENU,
    });

    useEffect(() => {
        const menuSetting = document.querySelector(`.${cx('menu__setting')}`);

        const handleHideMenuSetting = (e) => {
            if (!menuSetting.contains(e.target)) {
                if (menuSetting.style.display === 'block') {
                    menuSetting.style.display = 'none';
                }

                const titleShowing = document.querySelector(`.${cx('menu__title')}[style="display: flex;"]`);

                if (titleShowing) {
                    const itemShowings = document.querySelectorAll(`.${cx('item__setting')}[style="display: flex;"]`);

                    const menusLevel_1 = document.querySelectorAll(`.${cx('item__setting')}[data-index="1"]`);

                    titleShowing.style.display = 'none';

                    // Có title mà k có item showing là đang show form
                    if (!itemShowings.length) {
                        document.querySelector('#autoTransferEpisode[style="display: block;"]').style.display = 'none';
                    }

                    itemShowings.forEach((item) => {
                        item.style.display = 'none';
                    });

                    menusLevel_1.forEach((menu) => {
                        menu.style.display = 'flex';
                    });
                }
            }
        };

        document.addEventListener('click', handleHideMenuSetting);

        // Form click button save
        const formAutoTransferEpisode = document.querySelector('#autoTransferEpisode');

        const submitFormBtn = formAutoTransferEpisode.lastChild.firstChild;

        const index = formAutoTransferEpisode.dataset.index;

        const indexParent = formAutoTransferEpisode.dataset.parent;

        const menuParent = document.querySelectorAll(`.${cx('item__setting')}[data-index="${indexParent}"]`);

        const titleForm = document.querySelector(`.${cx('menu__title')}[data-index="${index}"]`);

        const handleSubmitForm = (e) => {
            e.stopPropagation();

            titleForm.style.display = 'none';

            formAutoTransferEpisode.style.display = 'none';

            menuParent.forEach((menu) => {
                menu.style.display = 'flex';
            });

            if (menuSetting.style.display === 'block') {
                menuSetting.style.display = 'none';
            }
        };

        submitFormBtn.addEventListener('click', handleSubmitForm);

        return () => {
            document.removeEventListener('click', handleHideMenuSetting);
            submitFormBtn.removeEventListener('click', handleSubmitForm);
        };
    }, []);

    const renderData = () => {
        let result = [];

        const renderMenu = (currentMenu) => {
            const handleOnBack = (e) => {
                e.stopPropagation();

                const menuParent = document.querySelectorAll(
                    `.${cx('item__setting')}[data-index="${currentMenu.indexParent}"]`,
                );

                if (currentMenu.type === 'self-custom') {
                    const childrenCustom = document.querySelector(currentMenu.selector);

                    childrenCustom.style.display = 'none';
                } else {
                    const menuChildren = document.querySelectorAll(
                        `.${cx('item__setting')}[data-index="${currentMenu.index}"]`,
                    );

                    menuChildren.forEach((menu) => {
                        menu.style.display = 'none';
                    });
                }

                const titleChildren = document.querySelector(
                    `.${cx('menu__title')}[data-index="${currentMenu.index}"]`,
                );

                titleChildren.style.display = 'none';

                menuParent.forEach((menu) => {
                    menu.style.display = 'flex';
                });
            };

            if (currentMenu.indexParent) {
                result = [
                    ...result,
                    <div
                        className={cx('menu__title')}
                        key={`title-submenu-${currentMenu.index}`}
                        data-index={currentMenu.index}
                        data-parent={currentMenu.indexParent}
                        style={{ display: 'none' }}
                    >
                        <div className={cx('menu__icon--back')} onClick={handleOnBack}>
                            <BackIcon height="1.8rem" width="1.8rem" className={cx('item__icon--left')} />
                        </div>
                        {currentMenu.title}
                    </div>,
                ];
            }

            if (currentMenu.type === 'self-custom') {
                result = [...result, currentMenu.data];
            } else {
                currentMenu.data.forEach((item) => {
                    let props = {};

                    let isParent = !!item.children;

                    if (isParent) {
                        props.onClick = (e) => {
                            e.stopPropagation();

                            const menuParent = document.querySelectorAll(
                                `.${cx('item__setting')}[data-index="${currentMenu.index}"]`,
                            );

                            const titleChildren = document.querySelector(
                                `.${cx('menu__title')}[data-index="${item.indexChildren}"]`,
                            );

                            if (item.childrenType === 'self-custom') {
                                const childrenCustom = document.querySelector(item.childrenSelector);

                                childrenCustom.style.display = 'block';
                            } else {
                                const menuChildren = document.querySelectorAll(
                                    `.${cx('item__setting')}[data-index="${item.indexChildren}"]`,
                                );

                                menuChildren.forEach((menu) => {
                                    menu.style.display = 'flex';
                                });
                            }

                            titleChildren.style.display = 'flex';

                            menuParent.forEach((menu) => {
                                menu.style.display = 'none';
                            });
                        };
                    } else {
                        props['data-parent'] = currentMenu.indexParent;
                        props.style = {
                            display: 'none',
                        };

                        if (item.type === 'playbackRate') {
                            props.onClick = (e) => {
                                e.stopPropagation();

                                let optionSelected;

                                const iconCheck = document.querySelector(
                                    `.${cx('pos-absolute')}[style="display: block;"]`,
                                );
                                // Ẩn icon đang hiện
                                if (iconCheck) {
                                    iconCheck.style.display = 'none';
                                }

                                let clickElement = e.target;

                                (() => {
                                    while (!clickElement.className.includes(cx('item__setting'))) {
                                        clickElement = clickElement.parentElement;
                                    }
                                })();

                                // Sau function bên trên clickElement -> element item__setting
                                clickElement.firstChild.firstChild.style.display = 'block';
                                optionSelected = clickElement.firstChild.innerText;

                                const menuPlaybackRate = document.querySelector(
                                    `.${cx('item__setting')}[data-index="1"][data-type="playbackRate"]`,
                                );

                                menuPlaybackRate.lastChild.firstChild.textContent = optionSelected;

                                if (optionSelected === 'Chuẩn') {
                                    optionSelected = '1';
                                }

                                currentMenu.optionSelected = parseFloat(optionSelected);

                                menu.current.data.forEach((menu) => {
                                    if (menu.type === item.type) {
                                        menu.content = parseFloat(optionSelected);
                                    }
                                });

                                handleOnBack(e);
                            };
                        }
                    }

                    if (item.type) {
                        props['data-type'] = item.type;
                    }

                    props['data-index'] = currentMenu.index;

                    result = [
                        ...result,
                        <div className={cx('item__setting', item.className)} key={item.id} {...props}>
                            <span className={cx('item__title')}>
                                {item.iconLeft}

                                <CheckIcon
                                    className={cx('pos-absolute')}
                                    style={{ display: item.title === currentMenu.optionSelected ? 'block' : 'none' }}
                                />

                                {item.title === 1 ? 'Chuẩn' : item.title}
                            </span>
                            <span className={cx('item__content')}>
                                {item.content === 1 ? 'Chuẩn' : item.content}
                                {item.iconRight}
                            </span>
                        </div>,
                    ];

                    if (isParent) {
                        renderMenu(item.children);
                    }
                });
            }
        };

        renderMenu(menu.current);

        // currentMenu[currentMenu.length - 1].data.forEach((item) => {
        //     const isParent = !!item.children;
        //     let props = {};

        //     if (isParent) {
        //         props.onClick = (e) => {
        //             e.stopPropagation();

        //             setCurrentMenu((prev) => [...prev, item.children]);
        //         };
        //     } else if (currentMenu.length > 1) {
        //         props.onClick = (e) => {
        //             e.stopPropagation();

        //             const optionSelected =
        //                 e.target.firstChild.innerText === 'Chuẩn' ? '1' : e.target.firstChild.innerText;

        //             currentMenu[currentMenu.length - 1].optionSelected = parseFloat(optionSelected);

        //             currentMenu[currentMenu.length - 2].data.forEach((menu) => {
        //                 if (menu.type === item.type) {
        //                     menu.content = e.target.firstChild.innerText;
        //                 }
        //             });

        //             handleOnBack(e);
        //         };
        //     }

        //     result = [
        //         ...result,
        //         <div
        //             className={cx('item__setting', item.className)}
        //             key={item.id}
        //             {...props}
        //             data-type={!isParent && item.type}
        //         >
        //             <span className={cx('item__title')}>
        //                 {item.iconLeft}
        //                 {item.title === currentMenu[currentMenu.length - 1].optionSelected && (
        //                     <CheckIcon className={cx('pos-absolute')} />
        //                 )}
        //                 {item.title === 1 ? 'Chuẩn' : item.title}
        //             </span>
        //             <span className={cx('item__content')}>
        //                 {item.content === 1 ? 'Chuẩn' : item.content}
        //                 {item.iconRight}
        //             </span>
        //         </div>,
        //     ];

        //     if (isParent) {
        //         console.log(item.children.data);
        //         if (item.children.type === 'self-custom') {
        //             result = [...result, item.children.data];
        //         } else {
        //             item.children.data.forEach((subItem) => {
        //                 result = [
        //                     ...result,
        //                     <div
        //                         className={cx('item__setting', subItem.className)}
        //                         key={subItem.id}
        //                         {...props}
        //                         data-type={!isParent && subItem.type}
        //                     >
        //                         <span className={cx('item__title')}>
        //                             {subItem.iconLeft}
        //                             {subItem.title === currentMenu[currentMenu.length - 1].optionSelected && (
        //                                 <CheckIcon className={cx('pos-absolute')} />
        //                             )}
        //                             {subItem.title === 1 ? 'Chuẩn' : subItem.title}
        //                         </span>
        //                         <span className={cx('item__content')}>
        //                             {subItem.content === 1 ? 'Chuẩn' : subItem.content}
        //                             {subItem.iconRight}
        //                         </span>
        //                     </div>,
        //                 ];
        //             });
        //         }
        //     }
        // });

        return result;
    };

    return (
        <div className={cx('menu__setting')} style={{ display: 'none' }}>
            {renderData()}
        </div>
    );
}

export default MenuSetting;
