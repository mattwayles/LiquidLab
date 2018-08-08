import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Recipe from './Recipe/Recipe';
import Target from './Target/Target';
import classes from './Formula.css';
import {
    calcBaseResults,
    calculateFlavorResults,
    duplicateRecipe,
    validateBaseResults,
    validateInputs
} from "../../../util/formulaUtil";

class Formula extends Component {
    handleClear = () => {
        this.props.onClearRecipe();
    };

    handleDelete = () => {
        this.props.onDeleteRecipe(this.props.token, this.props.dbEntryId,
            this.props.recipeKey, this.props.inputs.name, this.props.inputs.batch);
    };

    handleSave = () => {
        const name = this.props.inputs.name.value;
        const batch = this.props.inputs.batch.value;

        this.props.error(null);

        if (this.props.recipeKey) {
            this.props.onUpdateRecipe(this.props.token, this.props.dbEntryId, this.props.recipeKey,
                {...this.props.inputs, flavors: [...this.props.flavors]
            });
        }
        else {
            if (duplicateRecipe(name, batch, this.props.userRecipes)) {
                const nameBatch = batch ? name + " [" + batch + "]" : name;
                this.props.error("The recipe " + nameBatch + " already exists in the database.");
            }
            else {
                this.props.onSaveRecipe(this.props.token, this.props.dbEntryId, {
                    ...this.props.inputs,
                    flavors: [...this.props.flavors]
                });
            }
        }
    };

    handleCalculate = () => {
        //Clear any previous calculation errors
        this.props.error(null);

        //Validate user input
        if (validateInputs(this.props.inputs, this.props.flavors, this.props.error)) {
            let flavorResults = [];
            let flavorMlTotal = 0;

            //Calculate flavor ML/Gram/%
            if (this.props.flavors) {
                for (let i = 0; i < this.props.flavors.length; i++) {
                    const flavorResult = calculateFlavorResults(this.props.inputs, this.props.weights, this.props.flavors[i]);
                    flavorMlTotal = flavorMlTotal + flavorResult.ml;
                    flavorResults.push(flavorResult);
                }

                this.props.onUpdateIngredients('flavors', flavorResults);
            }

            //Calculate base ML/Gram/%
            const baseResults = calcBaseResults(this.props.inputs, this.props.weights, flavorMlTotal);

            this.props.onUpdateRecipeInfo('name', this.props.inputs.name );
            this.props.onUpdateRecipeInfo('batch', this.props.inputs.batch );
            this.props.onUpdateRecipeInfo('notes', this.props.inputs.notes );

            //Validate results before display
            return validateBaseResults(baseResults, this.props.onUpdateIngredients, this.props.error);
        }
        else {
            return false;
        }
    };


    render () {
        return (
            <div className={classes.Formula}>
                <Target  />
                <Recipe
                    recipes={this.props.recipes}
                    delete={this.handleDelete}
                    clear={this.handleClear}
                    save={this.handleSave}
                    calculate={() => this.handleCalculate() ? this.props.displayResults() : null} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        recipeKey: state.formula.key,
        inputs: state.formula.inputs,
        flavors: state.formula.flavors,
        weights: state.formula.weights,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        userRecipes: state.database.userRecipes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onClearRecipe: () => dispatch(actions.clearRecipe()),
        onDeleteRecipe: (token, db, key, name, batch) => dispatch(actions.deleteRecipe(token, db, key, name, batch)),
        onSaveRecipe: (token, db, recipeData) => dispatch(actions.saveRecipe(token, db, recipeData)),
        onUpdateRecipe: (token, db, key, recipeData) => dispatch(actions.updateRecipe(token, db, key, recipeData)),
        onUpdateIngredients: (control, value) => dispatch(actions.updateIngredients(control, value)),
        onUpdateRecipeInfo: (control, value) => dispatch(actions.updateRecipeInfo(control, value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Formula);