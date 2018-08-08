import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';
import errorImg from '../../assets/error.png';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import {enforceInputConstraints} from "../../util/shared";
import {setInvalidRecipes} from "../../util/formulaUtil";
import {CircularProgress} from "@material-ui/core";

class LiquidLab extends Component {
    state = {
        results: false,
        error: null,
        recipes: null
    };

    //BUGS:
    //TODO: Inventory: Tab to next field
    //TODO: Sorting recipes totally messed up the drop-down retrieval and saving :(
    //TODO: Move Recipe logic in render to util
    //TODO: Changing Recipe percentages should tell reset Invalid class in real-time

    //FEATURES:
    //TODO: Calculate correct 'Number of Recipes included' value
    //TODO: When saving recipe, "The following flavors included in inventory, would you like to add them?" with redirect
    //TODO: When entering VEN or FLAV data, provide drop-down with available inventory items
    //TODO: When entering flavor %, instantly tell me if my inventory won't support it
    //TODO: Material-UI grid for calculated results
    //TODO: "I Made it" button with warning if not clicked
    //TODO: Global flavors
    //TODO: What can I make from global flavors? Filter out local flavors
    //TODO: Browse global with intense search
    //TODO: Global flavors; "Add to My List" / "Remove From My List"
    //TODO: Associate pictures with recipes
    //TODO: Warn when token is about to expire
    //TODO: Error messages to Dialog windows
    //TODO: Firebase SMTP
    //TODO: Peformance testing: what happens when recipes, inventory, shoppingList get massive?
    //TODO: About/Help pages
    //TODO: Mobile Optimization

    componentWillMount() {
        if (this.props.inputs.mlToMake.value) {
            this.props.onDataEntered('mlToMake', '', true);
        }
    }

    componentWillUpdate() {
        if (this.props.history.location.pathname === "/login" || this.props.history.location.pathname === "/register") {
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
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);
        let valid = event.target.value >= 1;
        this.props.onDataEntered('mlToMake', event.target.value, valid);
        //For each recipe
        let recipes = {...this.state.recipes};
        if (!recipes.length > 0) {
            recipes = {...this.props.userRecipes}
        }
        let filteredRecipes = setInvalidRecipes(recipes, this.props.inputs, this.props.weights, this.props.inventory, event.target.value);
        this.setState({ recipes: filteredRecipes});
    };

    recipeSelectHandler(event) {
        const selectedRecipe = this.props.userRecipes[event.target.value];
        this.props.onSelectUserRecipe(event.target.value, selectedRecipe);
        this.setState({ results: null });
    }
    
    displayResultsHandler = () => {
        this.setState({ results: true })
    };

    errorHandler = (error) => {
        this.setState({ error: error });
    };

    render() {
        const { results, error, recipes } = this.state;
        const { isAuthenticated, inputs, userRecipes, recipeKey, successMsg, loading } = this.props;


        let displayedRecipes = recipes;
        if (!recipes) {
            displayedRecipes = userRecipes;
        }
        //TODO: Fix
        //displayedRecipes = Object.values(displayedRecipes).sort((a,b) => {
        //    return (a.name.value.toLowerCase() > b.name.value.toLowerCase()) ? 1 : ((b.name.value.toLowerCase() > a.name.value.toLowerCase()) ? -1 : 0)
        //});

        return (
            <div className={classes.LiquidLab}>
                <header className={classes.HeaderDiv}>
                    <p className={classes.Header}>ReactApp</p>
                    <div>
                        {loading ? <CircularProgress size={60} /> : null}
                    </div>
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
                        {displayedRecipes ? Object.keys(displayedRecipes).sort().map(recipeKey => {
                            const recipe = displayedRecipes[recipeKey];
                            let recName = recipe.name.value;
                            recName = recipe.batch.value ? recName + " [" + recipe.batch.value + "]" : recName;
                            return recipe.invalid ? <option style={{color: 'darkred', backgroundColor: 'salmon'}} key={recipeKey} value={recipeKey}>{recName}</option>
                                : <option key={recipeKey} value={recipeKey}>{recName}</option>
                        }) : null}
                    </select>
                </header>
                {error ? <p className={classes.Error}><img className={classes.ErrorImg} src={errorImg} alt="!!!" /> {error}</p>
                    : successMsg ? <p className={classes.Success}>{successMsg}</p> : null}
                <div className={classes.Views}>
                    <Formula recipes={recipes} displayResults={this.displayResultsHandler} error={this.errorHandler}/>
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
        weights: state.formula.weights,
        recipeKey: state.formula.key,
        inventory: state.inventory.flavors,
        loading: state.auth.loading || state.database.loading || state.formula.loading || state.inventory.loading
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