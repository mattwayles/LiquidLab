import React from'react';
import Input from '../ui/Input/Input';
import classes from './RecipeControl.css';
import * as ToolTip from '../../constants/Tooltip';
import InputOptions from "../ui/InputOptions/InputOptions";

const RecipeControl = (props) => {
    const venNotEmpty = (props.values && props.values.ven && props.values.ven.value !== '');
    const nameNotEmpty = (props.values && props.values.flavor && props.values.flavor.value !== '');
    const percentNotEmpty = (props.values && props.values.percent && props.values.percent.value !== '');

    return (
        <div className={classes.RecipeControl}>
            <Input autoPopulate={venNotEmpty && !props.values.ven.touched} id={props.id}
                   tooltip={ToolTip.VENDOR}
                   value={props.values && props.values.ven ? props.values.ven.value : ''} name='ven' type="text" placeholder="Ven" maxLength="4" change={props.change} readOnly={props.readOnly} keyDown={props.keyDown}
                    focus={(e) => props.focus(e, 'ven')} blur={(e) => props.blur(e, 'ven')} />
            {parseInt(props.display.ven.row,10) === props.id && props.display.ven.display && venNotEmpty &&  props.list.length > 0 ? <InputOptions class={classes.InputOptionVen} row={props.id} name="ven" keyDown={props.keyDown} mouseDown={props.optionClick} active={props.cursor} options={props.list} /> : null}
            <Input autoPopulate={nameNotEmpty && !props.values.flavor.touched}
                   tooltip={ToolTip.FLAVOR}
                   id={props.id} value={props.values && props.values.flavor ? props.values.flavor.value : ''} type="text" name='flavor' placeholder="Flavor Name" change={props.change} readOnly={props.readOnly} keyDown={props.keyDown}
                   focus={(e) => props.focus(e, 'name')} blur={(e) => props.blur(e, 'name')} />
            {parseInt(props.display.name.row,10) === props.id && props.display.name.display && nameNotEmpty &&  props.list.length > 0 ? <InputOptions class={classes.InputOptionFlavor} row={props.id} name="flavor" keyDown={props.keyDown} mouseDown={props.optionClick} active={props.cursor} options={props.list} /> : null}
            <Input autoPopulate={percentNotEmpty && !props.values.percent.touched} valid={props.values && props.valid}
                   tooltip={props.valid ? ToolTip.PERCENT : ToolTip.PERCENT_ERROR}
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
