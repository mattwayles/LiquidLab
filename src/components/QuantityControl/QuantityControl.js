import React from'react';
import Auxil from '../../hoc/Auxil';
import Input from '../ui/Input/Input'

import classes from './QuantityControl.css';

const QuantityControl = (props) => {
    let control =
        <Auxil>
            <p>{props.label}</p>
            {props.autofocus ?
                <Input valid={props.valid} change={props.change} type={props.type} maxLength={props.maxLength} placeholder="0" autoFocus/>
                : <Input valid={props.valid} change={props.change} type={props.type} maxLength={props.maxLength} placeholder="0" />
            }
            <p>{props.suffix}</p> 
        </Auxil>;

    if (props.type === 'textarea') {
        control =
            <Auxil>
                <textarea onChange={props.change} type={props.type} placeholder="Notes" />
            </Auxil>;
    }

        return (
            <div className={classes.QuantityControl}>
                {control}
            </div>
        )
    };


export default QuantityControl;
