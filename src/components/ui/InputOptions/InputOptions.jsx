import React from 'react';
import classes from './InputOptions.css';

const inputOptions = (props) => {
    return (
        <div className={props.class}>
            {props.options.map(option => {
                let classname = props.active === props.options.indexOf(option) ? classes.ActiveOption : classes.Option;
                return <option onKeyDown={(e) => props.keyDown(e, props.row, props.name, option)} onMouseDown={(e) => props.mouseDown(e, props.row, props.name, option)}
                               className={classname} key={option}>{option}</option>
            })}
        </div>
    );
};

export default inputOptions;