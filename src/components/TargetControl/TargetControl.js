import React from'react';
import Input from '../ui/Input/Input'

import classes from './TargetControl.css';

/**
 * Produce the three-component controls for the Target items (NIC, PG, VG, Notes)
 */
const TargetControl = (props) => (
            <div className={classes.TargetControl}>
                <p>{props.label}</p>
                {props.autofocus ?
                    <Input
                        autoPopulate={props.autoPopulate}
                        value={props.value}
                        valid={props.valid}
                        change={props.change}
                        type={props.type}
                        maxLength={props.maxLength}
                        tooltip={props.tooltip}
                        placeholder="0"
                        autoFocus/>
                    : <Input
                        autoPopulate={props.autoPopulate}
                        value={props.value}
                        valid={props.valid}
                        change={props.change}
                        type={props.type}
                        maxLength={props.maxLength}
                        tooltip={props.tooltip}
                        placeholder="0"
                        />
                }
                <p>{props.suffix}</p>
            </div>
        );

export default TargetControl;
