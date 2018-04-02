import React from'react';

import classes from './RecipeControl.css';

const RecipeControl = (props) => (
    <div className={classes.RecipeControl}>
        <input id={props.id} name='ven' type="text" placeholder="Ven" maxLength="4" onChange={props.change}/>
        <input id={props.id} type="text" name='flavor' placeholder="Flavor Name" onChange={props.change}/>
        <input id={props.id} type="number" name='percent' placeholder="0" maxLength="5" onChange={props.change}/>
        <p>%</p>
    </div>
);

export default RecipeControl;