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
import Auxil from "../../../hoc/Auxil";
import ConfirmSaveDialog from "../../../components/Dialog/ConfirmSaveDialog";
import {compareFlavors, createNextId} from "../../../util/shared";

class Formula extends Component {
    state = {
        saveConfirm: false,
        nonInventory: []
    };

    handleClose = () => {
        this.setState({ saveConfirm: false, nonInventory: [] });
    };

    handleClear = () => {
        this.props.onClearRecipe();
    };

    handleDelete = () => {
        this.props.onDeleteRecipe(this.props.token, this.props.dbEntryId,
            this.props.recipeKey, this.props.inputs.name, this.props.inputs.batch, this.props.flavors, this.props.inventory);
    };

    handleSave = () => {
        const name = this.props.inputs.name.value;
        const batch = this.props.inputs.batch.value;

        this.props.error(null);

        //TODO: Extract to shared method
        let nonInventoriedFlavors = [...this.state.nonInventory];
        if (nonInventoriedFlavors.length === 0) {
            for (let f in this.props.flavors) {
                let found = false;
                for (let i in this.props.inventory) {
                    if (compareFlavors(this.props.flavors[f], this.props.inventory[i])) {
                        found = true;
                    }
                }
                if (!found && this.props.flavors[f].flavor && this.props.flavors[f].flavor.value !== "") {
                    nonInventoriedFlavors.push(this.props.flavors[f]);
                }
            }
        }

        if (!this.state.saveConfirm && nonInventoriedFlavors.length > 0) {
            this.setState({ saveConfirm: true, nonInventory: nonInventoriedFlavors })
        }
        else {
            let inventory = [...this.props.inventory];
            for (let f in nonInventoriedFlavors) {
                inventory.push({amount: 0, id: createNextId(...this.props.flavors), name: nonInventoriedFlavors[f].flavor.value, vendor: nonInventoriedFlavors[f].ven ? nonInventoriedFlavors[f].ven.value : '', recipes: 0})
            }
            if (this.props.recipeKey) {
                this.props.onSaveFlavorData(this.props.token, this.props.dbEntryId, inventory);
                this.props.onUpdateRecipe(this.props.token, this.props.dbEntryId, this.props.recipeKey,
                    {...this.props.inputs, flavors: [...this.props.flavors]
                    }, inventory, this.props.userRecipes[this.props.recipeKey]);
            }
            else {
                if (duplicateRecipe(name, batch, this.props.userRecipes)) {
                    const nameBatch = batch ? name + " [" + batch + "]" : name;
                    this.props.error("The recipe " + nameBatch + " already exists in the database.");
                }
                else {
                    this.props.onSaveFlavorData(this.props.token, this.props.dbEntryId, inventory);
                    this.props.onSaveRecipe(this.props.token, this.props.dbEntryId, inventory, {
                        ...this.props.inputs,
                        flavors: [...this.props.flavors]
                    });
                }
            }
            this.setState({ saveConfirm: false, nonInventory: [] });
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
            <Auxil>
                <ConfirmSaveDialog open={this.state.saveConfirm} close={this.handleClose} confirm={this.handleSave}
                                   recipeKey={this.props.recipeKey} inventoryList={this.state.nonInventory} message={"The following flavors will be added to the Inventory:"} />
                <div className={classes.Formula}>
                    <Target  />
                    <Recipe
                        recipes={this.props.recipes}
                        delete={this.handleDelete}
                        clear={this.handleClear}
                        save={this.handleSave}
                        calculate={() => this.handleCalculate() ? this.props.displayResults() : null} />
                </div>
            </Auxil>
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
        userRecipes: state.database.userRecipes,
        inventory: state.inventory.flavors
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onClearRecipe: () => dispatch(actions.clearRecipe()),
        onDeleteRecipe: (token, db, key, name, batch, flavors, inventory) => dispatch(actions.deleteRecipe(token, db, key, name, batch, flavors, inventory)),
        onSaveRecipe: (token, db, inventory, recipeData) => dispatch(actions.saveRecipe(token, db, inventory, recipeData)),
        onUpdateRecipe: (token, db, key, recipeData, inventory, original) => dispatch(actions.updateRecipe(token, db, key, recipeData, inventory, original)),
        onUpdateIngredients: (control, value) => dispatch(actions.updateIngredients(control, value)),
        onUpdateRecipeInfo: (control, value) => dispatch(actions.updateRecipeInfo(control, value)),
        onSaveFlavorData: (token, dbEntryId, flavors) => dispatch(actions.saveFlavorData(token, dbEntryId, flavors))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Formula);