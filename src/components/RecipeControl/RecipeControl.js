import React from'react';
import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';
import InputOptions from "../ui/InputOptions/InputOptions";
import { Combobox } from 'react-widgets';

const RecipeControl = (props) => {

     //TODO: Try to keep working with this ComboBox component....

    let displayVen = false;
    let displayName = false;
    let options=["TFA", "FA", "FLV"];
    for (let o in options) {
        if (props.values && props.values.ven && props.values.ven.value !== '') {
            displayVen = true;
            if (props.values.ven.value === options[o]) {
                displayVen = false;
                break;
            }
        }
    }
    for (let o in options) {
        if (props.values && props.values.flavor && props.values.flavor.value !== '') {
            displayName = true;
            if (props.values.flavor.value === options[o]) {
                displayName = false;
                break;
            }
        }
    }

    return (
        <div className={classes.RecipeControl}>
            <Combobox containerClassName={classes.InputElement}
                        data={options}
                        placeholder="ven"
                        open={displayVen}/>
            <Input autoPopulate={props.values && props.values.flavor && !props.values.flavor.touched && props.values.flavor.value !== ''}
                   id={props.id} value={props.values && props.values.flavor ? props.values.flavor.value : ''} type="text" name='flavor' placeholder="Flavor Name" change={props.change} readOnly={props.readOnly}/>
            {displayName ? <InputOptions class={classes.InputOptionFlavor} row={props.id} name="flavor" click={props.optionClick} options={options} /> : null}
            <Input autoPopulate={props.values && props.values.percent && !props.values.percent.touched && props.values.percent.value !== ''} valid={props.valid}
                   value={props.values && props.values.percent ? props.values.percent.value : ''} id={props.id} type="number" name='percent' placeholder="0" min="0" maxLength="5" change={props.change} readOnly={props.readOnly}/>
            <p>%</p>
        </div>
    );
};

export default RecipeControl;
//
// <Input autoPopulate={props.values && props.values.ven && !props.values.ven.touched && props.values.ven.value !== ''} id={props.id}
//        value={props.values && props.values.ven ? props.values.ven.value : ''} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change} readOnly={props.readOnly}/>