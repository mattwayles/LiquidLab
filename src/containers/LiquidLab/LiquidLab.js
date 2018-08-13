import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';
import errorImg from '../../assets/error.png';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import {enforceInputConstraints} from "../../util/shared";
import {setInvalidFlavor, setInvalidRecipes} from "../../util/recipeUtil";
import {CircularProgress} from "@material-ui/core";
import ResultsButton from "../../components/ui/Button/ResultsButton";

class LiquidLab extends Component {
    state = {
        results: false,
        error: null,
        recipes: null,
        made: false,
        navWarn: false
    };

    //BUGS:
    //TODO: Clicking on a drop-down suggestion no longer works
    //TODO: If a flavor is added to inventory AFTER use in recipe, the "# of Recipes" should still calculate
    //TODO: Error when entering a flavor percent with no flavor name
    //TODO: When feeling burnt out, comment!
    //TODO: Error notification on main screen
    //TODO: No confirmation window when exiting out w/o any changes made!

    //FEATURES:
    //TODO: Global Recipes
        //TODO: What can I make from global recipes? Filter out local flavors
        //TODO: Browse global with intense search
        //TODO: Global flavors; "Add to My List" / "Remove From My List"
    //TODO: Associate pictures with recipes
    //TODO: Add Notes section to Inventory flavors
    //TODO: Warn when token is about to expire
    //TODO: Add PG, VG, and Nic to the inventory
    //TODO: Error messages to Dialog windows
    //TODO: Firebase SMTP
    //TODO: Peformance testing: what happens when recipes, inventory, shoppingList get massive?
    //TODO: About/Help pages
    //TODO: Mobile Optimization
    //TODO: LiquidLab Logo

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

    handleClearResults = () => {
        this.setState({ results: false });
    };

    handleRecipeMade = (recipeMade) => {
        this.setState({ results: false, navWarn: false, made: recipeMade });
    };

    handleNavWarn = () => {
        this.setState({results: false, navWarn: !this.state.navWarn });
    };

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
    
    displayResultsHandler = () => {
        this.setState({ results: true })
    };

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
                {error ? <p className={classes.Error}><img className={classes.ErrorImg} src={errorImg} alt="!!!" /> {error}</p>
                    : successMsg ? <p className={classes.Success}>{successMsg}</p> : null}
                <div className={classes.Views}>
                    <Formula clear={this.handleClearResults} recipes={recipes} displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results navWarn={navWarn} made={made} navWarnHandler={this.handleNavWarn} madeHandler={this.handleRecipeMade}/> : <p className={classes.Placeholder}>Results</p>}
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