import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';
import RecipeControl from '../../../../components/RecipeControl/RecipeControl';
import BatchSelect from '../../../../components/ui/BatchSelect/BatchSelect';
import classes from './Recipe.css';


class Recipe extends Component {
    state = {
        recipeControls: []
    };

    componentWillMount () {
        let recipeControlArray = this.state.recipeControls;
        let controlId = 0;

        recipeControlArray.push({id: controlId, extra: false, plus: true, buttons: false});
        controlId++;
        for (let i = 0; i < 6; i++) {
            recipeControlArray.push({id: controlId, extra: false, plus: false, buttons: false});
            controlId++;
        }
        recipeControlArray.push({id: controlId, extra: false, plus: false, buttons: true});

        this.setState({ recipeControls: recipeControlArray });
    }

    plusClickedHandler = () => {
        let controlId = 0;
        let recipeControlArray = [...this.state.recipeControls];

        for (let i = 0; i < recipeControlArray.length - 1; i++) {
            recipeControlArray[i].id++;
        }
        recipeControlArray.unshift({id: controlId, extra: true, plus: false, buttons: false});
        recipeControlArray.splice(recipeControlArray.length - 2, 1);

        this.setState({ recipeControls: recipeControlArray });
    };

    enforceMaxLength = (value, maxLength) => {
        if (maxLength >= 0) {
            return value.slice(0, maxLength)
        }
        else {
            return value;
        }
    };

    dataEnteredHandler = (event) => {
        event.target.value = this.enforceMaxLength(event.target.value, event.target.maxLength);

        let exists = false;
        let updatedFlavors = [...this.props.flavors];

        const controlAndField = event.target.name.split("_");
        const control = controlAndField[0];
        const field = controlAndField[1];

        for(let i = 0; i < updatedFlavors.length; i++) {
            if (updatedFlavors[i].control === control) {
                let updatedFlavor = {
                    ...updatedFlavors[i],
                    [field]: event.target.value};
                exists = true;
                updatedFlavors[i] = updatedFlavor;
            }
        }
        if (!exists) {
            updatedFlavors.push({
                control: control,
                [field]: event.target.value})
        }
        this.props.onDataEntered(updatedFlavors);
        
    };

    render () {
        let controls = this.state.recipeControls.map(control => (
            <RecipeControl
                key={control.id}
                id={control.id}
                ven={control.ven}
                plus={control.plus}
                extra={control.extra}
                buttons={control.buttons}
                plusClicked={this.plusClickedHandler}
                change={this.dataEnteredHandler}
                calculate={this.props.clicked}
            />
        ));

        return(
            <div className={classes.Recipe}>
                <div className={classes.RecipeInner}>
                    <p className={classes.Header}>Recipe</p>
                    <div className={classes.RecipeName} >
                        <input className={classes.RecipeNameInput} type="text" placeholder="Recipe Name"/>
                        <BatchSelect className={classes.Batch} />
                    </div>
                    {controls}
                </div>
            </div>
        )}
};

const mapStateToProps = state => {
    return {
       flavors: state.formula.flavors
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (arr) => dispatch(actions.recipeDataEntered(arr)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);