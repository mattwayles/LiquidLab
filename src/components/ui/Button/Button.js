import React from 'react';

import classes from './Button.css';

/**
 * A standard LiquidLab button
 * @param props
 * @returns {*}
 */
const button = (props) => (
    <button
        className={classes.Button}
        disabled = {props.disabled}
        onClick={props.clicked}
    >
        {props.children}
    </button>
);

export default button;