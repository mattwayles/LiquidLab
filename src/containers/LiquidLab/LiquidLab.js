import React, { Component } from 'react';
import { connect } from 'react-redux';
import Formula from './Formula/Formula';
import Results from './Results/Results';
import classes from './LiquidLab.css';
import logo from '../../assets/logo.png';
import * as ToolTip from "../../constants/Tooltip";
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import {enforceInputConstraints} from "../../util/shared";
import {setInvalidFlavor, setInvalidRecipes} from "../../util/recipeUtil";
import {CircularProgress} from "@material-ui/core";
import ErrorDialog from "../../components/Dialog/ErrorDialog";
import {validateTargetInput} from "../../util/formulaUtil";

class LiquidLab extends Component {
    state = {
        results: false,
        error: null,
        made: false,
        navWarn: false,
    };

    componentWillMount() {
        if(this.props.isAuthenticated) {
            console.log("Validating from LiquidLabMount");
            this.validateSufficientInventory(this.props.inputs.mlToMake.value);
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

        //Perform input validation on ML To Make edit for validated users only
        if (this.props.isAuthenticated) {
            this.validateSufficientInventory(event.target.value);
        }
    };

    /**
     * Validate the current user input against inventory for authenticated users only
     * @param value The data input value
     */
    validateSufficientInventory = (value) => {
        let recipes = [...this.props.userRecipes];
        let flavors = [...this.props.flavors];

        //Validate base ingredients
        let baseArr = ['targetNic', 'targetPg', 'targetVg'];
        for (let i in baseArr) {
            let updatedInputs = {
                ...this.props.inputs,
                mlToMake: {...this.props.inputs["mlToMake"], value: value}
            };
            let valid = validateTargetInput(baseArr[i], updatedInputs, this.props.weights, this.props.flavors, this.props.baseInventory);
            this.props.onDataEntered(baseArr[i], this.props.inputs[baseArr[i]].value, valid);
        }


        //Validate flavors
        for (let f in flavors) {
            flavors[f] = setInvalidFlavor(flavors[f], this.props.inputs, this.props.weights, this.props.inventory, value);
        }
        this.props.onRecipeDataEntered(flavors);

        let filteredRecipes = setInvalidRecipes(recipes, this.props.inputs, this.props.weights, this.props.inventory, value);
        this.props.onRecipeValidation(filteredRecipes);
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
        const { results, error, made, navWarn } = this.state;
        const { isAuthenticated, inputs, userRecipes, recipeKey, successMsg, loading } = this.props;

        let displayedRecipes = userRecipes;

        return (
            <div className={classes.LiquidLab}>
                <header className={classes.HeaderDiv}>
                    <p className={classes.Header}>LiquidLab</p>
                    <div>
                        {loading ? <CircularProgress size={50} /> : null}
                    </div>
                    <div className={classes.MlToMake}>
                        <p>ML To Make:</p>
                        <Input value={inputs.mlToMake.value} classes={classes.Input} valid={error ? !error.includes("ML") : true}
                               tooltip={error && error.includes("ML") ? ToolTip.ML_TO_MAKE_ERROR : ToolTip.ML_TO_MAKE}
                               change={(e) => this.dataEnteredHandler(e)} type='number'
                               maxLength={5} placeholder="0" autoFocus/>
                        <p>ml</p>
                    </div>
                    <select data-tip={isAuthenticated ? ToolTip.RECIPE_DROPDOWN : ToolTip.RECIPE_DROPDOWN_DISABLED}
                        className={classes.Select} value={recipeKey} onChange={(event) => this.recipeSelectHandler(event)}>
                        {isAuthenticated ? <option value="" disabled>Select a Recipe...</option>
                            : <option value="" disabled>Register or Login to Save and Retrieve your Recipes!</option>}
                        {displayedRecipes ? Object.keys(displayedRecipes).map(index => {
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
                    <Formula clear={this.handleClearResults} recipes={userRecipes} displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results navWarn={navWarn} made={made} navWarnHandler={this.handleNavWarn} madeHandler={this.handleRecipeMade}/>
                            : <div className={classes.ResultPlaceholder}><img className={classes.Logo} src={logo} alt="" /><span className={classes.Placeholder}>Results</span></div>}
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
        baseInventory: state.inventory.base,
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
        onRecipeValidation: (recipes) => dispatch(actions.recipeValidation(recipes)),
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiquidLab);