import React, { Component } from 'react';

import { connect } from 'react-redux';
import { enforceInputConstraints } from '../../../../util/shared';
import * as actions from '../../../../store/actions/index';
import BatchSelect from '../../../../components/ui/BatchSelect/BatchSelect';
import classes from './Recipe.css';
import {formulaIsEmpty} from "../../../../util/formulaUtil";
import {mapControls, populateList, updateFlavors} from "../../../../util/recipeUtil";
import MainButton from "../../../../components/ui/Button/MainButton";


class Recipe extends Component {
    state = {
        col1Controls: [],
        col2Controls: [],
        index: 0,
        selectedOption: null,
        displayOptions: {ven: {row: -1, display: false}, name: { roe: -1, display: false}},
        filter: {ven: null, name: null},
        cursor: -1
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

        let updatedFlavors = updateFlavors(event, this.props.flavors, this.props.input, this.props.weights,
            this.props.inventory, this.props.input.mlToMake.value);

        this.props.onDataEntered(updatedFlavors);

        event.target.name === 'ven' ? this.setState({ filter: {ven: event.target.value} })
            : this.setState({ filter: {name: event.target.value}})
    };

    optionHandler = (e, control) => {
            this.setState({
                displayOptions: {
                    ...this.state.displayOptions,
                    [control]: {row: e.target.id, display: !this.state.displayOptions[control].display},
                }, cursor: -1
            });
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

    keyDownHandler = (e, list) => {
        if (e.keyCode === 40 && this.state.cursor < list.length - 1) {
            this.setState({ cursor: this.state.cursor + 1});
        }
        else if (e.keyCode === 38 && this.state.cursor > 0) {
            this.setState({ cursor: this.state.cursor - 1})
        }
        else if (e.keyCode === 9) {
            if (this.state.cursor !== -1) {
                let flavors = [...this.props.flavors];
                for (let f in flavors) {
                    if (parseInt(flavors[f].control, 10) === parseInt(e.target.id, 10)) {
                        flavors[f][e.target.name] = {value: list[this.state.cursor], touched: false};
                    }
                }
                this.props.onDataEntered(flavors);
            }
        }
    };


    render () {
        const { col1Controls, col2Controls, displayOptions, filter, cursor } = this.state;
        const { input, flavors, token, recipeKey, recipes, inventory } = this.props;

        const list = populateList(displayOptions, filter, inventory);


        const firstRowControls = mapControls(col1Controls, classes, recipeKey, recipes, flavors, list, cursor, displayOptions,
            this.optionClickedHandler, this.plusClickedHandler, this.flavorDataEnteredHandler, this.optionHandler,
            (e) => this.keyDownHandler(e, list), this.props.clicked);
        const secondRowControls = mapControls(col2Controls, classes, recipeKey, recipes, flavors, list, cursor, displayOptions,
            this.keyDownHandler, this.optionClickedHandler, this.plusClickedHandler, this.flavorDataEnteredHandler, this.optionHandler, this.props.clicked);


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
                        {firstRowControls}
                    </div>
                    <div className={classes.Col2}>
                        {secondRowControls}
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