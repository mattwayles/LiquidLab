import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.classes) {
        inputClasses.push(props.classes);
    }

    if (props.autoPopulate && props.valid !== false) {
        inputClasses.push(classes.AutoPopulated);
    }
    else if (props.valid === false) {
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
                onKeyDown={props.keyDown}
                onFocus={props.focus}
                readOnly={props.readOnly}
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
                min={props.min}
                maxLength={props.maxLength}
                onPaste={props.paste}
                onCopy={props.copy}
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