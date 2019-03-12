import React from 'react';
import classes from './UserInput.css';
import Auxil from "../../../hoc/Auxil";

/**
 * User Input object
 * @param props
 * @returns {*}
 */
const userInput = (props) => {
    const inputClasses = [classes.InputElement];

    if (props.invalid === true) {
        inputClasses.push(classes.Invalid);
    }

    return(
        <Auxil>
            <div data-tip={props.tooltip}>
                <input
                    autoFocus={props.autofocus}
                    className={inputClasses.join(' ')}
                    id={props.id}
                    type={props.type}
                    value={props.value}
                    onChange={props.change}
                    onKeyPress={props.enter}
                    placeholder={props.placeholder}
                />
            </div>
        </Auxil>
    );
};

export default userInput;