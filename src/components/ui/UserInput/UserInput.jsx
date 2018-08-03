import React from 'react';
import classes from './UserInput.css';

const userInput = (props) => {
    const inputClasses = [classes.InputElement];

    if (props.invalid === true) {
        inputClasses.push(classes.Invalid);
    }

    return(
            <div>
                <input
                    autoFocus={props.autofocus}
                    className={inputClasses.join(' ')}
                    id={props.id}
                    type={props.type}
                    value={props.value}
                    onChange={props.change}
                    placeholder={props.placeholder}
                />
            </div>
    );
};

export default userInput;