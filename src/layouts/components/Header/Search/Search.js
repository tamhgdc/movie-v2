import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { SearchIcon, LoadingIcon, CloseIcon } from '~/components/icons';
import styles from './Search.module.scss';
import useDebounce from '~/hooks/useDebounce';

const cx = classNames.bind(styles);

function Search({ classNames }) {
    const [inputValue, setInputValue] = useState('');

    const delay = 500;

    const debounceValue = useDebounce(inputValue, delay);

    useEffect(() => {}, [debounceValue]);

    const handleChangeValueInput = (e) => {
        if (!e.target.value.startsWith(' ')) {
            setInputValue(e.target.value);
        }
    };

    const className = cx('wrapper', {
        [classNames]: !!classNames,
    });

    return (
        <div className={className}>
            <input
                className={cx('search__input')}
                value={inputValue}
                onChange={handleChangeValueInput}
                placeholder="Tìm kiếm phim"
            />
            {!!inputValue && <CloseIcon className={cx('close__icon', 'icon')} />}
            {/* <LoadingIcon className={cx('loading__icon', 'icon')} /> */}
            <SearchIcon className={cx('search__icon')} width="2.2rem" height="2.2rem" />
        </div>
    );
}

export default Search;
