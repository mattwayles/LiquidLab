import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.valid === false) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case ('select'):
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    value={props.value}
                    onChange={props.change}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.change}
                placeholder="0"
            />;

    }
    return (
        <div style={{height: '0'}}>
            <label>{props.label}</label>
            {inputElement}
        </div>
    );
};

export default input;