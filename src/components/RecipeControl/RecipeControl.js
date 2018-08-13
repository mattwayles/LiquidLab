import React from'react';
import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';
import InputOptions from "../ui/InputOptions/InputOptions";

const RecipeControl = (props) => {
    const venNotEmpty = (props.values && props.values.ven && props.values.ven.value !== '') && (props.list.length > 0);
    const nameNotEmpty = (props.values && props.values.flavor && props.values.flavor.value !== '') && (props.list.length > 0);

    let list = Array.from(new Set(props.list));

    return (
        <div className={classes.RecipeControl}>
            <Input autoPopulate={props.values && props.values.ven && !props.values.ven.touched && props.values.ven.value !== ''} id={props.id}
                   value={props.values && props.values.ven ? props.values.ven.value : ''} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change} readOnly={props.readOnly} keyDown={props.keyDown}
                    focus={(e) => props.focus(e, 'ven')} blur={(e) => props.blur(e, 'ven')} />
            {parseInt(props.display.ven.row,10) === props.id && props.display.ven.display && venNotEmpty ? <InputOptions class={classes.InputOptionVen} row={props.id} name="ven" keyDown={props.keyDown} mouseDown={props.optionClick} active={props.cursor} options={list} /> : null}
            <Input autoPopulate={props.values && props.values.flavor && !props.values.flavor.touched && props.values.flavor.value !== ''}
                   id={props.id} value={props.values && props.values.flavor ? props.values.flavor.value : ''} type="text" name='flavor' placeholder="Flavor Name" change={props.change} readOnly={props.readOnly} keyDown={props.keyDown}
                   focus={(e) => props.focus(e, 'name')} blur={(e) => props.blur(e, 'name')} />
            {parseInt(props.display.name.row,10) === props.id && props.display.name.display && nameNotEmpty ? <InputOptions class={classes.InputOptionFlavor} row={props.id} name="flavor" keyDown={props.keyDown} mouseDown={props.optionClick} active={props.cursor} options={list} /> : null}
            <Input autoPopulate={props.values && props.values.percent && !props.values.percent.touched && props.values.percent.value !== ''} valid={props.values && props.valid}
                   value={props.values && props.values.percent ? props.values.percent.value : ''} id={props.id} type="number" name='percent' placeholder="0" min="0" maxLength="5" change={props.change} readOnly={props.readOnly} />
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
