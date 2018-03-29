import React from'react';

import Auxil from '../../hoc/Auxil';
import Button from '../ui/Button/Button';
import classes from './RecipeControl.css';

const RecipeControl = (props) => {
    let controlArr = [];

    controlArr.push(setControl('row' + props.id + 'col0', props.change));
    if (props.extra) {
        controlArr.push(setControl('row' + props.id + 'col1', props.change));
    }
    else if (props.plus) {
        controlArr.push(<button key="plusBtn" className={classes.PlusButton} onClick={props.plusClicked} >+</button>);
    }
    else if (props.buttons) {
        let buttons =
            <div key="recipeBtns" className={classes.RecipeButtons}>
                <Button clicked={props.calculate} >Calculate</Button>
                <Button disabled clicked={null} >Save</Button>
                <Button disabled clicked={null} >Delete</Button>

            </div>;
        controlArr.push(buttons);
    }

    return(
        <div className={classes.RecipeControl}>
            {controlArr}
        </div>
    );
};

const input = (value, maxLength) => {

    return value.slice(0,maxLength);
}

const setControl = (key, change) => {
    const ven = key + '_ven';
    const flavor = key + '_flavor';
    const percent = key + '_percent';

    return <Auxil key={key}>
        <input name={ven} type="text" placeholder="Ven" onChange={change}/>
        <input name={flavor} type="text" placeholder="Flavor Name" onChange={change}/>
        <input name={percent} type="number" maxLength="5" onChange={change}/>
        <p>%</p>
    </Auxil>;
};


export default RecipeControl;