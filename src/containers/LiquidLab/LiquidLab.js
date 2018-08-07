import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';
import errorImg from '../../assets/error.png';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import {enforceMaxLength} from "../../util/shared";

class LiquidLab extends Component {
    state = {
        results: false,
        error: null
    };

    //BUGS:
    //TODO: Inputting in a row with an empty row above it inputs in the wrong row!
    //TODO: Spinner for all actions
    //TODO: Negative number protection
    //TODO: Recipe drop-down is way too big
    //TODO: Inventory header item highlighted after login
    //TODO: Inventory: Tab to next field
    //TODO: Inventory & Shopping List: make grid rows smaller, fit more in the page!
    //TODO: Inventory and shopping list, what happens when list gets huge?

    //FEATURES:
    //TODO: What flavors am I UNable to make with current inventory?
    //TODO: "I Made it" button with warning if not clicked
    //TODO: Calculate correct 'Number of Recipes included' value
    //TODO: Global flavors
    //TODO: What can I make from global flavors? Filter out local flavors
    //TODO: Browse global with intense search
    //TODO: Global flavors; "Add to My List" / "Remove From My List"
    //TODO: Associate pictures with recipes
    //TODO: Warn when token is about to expire
    //TODO: Error messages to Dialog windows
    //TODO: Firebase SMTP
    //TODO: About/Help pages
    //TODO: Mobile Optimization


    componentWillUpdate() {
        if (this.props.history.location.pathname === "/login") {
            this.props.history.push("/");
        }
    }

    componentDidUpdate() {
        if (this.props.successMsg) {
            setTimeout(() => {
                this.props.onClearSuccessMessage();
            }, 4000);
        }
    }

    dataEnteredHandler = (event) => {
        event.target.value = enforceMaxLength(event.target.value, event.target.maxLength);
        let valid = event.target.value >= 1;
        this.props.onDataEntered('mlToMake', event.target.value, valid);
    };

    recipeSelectHandler(event) {
        const selectedRecipe = this.props.userRecipes[event.target.value];
        this.props.onSelectUserRecipe(event.target.value, selectedRecipe);
    }
    
    displayResultsHandler = () => {
        this.setState({ results: true })
    };

    errorHandler = (error) => {
        this.setState({ error: error });
    };

    render() {
        const { results, error } = this.state;
        const { isAuthenticated, userRecipes, inputs, recipeKey, successMsg } = this.props;

        return (
            <div className={classes.LiquidLab}>
                <header className={classes.HeaderDiv}>
                    <p className={classes.Header}>ReactApp</p>
                    <div className={classes.MlToMake}>
                        <p>ML To Make:</p>
                        <Input value={inputs.mlToMake.value} classes={classes.Input} valid={error ? !error.includes("ML") : true}
                               change={(e) => this.dataEnteredHandler(e)} type='number'
                               maxLength={5} placeholder="0" autoFocus/>
                        <p>ml</p>
                    </div>
                    <select className={classes.Select} value={recipeKey} onChange={(event) => this.recipeSelectHandler(event)}>
                        {isAuthenticated ? <option value="" disabled>Select a Recipe...</option>
                            : <option value="" disabled>Register or Login to Save and Retrieve your Recipes!</option>}
                        {userRecipes ? Object.keys(userRecipes).map(recipeKey => {
                            const recipe = userRecipes[recipeKey];
                            let recName = recipe.name.value;
                            recName = recipe.batch.value ? recName + " [" + recipe.batch.value + "]" : recName;
                            return <option key={recipeKey} value={recipeKey}>{recName}</option>
                        }) : null}
                    </select>
                </header>
                {error ? <p className={classes.Error}><img className={classes.ErrorImg} src={errorImg} alt="!!!" /> {error}</p>
                    : successMsg ? <p className={classes.Success}>{successMsg}</p> : null}
                <div className={classes.Views}>
                    <Formula displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results /> : <p className={classes.Placeholder}>Results</p>}
                    </div>
                </div>
            </div> 
        ); 
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        userRecipes: state.database.userRecipes,
        successMsg: state.database.success,
        inputs: state.formula.inputs,
        recipeKey: state.formula.key
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectUserRecipe: (key, recipe) => dispatch(actions.selectUserRecipe(key, recipe)),
        onDataEntered: (control, value, valid) => dispatch(actions.inputDataEntered(control, value, valid)),
        onClearSuccessMessage: () => dispatch(actions.clearSuccessMessage())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiquidLab);