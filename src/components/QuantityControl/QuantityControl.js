import React from'react';
import Auxil from '../../hoc/Auxil';

import classes from './QuantityControl.css';

const QuantityControl = (props) => {
    let control =
        <Auxil>
            <p>{props.label}</p>
            {props.autofocus ?
                <input onChange={props.change} type={props.type} maxLength={props.maxLength} autoFocus/>
                : <input onChange={props.change} type={props.type} maxLength={props.maxLength} />
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
