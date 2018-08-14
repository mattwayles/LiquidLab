import React from 'react';

import classes from './Button.css';

/**
 * A specialized button for the main page
 * @param props
 * @returns {*}
 */
const button = (props) => (
    <button
        className={classes.MainButton}
        disabled = {props.disabled}
        onClick={props.clicked}
    >
        {props.children}
    </button>
);

export default button;