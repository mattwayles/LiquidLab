import React, { Component } from 'react';

import { connect } from 'react-redux';
import { enforceMaxLength } from '../../../../util/shared';
import * as actions from '../../../../store/actions/index';
import RecipeControl from '../../../../components/RecipeControl/RecipeControl';
import BatchSelect from '../../../../components/ui/BatchSelect/BatchSelect';
import Button from '../../../../components/ui/Button/Button';
import classes from './Recipe.css';


class Recipe extends Component {
    state = {
        col1Controls: [],
        col2Controls: [],
        index: 0
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
            //col2ControlArray.unshift({id: this.state.index});
            col2ControlArray.splice(col2ControlArray.length - 1, 0, {id: this.state.index});
            this.setState({col2Controls: col2ControlArray, index: this.state.index + 1});
        }
    };

    flavorDataEnteredHandler = (event) => {
        event.target.value = enforceMaxLength(event.target.value, event.target.maxLength);

        let exists = false;
        let updatedFlavors = [...this.props.flavors];

        for(let i = 0; i < updatedFlavors.length; i++) {
            if (updatedFlavors[i].control === event.target.id) {
                let updatedFlavor = {
                    ...updatedFlavors[i],
                    [event.target.name]: {value: event.target.value, touched: true}};
                exists = true;
                updatedFlavors[i] = updatedFlavor;
            }
        }
        if (!exists) {
            updatedFlavors.push({
                control: event.target.id,
                [event.target.name]: {value: event.target.value, touched: true}})
        }
        this.props.onDataEntered(updatedFlavors);
        
    };

    render () {
        const { col1Controls, col2Controls } = this.state;
        const { input, flavors, token } = this.props;
        
        let recipeControl1 = null;
        let controls = col1Controls.map(control => {
            let valid = null;

            if (flavors) {
                for (let i = 0; i < flavors.length; i++) {
                    if (+flavors[i].control === control.id) {
                        valid = flavors[i].percent && flavors[i].percent.value > 0;
                    }
                }
            }
            recipeControl1 =
                <RecipeControl
                    className={classes.RecipeControl}
                    values={flavors ? flavors[control.id] : null}
                    key={control.id}
                    id={control.id}
                    valid={valid}
                    plusClicked={this.plusClickedHandler}
                    change={this.flavorDataEnteredHandler}
                    calculate={this.props.clicked}
                />;
            return recipeControl1;
        });

        let recipeControl2 = null;
        let controls2 = col2Controls.map(control => {
            if (control.type === 'button') {
                return (
                    <button
                        key="plusBtn"
                        className={classes.PlusButton}
                        onClick={this.plusClickedHandler}
                    >+</button>
                )
            }
            else {
                let valid = null;

                if (flavors) {
                    for (let i = 0; i < flavors.length; i++) {
                        if (+flavors[i].control === control.id) {
                            valid = flavors[i].percent && flavors[i].percent.value > 0;
                        }
                    }
                }

                recipeControl2 =
                    <RecipeControl className={classes.RecipeControl}
                                   values={flavors ? flavors[control.id] : null}
                        key={control.id}
                        id={control.id}
                        valid={valid}
                        plusClicked={this.plusClickedHandler}
                        change={this.flavorDataEnteredHandler}
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
                        <Button disabled clicked={null} >Delete</Button>
                        <Button disabled={!token || input.name.value === ""}
                                clicked={this.props.save} >Save</Button>
                        <Button clicked={this.props.calculate} >Calculate</Button>
                    </div>
                </div>
            </div>
        )}
}

const mapStateToProps = state => {
    return {
        input: state.formula.inputs,
       flavors: state.formula.flavors,
        token: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (arr) => dispatch(actions.recipeDataEntered(arr)),
        onInputDataEntered: (control, value) => dispatch(actions.inputDataEntered(control, value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);