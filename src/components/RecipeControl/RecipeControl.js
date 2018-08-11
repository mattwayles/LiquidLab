import React from'react';
import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';
import InputOptions from "../ui/InputOptions/InputOptions";

const RecipeControl = (props) => {
    const venNotEmpty = props.values && props.values.ven && props.values.ven.value !== '';
    const nameNotEmpty = props.values && props.values.flavor && props.values.flavor.value !== '';

    return (
        <div className={classes.RecipeControl}>
            <Input autoPopulate={props.values && props.values.ven && !props.values.ven.touched && props.values.ven.value !== ''} id={props.id}
                   value={props.values && props.values.ven ? props.values.ven.value : ''} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change} readOnly={props.readOnly}
                    focus={(e) => props.focus(e, 'ven')} blur={(e) => props.blur(e, 'ven')}/>
            {parseInt(props.displayVen.row,10) === props.id && props.displayVen.display && venNotEmpty ? <InputOptions class={classes.InputOptionVen} row={props.id} name="ven" mouseDown={props.optionClick} options={props.venList} /> : null}
            <Input autoPopulate={props.values && props.values.flavor && !props.values.flavor.touched && props.values.flavor.value !== ''}
                   id={props.id} value={props.values && props.values.flavor ? props.values.flavor.value : ''} type="text" name='flavor' placeholder="Flavor Name" change={props.change} readOnly={props.readOnly}
                   focus={(e) => props.focus(e, 'flavor')} blur={(e) => props.blur(e, 'flavor')}/>
            {parseInt(props.displayName.row,10) === props.id && props.displayName.display && nameNotEmpty ? <InputOptions class={classes.InputOptionFlavor} row={props.id} name="flavor" mouseDown={props.optionClick} options={props.flavorList} /> : null}
            <Input autoPopulate={props.values && props.values.percent && !props.values.percent.touched && props.values.percent.value !== ''} valid={props.valid}
                   value={props.values && props.values.percent ? props.values.percent.value : ''} id={props.id} type="number" name='percent' placeholder="0" min="0" maxLength="5" change={props.change} readOnly={props.readOnly}/>
            <p>%</p>
        </div>
    );
};

export default RecipeControl;
//
// Combobox containerClassName={classes.InputElement}
// data={options}
// placeholder="ven"
// open={displayVen}/>
