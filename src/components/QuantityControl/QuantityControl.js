import React from'react';
import Input from '../ui/Input/Input'

import classes from './QuantityControl.css';

const QuantityControl = (props) => (
            <div className={classes.QuantityControl}>
                <p>{props.label}</p>
                {props.autofocus ?
                    <Input valid={props.valid} change={props.change} type={props.type} maxLength={props.maxLength} placeholder="0" autoFocus/>
                    : <Input valid={props.valid} change={props.change} type={props.type} maxLength={props.maxLength} placeholder="0" />
                }
                <p>{props.suffix}</p>
            </div>
        );

export default QuantityControl;
