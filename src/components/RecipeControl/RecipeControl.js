import React from'react';

import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';

const RecipeControl = (props) => {
    return (
        <div className={classes.RecipeControl}>
            <Input autoPopulate={props.values && props.values.ven && !props.values.ven.touched && props.values.ven.value !== ''} id={props.id}
                   value={props.values && props.values.ven ? props.values.ven.value : ''} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change} readOnly={props.readOnly}/>
            <Input autoPopulate={props.values && props.values.flavor && !props.values.flavor.touched && props.values.flavor.value !== ''}
                   id={props.id} value={props.values && props.values.flavor ? props.values.flavor.value : ''} type="text" name='flavor' placeholder="Flavor Name" change={props.change} readOnly={props.readOnly}/>
            <Input autoPopulate={props.values && props.values.percent && !props.values.percent.touched && props.values.percent.value !== ''} valid={props.valid}
                   value={props.values && props.values.percent ? props.values.percent.value : ''} id={props.id} type="number" name='percent' placeholder="0" min="0" maxLength="5" change={props.change} readOnly={props.readOnly}/>
            <p>%</p>
        </div>
    );
};

export default RecipeControl;