import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Recipe from './Recipe/Recipe';
import Target from './Target/Target';
import classes from './Formula.css';
import {
    calcBaseResults,
    calculateFlavorResults,
    populateNonInventoriedFlavors, saveOrUpdateRecipe,
    validateBaseResults,
    validateInputs
} from "../../../util/formulaUtil";
import Auxil from "../../../hoc/Auxil";
import ConfirmSaveDialog from "../../../components/Dialog/ConfirmSaveDialog";
import AddImageDialog from "../../../components/Dialog/AddImageDialog";
import firebase from "firebase";

class Formula extends Component {
    state = {
        saveConfirm: false,
        nonInventory: [],
        addImage: false,
        imgFile: ''
    };

    /**
     * Handler for closing the Save Confirm dialog
     */
    handleClose = () => {
        this.setState({ addImage: false, saveConfirm: false, nonInventory: [] });
    };

    /**
     * Handler for user click of the 'Clear' button, clearing all user input
     */
    handleClear = () => {
        this.props.clear();
        this.props.onClearRecipe();
    };

    /**
     * Handler for user click of the 'Delete' button, to delete a recipe from redux and database
     */
    handleDelete = () => {
        this.props.onDeleteRecipe(this.props.token, this.props.dbEntryId,
            this.props.recipeKey, this.props.inputs.name, this.props.inputs.batch, this.props.flavors, this.props.inventory, this.props.inventoryBase);
    };

    handleAddImage = () => {
        this.setState({ addImage: true });
    };
    /**
     * Handler for user click of the 'Save' button, to save a recipe to redux and database
     */
    handleSave = () => {
        if (this.state.addImage) {
            this.setState({ addImage: false, imgFile: '' });
        }
        
        let nonInventoriedFlavors = populateNonInventoriedFlavors(this.state.nonInventory, this.props.flavors, this.props.inventory);
        if (!this.state.saveConfirm && nonInventoriedFlavors.length > 0) {
            this.setState({ saveConfirm: true, nonInventory: nonInventoriedFlavors })
        }
        else {
            saveOrUpdateRecipe(nonInventoriedFlavors, this.props.inventory, this.props.inventoryBase, this.props.flavors, this.props.inputs, this.props.userRecipes,
                this.props.recipeKey, this.props.token, this.props.dbEntryId, this.props.error, this.props.onSaveInventoryData, this.props.onUpdateRecipe, this.props.onSaveRecipe);
            this.props.clear();
            this.setState({ addImage: false, saveConfirm: false, nonInventory: [] });
        }
    };

    /**
     * Calculate recipe Results using input and weights
     * @returns {boolean}
     */
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
            this.props.onUpdateRecipeInfo('mlToMake', this.props.inputs.mlToMake );

            //Validate results before display
            return validateBaseResults(baseResults, this.props.onUpdateIngredients, this.props.error);
        }
        else {
            return false;
        }
    };

    uploadImg = (e) => {
        let storageRef = firebase.storage().ref();
        let recipeRef = storageRef.child(e.target.files[0].name);
        recipeRef.put(e.target.files[0]).then(() => console.debug("Successfully uploaded e.target.files[0].name"));
        this.props.onInputDataEntered("image", e.target.files[0].name);
        this.setState({ imgFile: e.target.files[0]});
    };


    render () {
        const { saveConfirm, nonInventory, addImage, imgFile } = this.state;
        const { recipeKey, recipes, image} = this.props;

        let addMsg = recipeKey && image !== '' ? "Update the Recipe Image? " : "Add an Image to this Recipe?";


        return (
            <Auxil>
                <ConfirmSaveDialog open={saveConfirm} close={this.handleClose} confirm={this.handleSave}
                                   recipeKey={recipeKey} inventoryList={nonInventory}
                                   message={"The following flavors will be added to the Inventory:"} />
                <AddImageDialog open={addImage} close={this.handleClose} confirm={this.handleSave}
                                imgFile={imgFile} uploadImg={this.uploadImg} message={addMsg} />
                <div className={classes.Formula}>
                    <Target  />
                    <Recipe
                        recipes={recipes}
                        delete={this.handleDelete}
                        clear={this.handleClear}
                        save={this.handleAddImage}
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
        inventory: state.inventory.flavors,
        inventoryBase: state.inventory.base,
        results: state.results,
        image: state.formula.inputs.image.value
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
        onSaveInventoryData: (token, dbEntryId, base, flavors) => dispatch(actions.saveInventoryData(token, dbEntryId, base, flavors)),
        onInputDataEntered: (control, value) => dispatch(actions.inputDataEntered(control, value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Formula);