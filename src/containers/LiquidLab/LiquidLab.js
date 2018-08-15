import React, { Component } from 'react';
import { connect } from 'react-redux';
import Formula from './Formula/Formula';
import Results from './Results/Results';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import {enforceInputConstraints} from "../../util/shared";
import {setInvalidFlavor, setInvalidRecipes} from "../../util/recipeUtil";
import {CircularProgress} from "@material-ui/core";
import ErrorDialog from "../../components/Dialog/ErrorDialog";

class LiquidLab extends Component {
    state = {
        results: false,
        error: null,
        recipes: null,
        made: false,
        navWarn: false
    };

    //BUGS:

    //FEATURES:
    //TODO: Global Recipes
        //TODO: What can I make from global recipes? Filter out local flavors
        //TODO: Browse global with intense search
        //TODO: Global flavors; "Add to My List" / "Remove From My List"
    //TODO: Associate pictures with recipes
    //TODO: Add Notes section to Inventory flavors
    //TODO: Warn when token is support to expire
    //TODO: Add PG, VG, and Nic to the inventory
    //TODO: Error messages to Dialog windows
    //TODO: Firebase SMTP (email verification)
    //TODO: No confirmation window when exiting out w/o any changes made!
    //TODO: Performance testing: what happens when recipes, inventory, shoppingList get massive?
    //TODO: Support page with About section, Help section, Donate/Contact, and TOC
    //TODO: Mobile Optimization
    //TODO: LiquidLab Logo


    /**
     * Retain the MLToMake value across page visits
     */
    componentWillMount() {
        if (this.props.inputs.mlToMake.value) {
            this.props.onDataEntered('mlToMake', '', true);
        }
    }

    /**
     * Redirect to root from Login or Register
     */
    componentWillUpdate() {
        if (this.props.history.location.pathname === "/login" || this.props.history.location.pathname === "/register") {
            this.props.history.push("/");
        }
    }

    /**
     * Retain a success message on fade for 4 seconds
     */
    componentDidUpdate() {
        if (this.props.successMsg) {
            setTimeout(() => {
                this.props.onClearSuccessMessage();
            }, 4000);
        }
    }

    /**
     * Display the results page
     */
    displayResultsHandler = () => {
        this.setState({ results: true })
    };

    /**
     * Clear the results page
     */
    handleClearResults = () => {
        this.setState({ results: false });
    };

    /**
     * Mark a recipe as made, preventing a prompt when the recipe changes
     * @param recipeMade    Boolean indicating made status
     */
    handleRecipeMade = (recipeMade) => {
        this.setState({ results: false, navWarn: false, made: recipeMade });
    };

    /**
     * Set or unset NavWarn, which prompts a user if they're sure they want to navigate away from an unmade recipe
     */
    handleNavWarn = () => {
        this.setState({results: false, navWarn: !this.state.navWarn });
    };

    /**
     * Handler user input data
     * @param event The user input event
     */
    dataEnteredHandler = (event) => {
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);
        let valid = event.target.value >= 1;
        this.props.onDataEntered('mlToMake', event.target.value, valid);
        //For each recipe
        let recipes = {...this.state.recipes};
        if (!recipes.length > 0) {
            recipes = {...this.props.userRecipes}
        }

        let flavors = [...this.props.flavors];

        for(let f in flavors) {
            flavors[f] = setInvalidFlavor(flavors[f], this.props.inputs, this.props.weights, this.props.inventory, event.target.value);
        }
        this.props.onRecipeDataEntered(flavors);



        let filteredRecipes = setInvalidRecipes(recipes, this.props.inputs, this.props.weights, this.props.inventory, event.target.value);
        this.setState({ recipes: filteredRecipes});
    };

    /**
     * Handler user recipe selection from the recipe drop-down
     * @param event The recipe selection event
     */
    recipeSelectHandler(event) {
        if (this.state.results && !this.state.made) {
            this.setState({ navWarn: true });
        }
        else {
            this.setState({ made: false, navWarn: false });
        }

        let selectedRecipe;
        for (let r in this.props.userRecipes) {
            if (this.props.userRecipes[r].dbKey === event.target.value) {
                selectedRecipe = this.props.userRecipes[r];
            }
        }
        this.props.onSelectUserRecipe(selectedRecipe.dbKey, selectedRecipe);
    }

    /**
     * Set and display an error
     * @param error
     */
    errorHandler = (error) => {
        this.setState({ error: error });
    };

    render() {
        const { results, error, recipes, made, navWarn } = this.state;
        const { isAuthenticated, inputs, userRecipes, recipeKey, successMsg, loading } = this.props;


        let displayedRecipes = recipes;
        if (!recipes) {
            displayedRecipes = userRecipes;
        }

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
                        {displayedRecipes ? Object.keys(displayedRecipes).sort().map(index => {
                            const recipe = displayedRecipes[index];
                            let recName = recipe.name.value;
                            recName = recipe.batch.value ? recName + " [" + recipe.batch.value + "]" : recName;
                            return recipe.invalid ? <option style={{color: 'darkred', backgroundColor: 'salmon'}} key={recipe.dbKey} value={recipe.dbKey}>{recName}</option>
                                : <option key={recipe.dbKey} value={recipe.dbKey}>{recName}</option>
                        }) : null}
                    </select>
                </header>
                {successMsg ? <p className={classes.Success}>{successMsg}</p> : null}
                <div className={classes.Views}>
                    <Formula clear={this.handleClearResults} recipes={recipes} displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results navWarn={navWarn} made={made} navWarnHandler={this.handleNavWarn} madeHandler={this.handleRecipeMade}/> : <p className={classes.Placeholder}>Results</p>}
                    </div>
                </div>
                {error ? <ErrorDialog open={!!error} close={() => this.errorHandler(null)} message={error} /> : null}
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
        flavors: state.formula.flavors,
        inventory: state.inventory.flavors,
        loading: state.auth.loading || state.database.loading || state.formula.loading || state.inventory.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectUserRecipe: (key, recipe) => dispatch(actions.selectUserRecipe(key, recipe)),
        onDataEntered: (control, value, valid) => dispatch(actions.inputDataEntered(control, value, valid)),
        onClearSuccessMessage: () => dispatch(actions.clearSuccessMessage()),
        onRecipeDataEntered: (arr) => dispatch(actions.recipeDataEntered(arr)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiquidLab);