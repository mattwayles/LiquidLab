import React from 'react';

import classes from './Input.css';

/**
 * A standard LiquidLab Input object
 * @param props
 * @returns {*}
 */
const input = (props) => {
    //All inputs receive InputElement styling
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    //Specialized styling
    if (props.classes) {
        inputClasses.push(props.classes);
    }

    //Auto-populated styling
    if (props.autoPopulate && props.valid !== false) {
        inputClasses.push(classes.AutoPopulated);
    }
    else if (props.valid === false) { //Invalid styling
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