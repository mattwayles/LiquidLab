import React, { Component } from 'react';

import { connect } from 'react-redux';
import { enforceInputConstraints } from '../../../../util/shared';
import * as actions from '../../../../store/actions/index';
import RecipeControl from '../../../../components/RecipeControl/RecipeControl';
import BatchSelect from '../../../../components/ui/BatchSelect/BatchSelect';
import classes from './Recipe.css';
import {formulaIsEmpty, setInvalidFlavor} from "../../../../util/formulaUtil";
import MainButton from "../../../../components/ui/Button/MainButton";


class Recipe extends Component {
    state = {
        col1Controls: [],
        col2Controls: [],
        index: 0,
        selectedOption: null,
        displayVen: {row: -1, display: false},
        displayName: {row: -1, display: false},
        filterVen: null,
        filterName: null
    };

    componentWillMount () {
        let col1ControlArray = [...this.state.col1Controls];
        let controlId = this.state.index;

        for (let i = 0; i < 8; i++) {
            col1ControlArray.push({id: controlId});
            controlId++;
        }

        let col2ControlArray = [...this.state.col2Controls];
        col2ControlArray.push({ type: 'button'});

        this.setState({ col1Controls: col1ControlArray, col2Controls: col2ControlArray, index: controlId });
    }


    plusClickedHandler = () => {
        let col2ControlArray = [...this.state.col2Controls];

        if (this.state.index === 14) {
            col2ControlArray.splice(col2ControlArray.length - 1, 0, {id: this.state.index});
            col2ControlArray.splice(-1, 1);
            this.setState({col2Controls: col2ControlArray})
        }
        else {
            col2ControlArray.splice(col2ControlArray.length - 1, 0, {id: this.state.index});
            this.setState({col2Controls: col2ControlArray, index: this.state.index + 1});
        }
    };

    flavorDataEnteredHandler = (event) => {
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);

        let exists = false;
        let updatedFlavors = [...this.props.flavors];

        for(let i = 0; i < updatedFlavors.length; i++) {
            if (updatedFlavors[i].control === event.target.id) {
                let updatedFlavor = {
                    ...updatedFlavors[i],
                    [event.target.name]: {value: event.target.value, touched: true}};
                exists = true;
                if (event.target.name === 'percent') {
                    const valid = setInvalidFlavor(updatedFlavor, this.props.input, this.props.weights, this.props.inventory, this.props.input.mlToMake.value).valid;
                    updatedFlavor = {...updatedFlavor, valid: valid};
                }
                updatedFlavors[i] = updatedFlavor;
            }
        }
        if (!exists) {
            updatedFlavors.push({
                control: event.target.id,
                [event.target.name]: {value: event.target.value, touched: true}})
        }

