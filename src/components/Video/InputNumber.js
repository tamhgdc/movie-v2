import { useState } from 'react';

function InputNumber({ id, name, className }) {
    const [value, setValue] = useState('');

    const handleOnChange = (e) => {
        if (Number.isInteger(Number(e.target.value)) || !e.target.value) {
            setValue(() => e.target.value);
        }
    };

    const handleOnKeyDown = (e) => {
        e.stopPropagation();
    };

    return (
        <input
            type="text"
            id={id}
            name={name}
            className={className}
            value={value}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
        />
    );
}

export default InputNumber;
