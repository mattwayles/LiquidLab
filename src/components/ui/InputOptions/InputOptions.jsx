import React from 'react';
import classes from './InputOptions.css';

const inputOptions = (props) => {

    return (
        <div className={props.class}>
            {props.options.map(option => {
                return <option onMouseDown={(e) => props.mouseDown(e, props.row, props.name, option)}
                               className={classes.Option} key={option}>{option}</option>
            })}
        </div>
    );
};

export default inputOptions;