        this.props.onDataEntered(updatedFlavors);
        if (event.target.name === 'ven') {
            this.setState({ filterVen: event.target.value});
        }
        else {
            this.setState({ filterName: event.target.value})
        }
    };

    optionHandler = (e, control) => {
        if (control === 'ven') {
            this.setState({ displayVen: {row: e.target.id, display: !this.state.displayVen.display }});
        }
        else {
            this.setState({ displayName: {row: e.target.id, display: !this.state.displayName.display }});
        }
    };


    optionClickedHandler = (e, id, control, selection) => {
        let flavors = [...this.props.flavors];
        for (let f in flavors) {
            if (parseInt(flavors[f].control,10) === id) {
                flavors[f][control] = {value: selection, touched: false};
            }
        }
        this.props.onDataEntered(flavors);
    };


    render () {
        const { col1Controls, col2Controls } = this.state;
        const { input, flavors, token, recipeKey, recipes, inventory } = this.props;

        //TODO: Move to util
        let venList = [];
        let flavorList = [];
        for (let i in inventory) {
            if (inventory[i].vendor) {
                if (inventory[i].vendor.includes(this.state.filterVen)) {
                    venList.push(inventory[i].vendor)
                }
            }
            if (inventory[i].name.includes(this.state.filterName)) {
                flavorList.push(inventory[i].name);
            }
        }



        //TODO: Move to util, this can be optimized!
        let recipeControl1 = null;
        let controls = col1Controls.map(control => {
            let valid = null;

            if (recipeKey) {
                let recipe = null;
                for (let r in recipes) {
                    if (r === recipeKey) {
                        recipe = recipes[r];
                    }
                }
                if (recipe) {
                    for (let i = 0; i < flavors.length; i++) {
                        if (parseInt(recipe.flavors[i].control,10) === control.id) {
                            valid = flavors[i].valid !== false ?
                                setInvalidFlavor(flavors[i], this.props.input, this.props.weights, this.props.inventory, this.props.input.mlToMake.value).valid : false;
                        }
                    }
                }
            }
            else if (flavors) {

                for (let i = 0; i < flavors.length; i++) {
                    if (+flavors[i].control === control.id) {
                        valid = flavors[i].valid !== false;
                    }
                }
            }

            let readOnly = false;
            if (flavors && flavors.length < control.id) {
                readOnly = true;
            }

            recipeControl1 =
                <RecipeControl
                    readOnly={readOnly}
                    values={flavors ? flavors[control.id] : null}
                    key={control.id}
                    id={control.id}
                    valid={valid}
                    optionClick={this.optionClickedHandler}
                    plusClicked={this.plusClickedHandler}
                    change={this.flavorDataEnteredHandler}
                    displayVen={this.state.displayVen}
                    displayName={this.state.displayName}
                    focus={this.optionHandler}
                    blur={this.optionHandler}
                    calculate={this.props.clicked}
                    venList={venList}
                    flavorList={flavorList}
                />;
            return recipeControl1;
        });

        let recipeControl2 = null;
        let controls2 = col2Controls.map(control => {
            if (control.type === 'button') {
                return (
                    <button
                        key="plusBtn"
                        disabled={flavors && flavors.length < 8}
                        className={flavors && flavors.length < 8 ? classes.PlusButtonDisabled : classes.PlusButton}
                        onClick={this.plusClickedHandler}
                    >+</button>
                )
            }
            else {
                let valid = null;

                if (recipeKey) {
                    let recipe = null;
                    for (let r in recipes) {
                        if (r === recipeKey) {
                            recipe = recipes[r];
                        }
                    }
                    if (recipe) {
                        for (let i = 0; i < flavors.length; i++) {
                            if (parseInt(recipe.flavors[i].control,10) === control.id) {
                                valid = flavors[i].valid !== false ?
                                    setInvalidFlavor(flavors[i], this.props.input, this.props.weights, this.props.inventory, this.props.input.mlToMake.value).valid : false;
                            }
                        }
                    }
                }
                else if (flavors) {

                    for (let i = 0; i < flavors.length; i++) {
                        if (+flavors[i].control === control.id) {
                            valid = flavors[i].valid !== false;
                        }
                    }
                }

                let readOnly = false;
                if (flavors && flavors.length < control.id) {
                    readOnly = true;
                }

                recipeControl2 =
                    <RecipeControl
                        classes={classes}
                        readOnly={readOnly}
                        values={flavors ? flavors[control.id] : null}
                        key={control.id}
                        id={control.id}
                        valid={valid}
                        plusClicked={this.plusClickedHandler}
                        change={this.testChange}
                        selectedOption={this.state.selectedOption}
                        //change={this.flavorDataEnteredHandler}
                        calculate={this.props.clicked}
                    />;
                    return recipeControl2;
            }
        });


        return(
            <div className={classes.Recipe}>
                <div className={classes.RecipeInner}> 
                    <p className={classes.Header}>Recipe</p>
                    <div className={classes.RecipeName} >
                        <input className={!input.name.touched && input.name.value !== '' ?
                            classes.RecipeNameInputAuto : classes.RecipeNameInput}
                               value={input.name.value}
                               type="text"
                               placeholder="Recipe Name"
                                onChange={(event) => this.props.onInputDataEntered('name', event.target.value)} />
                        <BatchSelect classes={classes.Batch} value={input.batch.value}
                                     changed={(event) => this.props.onInputDataEntered('batch', event.target.value)} />
                    </div>
                    <div className={classes.Col1}>
                        {controls}
                    </div>
                    <div className={classes.Col2}>
                        {controls2}
                    </div>
                    <div className={classes.RecipeButtons}>
                        <MainButton disabled={recipeKey === ''} clicked={this.props.delete} >Delete</MainButton>
                        <MainButton disabled={!token || input.name.value === ""}
                                clicked={this.props.save} >{recipeKey ? "Update" : "Save"}</MainButton>
                        <MainButton disabled={formulaIsEmpty(this.props.input, this.props.flavors)} clicked={this.props.clear} >Clear</MainButton>
                        <MainButton clicked={this.props.calculate} >Calculate</MainButton>
                    </div>
                </div>
            </div>
        )}
}

const mapStateToProps = state => {
    return {
        recipeKey: state.formula.key,
        input: state.formula.inputs,
        flavors: state.formula.flavors,
        token: state.auth.userId,
        weights: state.formula.weights,
        inventory: state.inventory.flavors,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (arr) => dispatch(actions.recipeDataEntered(arr)),
        onInputDataEntered: (control, value) => dispatch(actions.inputDataEntered(control, value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);