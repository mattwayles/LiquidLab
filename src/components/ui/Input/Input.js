import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.classes) {
        inputClasses.push(props.classes);
    }

    if (props.autoPopulate) {
        inputClasses.push(classes.AutoPopulated);
    }

    if (props.valid === false) {
        inputClasses.push(classes.Invalid);
    }

    switch (props.elementType) {
        case ('select'):
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    name={props.name}
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
                autoFocus={props.autoFocus}
                className={inputClasses.join(' ')}
                id={props.id}
                name={props.name}
                type={props.type}
                {...props.elementConfig}
                value={props.value}
                onChange={props.change}
                onBlur={props.blur}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
            />;

    }
    return (
        <div>
            <label>{props.label}</label>
            {inputElement}
        </div>
    );
};

export default input;