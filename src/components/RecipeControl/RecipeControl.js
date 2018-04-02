import React from'react';

import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';

const RecipeControl = (props) => (
    <div className={classes.RecipeControl}>
        <Input id={props.id} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change}/>
        <Input id={props.id} type="text" name='flavor' placeholder="Flavor Name" change={props.change}/>
        <Input valid={props.valid} id={props.id} type="number" name='percent' placeholder="0" maxLength="5" change={props.change}/>
        <p>%</p>
    </div>
);

export default RecipeControl;